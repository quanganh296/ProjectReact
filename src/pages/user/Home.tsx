// src/pages/user/Home.tsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Row, Col, Pagination, Tag, Space, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Header from "../../components/Header";
import "../../layout/Home.css";
import { getCategoryColor } from "../../utils/categoryColor";

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  const posts = useSelector((state: RootState) => state.posts.posts);
  const [selectedView, setSelectedView] = useState("All blog posts");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 6;

  let filteredPosts = posts;

  if (selectedCategory !== "All") {
    filteredPosts = filteredPosts.filter((p) => p.category === selectedCategory);
  }

  if (selectedView === "All my posts") {
    filteredPosts = filteredPosts.slice(0, 3);
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handleViewChange = (view: string) => {
    setSelectedView(view);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const featuredPost = filteredPosts[0];
  const sidePosts = filteredPosts.slice(1, 3);

  return (
    <>
      <Header />

      <div className="homepage-container">
        <h4 className="fw-bold mb-2">Recent blog posts</h4>

        {/* =============== PHẦN TRÊN: BỎ RADIUS =============== */}
        <div className="featured-section">
        <Row gutter={[16, 0]} align="top">
            {/* BÀI LỚN BÊN TRÁI */}
            {featuredPost && (
              <Col xs={24} lg={10}>
                <div className="main-post">
                  <img src="/Auth/Image.png" alt={featuredPost.title} className="main-post-img" />
                  <div className="main-post-content">
                    <Text type="secondary" className="post-date">Date: {featuredPost.date}</Text>
                    <Title level={3} className="main-post-title">{featuredPost.title}</Title>
                    <Text className="main-post-excerpt">{featuredPost.excerpt}</Text>
                    <Tag className="compact-tag" color={getCategoryColor(featuredPost.category)}>
                      {featuredPost.category}
                    </Tag>
                  </div>
                </div>
              </Col>
            )}

            {/* 2 BÀI NHỎ BÊN PHẢI */}
            <Col xs={24} lg={12}>
              <div className="side-posts-container">
                {sidePosts.map((p) => (
                  <div key={p.id} className="side-post-card">
                    <img src={p.image} alt={p.title} className="side-post-img" />
                    <div className="side-post-content">
                      <Text type="secondary" className="post-date">Date: {p.date}</Text>
                      <Title level={5} className="side-post-title">{p.title}</Title>
                      <Text className="side-post-excerpt">{p.excerpt}</Text>
                      <Tag className="compact-tag" color={getCategoryColor(p.category)}>
                        {p.category}
                      </Tag>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>

        {/* =============== PHẦN DƯỚI: KHÔNG ĐỘNG VÀO =============== */}
        <div className="posts-section-card">
          <div className="posts-section-inner">
            <div className="view-tabs">
              <Space size={24}>
                <span className={`view-tab ${selectedView === "All blog posts" ? "active" : ""}`} onClick={() => handleViewChange("All blog posts")}>
                  All blog posts
                </span>
                <span className={`view-tab ${selectedView === "All my posts" ? "active" : ""}`} onClick={() => handleViewChange("All my posts")}>
                  All my posts
                </span>
              </Space>
            </div>

            <div className="category-links">
              <Space size={20}>
                {["All", "Daily Journal", "Work & Career", "Personal Thoughts", "Emotions & Feelings"].map((cat) => (
                  <span key={cat} className={`category-link ${selectedCategory === cat ? "active" : ""}`} onClick={() => handleCategoryChange(cat)}>
                    {cat}
                  </span>
                ))}
              </Space>
            </div>

            <div className="posts-grid">
              <Row gutter={[24, 24]}>
                {currentPosts.map((p) => (
                  <Col xs={24} md={12} lg={8} key={p.id}>
                    <div className="post-item">
                      <img src={p.image} alt={p.title} className="post-item-img" />
                      <div className="post-item-content">
                        <Text type="secondary" className="post-date">Date: {p.date}</Text>
                        <Title level={5} className="post-title">
                          {p.title} <RightOutlined className="arrow-icon" />
                        </Title>
                        <Text className="post-excerpt">{p.excerpt}</Text>
                        <Tag className="compact-tag" color={getCategoryColor(p.category)}>
                          {p.category}
                        </Tag>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            <div className="pagination-wrapper">
              <Pagination
                current={currentPage}
                pageSize={postsPerPage}
                total={filteredPosts.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                showQuickJumper
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;