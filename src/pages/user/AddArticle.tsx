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
import { UploadOutlined, SmileOutlined, FrownOutlined, MehOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Header from "../../components/Header";
import "../../layout/AddArticle.css";
import { type UploadFile, type UploadProps } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

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
  const { user } = useAuth();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // LẤY DANH SÁCH BÀI VIẾT TỪ REDUX
  const posts = useSelector((state: RootState) => state.posts.posts);

  // NẾU LÀ EDIT → LOAD DỮ LIỆU CŨ
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
        // Nếu có ảnh → giả lập fileList
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
  }, [id, isEdit, posts, form]);

  const onFinish = (values: ArticleFormValues) => {
    const articleData = {
      ...values,
      author: user?.name || "Anonymous",
      image: fileList[0]?.name || null,
    };

    if (isEdit) {
      console.log("UPDATE article ID:", id, articleData);
      message.success("Article updated successfully!");
    } else {
      console.log("CREATE article:", articleData);
      message.success("Article created successfully!");
    }

    navigate("/"); // Về Home
  };

  const uploadProps: UploadProps = {
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
  };

  return (
    <>
      <Header />
      <div className="add-article-container">
        <div className="add-article-form">
          <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
            {isEdit ? "Edit Article" : "Add New Article"}
          </Title>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* TITLE */}
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter title!" }]}
            >
              <Input placeholder="Enter article title" />
            </Form.Item>

            {/* CATEGORY */}
            <Form.Item
              label="Article Categories"
              name="category"
              rules={[{ required: true, message: "Please select category!" }]}
            >
              <Select placeholder="Select a category">
                <Select.Option value="Daily Journal">Daily Journal</Select.Option>
                <Select.Option value="Work & Career">Work & Career</Select.Option>
                <Select.Option value="Personal Thoughts">Personal Thoughts</Select.Option>
                <Select.Option value="Emotions & Feelings">Emotions & Feelings</Select.Option>
              </Select>
            </Form.Item>

            {/* MOOD */}
            <Form.Item
              label="Mood"
              name="mood"
              rules={[{ required: true, message: "Please select mood!" }]}
            >
              <Select placeholder="How are you feeling?">
                <Select.Option value="happy">
                  <SmileOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                  Happy
                </Select.Option>
                <Select.Option value="excited">
                  <SmileOutlined style={{ color: "#faad14", marginRight: 8 }} />
                  Excited
                </Select.Option>
                <Select.Option value="calm">
                  <MehOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                  Calm
                </Select.Option>
                <Select.Option value="tired">
                  <FrownOutlined style={{ color: "#f5222d", marginRight: 8 }} />
                  Tired
                </Select.Option>
              </Select>
            </Form.Item>

            {/* CONTENT */}
            <Form.Item
              label="Content"
              name="content"
              rules={[{ required: true, message: "Please write content!" }]}
            >
              <TextArea rows={6} placeholder="Write your article here..." />
            </Form.Item>

            {/* STATUS */}
            <Form.Item label="Status" name="status" initialValue="public">
              <Radio.Group>
                <Radio value="public">Public</Radio>
                <Radio value="private">Private</Radio>
              </Radio.Group>
            </Form.Item>

            {/* UPLOAD IMAGE */}
            <Form.Item label="Upload Image">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>
                  Browse and choose the file
                </Button>
              </Upload>
            </Form.Item>

            {/* SUBMIT */}
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                {isEdit ? "Update" : "Add"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddArticle;