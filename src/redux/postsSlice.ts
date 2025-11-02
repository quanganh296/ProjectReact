import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Post, Comment } from "../types";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "posts_data";

// Load from localStorage
const loadPosts = (): Post[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save to localStorage
const savePosts = (posts: Post[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

const initialState: Post[] = loadPosts();

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // ➕ Add new post
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

    // ✏ Update post
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
        savePosts(state);
      }
    },

    // ❌ Delete post
    deletePost: (state, action: PayloadAction<string>) => {
      const filtered = state.filter((p) => p.id !== action.payload);
      savePosts(filtered);
      return filtered;
    },

    // ❤️ Like post
    likePost: (state, action: PayloadAction<string>) => {
      const post = state.find((p) => p.id === action.payload);
      if (post) {
        post.likes = (post.likes ?? 0) + 1;
        savePosts(state);
      }
    },

    // 💬 Add comment — MATCH index.ts types
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
