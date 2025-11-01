// src/pages/user/HomePage.tsx
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Row, Col, Pagination, Button } from "antd";
import Header from "../../components/Header";
import FilterSidebar from "../../components/FilterSidebar";
import PostCard from "../../components/PostCard";
import Footer from "../../components/Footer";
import "../../styles/Home.css";
import "../../styles/PostCard.css";
import "../../styles/Footer.css";
import { useAuth } from "../../context/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { getCategoryColor } from "../../utils/categoryColor";

interface Post {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  image: string;
  isMine?: boolean;
  status?: "public" | "private";
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const posts = useSelector((state: RootState) => state.posts.posts);

  const shouldReset = Boolean(location.state?.resetToAllBlogs);
  const [selectedView, setSelectedView] = useState(
    shouldReset ? "All blog posts" : "All blog posts"
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  React.useEffect(() => {
    if (shouldReset) {
      setSelectedView("All blog posts");
      setSelectedCategory("All");
      setCurrentPage(1);
      window.history.replaceState({}, "");
    }
  }, [shouldReset]);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (selectedView === "All my posts" && isAuthenticated) {
      result = result.filter((p: Post) => p.isMine);
    }

    if (selectedCategory !== "All") {
      result = result.filter((p: Post) => p.category === selectedCategory);
    }

    if (!isAuthenticated || !user) {
      result = result.filter((p: Post) => p.status !== "private");
    } else {
      result = result.filter((p: Post) => p.status !== "private" || p.isMine);
    }

    return result;
  }, [posts, selectedView, selectedCategory, isAuthenticated, user]);

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

  return (
    <>
      <Header />
      <div className="homepage-container">
        {/* Nếu chọn "All my posts", ẩn Recent posts và hiển thị Add new article */}
        {selectedView === "All my posts" ? (
          <div
            style={{
              maxWidth: "1280px",
              margin: "40px auto",
              padding: "0 20px",
              textAlign: "center",
            }}
          >
            <h2>All my posts</h2>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/add-article")}
              style={{ marginTop: "20px" }}
            >
              + Add new article
            </Button>
          </div>
        ) : (
          <>
            {/* Featured Section */}
            <h2 style={{ maxWidth: "1280px", margin: "40px auto 20px", padding: "0 20px" }}>
              Recent posts
            </h2>

            {filteredPosts.length > 0 && (
              <div
                className="featured-section"
                style={{ display: "flex", gap: "20px", maxWidth: "1280px", margin: "0 auto" }}
              >
                {currentPosts[0] && (
                  <PostCard
                    id={currentPosts[0].id}
                    title={currentPosts[0].title}
                    date={currentPosts[0].date}
                    category={currentPosts[0].category}
                    excerpt={currentPosts[0].excerpt}
                    image={currentPosts[0].image}
                    isMine={currentPosts[0].isMine}
                    onEdit={() => navigate(`/add-article/${currentPosts[0].id}`)}
                    onTitleClick={() => navigate(`/article/${currentPosts[0].id}`)}
                    categoryColor={getCategoryColor(currentPosts[0].category)}
                  />
                )}

                <div className="side-posts-container">
                  {currentPosts.slice(1, 3).map((post) => (
                    <div key={post.id} className="side-post-card">
                      <img src={post.image} alt={post.title} className="side-post-img" />
                      <div className="side-post-content">
                        <h4 className="side-post-title">{post.title}</h4>
                        <p className="post-date">{post.date}</p>
                        <p className="side-post-excerpt">{post.excerpt}</p>
                        <a
                          href="#"
                          className="post-category"
                          style={{ color: getCategoryColor(post.category) }}
                        >
                          {post.category}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <FilterSidebar
          selectedView={selectedView}
          selectedCategory={selectedCategory}
          onViewChange={handleViewChange}
          onCategoryChange={handleCategoryChange}
        />

        {/* List posts */}
        <div className="posts-section-card">
          <div className="posts-section-inner">
            <Row gutter={[24, 24]}>
              {currentPosts.map((post) => (
                <Col key={post.id} xs={24} sm={12} lg={8}>
                  <PostCard
                    id={post.id}
                    title={post.title}
                    date={post.date}
                    category={post.category}
                    excerpt={post.excerpt}
                    image={post.image}
                    isMine={post.isMine}
                    onEdit={() => navigate(`/add-article/${post.id}`)}
                    onTitleClick={() => navigate(`/article/${post.id}`)}
                    categoryColor={getCategoryColor(post.category)}
                  />
                </Col>
              ))}
            </Row>

            {filteredPosts.length > postsPerPage && (
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
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HomePage;
