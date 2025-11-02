import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Select, message } from "antd";
import { addPost, updatePost } from "../../redux/postsSlice";
import type { RootState } from "../../redux/store";
import { useCategories } from "../../context/useCategories";
import { useAuth } from "../../context/useAuth";

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
  const posts = useSelector((state: RootState) => state.posts);
  const { categories } = useCategories();
  const { user } = useAuth();

  const [form] = Form.useForm<FormValues>();
  const isEdit = !!id;

  const currentPost = posts.find((p) => p.id === id);

  useEffect(() => {
    if (isEdit && currentPost) {
      form.setFieldsValue({
        title: currentPost.title,
        category: currentPost.category,
        content: currentPost.content,
      });
    }
  }, [currentPost, isEdit, form]);

  const onFinish = (values: FormValues) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để đăng bài!");
      return;
    }

    const postData = {
      title: values.title,
      content: values.content,
      category: values.category,
      date: new Date().toISOString().split("T")[0],
      isMine: true,
      excerpt: values.content.slice(0, 150) + (values.content.length > 150 ? "..." : ""), // TỰ TẠO
      image: "/Auth/Image (1).png", // MẶC ĐỊNH
    };

    if (isEdit && currentPost) {
      dispatch(
        updatePost({
          ...currentPost,
          ...postData,
        })
      );
      message.success("Cập nhật bài viết thành công!");
    } else {
      dispatch(addPost(postData)); // ĐÃ ĐỦ TRƯỜNG
      message.success("Tạo bài viết thành công!");
    }

    navigate("/home");
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px"}}>
      <h2 style={{ marginBottom: 24, fontSize: 28 }}>
        {isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
      </h2>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder="Nhập tiêu đề bài viết..." size="large" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Chủ đề"
          rules={[{ required: true, message: "Vui lòng chọn chủ đề!" }]}
        >
          <Select placeholder="Chọn một chủ đề" size="large">
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.name}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <TextArea
            rows={10}
            placeholder="Viết nội dung bài viết tại đây..."
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            {isEdit ? "Cập nhật bài" : "Đăng bài"}
          </Button>
          <Button
            style={{ marginLeft: 12 }}
            size="large"
            onClick={() => navigate("/home")}
          >
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddArticle;