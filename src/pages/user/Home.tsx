import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  Row,
  Col,
  Pagination,
  Tag,
  Space,
  Typography,
  Button,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
import Header from "../../components/Header";
import "../../layout/Home.css";
import "../../layout/PostCard.css";
import "../../layout/Footer.css";
import { getCategoryColor } from "../../utils/categoryColor";
import { useAuth } from "../../context/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

// Định nghĩa type cho Post
interface Post {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  image: string;
  isMine?: boolean;
}


const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const shouldReset = Boolean(location.state?.resetToAllBlogs);
   const [selectedView, setSelectedView] = useState(() => {
    return shouldReset ? "All blog posts" : "All blog posts";
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  

  const postsPerPage = 6;


 

  React.useEffect(() => {
    if (shouldReset) {
      setSelectedView("All blog posts");
      setSelectedCategory("All");
      setCurrentPage(1);
      // Xóa state để tránh reset lại lần sau
      window.history.replaceState({}, "");
    }
  }, [shouldReset]);

  // Lọc bài viết theo user
  const userPosts = posts.filter((p: Post) => p.isMine);

  let filteredPosts: Post[] =
    selectedView === "All my posts" ? userPosts : posts;

  if (selectedCategory !== "All") {
    filteredPosts = filteredPosts.filter(
      (p: Post) => p.category === selectedCategory
    );
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handleViewChange = (view: string) => {
    setSelectedView(view);
    setCurrentPage(1);
    setSelectedCategory("All");
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const featuredPost =
    selectedView === "All blog posts" ? filteredPosts[0] : null;
  const sidePosts =
    selectedView === "All blog posts" ? filteredPosts.slice(1, 3) : [];

  return (
    <>
      <Header />

      <div className="homepage-container">
        {/* === PHẦN RECENT BLOG POSTS - CHỈ HIỆN KHI "All blog posts" === */}
        {selectedView === "All blog posts" && (
          <div className="featured-section">
            <h4 className="fw-bold mb-2">Recent blog posts</h4>
            <Row gutter={[16, 16]} align="stretch">
              {featuredPost && (
                <Col xs={24} lg={12}>
                  <div className="main-post">
                    <img
                      src="/Auth/Image.png"
                      alt={featuredPost.title}
                      className="main-post-img"
                    />
                    <div className="main-post-content">
                      <Text type="secondary" className="post-date">
                        Date: {featuredPost.date}
                      </Text>
                      <Title level={4} className="main-post-title">
                        {featuredPost.title}
                      </Title>
                      <div className ="main-post-footer">
                      <Text className="main-post-excerpt">
                        {featuredPost.excerpt}
                      </Text>
                      <Tag
                        className="compact-tag-main"
                        color={getCategoryColor(featuredPost.category)}
                      >
                        {featuredPost.category}
                      </Tag>
                      </div>
                    </div>
                  </div>
                </Col>
              )}

              <Col xs={24} lg={12}>
                <div className="side-posts-container">
                  {sidePosts.map((p: Post) => (
                    <div key={p.id} className="side-post-card">
                      <img src={p.image} alt={p.title} className="side-post-img" />
                      <div className="side-post-content">
                        <Text type="secondary" className="post-date">
                          Date: {p.date}
                        </Text>
                        <Title level={5} className="side-post-title">
                          {p.title}
                        </Title>
                        <Text className="side-post-excerpt">{p.excerpt}</Text>
                        <Tag
                          className="compact-tag-side"
                          color={getCategoryColor(p.category)}
                        >
                          {p.category}
                        </Tag>
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* === PHẦN DANH SÁCH BÀI VIẾT === */}
        <div className="posts-section-card">
          <div className="posts-section-inner">
            {/* Tiêu đề động */}
            <div className="section-title-wrapper" style={{ textAlign: "center", margin: "24px 0" }}>
              {selectedView === "All my posts" ? (
                <div style={{ textAlign: "center" }}>
                 <Button
      type="primary"
      size="large"
      onClick={() => navigate("/add-article")}
    >
      Add New Article
    </Button>
                </div>
              ) : (
                <div className="view-tabs">
                  <Space size={24}>
                    <span
                      className={`view-tab ${
                        selectedView === "All blog posts" ? "active" : ""
                      }`}
                      onClick={() => handleViewChange("All blog posts")}
                    >
                      All blog posts
                    </span>
                    {isAuthenticated && (
                      <span
                        className={`view-tab ${
                          selectedView === "All my posts" ? "active" : ""
                        }`}
                        onClick={() => handleViewChange("All my posts")}
                      >
                        All my posts
                      </span>
                    )}
                  </Space>
                </div>
              )}
            </div>

            {/* Category filter - chỉ hiện ở All blog posts */}
            {selectedView === "All blog posts" && (
              <div className="category-links" style={{ marginBottom: 24 }}>
                <Space size={20}>
                  {[
                    "All",
                    "Daily Journal",
                    "Work & Career",
                    "Personal Thoughts",
                    "Emotions & Feelings",
                  ].map((cat) => (
                    <span
                      key={cat}
                      className={`category-link ${
                        selectedCategory === cat ? "active" : ""
                      }`}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {cat}
                    </span>
                  ))}
                </Space>
              </div>
            )}

            {/* Danh sách bài viết */}
            <div className="posts-grid">
              <Row gutter={[24, 24]}>
                {currentPosts.length > 0 ? (
                  currentPosts.map((p: Post) => (
  <Col xs={24} md={12} lg={8} key={p.id}>
    <div className="post-item" style={{ cursor: "pointer" }}>
      <img src={p.image} alt={p.title} className="post-item-img" />
      <div className="post-item-content">
        <Text type="secondary" className="post-date">Date: {p.date}</Text>

        {/* Bấm vào tiêu đề để vào chi tiết */}
       <Title
  level={5}
  className="post-title"
  onClick={() => navigate(`/article-detail/${p.id}`)} 
  style={{ cursor: "pointer", margin: "8px 0" }}
>
  {p.title} <RightOutlined className="arrow-icon" />
</Title>

        <Text className="post-excerpt">{p.excerpt}</Text>
        <div className="card-footer">
  <Tag className="compact-tag" color={getCategoryColor(p.category)}>
    {p.category}
  </Tag>

  {selectedView === "All my posts" && (
 <a
  href="#"
  className="Edit"
  onClick={(e) => {
    e.preventDefault();
    navigate(`/add-article/${p.id}`); 
  }}
>
  Edit your post
</a>
  )}
</div>
      </div>
    </div>
  </Col>
                  ))
                ) : (
                  <Col span={24}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#999",
                      }}
                    >
                      <Title level={4}>No posts yet</Title>
                      <Text>Start writing your first article!</Text>
                    </div>
                  </Col>
                )}
              </Row>
            </div>

            {/* Pagination */}
            {filteredPosts.length > postsPerPage && (
              <div className="pagination-wrapper">
                <Pagination
                  current={currentPage}
                  pageSize={postsPerPage}
                  total={filteredPosts.length}
                  onChange={(page: number) => setCurrentPage(page)}
                  showSizeChanger={false}
                  showQuickJumper
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="custom-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>MY BLOG</h2>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              dictum aliquet accumsan porta lectus ridiculus in mattis. Nunc
              sedales in volutpat ullamcorper amet adipiscing fermentum.
            </p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>About</li>
              <li>Features</li>
              <li>Works</li>
              <li>Career</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li>Customer Support</li>
              <li>Delivery Details</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li>Free eBooks</li>
              <li>Development Tutorial</li>
              <li>How to – Blog</li>
              <li>Youtube Playlist</li>
            </ul>
          </div>
        </div>
        <div className="footer-social">
          <i className="fab fa-twitter"></i>
          <i className="fab fa-facebook-f"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-github"></i>
        </div>
      </footer>
    </>
  );
};

export default HomePage;