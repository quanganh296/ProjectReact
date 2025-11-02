// src/pages/user/Home.tsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tabs, Pagination, Empty, Tag } from "antd";
import Header from "../../components/Header";
import PostCard from "../../components/PostCard";
import Footer from "../../components/Footer";
import { useCategories } from "../../context/useCategories";
import { useAuth } from "../../context/useAuth";
import type { RootState } from "../../redux/store";
import { getCategoryColor } from "../../utils/categoryColor";
import "../../styles/Home.css";
import "../../styles/PostCard.css";

const { TabPane } = Tabs;

const RECENT_IMAGES = ["/Auth/Image (4).png", "/Auth/Image.png", "/Auth/Image (1).png"];

const MOCK_POSTS = [
  { id: "1", title: "A Productive Day at Work", excerpt: "Today was a really productive day...", category: "Daily Journal", date: "2025-02-25", image: RECENT_IMAGES[0], isMine: false },
  { id: "2", title: "My First Job Interview Experience", excerpt: "I had my first job interview today...", category: "Work & Career", date: "2025-02-24", image: RECENT_IMAGES[1], isMine: true },
  { id: "3", title: "Overthinking Everything", excerpt: "Lately, I have been overthinking...", category: "Personal Thoughts", date: "2025-02-23", image: RECENT_IMAGES[2], isMine: false },
  { id: "4", title: "How collaboration makes us better designers", excerpt: "Collaboration can make our teams stronger...", category: "Work & Career", date: "2025-02-19", image: "/Auth/Image (6).png", isMine: false },
  { id: "5", title: "Our top 10 Javascript frameworks to use", excerpt: "JavaScript frameworks make development easy...", category: "Work & Career", date: "2025-02-18", image: "/Auth/Image (1).png", isMine: false },
  // ... thêm bài
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const posts = useSelector((state: RootState) => state.posts);
  const { categories } = useCategories();
  const { isAuthenticated } = useAuth();

  const [selectedView, setSelectedView] = useState("All blog posts");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const allPosts = posts.length > 0 ? posts : MOCK_POSTS;
  const recentPosts = allPosts.slice(0, 3);

  // Lọc theo view
  const filteredByView = allPosts.filter((post) =>
    selectedView === "All my posts" ? post.isMine : true
  );

  // LỌC CHỦ ĐỀ
  const filteredPosts = filteredByView.filter((post) =>
    selectedCategory === "All" ? true : post.category === selectedCategory
  );

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedView, selectedCategory]);

  useEffect(() => {
    if (!isAuthenticated && selectedView === "All my posts") {
      setSelectedView("All blog posts");
    }
  }, [isAuthenticated, selectedView]);

  const showEdit = selectedView === "All my posts";

  return (
    <div className="homepage-container">
      <Header />

      {/* === RECENT POSTS === */}
      <section className="featured-section">
        {recentPosts[0] && (
          <div className="main-post" onClick={() => navigate(`/article/${recentPosts[0].id}`)}>
            <img className="main-post-img" src={recentPosts[0].image} alt={recentPosts[0].title} />
            <div className="main-post-content">
              <p className="main-post-date">{recentPosts[0].date}</p>
              <h3 className="main-post-title">{recentPosts[0].title}</h3>
              <p className="main-post-excerpt">{recentPosts[0].excerpt}</p>
              <Tag className="compact-tag-main" color={getCategoryColor(recentPosts[0].category)}>
                {recentPosts[0].category}
              </Tag>
            </div>
          </div>
        )}

        <div className="side-posts-container">
          {recentPosts.slice(1).map((post) => (
            <div key={post.id} className="side-post-card" onClick={() => navigate(`/article/${post.id}`)}>
              <img className="side-post-img" src={post.image} alt={post.title} />
              <div className="side-post-content">
                <p className="side-post-date">{post.date}</p>
                <h3 className="side-post-title">{post.title}</h3>
                <p className="side-post-excerpt">{post.excerpt}</p>
                <Tag className="compact-tag-side" color={getCategoryColor(post.category)}>
                  {post.category}
                </Tag>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === ALL BLOG POSTS === */}
      <section className="posts-section-card">
        <div className="posts-section-inner">
          <h4>All blog posts</h4>

          <Tabs activeKey={selectedView} onChange={setSelectedView} className="view-tabs" tabBarGutter={24}>
            <TabPane tab="All blog posts" key="All blog posts" />
            {isAuthenticated && <TabPane tab="All my posts" key="All my posts" />}
          </Tabs>

          <Tabs activeKey={selectedCategory} onChange={setSelectedCategory} className="category-links" tabBarGutter={16}>
            <TabPane tab="All" key="All" />
            {categories.map((cat) => (
              <TabPane tab={cat.name} key={cat.name} />
            ))}
          </Tabs>

          {filteredPosts.length === 0 ? (
            <Empty description="Không có bài viết nào" />
          ) : (
            <>
              <div className="posts-grid">
                {paginatedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    date={post.date}
                    category={post.category}
                    excerpt={post.excerpt}
                    image={post.image} // DÙNG ẢNH CỦA CHÍNH BÀI VIẾT
                    isMine={post.isMine}
                    onEdit={showEdit && post.isMine ? () => navigate(`/add-article/${post.id}`) : undefined}
                    onTitleClick={() => navigate(`/article/${post.id}`)}
                    categoryColor={getCategoryColor(post.category)}
                  />
                ))}
              </div>

              <div className="pagination-wrapper">
                <Pagination
                  current={currentPage}
                  total={filteredPosts.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;