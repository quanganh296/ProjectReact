// src/redux/postsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Post, Comment } from "../types";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "posts_data";

const loadPosts = (): Post[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const savePosts = (posts: Post[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

const initialState: Post[] = loadPosts();

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (
      state,
      action: PayloadAction<Omit<Post, "id" | "likes" | "comments">>
    ) => {
      const newPost: Post = {
        ...action.payload,
        id: uuidv4(),
        likes: 0,
        comments: [],
      };
      state.push(newPost);
      savePosts(state);
    },

    updatePost: (state, action: PayloadAction<Post>) => {
      const i = state.findIndex((p) => p.id === action.payload.id);
      if (i !== -1) {
        state[i] = action.payload;
        savePosts(state);
      }
    },

    deletePost: (state, action: PayloadAction<string>) => {
      const filtered = state.filter((p) => p.id !== action.payload);
      savePosts(filtered);
      return filtered;
    },

    likePost: (state, action: PayloadAction<string>) => {
      const post = state.find((p) => p.id === action.payload);
      if (post) {
        post.likes = (post.likes ?? 0) + 1;
        savePosts(state);
      }
    },

    addComment: (
      state,
      action: PayloadAction<{ postId: string; text: string; author: string }>
    ) => {
      const { postId, text, author } = action.payload;
      const post = state.find((p) => p.id === postId);
      if (!post) return;

      const newComment: Comment = {
        id: uuidv4(),
        postId,
        text,
        author,
        date: new Date().toISOString(),
      };

      post.comments = [...(post.comments ?? []), newComment];
      savePosts(state);
    },
  },
});

export const { addPost, updatePost, deletePost, likePost, addComment } =
  postsSlice.actions;

export default postsSlice.reducer;
