// src/pages/user/Home.tsx
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
  const [selectedView, setSelectedView] = useState("All blog posts");
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
        {selectedView === "All my posts" ? (
          <div className="text-center my-8">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/add-article")}
            >
              Add New Article
            </Button>
          </div>
        ) : (
          <h2
            style={{
              maxWidth: "1280px",
              margin: "40px auto 20px",
              padding: "0 20px",
            }}
          >
            Recent posts
          </h2>
        )}

        {currentPosts.length > 0 && (
          <div
            className="featured-section"
            style={{
              display: "flex",
              gap: "20px",
              maxWidth: "1280px",
              margin: "0 auto",
            }}
          >
            {/* Main Post */}
            {currentPosts[0] && (
              <PostCard
                id={currentPosts[0].id}
                title={currentPosts[0].title}
                date={currentPosts[0].date}
                category={currentPosts[0].category}
                excerpt={currentPosts[0].excerpt}
                image={currentPosts[0].image}
                isMine={currentPosts[0].isMine && selectedView === "All my posts"}
                onEdit={() =>
                  navigate(`/add-article/${currentPosts[0].id}`)
                }
                onTitleClick={() =>
                  navigate(`/article/${currentPosts[0].id}`)
                }
                categoryColor={getCategoryColor(currentPosts[0].category)}
              />
            )}

            {/* Side Posts */}
            <div className="side-posts-container">
              {currentPosts.slice(1, 3).map((p) => (
                <div key={p.id} className="side-post-card">
                  <img src={p.image} alt={p.title} className="side-post-img" />
                  <div className="side-post-content">
                    <h4
                      className="side-post-title cursor-pointer"
                      onClick={() => navigate(`/article/${p.id}`)}
                    >
                      {p.title}
                    </h4>
                    <p className="post-date">{p.date}</p>
                    <p className="side-post-excerpt">{p.excerpt}</p>
                    <span
                      className="post-category"
                      style={{ color: getCategoryColor(p.category) }}
                    >
                      {p.category}
                    </span>
                    {p.isMine && selectedView === "All my posts" && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => navigate(`/add-article/${p.id}`)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <FilterSidebar
          selectedView={selectedView}
          selectedCategory={selectedCategory}
          onViewChange={handleViewChange}
          onCategoryChange={handleCategoryChange}
        />

        {/* List posts */}
        {selectedView !== "All my posts" && (
          <div className="posts-section-card">
            <div className="posts-section-inner">
              <Row gutter={[24, 24]}>
                {currentPosts.map((p) => (
                  <Col key={p.id} xs={24} sm={12} lg={8}>
                    <PostCard
                      id={p.id}
                      title={p.title}
                      date={p.date}
                      category={p.category}
                      excerpt={p.excerpt}
                      image={p.image}
                      isMine={p.isMine}
                      onEdit={() => navigate(`/add-article/${p.id}`)}
                      onTitleClick={() => navigate(`/article/${p.id}`)}
                      categoryColor={getCategoryColor(p.category)}
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
        )}
      </div>

      <Footer />
    </>
  );
};

export default HomePage;
