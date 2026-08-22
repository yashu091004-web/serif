"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  useEffect(() => {
    if (!success) return;
    const timeout = setTimeout(() => {
      router.replace("/login");
      router.refresh();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [success, router]);

  return (
    <AuthShell
      title="Set a new password"
      description="Choose a new password for your account."
    >
      <form onSubmit={handleResetPassword} className="space-y-4">
        {error && (
          <div className="space-y-1">
            <p className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
            <p className="text-xs text-muted-foreground">
              Link invalid or expired? Request a new reset email from the{" "}
              <Link href="/login" className="font-medium text-primary hover:text-primary/80">
                login page
              </Link>
              .
            </p>
          </div>
        )}
        {success && (
          <p className="rounded-md border border-emerald-600/20 bg-emerald-600/5 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-500">
            Password updated. Redirecting you to log in...
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={success}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={success}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading || success}>
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t need to reset?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary/80">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
