// src/pages/admin/ManagerEntries.tsx
import React, { useState } from "react";
import { Input, Button, Table, message, Space } from "antd";
import { SearchOutlined, FolderOutlined } from "@ant-design/icons";
import AdminLayout from "../../layout/AdminLayout";
import { useCategories } from "../../context/CategoryContext";
import type { Category } from "../../context/types"; 

const ManagerEntries: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useCategories();
  const [newCategory, setNewCategory] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      message.warning("Vui lòng nhập tên chủ đề!");
      return;
    }
    const success = addCategory(newCategory.trim());
    if (success) {
      setNewCategory("");
      message.success("Thêm chủ đề thành công!");
    } else {
      message.error("Chủ đề đã tồn tại!");
    }
  };

  const handleDelete = (key: string) => {
    const success = deleteCategory(key);
    if (success) {
      message.success("Xóa chủ đề thành công!");
    } else {
      message.error("Không thể xóa chủ đề mặc định!");
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
  {
    title: "#",
    key: "index",
    width: 60,
    render: (_: unknown, __: Category, i: number) => i + 1,
  },
    { title: "Category Name", dataIndex: "name", key: "name" },
    {
  title: "Actions",
  key: "action",
  width: 120,
  render: (_: unknown, record: Category) => (
    <Space size="middle">
      {parseInt(record.key) <= 4 ? (
        <span className="text-gray-400">Default</span>
      ) : (
        <Button danger size="small" onClick={() => handleDelete(record.key)}>
          Delete
        </Button>
      )}
    </Space>
  ),
},
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FolderOutlined className="mr-2 text-blue-500" />
          Manage Categories
        </h2>
        <Input
          placeholder="Search Article Categories"
          prefix={<SearchOutlined />}
          className="w-80"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name:
            </label>
            <Input
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onPressEnter={handleAddCategory}
            />
          </div>
          <div className="mt-6">
            <Button
              type="primary"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleAddCategory}
            >
              Add Category
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
          <FolderOutlined className="mr-2 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-800">Category List</h3>
        </div>
        <Table
          columns={columns}
          dataSource={filteredCategories}
          pagination={{ pageSize: 10 }}
          rowKey="key"
          locale={{ emptyText: "Không tìm thấy chủ đề nào." }}
          className="custom-table"
        />
      </div>
    </AdminLayout>
  );
};

export default ManagerEntries;