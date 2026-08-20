"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Bell, LogOut, Palette, User, Mail, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl ring-1 ring-foreground/10">
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
  const [profile, setProfile] = useState({
    name: "You",
    email: "you@example.com",
    avatar: "",
  });
  const [notifications, setNotifications] = useState({
    newComments: true,
    weeklyDigest: true,
    productUpdates: false,
    publishReminders: true,
  });

  function saveProfile() {
    toast.success("Profile updated");
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

      <Section icon={User} title="Profile" description="How you appear to readers.">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="size-16">
              <AvatarFallback className="bg-primary/10 font-display text-lg font-semibold text-primary">
                YO
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change avatar
            </Button>
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  Email
                </span>
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="size-3.5" />
                  Avatar URL
                </span>
              </Label>
              <Input
                id="avatar"
                placeholder="https://…"
                value={profile.avatar}
                onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
              />
            </div>
            <Button onClick={saveProfile}>Save profile</Button>
          </div>
        </div>
      </Section>

      <Section icon={Bell} title="Notifications" description="Choose what you want to hear about.">
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

      <Section icon={Palette} title="Preferences" description="Appearance and display options.">
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

      <Section icon={LogOut} title="Account" description="Sign out of your account on this device.">
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