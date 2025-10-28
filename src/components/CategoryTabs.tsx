import React from "react";
import { Tabs } from "antd";

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const items = [
    { label: "All", key: "All" },
    { label: "Daily Journal", key: "Daily Journal" },
    { label: "Personal Thoughts", key: "Personal Thoughts" },
    { label: "Work & Career", key: "Work & Career" },
    { label: "Emotions & Feelings  ", key: "Emotions & Feelings  " },
  ];

  return (
    <Tabs
      activeKey={selectedCategory}
      items={items}
      onChange={onCategoryChange}
      centered
    />
  );
};

export default CategoryTabs;
