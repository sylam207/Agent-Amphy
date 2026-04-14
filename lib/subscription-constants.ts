export const PLANS = {
    free: {
        slug: "free",
        name: "Free",
        price: "$0",
        priceNote: "Always free",
        planId: "",
        maxBooks: 1,
        maxSessionsPerMonth: 5,
        maxSessionMinutes: 5,
        sessionHistory: false,
        features: [
            "Up to 1 book",
            "5 voice sessions per month",
            "5-minute sessions",
            "No session history"
        ],
    },
    standard: {
        slug: "standard",
        name: "Standard",
        price: "$7.99",
        priceNote: "/month\nBilled annually",
        planId: process.env.NEXT_PUBLIC_CLERK_PLAN_STANDARD || "",
        maxBooks: 10,
        maxSessionsPerMonth: 100,
        maxSessionMinutes: 15,
        sessionHistory: true,
        features: [
            "Up to 10 books",
            "100 voice sessions per month",
            "15-minute sessions"
        ],
    },
    pro: {
        slug: "pro",
        name: "Pro",
        price: "$15",
        priceNote: "/month\nBilled annually",
        planId: process.env.NEXT_PUBLIC_CLERK_PLAN_PRO || "",
        maxBooks: 100,
        maxSessionsPerMonth: Infinity,
        maxSessionMinutes: 60,
        sessionHistory: true,
        features: [
            "Up to 100 books",
            "Unlimited voice sessions per month",
            "60-minute sessions",
            "Priority support"
        ],
    },
};

export type PlanSlug = keyof typeof PLANS;
export type Plan = typeof PLANS[PlanSlug];

export const getCurrentBillingPeriodStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
};