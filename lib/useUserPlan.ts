import { PLANS } from "@/lib/subscription-constants";
import { useUser } from "@clerk/nextjs";

export function useUserPlan() {
  const { user } = useUser();
  if (!user) return PLANS.free;
  const plan = (user.publicMetadata?.subscription as string) || "free";
  if (plan === "pro") return PLANS.pro;
  if (plan === "standard") return PLANS.standard;
  return PLANS.free;
}
