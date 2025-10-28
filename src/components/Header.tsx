import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "../../src/layout/Header.css";

const Header: React.FC = () => {
  return (
    <header className="blog-header ">
        
     <div className ="header-title">
      <div className="Logo">
        {/* Logo */}
        <img
          src="/Auth/Chip.png"
          alt="Logo"
          style={{ width: 24, height: 24}}
        />
        </div>

        {/* Tên blog + slogan */}
          <h6 className="fw-bold text-uppercase">RIKKEI_EDU_BLOG</h6>
          </div>

          <Input
        placeholder="Search for articles"
        prefix={<SearchOutlined />}
        className="search-input"
      />
      

      {/* Ô tìm kiếm */}
      
    </header>
  );
};

export default Header;
