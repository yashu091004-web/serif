export type PostStatus = "draft" | "published";

export interface Author {
  id: string;
  name: string;
  initials: string;
  role: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  cover: string;
  seoTitle: string;
  seoDescription: string;
  author: Author;
  status: PostStatus;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  views: number;
}

export type TaskStatus = "todo" | "in-progress" | "done";

export interface DashboardTask {
  id: string;
  title: string;
  status: TaskStatus;
  due: string;
}

export interface DashboardStats {
  totalPosts: number;
  drafts: number;
  monthlyViews: string;
}

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  avatar: string;
}