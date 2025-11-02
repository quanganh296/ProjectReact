import React from "react";
import { Button, Tag } from "antd";
import { RightOutlined } from "@ant-design/icons";
import "../styles/PostCard.css";

export interface PostCardProps {
  id: string;
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
    <div className="post-item" onClick={onTitleClick}>
      <img className="post-item-img" src={image} alt={title} />
      <div className="post-item-content">
        <p className="post-date">{date}</p>
        <h3 className="post-title">
          {title}
          <RightOutlined className="arrow-icon" />
        </h3>
        <p className="post-excerpt">{excerpt}</p>
        <div className="card-footer">
          <Tag className="compact-tag" color={categoryColor}>
            {category}
          </Tag>
          {isMine && onEdit && (
            <Button
              type="link"
              className="Edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;