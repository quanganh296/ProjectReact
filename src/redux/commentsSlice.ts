// src/redux/commentsSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Comment {
  id: number;
  postId: number;
  text: string;
  author: string;
  date: string;
}

interface CommentsState {
  comments: Comment[];
}

const initialState: CommentsState = {
  comments: [
    {
      id: 1,
      postId: 1,
      text: "Great article! Really helpful.",
      author: "Nguyen Van A",
      date: "2025-02-26",
    },
    {
      id: 2,
      postId: 1,
      text: "Thanks for sharing your experience.",
      author: "Tran Thi B",
      date: "2025-02-27",
    },
  ],
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: {
      reducer: (state, action: PayloadAction<Comment>) => {
        state.comments.push(action.payload);
      },
      prepare: (postId: number, text: string, author: string) => {
        return {
          payload: {
            id: Date.now(),
            postId,
            text,
            author,
            date: new Date().toISOString().split("T")[0],
          } as Comment,
        };
      },
    },
    deleteComment: (state, action: PayloadAction<number>) => {
      state.comments = state.comments.filter((c) => c.id !== action.payload);
    },
  },
});

export const { addComment, deleteComment } = commentsSlice.actions;
export default commentsSlice.reducer;