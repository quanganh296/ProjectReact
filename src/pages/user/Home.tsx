// src/pages/user/Home.tsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Pagination, Empty, Tag, Space } from "antd";
import { LikeOutlined, CommentOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import Header from "../../components/Header";
import PostCard from "../../components/PostCard";
import Footer from "../../components/Footer";
import { useCategories } from "../../context/useCategories";
import type { Post } from "../../types";
import { useAuth } from "../../context/useAuth";
import { getCategoryColor } from "../../utils/categoryColor";
import "../../styles/Home.css";
import "../../styles/PostCard.css";

// Default static posts (kept for initial content). These will be merged with Redux posts.
const DEFAULT_RECENT = [
  {
    id: "1",
    title: "A Productive Day at Work",
    excerpt:
      "Today was a really productive day at work. I managed to finish a report ahead of schedule and received positive feedback from my manager.",
    category: 1,
    date: "2025-02-25",
    image: "/Auth/Image (4).png",
    likes: 15,
    comments: [
      { id: "c1", text: "Great job! Keep up the good work!", author: "John", date: "2025-02-25" },
      { id: "c2", text: "That's impressive! What strategies did you use?", author: "Sarah", date: "2025-02-25" }
    ],
  },
  {
    id: "2",
    title: "My First Job Interview Experience",
    excerpt:
      "I had my first job interview today! I was nervous at first, but as the conversation went on, I felt more confident.",
    category: 2,
    date: "2025-02-24",
    image: "/Auth/Image.png",
    likes: 23,
    comments: [
      { id: "c3", text: "We've all been there! Hope you get the job!", author: "Mike", date: "2025-02-24" },
      { id: "c4", text: "Interviews get easier with practice. You did great!", author: "Emma", date: "2025-02-24" }
    ],
  },
  {
    id: "3",
    title: "Overthinking Everything",
    excerpt:
      "Lately, I have been overthinking everything, from small decisions to bigger life choices. I know I should trust myself more.",
    category: 3,
    date: "2025-02-23",
    image: "/Auth/Image (1).png",
    likes: 45,
    comments: [
      { id: "c5", text: "I can totally relate to this. Take it one day at a time!", author: "Lisa", date: "2025-02-23" },
      { id: "c6", text: "Try meditation, it helps with overthinking.", author: "David", date: "2025-02-23" }
    ],
  },
];

const DEFAULT_ALL = [
  {
    id: "4",
    title: "How collaboration makes us better designers",
    excerpt: "Collaboration can make our teams stronger, and our work more impactful.",
    category: 2,
    date: "2025-02-16",
    image: "/Auth/Image (6).png",
    likes: 67,
    comments: [
      { id: "c7", text: "This really resonates with our team's experience!", author: "Alex", date: "2025-02-16" },
      { id: "c8", text: "Great insights on team collaboration!", author: "Maria", date: "2025-02-16" }
    ],
  },
  {
    id: "5",
    title: "Our top 10 Javascript frameworks to use",
    excerpt: "JavaScript frameworks make development easy with extensive features and functionalities.",
    category: 2,
    date: "2025-02-15",
    image: "/Auth/Image (1).png",
    likes: 89,
    comments: [
      { id: "c9", text: "React is definitely my favorite!", author: "James", date: "2025-02-15" },
      { id: "c10", text: "Would love to see a comparison between Vue and React", author: "Anna", date: "2025-02-15" }
    ],
  },
  {
    id: "6",
    title: "Podcast: Creating a better CX Community",
    excerpt: "Starting a community doesn't need to be complicated, but how do you get started?",
    category: 4,
    date: "2025-02-05",
    image: "/Auth/Image (2).png",
    likes: 34,
    comments: [
      { id: "c11", text: "This podcast was super helpful for our startup!", author: "Thomas", date: "2025-02-05" },
      { id: "c12", text: "Great tips for community building!", author: "Sophie", date: "2025-02-05" }
    ],
  },
  {
    id: "1",
    title: "A Productive Day at Work",
    excerpt:
      "Today was a really productive day at work. I managed to finish a report ahead of schedule and received positive feedback from my manager.",
    category: 1,
    date: "2025-02-25",
    image: "/Auth/Image (3).png",
    likes: 15,
    comments: [
      { id: "c1", text: "Great job! Keep up the good work!", author: "John", date: "2025-02-25" },
      { id: "c2", text: "That's impressive! What strategies did you use?", author: "Sarah", date: "2025-02-25" }
    ],
  },
  {
    id: "2",
    title: "My First Job Interview Experience",
    excerpt:
      "I had my first job interview today! I was nervous at first, but as the conversation went on, I felt more confident.",
    category: 2,
    date: "2025-02-24",
    image: "/Auth/Image (4).png",
    likes: 23,
    comments: [
      { id: "c3", text: "We've all been there! Hope you get the job!", author: "Mike", date: "2025-02-24" },
      { id: "c4", text: "Interviews get easier with practice. You did great!", author: "Emma", date: "2025-02-24" }
    ],
  },
  {
    id: "3",
    title: "Overthinking Everything",
    excerpt:
      "Lately, I have been overthinking everything, from small decisions to bigger life choices. I know I should trust myself more.",
    category: 3,
    date: "2025-02-23",
    image: "/Auth/Image (5).png",
    likes: 45,
    comments: [
      { id: "c5", text: "I can totally relate to this. Take it one day at a time!", author: "Lisa", date: "2025-02-23" },
      { id: "c6", text: "Try meditation, it helps with overthinking.", author: "David", date: "2025-02-23" }
    ],
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { categories } = useCategories();
  const [selectedView, setSelectedView] = useState<string>("All blog posts");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Load all posts from Redux store
  const allPosts = useSelector((state: RootState) => state.posts);
 

  // Normalize redux posts into the same lightweight UI shape as the defaults
  type UIShapedPost = {
    id: string;
    title: string;
    excerpt: string;
    category: number;
    date: string;
    image: string;
    content?: string;
    author?: string;
    isMine?: boolean;
    likes?: number;
    comments?: Array<{
      id: string;
      text: string;
      author: string;
      date: string;
    }>;
  };
  const reduxNormalized: UIShapedPost[] = useMemo(
    () =>
      allPosts.map((p: Post) => ({
        id: String(p.id),
        title: String(p.title ?? "Untitled"),
        excerpt: String(p.excerpt ?? (p.content ? String(p.content).substring(0, 150) : "")),
        category: Number(p.category ?? 0),
        date: String(p.date ?? new Date().toISOString().split("T")[0]),
        image: String(p.image ?? ""),
        content: p.content,
        author: p.author,
        isMine: p.isMine,
        likes: p.likes ?? 0,
        comments: p.comments ?? [],
      })),
    [allPosts]
  );

  // Merge defaults with redux posts while avoiding duplicates by id
  const mergedAllPosts: UIShapedPost[] = useMemo(
    () => [
      ...DEFAULT_ALL,
      ...reduxNormalized.filter((r) => !DEFAULT_ALL.some((d) => d.id === r.id)),
    ],
    [reduxNormalized]
  );

  const mergedRecentPosts: UIShapedPost[] = useMemo(
    () => [
      ...DEFAULT_RECENT,
      ...reduxNormalized.filter((r) => !DEFAULT_RECENT.some((d) => d.id === r.id)),
    ].slice(0, 3),
    [reduxNormalized]
  );

  const getCategoryName = useCallback((categoryId: number | string): string => {
    const id = typeof categoryId === "number" ? categoryId : parseInt(String(categoryId), 10);
    return categories.find((c) => c.id === id)?.name || "Uncategorized";
  }, [categories]);

  // Use merged recent posts (defaults + redux)
  const recentPosts = mergedRecentPosts;

  // Get filtered posts based on view and category (operate on mergedAllPosts)
  const filteredPosts = useMemo(() => {
    let filtered = [...mergedAllPosts];
    
    // Filter by view (all posts or my posts)
    if (selectedView === "All my posts" && user) {
      filtered = filtered.filter(post => post.author === user.name);
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => 
        getCategoryName(post.category) === selectedCategory
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [mergedAllPosts, selectedView, selectedCategory, user, getCategoryName]);

  // Get paginated posts
  const paginatedPosts = useMemo(() => {
    return filteredPosts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredPosts, currentPage, pageSize]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedView, selectedCategory]);

  // Reset view if user logs out
  useEffect(() => {
    if (!isAuthenticated && selectedView === "All my posts") {
      setSelectedView("All blog posts");
    }
  }, [isAuthenticated, selectedView]);


  // Tabs items
  const viewItems = isAuthenticated
    ? [
        { label: "All blog posts", key: "All blog posts" },
        { label: "All my posts", key: "All my posts" },
      ]
    : [{ label: "All blog posts", key: "All blog posts" }];

  const categoryItems = [
    { label: "All", key: "All" },
    ...categories.map((cat) => ({ label: cat.name, key: cat.name })),
  ];

  return (
    <div className="homepage-container">
      <Header />

      {/* Banner: My Posts */}
      {isAuthenticated && selectedView === "All my posts" && (
        <div className="add-post-banner">
          {filteredPosts.length === 0 ? (
            <h2>You haven't written any blog posts yet!</h2>
          ) : (
            <h2>Manage your blog posts</h2>
          )}
          <button className="add-post-btn" onClick={() => navigate("/add-article")}>
            Add new post
          </button>
        </div>
      )}

      {/* RECENT POSTS */}
      {selectedView !== "All my posts" && (
        <>
          <h1>Recent blog posts</h1>

          <section className="featured-section">
            {recentPosts[0] && (
              <div className="main-post" onClick={() => navigate(`/article/${recentPosts[0].id}`)}>
                <img
                  className="main-post-img"
                  src={recentPosts[0].image}
                  alt={recentPosts[0].title}
                />
                <div className="main-post-content">
                  <p className="main-post-date">{recentPosts[0].date}</p>
                  <h3 className="main-post-title">{recentPosts[0].title}</h3>
                  <p className="main-post-excerpt">{recentPosts[0].excerpt}</p>
                  <Space className="main-post-footer">
                    <Tag
                      className="compact-tag-main"
                      color={getCategoryColor(getCategoryName(recentPosts[0].category))}
                    >
                      {getCategoryName(recentPosts[0].category)}
                    </Tag>
                    <Space>
                      <LikeOutlined /> {recentPosts[0].likes || 0}
                      <CommentOutlined /> {recentPosts[0].comments?.length || 0}
                    </Space>
                  </Space>
                </div>
              </div>
            )}

            <div className="side-posts-container">
              {recentPosts.slice(1).map((post) => (
                <div key={post.id} className="side-post-card" onClick={() => navigate(`/article/${post.id}`)}>
                  <img
                    className="side-post-img"
                    src={post.image}
                    alt={post.title}
                  />
                  <div className="side-post-content">
                    <p className="side-post-date">{post.date}</p>
                    <h3 className="side-post-title">{post.title}</h3>
                    <p className="side-post-excerpt">{post.excerpt}</p>
                    <div className="post-stats">
                      <Space>
                        <Tag
                          className="compact-tag-side"
                          color={getCategoryColor(getCategoryName(post.category))}
                        >
                          {getCategoryName(post.category)}
                        </Tag>
                        <Space>
                          <LikeOutlined /> {post.likes || 0}
                          <CommentOutlined /> {post.comments?.length || 0}
                        </Space>
                      </Space>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ALL POSTS */}
      <section className="posts-section-card">
        <div className="posts-section-inner">
          <h4>All blog posts</h4>

          <Tabs
            activeKey={selectedView}
            onChange={(key) => setSelectedView(String(key))}
            className="view-tabs"
            items={viewItems}
          />

          <Tabs
            activeKey={selectedCategory}
            onChange={(key) => setSelectedCategory(String(key))}
            className="category-links"
            items={categoryItems}
          />

          {filteredPosts.length === 0 ? (
            <Empty description="No posts found" />
          ) : (
            <>
              <div className="posts-grid">
                {paginatedPosts.map((post) => {
                  const categoryName = getCategoryName(post.category);
                  return (
                    <div key={post.id} className="post-item">
                    <PostCard
                        title={post.title}
                        date={post.date}
                        category={categoryName}
                        excerpt={post.excerpt}
                        image={post.image ?? ""}
                        isMine={post.author === user?.name}
                        onEdit={() => navigate(`/add-article/${post.id}`)}
                        onTitleClick={() => navigate(`/article/${post.id}`)}
                        categoryColor={getCategoryColor(categoryName)}
                        likes={post.likes}
                        comments={post.comments}
                      />
                    </div>
                  );
                })}
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