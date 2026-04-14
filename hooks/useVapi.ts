import { startVoiceSession } from "@/lib/actions/session.actions";
import { ASSISTANT_ID, DEFAULT_VOICE, VOICE_SETTINGS, voiceOptions } from "@/lib/constants";
import { getVoice } from "@/lib/utils";
import {IBook, Messages} from "@/types";
import {useAuth} from "@clerk/nextjs";
import {useEffect, useRef, useState} from "react";
import Vapi from '@vapi-ai/web';


export type CallStatus = 'idle' | 'connecting' | 'starting' | 'listening' | 'thinking' | 'speaking';


const useLatestRef = <T, >(value: T) => {
    const ref = useRef(value);
    useEffect(() => {  
        ref.current = value;
    }, [value]);
    return ref;
}

const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY;
let vapi: InstanceType<typeof Vapi>
function getVapi() {
    if (!vapi) {
        if (!VAPI_API_KEY) {
            throw new Error('VAPI API key is not set');
        }
        vapi = new Vapi(VAPI_API_KEY);
    }
    return vapi;
}


export const useVapi = (book: IBook) => {
    const {userId} = useAuth();
    const [status, setStatus] = useState<CallStatus>('idle');
    const [messages, setMessages] = useState<Messages[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [currentUserMessage, setCurrentUserMessage] = useState('');
    const [duration, setDuration] = useState(0);
    const [limitError, setLimitError] = useState<string | null>(null);   

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimerRef = useRef<NodeJS.Timeout | null>(null);
    const sessionIdRef = useRef<string | null>(null);
    const isStoppingRef = useRef<boolean>(false);


    const BookRef = useLatestRef(book);
    const durationRef = useLatestRef(duration);

    let voice = book.persona || voiceOptions[DEFAULT_VOICE]?.id || DEFAULT_VOICE;

    const isActive = status === 'listening' || status === 'thinking' || status === 'speaking' || status === 'starting';
    
    useEffect(() => {
        const vapiInstance = getVapi();
        
        const getText = (value: any) => {
            if (typeof value === 'string') return value;
            if (Array.isArray(value)) return value.join('');
            if (value?.parts && Array.isArray(value.parts)) return value.parts.join('');
            if (typeof value?.text === 'string') return value.text;
            return '';
        };

        const getRole = (message: any) => {
            if (!message) return undefined;
            if (message.role === 'user' || message.role === 'assistant') return message.role;
            if (message.message?.role === 'user' || message.message?.role === 'assistant') return message.message.role;
            if (typeof message.type === 'string') {
                if (message.type.includes('user')) return 'user';
                if (message.type.includes('assistant')) return 'assistant';
                if (message.type === 'say' || message.type === 'add-message') {
                    return message.message?.role || 'assistant';
                }
            }
            return undefined;
        };

        const isPartial = (message: any) => {
            if (!message) return false;
            if (typeof message.type === 'string' && /partial|transcript|speech/i.test(message.type)) return true;
            return message.status === 'partial';
        };

        const isFinal = (message: any) => {
            if (!message) return false;
            if (typeof message.type === 'string' && /(final|complete|done|message)/i.test(message.type)) return true;
            return message.status === 'final';
        };

        const appendMessage = (newMessage: Messages) => {
            setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === newMessage.role && last.content === newMessage.content) {
                    return prev;
                }
                return [...prev, newMessage];
            });
        };

        const handleMessage = (message: any) => {
            const payload = message?.message ? message.message : message;
            const role = getRole(message) || getRole(payload);
            const text = getText(payload?.content ?? payload?.transcript ?? payload?.text ?? payload?.message?.content);

            if (!role || !text) {
                return;
            }

            if (isPartial(message) || isPartial(payload)) {
                if (role === 'user') {
                    setCurrentUserMessage(text);
                    setStatus('listening');
                } else if (role === 'assistant') {
                    setCurrentMessage(text);
                    setStatus('speaking');
                }
                return;
            }

            if (role === 'user') {
                setCurrentUserMessage('');
                setStatus('thinking');
                appendMessage({ role: 'user', content: text });
            } else if (role === 'assistant') {
                setCurrentMessage('');
                setStatus('listening');
                appendMessage({ role: 'assistant', content: text });
            }
        };
        
        const handleCallStart = () => {
            setStatus('starting');
            startTimerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        };
        
        const handleCallEnd = (event?: any) => {
            setStatus('idle');
            if (startTimerRef.current) {
                clearInterval(startTimerRef.current);
                startTimerRef.current = null;
            }

            // Only show error for unexpected reasons
            if (event && event.reason) {
                if (event.reason === 'Meeting has ended' || event.reason === 'ejection') {
                    // Normal session end, do not set error
                    setLimitError(null);
                } else {
                    setLimitError(`Session ended: ${event.reason}`);
                }
            } else if (event && event.error) {
                setLimitError(`Session error: ${event.error}`);
            } else {
                setLimitError(null);
            }
        };
        
        vapiInstance.on('message', handleMessage);
        vapiInstance.on('call-start', handleCallStart);
        vapiInstance.on('call-end', handleCallEnd);
        
        return () => {
            vapiInstance.off('message', handleMessage);
            vapiInstance.off('call-start', handleCallStart);
            vapiInstance.off('call-end', handleCallEnd);
        };
    }, []);
    
    const start = async () => {
        if (!userId) return setLimitError('Please login to start a conversation');
        setLimitError(null);
        setStatus('connecting');
        setMessages([]);
        setCurrentMessage('');
        setCurrentUserMessage('');
        setDuration(0);

        const firstMessage =`Hey, good to meet you. Quick question, before we dive in : have you read ${book.title} yet? or we starting fresh?`

        try {
            const result = await startVoiceSession(userId, book._id);
            if (result.success) {
                sessionIdRef.current = result.sessionId || null;
            } else {
                setLimitError(result.error || 'Session Limit Reached.');
                sessionIdRef.current = result.sessionId || null;
            }
            
            await getVapi().start(ASSISTANT_ID, {
                firstMessage,
                variableValues: {
                    title: book.title, author: book.author, voice, bookId: book._id.toString()
                },
                voice: {
                    provider: '11labs' as const,
                    voiceId: getVoice(voice).id,
                    model: "eleven_turbo_v2_5" as const,
                    stability: VOICE_SETTINGS.stability,
                    similarityBoost: VOICE_SETTINGS.similarityBoost,
                    style: VOICE_SETTINGS.style,
                    useSpeakerBoost: VOICE_SETTINGS.useSpeakerBoost,
                }
            })

            // Add the first message to show in transcript
            setMessages([{ role: 'assistant', content: firstMessage }]);
        } catch (e) {
            console.error('Error starting call', e);
            setStatus('idle');
            setLimitError('Failed to start conversation');
        }
    }
    const stop = async () => {
        isStoppingRef.current = true;
        await getVapi().stop();
        isStoppingRef.current = false;
    }
    const clearErrors = async() => {}

    return {
        status, isActive, messages, currentMessage, currentUserMessage, duration,
        start, stop, clearErrors
    }
}