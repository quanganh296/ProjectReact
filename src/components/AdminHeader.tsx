import React from "react";
import { Avatar, Dropdown, Space, Typography } from "antd";
import { UserOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/Header.css"

const { Text } = Typography;

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "profile",
      label: <span>Hồ sơ</span>,
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      label: <span>Cài đặt</span>,
    },
    { type: "divider" as const },
    {
      key: "logout",
      label: (
        <span style={{ color: "#ff4d4f" }}>
          <LogoutOutlined /> Đăng xuất
        </span>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <div className ="admin-avatar">
      {/* User dropdown */}
      <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <a
          onClick={(e) => e.preventDefault()}
          className="flex items-center space-x-2"
        >
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            <Text strong className="text-gray-700">
              {user?.name || "Admin"}
            </Text>
            <DownOutlined className="text-xs" />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default AdminHeader;