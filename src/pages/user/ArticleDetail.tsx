// src/pages/user/ArticleDetail.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Avatar, Input, Button, List, Typography, message } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import Header from "../../components/Header";
import "../../styles/ArticleDetail.css";
import type { RootState } from "../../redux/store";
import { addComment } from "../../redux/commentsSlice";
import type { Comment } from "../../types"; // TYPE-ONLY IMPORT

const { Title, Text } = Typography;
const { TextArea } = Input;

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const posts = useSelector((state: RootState) => state.posts.posts);
  const comments = useSelector((state: RootState) =>
    state.comments.comments.filter((c: Comment) => c.postId === Number(id))
  );

  const post = posts.find((p) => p.id === Number(id));
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (!newComment.trim()) {
      message.warning("Vui lòng nhập bình luận!");
      return;
    }

    dispatch(addComment(Number(id), newComment, "Bạn"));
    setNewComment("");
    message.success("Bình luận thành công!");
  };

  if (!post) {
    return <div className="text-center p-8">Bài viết không tồn tại</div>;
  }

  return (
    <>
      <Header />
      <div className="article-detail-container">
        <Card className="article-card">
          <div className="article-header">
            <Avatar size={50} icon={<UserOutlined />} />
            <div style={{ marginLeft: 12 }}>
              <Text strong>{post.author || "Người dùng ẩn danh"}</Text>
              <br />
              <Text type="secondary">
                <CalendarOutlined /> {post.date}
              </Text>
            </div>
          </div>

          <Title level={2} className="mt-4">{post.title}</Title>
          <img src={post.image} alt={post.title} className="article-image" />

          <div className="article-content mt-4">
            <Text>{post.excerpt}</Text>
          </div>

          <div className="article-actions">
            <Button type="link">Like</Button>
            <Button type="link">Share</Button>
          </div>
        </Card>

        {/* Comments Section */}
        <div className="comments-section mt-6">
          <Title level={4}>Bình luận ({comments.length})</Title>

          <div className="mb-4">
            <TextArea
              rows={3}
              placeholder="Viết bình luận của bạn..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              type="primary"
              onClick={handleSubmit}
              className="mt-2"
              disabled={!newComment.trim()}
            >
              Gửi
            </Button>
          </div>

          <List<Comment>
            dataSource={comments}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={<Text strong>{item.author}</Text>}
                  description={
                    <>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.date}
                      </Text>
                      <br />
                      <Text>{item.text}</Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default ArticleDetail;