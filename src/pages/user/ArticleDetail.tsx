// src/pages/user/ArticleDetail.tsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { likePost, addComment } from "../../redux/postsSlice";
import { Button, Typography, Divider, Avatar, Input, message } from "antd";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import type { Post, Comment } from "../../types";
import { useAuth } from "../../context/useAuth";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const posts = useSelector((state: RootState) => state.posts);
  const post = posts.find((p: Post) => p.id === id);

  const { user } = useAuth();

  const [commentText, setCommentText] = useState("");

  // memoized comments (sorted by date asc)
  const comments: Comment[] = useMemo(
    () => (post?.comments ? [...post.comments].sort((a, b) => a.date.localeCompare(b.date)) : []),
    [post]
  );

  if (!post) {
    return (
      <>
        <Header />
        <div style={{ maxWidth: 900, margin: "60px auto", padding: "0 20px" }}>
          <Title level={3}>Không tìm thấy bài viết.</Title>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
        <Footer />
      </>
    );
  }

  const handleLike = () => {
    if (!user) {
      message.error("Vui lòng đăng nhập để thích bài viết!");
      return;
    }
    dispatch(likePost(post.id));
    // optional UI feedback
    message.success("Bạn đã thích bài viết này.");
  };

  const handleAddComment = () => {
    if (!user) {
      message.error("Vui lòng đăng nhập để bình luận!");
      return;
    }
    const text = commentText.trim();
    if (!text) {
      message.warning("Vui lòng nhập nội dung bình luận.");
      return;
    }

    dispatch(addComment({ postId: post.id, text, author: user.username ?? user.name ?? "User" }));
    setCommentText("");
    message.success("Bình luận đã được thêm.");
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
        <Button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
          ⬅ Quay lại
        </Button>

        <Title level={2}>{post.title}</Title>
        <Paragraph>
          <b>Chủ đề:</b> {post.category} • <b>Ngày:</b> {post.date}
        </Paragraph>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            style={{ width: "100%", borderRadius: 8, marginBottom: 20 }}
          />
        )}

        <Paragraph style={{ whiteSpace: "pre-line" }}>{post.content}</Paragraph>

        <Divider />

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <Button type="primary" onClick={handleLike}>
            ❤️ Thích ({post.likes ?? 0})
          </Button>

          <span style={{ color: "#888" }}>{(post.comments ?? []).length} bình luận</span>
        </div>

        <Divider />

        <Title level={4}>Thêm bình luận</Title>
        <TextArea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={4}
          placeholder={user ? "Viết bình luận..." : "Vui lòng đăng nhập để bình luận"}
        />
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <Button type="primary" onClick={handleAddComment}>
            Gửi bình luận
          </Button>
          <Button onClick={() => setCommentText("")}>Hủy</Button>
        </div>

        <Divider />

        <Title level={4}>Bình luận</Title>
        {comments.length === 0 ? (
          <div style={{ color: "#777" }}>Chưa có bình luận nào.</div>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                gap: 12,
                padding: "12px 0",
                borderBottom: "1px solid #eee",
                alignItems: "flex-start",
              }}
            >
              <Avatar>{(c.author || "U").charAt(0).toUpperCase()}</Avatar>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <b>{c.author}</b>
                  <span style={{ color: "#999", fontSize: 12 }}>{new Date(c.date).toLocaleString()}</span>
                </div>
                <div style={{ marginTop: 6 }}>{c.text}</div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default ArticleDetail;
