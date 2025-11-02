// src/redux/postsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../types";
import { v4 as uuidv4 } from "uuid";

// === Helper Functions ===
const savePosts = (posts: Post[]) => {
  localStorage.setItem("posts_data", JSON.stringify(posts));
};

const loadPosts = (): Post[] => {
  const saved = localStorage.getItem("posts_data");
  return saved ? JSON.parse(saved) : [];
};

// === Slice ===
const postsSlice = createSlice({
  name: "posts",
  initialState: loadPosts(),
  reducers: {
    // Tạo bài mới
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

    // Cập nhật bài
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
        savePosts(state);
      }
    },

    // Xóa bài
    deletePost: (state, action: PayloadAction<string>) => {
      const filtered = state.filter((p) => p.id !== action.payload);
      savePosts(filtered);
      return filtered;
    },

    // Like bài
    likePost: (state, action: PayloadAction<string>) => {
      const post = state.find((p) => p.id === action.payload);
      if (post) {
        post.likes! += 1;
        savePosts(state);
      }
    },
  },
});

export const { addPost, updatePost, deletePost, likePost } = postsSlice.actions;
export default postsSlice.reducer;