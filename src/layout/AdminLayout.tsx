// src/layout/AdminLayout.tsx
import React, { useEffect } from "react";
import { Layout, Menu, message } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  LogoutOutlined,
} from "@ant-design/icons"; // XÓA LogoutOutlined
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import AdminHeader from "../components/AdminHeader";
import "../styles/Layout.css"

const { Sider, Content } = Layout;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // KIỂM TRA QUYỀN ADMIN
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      message.warning("Bạn không có quyền truy cập trang quản trị!");
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("/admin/users")) return "users";
    if (path.includes("/admin/entries")) return "entries";
    if (path.includes("/admin/articles")) return "articles";
    return "users";
  };

  const menuItems = [
    {
      key: "users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Quản lý người dùng</Link>,
    },
    {
      key: "entries",
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/entries">Quản lý chủ đề</Link>,
    },
    {
      key: "articles",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/articles">Quản lý bài viết</Link>,
    }, 
    {
      key: "logout",
      icon: <LogoutOutlined/>,
      label: <Link to="/login">Logout</Link>,
    },
  ];

  return (
    <Layout  >
      <Sider width={240} >
        
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          style={{ height: "100%"}}
          items={menuItems}
          className ="main-admin"
        />
      </Sider>

      {/* Nội dung chính */}
      <Layout className="ml-60">
        {/* HEADER ADMIN RIÊNG – CÓ LogoutOutlined */}
        <AdminHeader />

        {/* CONTENT */}
        <Content
          className="ManagerPost"
          style={{
            marginTop: "30px",
          }}
        >
          <div >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;