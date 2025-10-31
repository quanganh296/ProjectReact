import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Typography, Tag, Button, Input, Avatar, List } from "antd";
import Header from "../../components/Header";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const posts = useSelector((state: RootState) => state.posts.posts);

  const post = posts.find((p) => p.id === Number(id));

  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

  if (!post) {
    return (
      <>
        <Header />
        <div style={{ padding: 24 }}>
          <Title level={3}>Article not found</Title>
          <Button type="primary" onClick={() => navigate("/")}>
            Back Home
          </Button>
        </div>
      </>
    );
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments((prev) => [...prev, newComment]);
      setNewComment("");
    }
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 800, margin: "24px auto", padding: 16 }}>
        <Button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          Back
        </Button>

        <img
          src={post.image}
          alt={post.title}
          style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
        />

        <Text type="secondary">Date: {post.date}</Text>
        <Title level={2}>{post.title}</Title>

        <Tag color="blue">{post.category}</Tag>

        <Paragraph style={{ marginTop: 16, fontSize: "16px" }}>
          {post.excerpt}
        </Paragraph>

        <Title level={4} style={{ marginTop: 32 }}>
          Comments
        </Title>

        {/* Comment list */}
        <List
          dataSource={comments}
          renderItem={(c) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar />}
                title={<Text strong>User</Text>}
                description={c}
              />
            </List.Item>
          )}
        />

        {/* Add comment */}
        <TextArea
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          style={{ marginTop: 12 }}
        />
        <Button type="primary" onClick={handleAddComment} style={{ marginTop: 8 }}>
          Add Comment
        </Button>
      </div>
    </>
  );
};

export default ArticleDetail;
