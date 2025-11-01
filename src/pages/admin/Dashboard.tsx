import React from "react";
import { Table, Button, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../styles/AdminSidebar.css"
import AdminLayout from "../../layout/AdminLayout";

interface Entry {
  id: number;
  title: string;
  category: string;
  status: "Public" | "Private";
}

const sampleEntries: Entry[] = [
  { id: 1, title: "Học nấu cá sốt cà chua", category: "Nấu ăn", status: "Public" },
  { id: 2, title: "Bí kíp viết CV ngành IT", category: "IT", status: "Private" },
];

const ManagerEntries: React.FC = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Chủ đề",
      dataIndex: "category",
      key: "category",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={status === "Public" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 160,
      render: () => (
        <>
          <Button icon={<EditOutlined />} type="primary" size="small" className="mr-2">
            Sửa
          </Button>
          <Button icon={<DeleteOutlined />} danger size="small">
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <AdminLayout>
    <div className="sidebar flex min-h-screen bg-gray-50">
      

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4">📁 Quản lý bài viết</h2>

        <Button type="primary" className="mb-4">
          + Thêm bài viết
        </Button>

        <Table
          dataSource={sampleEntries}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="id"
          bordered
        />
      </div>
    </div>
    </AdminLayout>
  );
};

export default ManagerEntries;
