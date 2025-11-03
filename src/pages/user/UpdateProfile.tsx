import React, { useState } from 'react';
import { Card, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import type { RcFile } from 'antd/es/upload/interface';

const UpdateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [avatarFile, setAvatarFile] = useState<RcFile | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleUpload = async () => {
    if (!avatarFile) {
      message.error('Please select an image first!');
      return;
    }

    setUploading(true);
    try {
      // Convert to base64 for storage
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(avatarFile);
      });

      // Update user with new avatar
      await updateUser({
        ...user,
        avatar: base64
      });

      message.success('Avatar updated successfully!');
      navigate('/profile');
    } catch {
      message.error('Failed to update avatar');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: RcFile) => {
      // Validate file type and size
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }

      setAvatarFile(file);
      return false; // Prevent auto upload
    },
    maxCount: 1,
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card title="Update Profile Picture" className="shadow-md">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Current avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-semibold bg-blue-100 text-blue-600">
                  {user.name[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <Upload {...uploadProps} className="w-full">
            <Button icon={<UploadOutlined />} block>
              Select New Avatar
            </Button>
          </Upload>

          <div className="flex justify-between space-x-4">
            <Button onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <div className="flex space-x-4">
              <Button onClick={() => navigate('/profile')}>
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleUpload}
                loading={uploading}
                disabled={!avatarFile}
              >
                Update Avatar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UpdateProfile;