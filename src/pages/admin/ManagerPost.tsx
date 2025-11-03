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
import { DEFAULT_POSTS } from "../../constants/defaultPosts";
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

  // Merge default posts with redux posts (avoid duplicate ids)
  const ADMIN_DELETED_KEY = "adminDeletedPosts";
  const ADMIN_OVERRIDES_KEY = "adminPostOverrides";

  const loadAdminDeleted = (): string[] => {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_DELETED_KEY) || "[]");
    } catch {
      return [];
    }
  };
  const saveAdminDeleted = (list: string[]) => localStorage.setItem(ADMIN_DELETED_KEY, JSON.stringify(list));

  const loadOverrides = (): Record<string, Partial<Post>> => {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_OVERRIDES_KEY) || "{}");
    } catch {
      return {};
    }
  };
  const saveOverride = (id: string, override: Partial<Post>) => {
    const all = loadOverrides();
    all[String(id)] = { ...(all[String(id)] || {}), ...override };
    localStorage.setItem(ADMIN_OVERRIDES_KEY, JSON.stringify(all));
  };
  const removeOverride = (id: string) => {
    const all = loadOverrides();
    delete all[String(id)];
    localStorage.setItem(ADMIN_OVERRIDES_KEY, JSON.stringify(all));
  };

  const rawMerged = [
    ...DEFAULT_POSTS,
    ...posts.filter((p) => !DEFAULT_POSTS.some((d) => String(d.id) === String(p.id))),
  ];

  // apply admin deletions and sort
  const deletedIds = loadAdminDeleted();
  const mergedAllPosts = rawMerged
    .filter((p) => !deletedIds.includes(String(p.id)))
    .sort((a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime());

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

    if (fileList.length > 0 && fileList[0].originFileObj) {
      try {
        const file = fileList[0].originFileObj as RcFile;
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
      } catch (error) {
        console.error('Error reading file:', error);
        message.error('Không thể đọc file ảnh. Vui lòng thử lại.');
        return;
      }
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

      const isReduxPost = posts.some((p) => String(p.id) === String(editingPost.id));
      const isDefaultPost = DEFAULT_POSTS.some((p) => String(p.id) === String(editingPost.id));

      if (isReduxPost) {
        // For user posts: only save admin override, don't update redux
        saveOverride(String(editingPost.id), {
          title: updatedPost.title,
          content: updatedPost.content,
          comment: updatedPost.comment,
          image: updatedPost.image,
          excerpt: updatedPost.excerpt,
          date: updatedPost.date,
        });
        message.success("Đã lưu thay đổi (chỉ hiển thị trong trang quản trị)");
        setShowForm(false); // Return to post list view
      } else if (isDefaultPost) {
        // For default/example posts: save to redux (global change)
        dispatch(updatePost(updatedPost));
        message.success("Đã sửa bài viết mẫu!");
        setShowForm(false); // Return to post list view
      } else {
        // Handle any other cases
        saveOverride(String(editingPost.id), {
          title: updatedPost.title,
          content: updatedPost.content,
          comment: updatedPost.comment,
          image: updatedPost.image,
          excerpt: updatedPost.excerpt,
          date: updatedPost.date,
        });
        message.success("Đã lưu thay đổi (chỉ hiển thị trong trang quản trị)");
        setShowForm(false); // Return to post list view
      }
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
      setShowForm(false); // Return to post list view
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xoá",
      content: "Bạn có chắc muốn xoá bài viết này?",
      onOk: () => {
        const isReduxPost = posts.some((p) => String(p.id) === String(id));
        if (isReduxPost) {
          dispatch(deletePost(id));
        } else {
          // mark default post as deleted for admin view
          const cur = loadAdminDeleted();
          if (!cur.includes(String(id))) {
            cur.push(String(id));
            saveAdminDeleted(cur);
          }
          // also remove any override
          removeOverride(id);
        }
        message.success("Đã xoá bài viết!");
      },
    });
  };

  const uploadProps = {
    onRemove: (file: UploadFile) =>
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid)),
    beforeUpload: (file: RcFile) => {
      if (!file.type.startsWith('image/')) {
        message.error('Chỉ chấp nhận file ảnh!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Dung lượng ảnh phải nhỏ hơn 2MB!');
        return false;
      }
      setFileList([{
        uid: '-1',
        name: file.name,
        status: 'done',
        originFileObj: file,
      }]);
      return false;
    },
    accept: 'image/*',
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-1">
            {mergedAllPosts.length === 0 ? (
              <Card size="small">No posts available</Card>
            ) : (
              mergedAllPosts.map((p) => {
                // Get any admin override for this post
                const overrides = loadOverrides();
                const override = overrides[String(p.id)] || {};
                
                // Use override values if they exist, otherwise use original
                const displayPost = {
                  ...p,
                  title: override.title ?? p.title,
                  content: override.content ?? p.content,
                  excerpt: override.excerpt ?? p.excerpt,
                  image: override.image ?? p.image,
                  date: override.date ?? p.date,
                };

                return (
                  <Card key={p.id} size="small" hoverable className="!p-1 max-w-[240px]">
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {displayPost.image && (
                        <img
                          src={displayPost.image}
                          alt={displayPost.title}
                          className="w-full h-10 object-cover rounded-sm"
                        />
                      )}
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <strong className="text-[10px] truncate flex-1" title={displayPost.title}>{displayPost.title}</strong>
                          <span className="text-[8px] text-gray-400 whitespace-nowrap">{displayPost.date}</span>
                        </div>
                        <div className="text-[8px] text-gray-600 line-clamp-2 mt-0.5 mb-1" style={{minHeight: "16px"}}>
                          {String(displayPost.excerpt ?? (displayPost.content ?? "")).substring(0, 30)}...
                        </div>
                        <div className="flex justify-end gap-0.5">
                            <Space size={2}>
                              <Button
                                size="small"
                                className="!px-1 !py-0 !text-[8px] !h-4 !min-w-0"
                                onClick={() => {
                                  // get the post from redux or default posts
                                  const target = posts.find((pp) => String(pp.id) === String(p.id)) || 
                                               DEFAULT_POSTS.find((pp) => String(pp.id) === String(p.id));
                                  
                                  if (target) {
                                    setEditingPost(target);
                                    
                                    // If there's an admin override, use those values
                                    const overrides = loadOverrides();
                                    const override = overrides[String(p.id)] || {};
                                    
                                    form.setFieldsValue({
                                      title: override.title ?? target.title,
                                      category: override.category ?? target.category,
                                      content: override.content ?? target.content,
                                      comment: override.comment ?? target.comment,
                                    });
                                    
                                    const img = override.image ?? target.image;
                                    if (img) {
                                      setFileList([
                                        {
                                          uid: "-1",
                                          name: "img.png",
                                          status: "done",
                                          url: img,
                                        } as UploadFile,
                                      ]);
                                    }
                                    setShowForm(true);
                                  }
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                danger
                                className="!px-1 !py-0 !text-[8px] !h-4 !min-w-0"
                                onClick={() => handleDelete(String(p.id))}
                              >
                                Delete
                              </Button>
                            </Space>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
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