import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Select, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { addPost, updatePost } from "../../redux/postsSlice";
import type { RootState } from "../../redux/store";
import { useCategories } from "../../context/useCategories";
import { useAuth } from "../../context/useAuth";
import type { RcFile } from "antd/es/upload/interface";
import type { Post } from "../../types";

const { TextArea } = Input;

interface FormValues {
  title: string;
  category: string;
  content: string;
}

const AddArticle: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ posts là mảng Post[]
  const posts = useSelector((state: RootState) => state.posts);

  const { categories } = useCategories();
  const { user } = useAuth();
  const [form] = Form.useForm<FormValues>();
  const [imageFile, setImageFile] = useState<RcFile | null>(null);

  const isEdit = Boolean(id);
  const currentPost = posts.find((p: Post) => p.id === id);

  useEffect(() => {
    if (isEdit && currentPost) {
      form.setFieldsValue({
        title: currentPost.title,
        category: currentPost.category,
        content: currentPost.content,
      });
    }
  }, [currentPost, isEdit, form]);

  const onFinish = async (values: FormValues) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để đăng bài!");
      return;
    }

    // ✅ đảm bảo image luôn là string
    let imageBase64: string = currentPost?.image ?? "";

    if (imageFile) {
      imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }

    const postData: Omit<Post, "likes" | "comments"> = {
      id: isEdit ? currentPost!.id : crypto.randomUUID(),
      title: values.title,
      category: values.category,
      content: values.content,
      date: new Date().toISOString().split("T")[0],
      isMine: true,
      excerpt:
        values.content.slice(0, 150) +
        (values.content.length > 150 ? "..." : ""),
      image: imageBase64 || "/default-img.png", // fallback
    };

    if (isEdit) {
      dispatch(updatePost({ ...currentPost!, ...postData }));
      message.success("Cập nhật bài viết thành công!");
    } else {
      dispatch(addPost(postData));
      message.success("Tạo bài viết thành công!");
    }

    navigate("/home");
  };

  const uploadProps = {
    beforeUpload: (file: RcFile) => {
      setImageFile(file);
      return false;
    },
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ marginBottom: 24, fontSize: 28 }}>
        {isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
      </h2>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
          <Input size="large" placeholder="Nhập tiêu đề bài viết..." />
        </Form.Item>

        <Form.Item name="category" label="Chủ đề" rules={[{ required: true }]}>
          <Select size="large" placeholder="Chọn chủ đề">
            {categories.map((c) => (
              <Select.Option key={c.id} value={c.name}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
          <TextArea rows={10} placeholder="Viết nội dung..." />
        </Form.Item>

        <Form.Item label="Ảnh bài viết">
          <Upload {...uploadProps} maxCount={1}>
            <Button icon={<UploadOutlined />}>Chọn ảnh...</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit" size="large">
          {isEdit ? "Cập nhật" : "Đăng bài"}
        </Button>

        <Button style={{ marginLeft: 12 }} size="large" onClick={() => navigate("/home")}>
          Hủy
        </Button>
      </Form>
    </div>
  );
};

export default AddArticle;
