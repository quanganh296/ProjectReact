import React from 'react';
import { Typography, Form, Input, Button, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleOutlined } from '@ant-design/icons';
import './Signup.css';

const { Text } = Typography;

interface SignupFormType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const [form] = Form.useForm<SignupFormType>();
  const navigate = useNavigate();

  interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    avatar?: string;
  }

  // Handle form submission
  const onFinish = (values: SignupFormType) => {
    const { firstName, lastName, email, password } = values;

    // Get current users list from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Create new user
    const newUser = {
      id: Date.now(),
      name: `${firstName} ${lastName}`,
      email,
      password,
      role: "user",
      avatar: "https://via.placeholder.com/40"
    };

    // Save to localStorage
    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Show success notification
    notification.success({
      message: "Đăng ký thành công",
      description: "Chào mừng " + newUser.name + "! Vui lòng đăng nhập để tiếp tục.",
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      placement: "top",
      duration: 2
    });

    // Reset form
    form.resetFields();

    // Redirect to login after showing notification
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="signup-container">
      <div className="signup-background">
        <div className="welcome-text">
          <h2>Welcome to the Website</h2>
          <p>RIKKEI EDUCATION</p>
        </div>

        <Form
          form={form}
          name="signup"
          onFinish={onFinish}
          className="signup-form"
          layout="vertical"
          size="large"
        >
          <div className="form-row">
            <Form.Item
              label="Họ"
              name="firstName"
              rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
              className="form-group"
            >
              <Input placeholder="Nhập họ của bạn" />
            </Form.Item>

            <Form.Item
              label="Tên"
              name="lastName"
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
              className="form-group"
            >
              <Input placeholder="Nhập tên của bạn" />
            </Form.Item>
          </div>

          <Form.Item
            label="Email"
            name="email"
            validateTrigger="onBlur"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  // Check if email exists in localStorage
                  const users = JSON.parse(localStorage.getItem("users") || "[]");
                  const existingUser = users.find((u: User) => u.email === value);
                  
                  if (existingUser) {
                    return Promise.reject(
                      new Error('Email này đã được đăng ký! Vui lòng sử dụng email khác hoặc đăng nhập.')
                    );
                  }
                  
                  return Promise.resolve();
                },
              }
            ]}
            validateFirst={true}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="signup-btn" block>
              Đăng ký
            </Button>
          </Form.Item>

          <Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Text>
                Đã có tài khoản?{" "}
                <Link style={{ textDecoration: 'underline', color: '#ff4d4f' }} to="/login">
                  Đăng nhập
                </Link>
              </Text>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
