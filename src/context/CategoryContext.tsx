import { createContext } from "react";
import type { Category } from "../redux/categoriesSlice";

interface CategoryContextType {
  categories: Category[];
  addCategory: (name: string) => void;
  deleteCategory: (id: number) => void;
}

export const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  addCategory: () => {},
  deleteCategory: () => {},
});