// src/components/PostCard.tsx
import React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Card, Tag, Space } from "antd";
import "../styles/PostCard.css";

export interface PostCardProps {
  // XÓA id vì không dùng trong component
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  isMine?: boolean;
  onEdit?: () => void;
  onTitleClick: () => void;
  categoryColor: string;
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
      className="post-card"
      hoverable
      cover={
        <img
          alt={title}
          src={image}
          className="post-card-img"
          onClick={onTitleClick}
        />
      }
      actions={
        isMine
          ? [
              <EditOutlined key="edit" onClick={onEdit} />,
              <DeleteOutlined key="delete" />,
            ]
          : undefined
      }
    >
      <div onClick={onTitleClick} style={{ cursor: "pointer" }}>
        <Card.Meta
          title={
            <Space>
              <span>{title}</span>
              <Tag color={categoryColor}>{category}</Tag>
            </Space>
          }
          description={
            <>
              <p className="post-card-date">{date}</p>
              <p className="post-card-excerpt">{excerpt}</p>
            </>
          }
        />
      </div>
    </Card>
  );
};

export default PostCard;