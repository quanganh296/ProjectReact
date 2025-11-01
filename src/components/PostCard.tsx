import React from "react";
import { Card, Tag } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import "../styles/PostCard.css";
import { getCategoryColor } from "../utils/categoryColor";

interface PostCardProps {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  isMine?: boolean; // Thêm để biết có phải bài của mình
  onEdit?: () => void; // Optional
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  date,
  category,
  excerpt,
  image,
  isMine = false,
  onEdit,
}) => {
  return (
    <Card
      hoverable
      cover={<img src={image} alt={title} className="main-img" />}
      className="main-card"
    >
      <div className="post-content">
        <p className="post-date">Date: {date}</p>
        <h3 className="post-title">{title}</h3>
        <p className="post-excerpt">{excerpt}</p>

        {/* FOOTER: TAG + EDIT LINK */}
        <div className="card-footer">
          <Tag className="compact-tag" color={getCategoryColor(category)}>
            {category}
            <ArrowRightOutlined style={{ fontSize: "10px", marginLeft: "4px" }} />
          </Tag>

          {isMine && (
            <a href="#" className="Edit" onClick={(e) => { e.preventDefault(); onEdit?.(); }}>
              Edit your post
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PostCard;