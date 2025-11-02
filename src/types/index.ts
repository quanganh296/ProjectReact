export interface Comment {
  id: string;
  postId: string;
  text: string;
  author: string;
  date: string;
}

export interface Post {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  isMine?: boolean;
  status?: "public" | "private";
  likes: number;
  comments: Comment[];
}
