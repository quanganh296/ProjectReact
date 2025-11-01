import React, { useState } from "react";
import { Table, Button, Tag, Image, Select} from "antd";
import AdminLayout from "../../layout/AdminLayout";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

interface Post {
  id: number;
  title: string;
  category: string;
  content: string;
  status: "Public" | "Private";
  img: string;
  authorAvatar?: string;
  authorName?: string;
}

const ManagerPost: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const posts = useSelector((state: RootState) => state.posts.posts);

  const formattedPosts: Post[] = posts.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    content: p.excerpt,
    status: p.status === "public" ? "Public" : "Private",
    img: p.image,
    authorAvatar: "https://via.placeholder.com/40",
    authorName: "User"
  }));

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "img",
      render: (img: string) => <Image width={70} height={50} src={img} />,
      width: 90
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      width: 250
    },
    {
      title: "Chủ đề",
      dataIndex: "category",
      width: 150,
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      )
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      width: 250,
      ellipsis: true
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
      render: (status: "Public" | "Private") => (
        <Tag color={status === "Public" ? "green" : "red"}>{status}</Tag>
      )
    },
    {
      title: "Chỉnh sửa trạng thái",
      width: 130,
      render: (record: Post) => (
        <Select defaultValue={record.status} size="small" style={{ width: 90 }}>
          <Select.Option value="Public">Public</Select.Option>
          <Select.Option value="Private">Private</Select.Option>
        </Select>
      )
    },
    {
      title: "Hành động",
      width: 140,
      render: () => (
        <div className="flex gap-1">
          <Button size="small" type="link">Sửa</Button>
          <Button size="small" danger type="link">Xóa</Button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Manage articles</h2>
        <Button type="primary" size="large">Thêm mới bài viết</Button>
      </div>

      <Table
        columns={columns}
        dataSource={formattedPosts}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: 5,
          total: formattedPosts.length,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} articles`,
          onChange: setCurrentPage
        }}
        scroll={{ x: 1100 }}
        className="custom-table"
      />
    </AdminLayout>
  );
};

export default ManagerPost;