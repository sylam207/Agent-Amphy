"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function PokemonLibraryHero() {
  return (
    <section className="w-full pt-20 md:pt-24 sm:pt-28 mb-5 md:mb-5">
      <div className="mx-auto w-full rounded-[5.5px] border border-[#decfb2] bg-[#e8dcc4] px-6 py-6 md:px-8 md:py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="w-full lg:max-w-90">
            <h1 className="font-serif text-[2.3rem] font-semibold leading-tight text-[#2d2218] md:text-[2.5rem]">
              Your Library
            </h1>

            <p className="mt-4 max-w-105 text-[1rem] leading-7 text-[#6f665d]">
              Convert your Pokémon books into interactive AI conversations.
              Listen, learn, and discuss your favorite reads.
            </p>

            <Link href="/books/new">
              <button className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-[1.05rem] font-semibold text-[#3a2d20] shadow-[0_4px_14px_rgba(80,62,35,0.08)] transition hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(80,62,35,0.12)]">
                <Plus className="h-5 w-5" />
                Add new book
              </button>
            </Link>
          </div>

          {/* Center */}
          <div className="flex w-full flex-1 justify-center">
            <div className="relative h-65 w-full max-w-[320px]">
              {/* Soft background glow */}
              <div className="absolute left-1/2 top-[4.5px] h-[37.5px] w-16.5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,242,181,0.95)_0%,rgba(255,231,143,0.55)_35%,rgba(255,214,102,0.18)_60%,transparent_82%)] blur-md" />

              {/* Secondary pink electric glow */}
              <div className="absolute left-[52%] top-[14.5px] h-[22.5px] w-[37.5px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,197,226,0.55)_0%,rgba(255,197,226,0.22)_45%,transparent_78%)] blur-lg" />

              {/* Ground shadow */}
              <div className="absolute bottom-3 left-1/2 h-7 w-[62.5px] -translate-x-1/2 rounded-full bg-[rgba(97,72,42,0.12)] blur-md" />

              {/* Back standing books */}
              <div className="absolute right-[21.25px] top-12 z-10 flex items-end gap-1">
                <div className="h-18 w-4.5 rounded-t-lg rounded-b-[3px] bg-linear-to-b from-[#9a6749] to-[#6f432e] shadow-[0_5px_10px_rgba(0,0,0,0.12)]" />
                <div className="h-[21.5px] w-5.5 rounded-t-lg rounded-b-[3px] bg-linear-to-b from-[#724c35] to-[#4d3021] shadow-[0_5px_10px_rgba(0,0,0,0.12)]" />
                <div className="h-16 w-4 rounded-t-lg rounded-b-[3px] bg-linear-to-b from-[#c29a55] to-[#8f6b32] shadow-[0_5px_10px_rgba(0,0,0,0.12)]" />
              </div>

              {/* Decorative Pokeball style orb / globe */}
              <div className="absolute left-[31.5px] top-5 z-10">
                <div className="relative h-[19.5px] w-[19.5px] rounded-full border-[3px] border-[#9f825f] bg-[radial-gradient(circle_at_30%_28%,#f8eed7_0%,#ead9b6_42%,#c7a97b_100%)] shadow-[0_10px_18px_rgba(0,0,0,0.14)]">
                  <div className="absolute left-3 top-6 h-0.5 w-13 rotate-18 bg-[#b5966d]/70" />
                  <div className="absolute left-[4.5px] top-4 h-10 w-7 rounded-[50%] border border-[#b5966d]/60" />
                </div>
                <div className="mx-auto h-[9.5px] w-2.5 rounded-b-md bg-linear-to-b from-[#7f5d42] to-[#5e432f]" />
                <div className="-mt-0.5 mx-auto h-2 w-12 rounded-full bg-[#72523a]" />
              </div>

              {/* Lamp */}
              <div className="absolute right-4.5 top-3 z-10">
                <div className="relative h-29.5 w-16.5">
                  <div className="absolute right-2.5 top-0 h-21 w-4.5 rounded-full bg-[#72543b]" />
                  <div className="absolute right-2.5 top-2 h-1.25 w-7 rounded-full bg-[#72543b]" />
                  <div className="absolute right-8.5 top-2 h-6 w-1 rotate-28 rounded-full bg-[#72543b]" />
                  <div className="absolute right-5.5 top-2.25 h-4.5 w-6.5 rotate-18 rounded-b-[14px] rounded-t-[5px] border border-[#8c6a49] bg-linear-to-b from-[#d3a85a] to-[#8f6636] shadow-[0_4px_10px_rgba(0,0,0,0.15)]" />
                  <div className="absolute right-3.5 top-6.5 h-12 w-10 rounded-full bg-[radial-gradient(circle,rgba(255,226,146,0.55)_0%,rgba(255,226,146,0.18)_48%,transparent_76%)] blur-md" />
                  <div className="absolute bottom-2.5 right-1 h-1 w-4.5 rounded-full bg-[#72543b]" />
                  <div className="absolute bottom-0 right-0 h-3 w-6.5 rounded-full bg-[#5a402d]" />
                </div>
              </div>

              {/* Bottom closed books */}
              <div className="absolute left-5.75 bottom-10 z-20 -rotate-12">
                <div className="relative h-5.5 w-23 rounded-[6px] bg-linear-to-b from-[#8f5c42] to-[#613a29] shadow-[0_8px_16px_rgba(0,0,0,0.15)]">
                  <div className="absolute inset-x-2 top-[1.25px] h-0.5 rounded-full bg-[#d8b27e]/70" />
                </div>
              </div>
              <div className="absolute left-28.75 bottom-13.75 z-10 rotate-10">
                <div className="relative h-5 w-19.5 rounded-[6px] bg-linear-to-b from-[#6f4634] to-[#4d2d22] shadow-[0_8px_16px_rgba(0,0,0,0.15)]">
                  <div className="absolute inset-x-2 top-[1.25px] h-0.5 rounded-full bg-[#caa36f]/60" />
                </div>
              </div>

              {/* Open book */}
              <div className="absolute left-[42.5px] bottom-[5.5px] z-30">
                <div className="relative h-18.5 w-[29.5px]">
                  <div className="absolute left-1/2 top-2.5 h-13 w-2.5 -translate-x-1/2 rounded-b-md bg-[#b98f59]" />
                  <div className="absolute left-0 top-3 h-12 w-14.5 origin-bottom-right skew-y-10 rounded-bl-3xl rounded-tr-[5px] rounded-tl-xl border border-[#d9c6a0] bg-linear-to-b from-[#fff8ea] to-[#ead7b3] shadow-[0_8px_18px_rgba(0,0,0,0.1)]" />
                  <div className="absolute right-0 top-3 h-12 w-14.5 origin-bottom-left -skew-y-10 rounded-br-3xl rounded-tl-[5px] rounded-tr-xl border border-[#d9c6a0] bg-linear-to-b from-[#fff8ea] to-[#ead7b3] shadow-[0_8px_18px_rgba(0,0,0,0.1)]" />
                  <div className="absolute left-3 top-5.5 h-px w-7.5 bg-[#cbb48f]" />
                  <div className="absolute left-3 top-7 h-px w-6 bg-[#cbb48f]" />
                  <div className="absolute right-3 top-5.5 h-px w-7.5 bg-[#cbb48f]" />
                  <div className="absolute right-3 top-7 h-px w-6 bg-[#cbb48f]" />
                </div>
              </div>

              {/* Ampharos */}
              <div className="absolute left-1/2 top-[8.5px] z-40 -translate-x-1/2">
                <div className="relative">
                  <div className="absolute left-1/2 top-9 h-[23.75px] w-[23.75px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,236,158,0.85)_0%,rgba(255,214,92,0.4)_46%,transparent_76%)] blur-md" />
                  <Image
                    src="/assets/amphy.png"
                    alt="Ampharos illustration"
                    width={145}
                    height={165}
                    className="relative object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.18)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="w-full lg:w-1/4">
            <div className="mx-auto w-full max-w-75 rounded-3xl bg-white px-5 py-5 shadow-[0_8px_24px_rgba(90,70,40,0.08)]">
              <div className="space-y-5">
                <StepItem
                  number="1"
                  title="Upload PDF"
                  description="Add your book file"
                />
                <StepItem
                  number="2"
                  title="AI Processing"
                  description="We analyze the content"
                />
                <StepItem
                  number="3"
                  title="Voice Chat"
                  description="Discuss with AI"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#b8ab98] text-sm font-semibold text-[#5e5447]">
        {number}
      </div>

      <div>
        <p className="text-[1rem] font-semibold leading-5 text-[#3a3026]">
          {title}
        </p>
        <p className="mt-1 text-[0.95rem] leading-5 text-[#7b7165]">
          {description}
        </p>
      </div>
    </div>
  );
}