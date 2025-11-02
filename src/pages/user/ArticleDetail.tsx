import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { updatePost } from "../../redux/postsSlice";
import Header from "../../components/Header";
import { Button, Typography, Divider, Avatar } from "antd";

const { Title, Paragraph } = Typography;

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const posts = useSelector((state: RootState) => state.posts);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return <p>Không tìm thấy bài viết.</p>;
  }

  const handleLike = () => {
    const updatedPost = {
      ...post,
      likes: (post.likes ?? 0) + 1,
    };

    dispatch(updatePost(updatedPost));
  };

  return (
    <>
      <Header />
      <div className="article-container">
        <Button onClick={() => navigate(-1)} style={{ marginBottom: 10 }}>
          ⬅ Quay lại
        </Button>

        <Title level={2}>{post.title}</Title>

        <Paragraph>
          <b>Chủ đề:</b> {post.category} | <b>Ngày:</b> {post.date}
        </Paragraph>

        <img
          src={post.image}
          alt={post.title}
          style={{ width: "50%", borderRadius: 8, marginBottom: 20 }}
        />

        <Paragraph style={{ whiteSpace: "pre-line" }}>
          {post.content}
        </Paragraph>

        <Divider />

        <Button type="primary" onClick={handleLike}>
          ❤️ Thích ({post.likes ?? 0})
        </Button>

        <Divider />

        <Title level={4}>Bình luận</Title>

        {(post.comments ?? []).length === 0 && (
          <p>Chưa có bình luận nào.</p>
        )}

        {(post.comments ?? []).map((c) => (
          <div
            key={c.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              marginBottom: 15,
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <Avatar>{c.author[0]}</Avatar>
            <div>
              <b>{c.author}</b> • {c.date}
              <p style={{ marginTop: 5 }}>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ArticleDetail;
