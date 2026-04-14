"use client";

import { PLANS } from "@/lib/subscription-constants";
import { Show } from "@clerk/nextjs";
import { CheckoutButton } from "@clerk/nextjs/experimental";

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-[#fdf6ea] pt-32 pb-12 px-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-2 text-center">Choose Your Plan</h1>
      <p className="text-lg text-[#7a6a5c] mb-10 text-center">
        Upgrade to unlock more books, longer sessions, and advanced features.
      </p>
      <div className="flex flex-col md:flex-row gap-8 justify-center w-full max-w-5xl">
        {Object.values(PLANS).map((plan, idx) => (
          <div
            key={plan.slug}
            className={`flex-1 rounded-2xl border-2 ${plan.slug === "free" ? "border-[#7a4c2a]" : "border-transparent"} bg-white shadow-md flex flex-col p-8 relative min-w-70 max-w-85 ${plan.slug === "free" ? "scale-105" : ""}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl font-bold text-[#7a4c2a]">{plan.name}</span>
              {plan.slug === "free" && (
                <span className="bg-[#7a4c2a] text-white text-xs px-3 py-1 rounded-full">Active</span>
              )}
            </div>
            <div className="text-3xl font-bold mb-1">{plan.price}
              <span className="text-base font-normal text-[#7a6a5c] ml-1 align-top">{plan.slug !== "free" ? "/month" : ""}</span>
            </div>
            <div className="text-xs text-[#7a6a5c] mb-6 whitespace-pre-line">{plan.priceNote}</div>
            <ul className="mb-8 space-y-2 text-[#5b4f40] grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> {feature}
                </li>
              ))}
            </ul>
            {plan.slug !== "free" && plan.planId && (
              <Show when="signed-in">
                <CheckoutButton planId={plan.planId} planPeriod="month">
                  <button className="w-full py-2 rounded-lg bg-[#3d3630] text-white font-semibold shadow transition hover:bg-[#7a4c2a]">Subscribe</button>
                </CheckoutButton>
              </Show>
            )}
            {plan.slug !== "free" && (
              <Show when="signed-out">
                <button className="w-full py-2 rounded-lg bg-gray-300 text-gray-500 font-semibold shadow cursor-not-allowed" disabled>Sign in to subscribe</button>
              </Show>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
