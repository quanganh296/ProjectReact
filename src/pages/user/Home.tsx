import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Row, Col, Card, Pagination } from "antd";
import CategoryTabs from "../../components/CategoryTabs";
import Header from "../../components/Header";
import "../../layout/Home.css";
import PostCard from "../../components/PostCard";

const HomePage: React.FC = () => {
  const posts = useSelector((state: RootState) => state.posts.posts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 6; // số bài mỗi trang

  // Lọc theo chủ đề
  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  // Tính toán phạm vi bài viết theo trang
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Khi đổi tab → quay lại trang 1
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Bài viết nổi bật + bài nhỏ bên phải (dựa trên filteredPosts)
  const featuredPost = filteredPosts[0];
  const sidePosts = filteredPosts.slice(1, 3);

  return (
    <>
      <Header />

   <div className="homepage-container">
  <h4 className="fw-bold mb-3">Recent blog posts</h4>

  {/* --- Bài nổi bật + 2 bài bên phải --- */}
  <Row gutter={[16, 16]}>
    {featuredPost && (
      <Col xs={24} md={16} key={featuredPost.id}>
        <PostCard {...featuredPost} />
        <Card
          hoverable
          cover={
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="featured-img"
            />
          }
          className="featured-card"
        >
          <p className="text-muted small mb-1">Date: {featuredPost.date}</p>
          <h5 className="fw-semibold">{featuredPost.title}</h5>
          <p className="text-secondary small">{featuredPost.excerpt}</p>
          <a href="#" className="text-primary small">
            {featuredPost.category}
          </a>
        </Card>
      </Col>
    )}

    <Col xs={24} md={8}>
      {sidePosts.map((p) => (
        <Card
          key={p.id}
          hoverable
          cover={<img src={p.image} alt={p.title} className="side-img" />}
          className="side-card mb-3"
        >
          <p className="text-muted small mb-1">Date: {p.date}</p>
          <h6 className="fw-semibold">{p.title}</h6>
          <a href="#" className="text-primary small">
            {p.category}
          </a>
        </Card>
      ))}
    </Col>
  </Row>

        {/* --- Tabs chọn chủ đề --- */}
        <h4 className="fw-bold mt-5 mb-3">All blog posts</h4>
        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* --- Hiển thị bài theo trang --- */}
        <Row gutter={[16, 16]}>
          {currentPosts.map((p) => (
            <Col xs={24} sm={12} md={8} key={p.id}>
              <Card
                hoverable
                cover={<img src={p.image} alt={p.title} className="post-img" />}
                className="post-card"
              >
                <p className="text-muted small mb-1">Date: {p.date}</p>
                <h6 className="fw-semibold">{p.title}</h6>
                <p className="text-secondary small">{p.excerpt}</p>
                <a href="#" className="text-primary small">
                  {p.category}
                </a>
              </Card>
            </Col>
          ))}
        </Row>

        {/* --- Phân trang --- */}
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            pageSize={postsPerPage}
            total={filteredPosts.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
