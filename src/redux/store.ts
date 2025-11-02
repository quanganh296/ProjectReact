import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./postsSlice";
import categoriesReducer from "./categoriesSlice";
import commentsReducer from "./commentsSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    categories: categoriesReducer,
    comments: commentsReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;