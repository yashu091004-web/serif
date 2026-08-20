"use client";

import { useSyncExternalStore } from "react";
import { initialPosts, initialTasks } from "./dashboard-data";
import type { BlogPost, DashboardTask, PostStatus } from "./types";

export interface PostInput {
  title: string;
  subtitle: string;
  category: string;
  content: string;
  cover: string;
  seoTitle: string;
  seoDescription: string;
  status: PostStatus;
}

interface DashboardState {
  posts: BlogPost[];
  tasks: DashboardTask[];
}

let state: DashboardState = {
  posts: initialPosts,
  tasks: initialTasks,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function setState(next: DashboardState) {
  state = next;
  emit();
}

function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || `post-${Date.now()}`;
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function useDashboard() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getPostById(id: string): BlogPost | undefined {
  return state.posts.find((post) => post.id === id);
}

export function createPost(input: PostInput): BlogPost {
  const now = new Date().toISOString().slice(0, 10);
  const post: BlogPost = {
    id: `db-${Date.now()}`,
    slug: slugify(input.title),
    ...input,
    author: { id: "me", name: "You", initials: "YO", role: "Author" },
    publishedAt: input.status === "published" ? now : "",
    updatedAt: now,
    readTime: estimateReadTime(input.content),
    views: 0,
  };
  setState({ ...state, posts: [post, ...state.posts] });
  return post;
}

export function updatePost(id: string, input: PostInput) {
  const now = new Date().toISOString().slice(0, 10);
  setState({
    ...state,
    posts: state.posts.map((post) =>
      post.id === id
        ? {
            ...post,
            ...input,
            slug: slugify(input.title),
            updatedAt: now,
            publishedAt:
              input.status === "published" && !post.publishedAt
                ? now
                : post.publishedAt,
          }
        : post
    ),
  });
}

export function deletePost(id: string) {
  setState({ ...state, posts: state.posts.filter((post) => post.id !== id) });
}