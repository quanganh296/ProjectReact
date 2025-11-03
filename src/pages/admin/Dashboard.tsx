// src/pages/admin/Dashboard.tsx
import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Table,
  message,
  Space,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  FolderOutlined,
  UserOutlined,
  FileTextOutlined,
  MessageOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../layout/AdminLayout";
import { useCategories } from "../../context/useCategories";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import type { Category } from "../../redux/categoriesSlice";
import { addCategory as reduxAdd, deleteCategory as reduxDelete } from "../../redux/categoriesSlice";

const { Title } = Typography;
const LOCAL_STORAGE_KEY = "customBlogCategories";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts);
  const reduxCategories = useSelector((state: RootState) => state.categories.categories);
  const { addCategory, deleteCategory } = useCategories();

  const [newCategory, setNewCategory] = useState("");
  const [searchText, setSearchText] = useState("");

  // Load custom categories từ localStorage (1 lần)
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Category[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const missing = parsed.filter(
            (cat) => !reduxCategories.some((c) => c.id === cat.id)
          );
          missing.forEach((cat) => {
            dispatch(reduxAdd(cat.name));
          });
        }
      } catch (e) {
        console.error("Parse localStorage error:", e);
      }
    }
  }, [dispatch, reduxCategories]);

  // Đồng bộ Redux → localStorage
  useEffect(() => {
    const custom = reduxCategories.filter((c) => c.id > 4);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(custom));
  }, [reduxCategories]);

  const allCategories = [...reduxCategories];

  // Thêm chủ đề
  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return message.warning("Vui lòng nhập tên chủ đề!");

    if (allCategories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      return message.error("Chủ đề đã tồn tại!");
    }

    // Redux lưu string (tên category)
    dispatch(reduxAdd(trimmed));

    // Context cũng nhận string
    addCategory(trimmed);

    setNewCategory("");
    message.success("Thêm chủ đề thành công!");
  };

  // Xóa chủ đề
  const handleDelete = (id: number) => {
    if (id <= 4) return message.error("Không thể xóa chủ đề mặc định!");

    const category = allCategories.find((c) => c.id === id);
    if (!category) return;

    // Redux xóa theo id
    dispatch(reduxDelete(id));

    // Context xóa theo id
    deleteCategory(id);

    message.success("Xóa chủ đề thành công!");
  };

  // Lọc categories
  const filteredCategories = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Columns Table
  const columns: ColumnsType<Category> = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space>
          {record.id <= 4 ? (
            <span className="text-gray-400">Default</span>
          ) : (
            <Button danger size="small" onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Thống kê
  const totalPosts = posts.length;
  const totalComments = posts.reduce<number>((sum, p) => sum + (p.comments?.length || 0), 0);
  const totalLikes = posts.reduce<number>((sum, p) => sum + (p.likes ?? 0), 0);

  return (
    <AdminLayout>
      {/* DASHBOARD TITLE */}
      <div className="mb-6">
        <Title level={2}>Dashboard</Title>
      </div>

      {/* STATISTIC CARDS */}
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Space>
                <UserOutlined style={{ fontSize: 22 }} />
                <div>
                  <b>Admin</b>
                  <p style={{ margin: 0 }}>1 user</p>
                </div>
              </Space>
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Space>
                <FileTextOutlined style={{ fontSize: 22 }} />
                <div>
                  <b>Bài viết</b>
                  <p style={{ margin: 0 }}>{totalPosts}</p>
                </div>
              </Space>
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Space>
                <MessageOutlined style={{ fontSize: 22 }} />
                <div>
                  <b>Bình luận</b>
                  <p style={{ margin: 0 }}>{totalComments}</p>
                </div>
              </Space>
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Space>
                <BarChartOutlined style={{ fontSize: 22 }} />
                <div>
                  <b>Lượt thích</b>
                  <p style={{ margin: 0 }}>{totalLikes}</p>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Card>
          <Title level={4}>Chủ đề</Title>
          <p>Tổng số chủ đề: {allCategories.length}</p>
        </Card>
      </Space>

      {/* SEARCH & ADD CATEGORY */}
      <div className="flex justify-between items-center mb-6 mt-8">
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

      {/* CATEGORY TABLE */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
          <FolderOutlined className="mr-2 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-800">Category List</h3>
        </div>
        <Table
          columns={columns}
          dataSource={filteredCategories}
          pagination={{ pageSize: 10 }}
          rowKey="id"
          locale={{ emptyText: "Không tìm thấy chủ đề nào." }}
          className="custom-table"
        />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
