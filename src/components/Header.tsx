import React from "react";
import { Input, Button, Space, Avatar, Dropdown, type MenuProps } from "antd";
import { SearchOutlined, LoginOutlined, UserAddOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "../layout/Header.css";
import { useAuth } from "../context/useAuth"; 


const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div style={{ padding: "4px 8px" }}>
          <strong>{user?.name || "User"}</strong>
          <br />
          <small>{user?.email}</small>
        </div>
      ),
      disabled: true
    },
    { type: "divider" },
    { key: '2', label: "View profile", onClick: () => navigate("/profile") },
    { key: '3', label: "Update profile picture" },
    { key: '4', label: "Change password" },
    { type: "divider" },
    {
      key: '5',
      label: <span style={{ color: "red" }}>Log out</span>,
      icon: <LogoutOutlined />,
      onClick: logout
    }
  ];

  return (
    <header className="blog-header">
      <div className="header-title">
        <div className="Logo">
          <img src="/Auth/Chip.png" alt="Logo" style={{ width: 24, height: 24 }} />
        </div>
        <button
          onClick={handleLogoClick}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        ><h6 className="fw-bold text-uppercase">RIKKEI_EDU_BLOG</h6></button>
      </div>

      <Input
        placeholder="Search for articles"
        prefix={<SearchOutlined />}
        className="search-input"
      />

      <Space size="middle">
        {!isAuthenticated ? (
          <>
            <Link to="/login">
              <Button icon={<LoginOutlined />}>Login</Button>
            </Link>
            <Link to="/signup">
              <Button type="primary" icon={<UserAddOutlined />}>
                Sign up
              </Button>
            </Link>
          </>
        ) : (
          <Dropdown menu={{ items }} placement="bottomRight">
            <Avatar
              src={user?.avatarUrl}
              icon={<UserOutlined />}
              style={{ cursor: "pointer" }}
            />
          </Dropdown>
        )}
      </Space>
    </header>
  );
};

export default Header;
