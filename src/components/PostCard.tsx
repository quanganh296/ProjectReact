import React from "react";
import { Card } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import "../layout/PostCard.css";

interface PostCardProps {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  date,
  category,
  excerpt,
  image,
}) => {
  return (
    <Card hoverable cover={<img src={image} alt={title} className="post-img" />} className="post-card">
      <div className="post-content">
        <p className="post-date">Date: {date}</p>
        <h3 className="post-title">{title}</h3>
        <p className="post-excerpt">{excerpt}</p>
        <a href="#" className="post-category">
          {category} <ArrowRightOutlined />
        </a>
      </div>
    </Card>
  );
};

export default PostCard;
