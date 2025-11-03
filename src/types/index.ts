export interface Post {
  id: string;
  title: string;
  category: number;
  content: string;
  excerpt: string;
  date: string;
  image?: string;
  likes: number;       
  comments: Comment[];  
  author?: string;
  comment?: string;
  isMine?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  text: string;
  author: string;
  date: string;
}