import React from 'react';
import { Form, Input, Button, Space, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons';
import './Login.css';

interface LoginFormData {
  email: string;
  password: string;
}

const { Text, Link } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: LoginFormData) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        </div>
      <div className="login-form-wrapper">
        <Space className="login-icon" style={{ width: '100%' }}>
         <p> Sign in with </p>
          <Button  type="primary" icon={<FontAwesomeIcon icon={faFacebookF} />} block>
            
          </Button>
           <Button  type="primary" icon={<FontAwesomeIcon icon={faTwitter} />} block>

          </Button>

           <Button  type="primary" icon={<FontAwesomeIcon icon={faLinkedinIn} />} block>

          </Button>

        </Space>
        <div className="or-divider">or</div>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="Enter a valid email address" />
           <h3>Email address</h3>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter password" />
            <h3>Password</h3>
          </Form.Item>

          <Form.Item>
            <Button className="Login-Btn-submit" type="primary" htmlType="submit" >
              Login
            </Button>
          </Form.Item>
        </Form>
        <div className="link-register">
        <Text >Don't have an account? <Link style={{ textDecoration: 'underline', color: '#ff4d4f' }} href="/register">Register</Link></Text>
      </div>
      </div>
      <div className="footer">
        <div className="footer-text">
        <p>Copyright © 2025 All rights reserved</p>
        </div>
        <div className="footer-links">
           <Button  type="primary" icon={<FontAwesomeIcon icon={faFacebookF} />} block>
            
          </Button>
           <Button  type="primary" icon={<FontAwesomeIcon icon={faTwitter} />} block>

          </Button>

           <Button  type="primary" icon={<FontAwesomeIcon icon={faLinkedinIn} />} block>

          </Button>
           <Button  type="primary"  icon={<FontAwesomeIcon icon={faGoogle}  />} block>

          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;