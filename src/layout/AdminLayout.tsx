// src/layout/AdminLayout.tsx
import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminSidebar.css";

interface Props {
  children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="admin-layout min-h-screen bg-gray-50 flex">
      {/* Sidebar cố định bên trái */}
      <div className="w-64 fixed left-0 top-0 h-full bg-white shadow-sm border-r z-50">
        <AdminSidebar />
      </div>

      {/* Nội dung chính - thụt lề theo sidebar */}
      <div className="ml-64 flex-1 p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;