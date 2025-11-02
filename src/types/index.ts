// src/types/index.ts
export interface Comment {
  id: string;        // ✅ sửa thành string
  postId: string;    // ✅ sửa thành string
  text: string;
  author: string;
  date: string;
}

export interface Post {
  id: string; // ✅ đổi từ number → string
  title: string;
  category: string;
  mood?: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  isMine?: boolean;
  status?: "public" | "private";
  likes?: number;
  comments?: Comment[];
}
