import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { user, changePassword } = useAuth();
  const [form] = Form.useForm<ChangePasswordForm>();

  if (!user) {
    navigate('/login');
    return null;
  }

  const onFinish = async (values: ChangePasswordForm) => {
    try {
      if (values.newPassword !== values.confirmPassword) {
        message.error('New passwords do not match!');
        return;
      }

      // Call the auth context's changePassword method
      await changePassword(values.currentPassword, values.newPassword);
      
      message.success('Password changed successfully!');
      navigate('/profile');
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Failed to change password');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card title="Change Password" className="shadow-md">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              { required: true, message: 'Please input your current password!' }
            ]}
          >
            <Input.Password placeholder="Enter your current password" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password placeholder="Enter your new password" />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your new password" />
          </Form.Item>

          <div className="flex justify-between">
            <Button onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <div className="space-x-4">
              <Button onClick={() => navigate('/profile')}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Change Password
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;