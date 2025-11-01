// src/components/PostCard.tsx
import React from "react";
import { Card } from "antd";
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
  onTitleClick?: () => void;
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
    >
      <div className="post-card-content">
        <h3 className="post-card-title" onClick={onTitleClick} style={{ cursor: "pointer" }}>
          {title}
        </h3>
        <p className="post-card-date">{date}</p>
        <p className="post-card-excerpt">{excerpt}</p>
        <div className ="card-footer">
        <a href="#" className="post-category" style={{ color: categoryColor }}>
          {category}
        </a>
        {isMine && onEdit && (
          <button className="Edit" onClick={onEdit}>
            Edit
          </button>
        )}
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
