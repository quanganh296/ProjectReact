export interface AdminPost {
  id: string;
  title: string;
  content: string;
  categories: number[];
  mood: string;
  status: "public" | "private";
  image?: string;
  createdAt: string;
}

export const ADMIN_POST_KEY = "admin_posts";

export const loadAdminPosts = (): AdminPost[] => {
  const saved = localStorage.getItem(ADMIN_POST_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveAdminPosts = (posts: AdminPost[]) => {
  localStorage.setItem(ADMIN_POST_KEY, JSON.stringify(posts));
};
