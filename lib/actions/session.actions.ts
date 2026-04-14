"use server";

import VoiceSession from "@/database/models/voiceSession.model";
import { connectToDatabase } from "@/database/mongoose";
import { EndSessionResult, StartSessionResult } from "@/types";
import { getCurrentBillingPeriodStart, PLANS } from "../subscription-constants";
import { getUserPlan } from "@/lib/getUserPlan";
export const startVoiceSession = async (
  clerkId: string,
  bookId: string,
): Promise<StartSessionResult> => {
  try {
    await connectToDatabase();
    // Plan enforcement: session/month limit
    const plan = await getUserPlan(clerkId);
    const now = new Date();
    const startOfMonth = getCurrentBillingPeriodStart();
    const sessionCount = await VoiceSession.countDocuments({
      clerkId,
      startedAt: { $gte: startOfMonth },
    });
    if (sessionCount >= plan.maxSessionsPerMonth) {
      return { success: false, error: "Monthly session limit reached for your plan." };
    }

    const session = await VoiceSession.create({
      clerkId,
      bookId,
      startedAt: new Date(),
      billingPeriodStart: startOfMonth,
      durationSeconds: 0,
    });

    return { success: true, sessionId: session._id.toString() };
  } catch (e) {
    console.error("Error starting voice session", e);
    return { success: false, error: "Failed to start voice session" };
  }
};

export const endVoiceSession = async (
  sessionId: string,
  durationSeconds: number,
): Promise<EndSessionResult> => {
  try {
    await connectToDatabase();
    const result =await VoiceSession.findByIdAndUpdate(sessionId, {
      endedAt: new Date(),
      durationSeconds,
    });

    if(!result) return { success: false, error: "Session not found" };
    return { success: true };
  } catch (e) {
    console.error("Error ending voice session", e);
    return { success: false, error: "Failed to end voice session" };
  }
};
