import React from "react";
import { Input, Button, Space } from "antd";
import { SearchOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../layout/Header.css";

const Header: React.FC = () => {
  return (
    <header className="blog-header">
      <div className="header-title">
        <div className="Logo">
          <img src="/Auth/Chip.png" alt="Logo" style={{ width: 24, height: 24 }} />
        </div>
        <h6 className="fw-bold text-uppercase">RIKKEI_EDU_BLOG</h6>
      </div>

      <Input
        placeholder="Search for articles"
        prefix={<SearchOutlined />}
        className="search-input"
      />

      {/* Nút đăng nhập & đăng ký */}
      <Space size="middle">
        <Link to="/login">
          <Button icon={<LoginOutlined />}>Login</Button>
        </Link>
        <Link to="/signup">
          <Button type="primary" icon={<UserAddOutlined />}>Sign up</Button>
        </Link>
      </Space>
    </header>
  );
};

export default Header;