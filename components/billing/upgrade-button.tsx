"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function UpgradeButton({
  label = "Upgrade to Pro",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) {
        toast.error(data?.error ?? "Could not start checkout. Try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Network error. Try again.");
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={startCheckout}
      disabled={loading}
      size="lg"
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Redirecting…
        </>
      ) : (
        label
      )}
    </Button>
  );
}
