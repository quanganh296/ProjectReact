import React from "react";
import { Table, Button, Tag, Image } from "antd";

const posts = [
  {
    id: 1,
    title: "Học JS từ cơ bản đến nâng cao",
    category: "Web Dev",
    content: "JS is everywhere...",
    status: "Public",
    img: "https://via.placeholder.com/80"
  },
  {
    id: 2,
    title: "Giới thiệu ngành IT",
    category: "IT",
    content: "IT is booming...",
    status: "Private",
    img: "https://via.placeholder.com/80"
  }
];

const ManagerPost: React.FC = () => {
  const columns = [
    { title: "Ảnh", dataIndex: "img", render: (img: string) => <Image width={60} src={img} /> },
    { title: "Tiêu đề", dataIndex: "title" },
    { title: "Chủ đề", dataIndex: "category" },
    { title: "Nội dung", dataIndex: "content" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s: string) =>
        s === "Public" ? <Tag color="green">Public</Tag> : <Tag color="gray">Private</Tag>
    },
    {
      title: "Hành động",
      render: () => (
        <div className="flex gap-2">
          <Button size="small" type="primary">Sửa</Button>
          <Button size="small" danger>Xoá</Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-5">
      <h2 className="font-bold text-xl mb-3">Quản lý bài viết</h2>

      <Button type="primary" className="mb-3">+ Thêm bài viết</Button>

      <Table rowKey="id" dataSource={posts} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default ManagerPost;
