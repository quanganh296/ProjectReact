// src/pages/user/AddArticle.tsx
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Radio,
  Button,
  Upload,
  message,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import "../../styles/AddArticle.css";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { setPosts } from "../../redux/postsSlice";
import type { UploadFile } from "antd";
import { useCategories } from "../../context/CategoryContext";

const { Title } = Typography;
const { TextArea } = Input;

interface ArticleFormValues {
  title: string;
  category: string;
  mood: string;
  content: string;
  status: "public" | "private";
}

const AddArticle: React.FC = () => {
  const [form] = Form.useForm<ArticleFormValues>();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);

  // ✅ Lấy category từ context
  const { categories } = useCategories();
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);

  // Cập nhật category options mỗi khi categories trong context thay đổi
  useEffect(() => {
    setCategoryOptions(categories.map((cat) => ({ label: cat.name, value: cat.name })));
  }, [categories]);

  // Load dữ liệu nếu edit
  useEffect(() => {
    if (isEdit && id) {
      const post = posts.find((p) => p.id === Number(id));
      if (post) {
        form.setFieldsValue({
          title: post.title,
          category: post.category,
          mood: post.mood || "happy",
          content: post.excerpt,
          status: post.status || "public",
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
      }
    }
  }, [id, isEdit, form, posts]);

  const onFinish = (values: ArticleFormValues) => {
    const newPost = {
      id: isEdit ? Number(id) : Date.now(),
      title: values.title,
      category: values.category,
      mood: values.mood,
      excerpt: values.content,
      image: fileList[0]?.url || "/default-image.png",
      date: new Date().toISOString().split("T")[0],
      isMine: true,
      status: values.status,
    };

    const updatedPosts = isEdit
      ? posts.map((p) => (p.id === Number(id) ? { ...p, ...newPost } : p))
      : [...posts, newPost];

    dispatch(setPosts(updatedPosts));
    message.success(isEdit ? "Cập nhật thành công!" : "Thêm bài viết thành công!");
    navigate("/home", { state: { resetToAllBlogs: true } });
  };

  const uploadProps = {
    fileList,
    onRemove: () => setFileList([]),
    beforeUpload: (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileList([
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: e.target?.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
      return false; // Ngăn upload thật
    },
  };

  return (
    <>
      <Header />
      <div className="add-article-container">
        <Title level={2} className="text-center mb-6">
          {isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"}
        </Title>
        <div className="add-article-form">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* TITLE */}
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input placeholder="Nhập tiêu đề bài viết" />
            </Form.Item>

            {/* CATEGORY */}
            <Form.Item
              label="Chủ đề"
              name="category"
              rules={[{ required: true, message: "Vui lòng chọn chủ đề!" }]}
            >
              <Select
                placeholder="Chọn chủ đề"
                options={categoryOptions}
              />
            </Form.Item>

            {/* MOOD */}
            <Form.Item
              label="Tâm trạng"
              name="mood"
              rules={[{ required: true, message: "Vui lòng chọn tâm trạng!" }]}
            >
              <Select placeholder="Bạn đang cảm thấy thế nào?">
                <Select.Option value="happy">Happy</Select.Option>
                <Select.Option value="excited">Excited</Select.Option>
                <Select.Option value="calm">Calm</Select.Option>
                <Select.Option value="tired">Tired</Select.Option>
              </Select>
            </Form.Item>

            {/* CONTENT */}
            <Form.Item
              label="Nội dung"
              name="content"
              rules={[{ required: true, message: "Vui lòng viết nội dung!" }]}
            >
              <TextArea rows={6} placeholder="Viết bài của bạn tại đây..." />
            </Form.Item>

            {/* STATUS */}
            <Form.Item label="Trạng thái" name="status" initialValue="public">
              <Radio.Group>
                <Radio value="public">Công khai</Radio>
                <Radio value="private">Riêng tư</Radio>
              </Radio.Group>
            </Form.Item>

            {/* UPLOAD IMAGE */}
            <Form.Item label="Hình ảnh">
              <Upload {...uploadProps} listType="picture">
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>

            {/* SUBMIT */}
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                {isEdit ? "Cập nhật" : "Đăng bài"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddArticle;
