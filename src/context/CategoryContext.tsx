/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, type ReactNode } from "react";
import { DEFAULT_CATEGORIES } from "./constants";
import type { Category } from "./types";

interface CategoryContextType {
  categories: Category[];
  addCategory: (name: string) => boolean;
  deleteCategory: (key: string) => boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  const addCategory = (name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) return false;

    const newCat: Category = { key: Date.now().toString(), name: trimmed };
    setCategories((prev) => [...prev, newCat]);
    return true;
  };

  const deleteCategory = (key: string): boolean => {
    if (DEFAULT_CATEGORIES.some((c) => c.key === key)) return false;
    setCategories((prev) => prev.filter((c) => c.key !== key));
    return true;
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error("useCategories must be used within CategoryProvider");
  return context;
};
