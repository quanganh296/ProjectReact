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
  const { categories } = useCategories();

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.name,
  }));

  useEffect(() => {
    if (isEdit && id) {
      const post = posts.find((p) => p.id === Number(id));
      if (post) {
        form.setFieldsValue({
          title: post.title,
          category: post.category,
          mood: post.mood || "happy",
          content: post.content,
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
      } else {
        message.error("Không tìm thấy bài viết!");
        navigate("/home");
      }
    }
  }, [id, isEdit, form, posts, navigate]);

  const onFinish = (values: ArticleFormValues) => {
    const newPost = {
      id: isEdit ? Number(id) : Date.now(),
      title: values.title,
      category: values.category,
      mood: values.mood,
      excerpt: values.content.slice(0, 150) + (values.content.length > 150 ? "..." : ""),
      content: values.content,
      image: fileList[0]?.url || "/default-image.png",
      date: new Date().toISOString().split("T")[0],
      isMine: true,
      status: values.status,
      likes: isEdit ? posts.find(p => p.id === Number(id))?.likes || 0 : 0,
      comments: isEdit ? posts.find(p => p.id === Number(id))?.comments || [] : []
    };

    const updatedPosts = isEdit
      ? posts.map((p) => (p.id === Number(id) ? { ...p, ...newPost } : p))
      : [...posts, newPost];

    dispatch(setPosts(updatedPosts));
    message.success(isEdit ? "Cập nhật thành công!" : "Đăng bài thành công!");
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
      return false;
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
            <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
              <Input placeholder="Nhập tiêu đề bài viết" />
            </Form.Item>

            <Form.Item label="Chủ đề" name="category" rules={[{ required: true }]}>
              <Select placeholder="Chọn chủ đề" options={categoryOptions} />
            </Form.Item>

            <Form.Item label="Tâm trạng" name="mood" rules={[{ required: true }]}>
              <Select placeholder="Bạn đang cảm thấy thế nào?">
                <Select.Option value="happy">Happy</Select.Option>
                <Select.Option value="excited">Excited</Select.Option>
                <Select.Option value="calm">Calm</Select.Option>
                <Select.Option value="tired">Tired</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Nội dung" name="content" rules={[{ required: true }]}>
              <TextArea rows={8} placeholder="Viết bài của bạn tại đây..." />
            </Form.Item>

            <Form.Item label="Trạng thái" name="status" initialValue="public">
              <Radio.Group>
                <Radio value="public">Công khai</Radio>
                <Radio value="private">Riêng tư</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Hình ảnh">
              <Upload {...uploadProps} listType="picture">
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>

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