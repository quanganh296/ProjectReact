// src/pages/auth/Login.tsx
import React, { useEffect } from "react";
import { Form, Input, Button, Space, Typography, notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedinIn,
  faTwitter,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../context/useAuth";
import type { User } from "../../types/types";
import type { NotificationArgsProps } from "antd";

type StoredUser = User & { password?: string };

const { Text, Link } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Dùng useNotification để có contextHolder
  const [api, contextHolder] = notification.useNotification();

  const show = (type: "success" | "error" | "warning", config: Pick<NotificationArgsProps, "message" | "description" | "icon" | "placement" | "duration">) => {
    api[type]({
      ...config,
      placement: "top",
      duration: 2,
    });
  };

  // Tạo user mẫu
  useEffect(() => {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (existingUsers.length === 0) {
      const defaultUsers: StoredUser[] = [
        {
          id: "1",
          username: "admin",
          name: "Admin",
          email: "admin@gmail.com",
          avatar: "https://via.placeholder.com/40",
          role: "admin",
          password: "admin123",
          status: "active",
        },
        {
          id: "2",
          username: "quanganh",
          name: "Nguyen Quang Anh",
          email: "user@gmail.com",
          avatar: "https://via.placeholder.com/40",
          role: "user",
          password: "123456",
          status: "active",
        },
      ];
      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
  }, []);

  const onFinish = (values: { email: string; password: string }) => {
    if (!values.email || !values.password) {
      show("warning", {
        message: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin đăng nhập!",
      });
      return;
    }

    const users: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (u) => u.email.toLowerCase().trim() === values.email.toLowerCase().trim()
    );

    if (!foundUser) {
      show("error", {
        message: "Email không tồn tại",
        description: "Vui lòng kiểm tra lại email",
      });
      return;
    }

    if (foundUser.password !== values.password) {
      show("error", {
        message: "Sai mật khẩu",
        description: "Vui lòng thử lại",
      });
      return;
    }

    if (foundUser.status === "blocked") {
      show("error", {
        message: "Tài khoản đã bị khóa",
        description: "Liên hệ quản trị viên để mở khóa!",
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
      return;
    }

    login(foundUser);
    show("success", {
      message: "Đăng nhập thành công",
      description: "Chào mừng " + foundUser.name + " quay trở lại!",
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
    });

    setTimeout(() => {
      navigate(foundUser.role === "admin" ? "/admin" : "/home");
    }, 1000);
  };

  return (
    <>
      {contextHolder} {/* Bắt buộc để notification hiện */}

      <div className="login-container">
        <div className="login-background"></div>

        <div className="login-form-wrapper">
          <Space className="login-icon" size="middle" style={{ width: "100%", justifyContent: "center" }}>
            <Text>Sign in with</Text>
            <Button type="text" size="small" icon={<FontAwesomeIcon icon={faFacebookF} />} />
            <Button type="text" size="small" icon={<FontAwesomeIcon icon={faTwitter} />} />
            <Button type="text" size="small" icon={<FontAwesomeIcon icon={faLinkedinIn} />} />
          </Space>

          <div className="or-divider">or</div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            validateTrigger="onSubmit"
            validateMessages={{
              required: "${label} không được để trống!",
              types: { email: "Định dạng ${label} không hợp lệ!" },
              string: { min: "${label} phải có ít nhất ${min} ký tự!" },
            }}
            layout="vertical"
            size="large"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập email của bạn" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu của bạn" />
            </Form.Item>

            <Form.Item>
              <Button className="Login-Btn-submit" type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>

          <div className="link-register" style={{ textAlign: "center" }}>
            <Text>
              Don't have an account?{" "}
              <Link href="/signup" style={{ textDecoration: "underline", color: "#ff4d4f" }}>
                Register
              </Link>
            </Text>
          </div>
        </div>

        <div className="footer">
          <div className="footer-text">
            <p>Copyright © 2025 All rights reserved</p>
          </div>
          <div className="footer-links">
            <Button type="text" size="small" icon={<FontAwesomeIcon icon={faFacebookF} />} />
            <Button type="text" size="small" icon={<FontAwesomeIcon icon={faTwitter} />} />
            <Button type="text" size="small" icon={<FontAwesomeIcon icon={faLinkedinIn} />} />
            <Button type="text" size="small" icon={<FontAwesomeIcon icon={faGoogle} />} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;