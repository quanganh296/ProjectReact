// src/pages/admin/ManagerPost.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Select,
  Form,
  message,
  Card,
  Space,
  Modal,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import AdminLayout from "../../layout/AdminLayout";
import { useCategories } from "../../context/useCategories";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import type { Post } from "../../types";
import { addPost, updatePost, deletePost } from "../../redux/postsSlice";

const { TextArea } = Input;

interface FormValues {
  title: string;
  category: number;
  content: string;
  comment?: string;
}

const ManagerPost: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const { categories } = useCategories();
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts);
  const location = useLocation();
  const navigate = useNavigate();

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const resetForm = () => {
  form.resetFields();
    setEditingPost(null);
    setShowForm(false);
    setFileList([]);
  };

  // If navigation supplied an editId (from Home), open edit form for that post
  useEffect(() => {
    const state = location.state as { editId?: string } | null;
    const editId = state?.editId;
    if (editId) {
      const target = posts.find((p) => String(p.id) === String(editId));
      if (target) {
        setEditingPost(target);
        form.setFieldsValue({
          title: target.title,
          category: target.category,
          content: target.content,
          comment: target.comment,
        });
        if (target.image) {
          setFileList([
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: target.image,
            },
          ]);
        }
        setShowForm(true);
        // clear location state so refresh doesn't re-open
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location, posts, form, navigate]);

  const handleSubmit = async (values: FormValues) => {
    let imageBase64: string | undefined = editingPost?.image;

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj as RcFile;
      imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const excerpt = values.content.substring(0, 150) + (values.content.length > 150 ? "..." : "");
    const date = new Date().toISOString().split("T")[0];

    if (editingPost) {
      const updatedPost: Post = {
        ...editingPost,
        title: values.title,
        category: values.category,
        content: values.content,
        comment: values.comment,
        image: imageBase64,
        excerpt,
        date,
      };
      dispatch(updatePost(updatedPost));
      message.success("Đã sửa bài viết!");
    } else {
      const newPost: Omit<Post, "id" | "likes" | "comments"> = {
        title: values.title,
        category: values.category,
        content: values.content,
        comment: values.comment,
        image: imageBase64,
        excerpt,
        date,
        author: "Admin",
      };
      dispatch(addPost(newPost));
      message.success("Đã thêm bài viết!");
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xoá",
      content: "Bạn có chắc muốn xoá bài viết này?",
      onOk: () => {
        dispatch(deletePost(id));
        message.success("Đã xoá bài viết!");
      },
    });
  };

  const uploadProps = {
    onRemove: (file: UploadFile) =>
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid)),
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
            <h2 className="text-xl font-semibold">Quản lý tất cả bài viết</h2>
            <Button type="primary" onClick={() => setShowForm(true)}>
              Thêm mới
            </Button>
          </div>

          <div className="grid gap-4">
            {posts.length === 0 ? (
              <Card>
                <p className="text-center text-gray-500">Chưa có bài viết nào.</p>
              </Card>
            ) : (
              posts.map((post) => (
                <Card
                  key={post.id}
                  title={post.title}
                  extra={
                    <Space>
                      <Button
                        onClick={() => {
                          setEditingPost(post);
                          form.setFieldsValue({
                            title: post.title,
                            category: post.category,
                            content: post.content,
                            comment: post.comment,
                          });
                          if (post.image) {
                            setFileList([
                              {
                                uid: "-1",
                                name: "image.png",
                                status: "done",
                                url: post.image,
                              },
                            ]);
                          }
                          setShowForm(true);
                        }}
                      >
                        Sửa
                      </Button>
                      <Button danger onClick={() => handleDelete(post.id)}>
                        Xóa
                      </Button>
                    </Space>
                  }
                >
                  <p>
                    <b>Tác giả:</b> {post.author || "Người dùng"}
                  </p>
                  <p>
                    <b>Chủ đề:</b>{" "}
                    {categories.find((c) => c.id === post.category)?.name || "Không xác định"}
                  </p>
                  <p>
                    <b>Nội dung:</b> {post.content.substring(0, 100)}...
                  </p>
                  {post.comment && (
                    <p>
                      <b>Comment:</b> {post.comment}
                    </p>
                  )}
                  {post.image && (
                    <img
                      src={post.image}
                      alt=""
                      className="w-32 h-32 rounded mt-2 object-cover"
                    />
                  )}
                </Card>
              ))
            )}
          </div>
        </>
      ) : (
        <Card title={editingPost ? "Sửa bài viết" : "Thêm bài viết mới"}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Chủ đề" name="category" rules={[{ required: true }]}>
              <Select placeholder="Chọn 1 chủ đề">
                {categories.map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Nội dung" name="content" rules={[{ required: true }]}>
              <TextArea rows={5} />
            </Form.Item>

            <Form.Item label="Comment (tuỳ chọn)" name="comment">
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item label="Ảnh">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Chọn file</Button>
              </Upload>
            </Form.Item>

            <Space>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
              <Button onClick={resetForm}>Hủy</Button>
            </Space>
          </Form>
        </Card>
      )}
    </AdminLayout>
  );
};

export default ManagerPost;