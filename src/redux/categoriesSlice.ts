import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Category { id: number; name: string; }
interface CategoriesState { categories: Category[]; }

const initialState: CategoriesState = {
  categories: [
    { id: 1, name: "Daily Journal" },
    { id: 2, name: "Work & Career" },
    { id: 3, name: "Personal Thoughts" },
    { id: 4, name: "Emotions & Feelings" },
  ]
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    }
  }
});

export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;