import React from "react";
import { Form, Input, Button, Space, Typography, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedinIn,
  faTwitter,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../context/useAuth";
import type { User } from "../../types/types";

// Local stored user shape (includes password for local auth storage)
type StoredUser = User & { password?: string };

const { Text, Link } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ Tạo user mẫu nếu chưa có trong localStorage
  React.useEffect(() => {
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
        },
        {
          id: "2",
          username: "quanganh",
          name: "Nguyen Quang Anh",
          email: "user@gmail.com",
          avatar: "https://via.placeholder.com/40",
          role: "user",
          password: "123456",
        },
      ];

      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
  }, []);

  const onFinish = (values: { email: string; password: string }) => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]");

    const foundUser = users.find((u) => u.email === values.email && u.password === values.password);

    if (!foundUser) {
      message.error("Email or password is incorrect!");
      return;
    }

    // ✅ Lưu user login vào Auth Context + localStorage
    login(foundUser);
    message.success("Login successful!");

    // ✅ Điều hướng theo role
    if (foundUser.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Login Failed:", errorInfo);
    message.error("Please check your email and password.");
  };

  return (
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
          onFinishFailed={onFinishFailed}
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter a valid email address" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter password" />
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
  );
};

export default Login;
