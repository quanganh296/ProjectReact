// src/types/index.ts
export interface Comment {
  id: number;
  postId: number;
  text: string;
  author: string;
  date: string;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  mood?: string;
  isMine?: boolean;
  status?: "public" | "private";
  author?: string;
}