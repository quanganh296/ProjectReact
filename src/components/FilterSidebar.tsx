import React from "react";
import { Tabs } from "antd";
import "../styles/FilterSidebar.css";

interface FilterSidebarProps {
  selectedView: string;
  selectedCategory: string;
  onViewChange: (view: string) => void;
  onCategoryChange: (category: string) => void;
}

const { TabPane } = Tabs;

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedView,
  selectedCategory,
  onViewChange,
  onCategoryChange,
}) => {
  return (
    <div className="filter-sidebar">
      <Tabs activeKey={selectedView} onChange={onViewChange} tabBarGutter={24}>
        <TabPane tab="All blog posts" key="All blog posts" />
        <TabPane tab="All my posts" key="All my posts" />
      </Tabs>

      <Tabs activeKey={selectedCategory} onChange={onCategoryChange} tabBarGutter={16} className="category-tabs">
        <TabPane tab="All" key="All" />
        <TabPane tab="Daily Journal" key="Daily Journal" />
        <TabPane tab="Personal Thoughts" key="Personal Thoughts" />
        <TabPane tab="Work & Career" key="Work & Career" />
        <TabPane tab="Emotions & Feelings" key="Emotions & Feelings" />
      </Tabs>
    </div>
  );
};

export default FilterSidebar;