import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Post {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  isMine: boolean;
  mood?: string; 
  status?: "public" | "private";
}

interface PostsState {
  posts: Post[];
}

const initialState: PostsState = {
  posts: [
    {
      id: 1,
      title: "A Productive Day at Work",
      date: "2025-02-25",
      category: "Daily Journal",
      excerpt:
        "Today was a really productive day at work. I managed to finish a report ahead of schedule and received positive feedback from my manager.",
      image: "/Auth/Image (6).png",
      isMine: true,
      mood: "happy",
    },
    {
      id: 2,
      title: "My First Job Interview Experience",
      date: "2025-02-24",
      category: "Work & Career",
      excerpt:
        "I had my first job interview today! I was nervous at first, but as the conversation went on, I felt more confident. ",
      image: "/Auth/Image (1).png",
      isMine: true,
      mood: "happy",
    },
    {
      id: 3,
      title: "Overthinking Everything",
      date: "2025-02-23",
      category: "Personal Thoughts",
      excerpt:
        "Lately, I have been overthinking everything, from small decisions to bigger life choices.",
      image: "/Auth/Image (2).png",
      isMine: true,
      mood: "happy",
    },
    {
      id: 4,
      title: "How Collaboration Makes Us Better Designers",
      date: "2025-02-21",
      category: "Work & Career",
      excerpt:
        "We learn more and build stronger teams through collaboration.",
      image: "/Auth/Image (3).png",
      isMine: false,
      mood: "happy",
    },
     {
      id: 5,
      title: "Our top 10 Javascript frameworks to use",
      date: "2025-02-21",
      category: "Work & Career",
      excerpt:
        "JavaScript frameworks make development easy with extensive features and functionalities.",
      image: "/Auth/Image (4).png",
      isMine: false,
      mood: "happy",
    },
     {
      id: 6,
      title: "Podcast: Creating a better CX Community",
      date: "2025-02-05",
      category: "Emotions & Feelings",
      excerpt:
        "Starting a community doesn’t need to be complicated, but how do you get started?",
      image: "/Auth/Image (5).png",
      isMine: true,
      mood: "happy",
    },
  ],
};


const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
  },
});

export const { setPosts } = postsSlice.actions;
export default postsSlice.reducer;
