export type PostStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  userId: string;
  title: string;
  summary: string;
  body: string;
  imageUrl: string | null;
  status: PostStatus;
  slug: string;
  readTime: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "todo" | "in-progress" | "done";

export interface DashboardTask {
  id: string;
  title: string;
  status: TaskStatus;
  due: string;
}

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  avatar: string;
}
