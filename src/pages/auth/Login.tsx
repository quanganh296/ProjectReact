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
import { type User } from "../../context/AuthContext"; // Import User type

const { Text, Link } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = (values: { email: string; password: string }) => {
  // Mock users list — TẠO TÀI KHOẢN ADMIN & USER
  const mockUsers: User[] = [
    {
      name: "Admin",
      email: "admin@gmail.com",
      avatarUrl: "https://via.placeholder.com/40",
      role: "admin",
      password: "admin123",
    },
    {
      name: "Nguyen Quang Anh",
      email: "user@gmail.com",
      avatarUrl: "https://via.placeholder.com/40",
      role: "user",
      password: "123456",
    },
  ];

  // Tìm user dựa trên email + password nhập vào
  const foundUser = mockUsers.find(
    (u) => u.email === values.email && u.password === values.password
  );

  if (!foundUser) {
    message.error("Email or password is incorrect!");
    return;
  }

  // Lưu thông tin user vào localStorage (Auth Context)
  login(foundUser);
  message.success("Login successful!");

  // Nếu user là admin → về trang admin
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
      {/* Background */}
      <div className="login-background"></div>

      {/* Form */}
      <div className="login-form-wrapper">
        {/* Social Login */}
        <Space className="login-icon" size="middle" style={{ width: "100%", justifyContent: "center" }}>
          <Text>Sign in with</Text>
          <Button type="text" size="small" icon={<FontAwesomeIcon icon={faFacebookF} />} />
          <Button type="text" size="small" icon={<FontAwesomeIcon icon={faTwitter} />} />
          <Button type="text" size="small" icon={<FontAwesomeIcon icon={faLinkedinIn} />} />
        </Space>

        <div className="or-divider">or</div>

        {/* Login Form */}
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

        {/* Register Link */}
        <div className="link-register" style={{ textAlign: "center" }}>
          <Text>
            Don't have an account?{" "}
            <Link href="/signup" style={{ textDecoration: "underline", color: "#ff4d4f" }}>
              Register
            </Link>
          </Text>
        </div>
      </div>

      {/* Footer */}
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