// src/context/CategoryProvider.tsx
import React, { type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { CategoryContext } from "./CategoryContext";
import { addCategory, deleteCategory } from "../redux/categoriesSlice";

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories.categories);

  const handleAdd = (name: string) => {
    dispatch(addCategory(name));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteCategory(id));
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory: handleAdd, deleteCategory: handleDelete }}>
      {children}
    </CategoryContext.Provider>
  );
};