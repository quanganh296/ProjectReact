
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  username:string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  likes: number;
  comments: Comment[];
  isMine?: boolean;
  image?: string;
}

export interface Comment {
  id: string;
  postId: string;
  text: string;
  author: string;
  date: string;
}