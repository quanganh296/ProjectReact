import React from "react";
import { Menu, Button } from "antd";
import { 
  UserOutlined, 
  FileTextOutlined, 
  EditOutlined, 
  LogoutOutlined 
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const AdminSidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Manage users</Link>,
    },
    {
      key: "/admin/entries",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/entries">Manage entries</Link>,
    },
    {
      key: "/admin/articles",
      icon: <EditOutlined />,
      label: <Link to="/admin/articles">Manage articles</Link>,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">RIKKEI EDUCATION</h2>
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="flex-1 border-none"
        style={{ background: "transparent" }}
      />

      {/* Logout */}
      <div className=" log-out p-1 border-t ">
        <Button
          block
          type="text"
          icon={<LogoutOutlined />}
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className=" hover:text-red-500"
        >
          Log out
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;