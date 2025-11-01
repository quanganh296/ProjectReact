// src/pages/admin/ManagerPost.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  Radio,
  Upload,
  Form,
  message,
  Card,
  Space,
} from "antd";
import {
  UploadOutlined,
  SmileOutlined,
  FrownOutlined,
  MehOutlined,
} from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import AdminLayout from "../../layout/AdminLayout";
import { useCategories } from "../../context/CategoryContext";

const { TextArea } = Input;

interface FormValues {
  title: string;
  categories: string[];
  mood: "Happy" | "Neutral" | "Sad";
  content: string;
  status: "public" | "private";
}

interface Post {
  id: number;
  title: string;
  categories: string[];
  mood: "Happy" | "Neutral" | "Sad";
  content: string;
  status: "public" | "private";
  image?: string;
  createdAt: string;
}

const ManagerPost: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [showForm, setShowForm] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { categories } = useCategories();

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem("posts");
    return saved ? JSON.parse(saved) : [];
  });

  // Đồng bộ posts vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const handleAddNew = () => setShowForm(true);
  const handleCancel = () => {
    setShowForm(false);
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async (values: FormValues) => {
    let imageBase64: string | undefined;

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj as RcFile;
      imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const newPost: Post = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      image: imageBase64,
      ...values,
    };

    const updated = [...posts, newPost];
    setPosts(updated);

    message.success("✅ Bài viết đã được lưu!");
    handleCancel();
  };

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    beforeUpload: (file: RcFile) => {
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
  };

  return (
    <AdminLayout>
      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Manage Articles</h2>
            <Button type="primary" onClick={handleAddNew}>Thêm mới</Button>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Chưa có bài viết. Bấm "Thêm mới" để bắt đầu!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {posts.map((post) => (
                <Card key={post.id} title={post.title} className="shadow">
                  <p>
                    <strong>Categories:</strong>{" "}
                    {post.categories
                      .map((catKey) => {
                        const cat = categories.find((c) => c.key === catKey);
                        return cat ? cat.name : catKey;
                      })
                      .join(", ")}
                  </p>
                  <p><strong>Mood:</strong> {post.mood}</p>
                  <p><strong>Status:</strong> {post.status}</p>
                  {post.image && (
                    <img src={post.image} alt="" className="w-32 h-32 mt-2 rounded"/>
                  )}
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <Button onClick={handleCancel} className="mb-4">◀ Quay lại</Button>

          <Card title="Thêm bài viết mới" className="shadow-sm">
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="max-w-4xl">
              <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                <Input placeholder="Enter article title" />
              </Form.Item>

              <Form.Item label="Categories" name="categories" rules={[{ required: true }]}>
                <Select mode="multiple" placeholder="Select categories" allowClear>
                  {categories.map((cat) => (
                    <Select.Option key={cat.key} value={cat.key}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Mood" name="mood" rules={[{ required: true }]}>
                <Radio.Group>
                  <Space>
                    <Radio value="Happy"><SmileOutlined style={{ color: "#fadb14" }} /> Happy</Radio>
                    <Radio value="Neutral"><MehOutlined style={{ color: "#fa8c16" }} /> Neutral</Radio>
                    <Radio value="Sad"><FrownOutlined style={{ color: "#ff4d4f" }} /> Sad</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="Content" name="content" rules={[{ required: true }]}>
                <TextArea rows={6} placeholder="Write your article content..." />
              </Form.Item>

              <Form.Item label="Status" name="status" initialValue="public">
                <Radio.Group>
                  <Space>
                    <Radio value="public">Public</Radio>
                    <Radio value="private">Private</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="Upload Image">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Browse and choose the file...</Button>
                </Upload>
              </Form.Item>

              <Button type="primary" htmlType="submit" className="bg-green-600">
                Add
              </Button>
            </Form>
          </Card>
        </>
      )}
    </AdminLayout>
  );
};

export default ManagerPost;
