// src/components/PostCard.tsx
import React from "react";
import { Card, Button } from "antd";
import "../styles/PostCard.css";

export interface PostCardProps {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  isMine?: boolean;
  onEdit?: () => void;
  onTitleClick?: () => void; // ← Click vào tiêu đề / card
  categoryColor?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  date,
  category,
  excerpt,
  image,
  isMine,
  onEdit,
  onTitleClick,
  categoryColor,
}) => {
  return (
    <Card
      hoverable
      cover={<img alt={title} src={image} style={{ height: 240, objectFit: "cover" }} />}
      onClick={onTitleClick} // ← Click toàn bộ card → vào chi tiết
      style={{ cursor: onTitleClick ? "pointer" : "default" }}
    >
      <div className="post-card-content">
        {/* Click vào tiêu đề cũng vào chi tiết */}
        <h3
          className="post-card-title"
          style={{ margin: 0, cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation(); // Ngăn click card
            onTitleClick?.();
          }}
        >
          {title}
        </h3>

        <p className="post-card-date">{date}</p>
        <p className="post-card-excerpt">{excerpt}</p>

        <div
          className="card-footer"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={(e) => e.stopPropagation()} // ← Chặn lan tỏa khi bấm Edit
        >
          <span className="post-category" style={{ color: categoryColor }}>
            {category}
          </span>
          {isMine && onEdit && (
            <Button type="link" size="small" onClick={onEdit}>
              Edit
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PostCard;