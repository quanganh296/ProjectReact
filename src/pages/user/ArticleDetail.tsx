// src/pages/user/ArticleDetail.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { setPosts } from "../../redux/postsSlice";
import { Card, Button, Typography, Input, List, Avatar, message, Space } from "antd";
import { LikeOutlined, LikeFilled, MessageOutlined, EditOutlined } from "@ant-design/icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getCategoryColor } from "../../utils/categoryColor";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const post = posts.find((p) => p.id === Number(id));

  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);

  if (!post) {
    return (
      <>
        <Header />
        <div style={{ padding: 40, textAlign: "center" }}>
          <Title level={3}>Bài viết không tồn tại!</Title>
          <Button type="primary" onClick={() => navigate("/home")}>
            Quay lại trang chủ
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const handleLike = () => {
    const updated = {
      ...post,
      likes: liked ? post.likes - 1 : post.likes + 1
    };
    const newPosts = posts.map(p => p.id === post.id ? updated : p);
    dispatch(setPosts(newPosts));
    setLiked(!liked);
    message.success(liked ? "Đã bỏ thích" : "Đã thích bài viết!");
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      postId: post.id,
      text: commentText,
      author: "Bạn",
      date: new Date().toISOString().split("T")[0]
    };

    const updated = {
      ...post,
      comments: [...post.comments, newComment]
    };

    const newPosts = posts.map(p => p.id === post.id ? updated : p);
    dispatch(setPosts(newPosts));
    setCommentText("");
    message.success("Đã thêm bình luận!");
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <Card
          cover={
            <img
              alt={post.title}
              src={post.image}
              style={{ height: 400, objectFit: "cover" }}
            />
          }
          actions={[
            <Space onClick={handleLike} style={{ cursor: "pointer" }}>
              {liked ? <LikeFilled style={{ color: "#1890ff" }} /> : <LikeOutlined />}
              <Text>{post.likes} Thích</Text>
            </Space>,
            <Space>
              <MessageOutlined />
              <Text>{post.comments.length} Bình luận</Text>
            </Space>,
            post.isMine && (
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => navigate(`/add-article/${post.id}`)}
              >
                Chỉnh sửa
              </Button>
            )
          ].filter(Boolean)}
        >
          <Title level={1}>{post.title}</Title>

          <Paragraph type="secondary">
            <Text strong>Ngày:</Text> {post.date} |{" "}
            <Text style={{ color: getCategoryColor(post.category) }}>
              {post.category}
            </Text>
            {post.mood && ` | Tâm trạng: ${post.mood}`}
          </Paragraph>

          <Paragraph style={{ fontSize: 18, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
            {post.content}
          </Paragraph>
        </Card>

        {/* Bình luận */}
        <Card title={`Bình luận (${post.comments.length})`} style={{ marginTop: 24 }}>
          <List
            dataSource={post.comments}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: "#87d068" }}>{item.author[0]}</Avatar>}
                  title={<Text strong>{item.author}</Text>}
                  description={item.date}
                />
                <div style={{ maxWidth: 600 }}>{item.text}</div>
              </List.Item>
            )}
          />

          <div style={{ marginTop: 16 }}>
            <TextArea
              rows={3}
              placeholder="Viết bình luận của bạn..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={handleAddComment}
              disabled={!commentText.trim()}
            >
              Gửi bình luận
            </Button>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default ArticleDetail;