import { currentUser } from "@clerk/nextjs/server";
import { PLANS } from "@/lib/subscription-constants";

export async function getUserPlan(clerkId: string) {
  const user = await currentUser();
  if (!user) return PLANS.free;
  // Clerk MCP Billing: check user.publicMetadata.subscription
  const plan = (user.publicMetadata?.subscription as string) || "free";
  if (plan === "pro") return PLANS.pro;
  if (plan === "standard") return PLANS.standard;
  return PLANS.free;
}
