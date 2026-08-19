"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Serif
        </Link>
        <nav className="flex items-center gap-2">
          {loading ? null : user ? (
            <>
              <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Dashboard
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Log in
              </Link>
              <Link href="/signup" className={buttonVariants({ size: "sm" })}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
