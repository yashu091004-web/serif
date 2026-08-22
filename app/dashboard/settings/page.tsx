"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Bell, LogOut, Palette, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { logout } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, uploadAvatar, authorInitials } from "@/lib/profiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform ${
            checked ? "translate-x-[1.125rem]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  delay = 0,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <section
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className="animate-in fade-in slide-in-from-bottom-3 rounded-xl ring-1 ring-foreground/10 duration-500 ease-out [animation-fill-mode:both] motion-reduce:animate-none"
    >
      <div className="flex items-center gap-3 border-b border-border/80 px-5 py-4">
        <span className="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
          <Icon className="size-4.5" />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [notifications, setNotifications] = useState({
    newComments: true,
    weeklyDigest: true,
    productUpdates: false,
    publishReminders: true,
  });

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (cancelled || !data.user) {
          if (!cancelled) setLoading(false);
          return null;
        }
        if (!cancelled) setEmail(data.user.email ?? "");
        return supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", data.user.id)
          .maybeSingle();
      })
      .then((result) => {
        if (cancelled || !result) return;
        setName(result.data?.full_name ?? "");
        setAvatarUrl(result.data?.avatar_url ?? "");
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveProfile() {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      toast.error("You need to be signed in");
      return;
    }
    setSaving(true);
    try {
      await updateProfile(supabase, data.user.id, { fullName: name });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Image must be under 5 MB");
      return;
    }
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      toast.error("You need to be signed in");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadAvatar(supabase, data.user.id, file);
      await updateProfile(supabase, data.user.id, { avatarUrl: url });
      setAvatarUrl(url);
      toast.success("Avatar updated");
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, preferences, and account.
        </p>
      </header>

      <Section
        icon={User}
        delay={0}
        title="Profile"
        description="How you appear to readers."
      >
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="size-16">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
              <AvatarFallback className="bg-primary/10 font-display text-lg font-semibold text-primary">
                {authorInitials(name || email || "?")}
              </AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Uploading…
                </>
              ) : (
                "Change avatar"
              )}
            </Button>
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} disabled readOnly />
            </div>
            <Button onClick={saveProfile} disabled={saving || loading}>
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save profile"
              )}
            </Button>
          </div>
        </div>
      </Section>

      <Section
        icon={Bell}
        delay={80}
        title="Notifications"
        description="Choose what you want to hear about."
      >
        <div className="divide-y divide-border/60">
          <Toggle
            checked={notifications.newComments}
            onChange={(checked) => setNotifications({ ...notifications, newComments: checked })}
            label="New comments"
            description="Get notified when readers comment on your posts."
          />
          <Toggle
            checked={notifications.weeklyDigest}
            onChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
            label="Weekly digest"
            description="A summary of your posts and performance, every Monday."
          />
          <Toggle
            checked={notifications.publishReminders}
            onChange={(checked) => setNotifications({ ...notifications, publishReminders: checked })}
            label="Publish reminders"
            description="Gentle nudges when drafts have been sitting too long."
          />
          <Toggle
            checked={notifications.productUpdates}
            onChange={(checked) => setNotifications({ ...notifications, productUpdates: checked })}
            label="Product updates"
            description="News about new features and improvements to Serif."
          />
        </div>
      </Section>

      <Section
        icon={Palette}
        delay={160}
        title="Preferences"
        description="Appearance and display options."
      >
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select value={theme} onValueChange={(value) => setTheme(value ?? "system")}>
            <SelectTrigger className="w-full" id="theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Section
        icon={LogOut}
        delay={240}
        title="Account"
        description="Sign out of your account on this device."
      >
        <form action={logout}>
          <Button type="submit" variant="destructive" className="gap-1.5">
            <LogOut className="size-4" />
            Log out
          </Button>
        </form>
      </Section>
    </div>
  );
}

