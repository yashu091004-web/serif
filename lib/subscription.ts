import type { Db } from "@/lib/posts";

export type SubscriptionStatus = "free" | "active" | "past_due" | "cancelled";

export function isProStatus(status: string | null | undefined): boolean {
  return status === "active";
}

export async function getSubscriptionStatus(
  db: Db,
  userId: string
): Promise<SubscriptionStatus> {
  try {
    const { data, error } = await db
      .from("profiles")
      .select("subscription_status")
      .eq("id", userId)
      .maybeSingle();
    if (error || !data) return "free";
    const status = (data as { subscription_status?: string })
      .subscription_status;
    return (status as SubscriptionStatus) ?? "free";
  } catch {
    return "free";
  }
}

export async function isPro(db: Db, userId: string): Promise<boolean> {
  return isProStatus(await getSubscriptionStatus(db, userId));
}
