// src/redux/categoriesSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  id: number;
  name: string;
}

interface CategoriesState {
  categories: Category[];
}

const initialState: CategoriesState = {
  categories: [
    { id: 1, name: "Daily Journal" },
    { id: 2, name: "Work & Career" },
    { id: 3, name: "Personal Thoughts" },
    { id: 4, name: "Emotions & Feelings" },
  ],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
    addCategory(state, action: PayloadAction<string>) {
      const newId = Math.max(...state.categories.map(c => c.id), 0) + 1;
      state.categories.push({ id: newId, name: action.payload });
    },
    deleteCategory(state, action: PayloadAction<number>) {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
  },
});

export const { setCategories, addCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;