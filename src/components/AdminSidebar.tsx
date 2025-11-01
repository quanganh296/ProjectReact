// // src/layout/AdminLayout.tsx
// import React from "react";
// import { Layout, Menu } from "antd";
// import {
//   UserOutlined,
//   FileTextOutlined,
//   AppstoreOutlined,
//   LogoutOutlined,
// } from "@ant-design/icons";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/useAuth";
// import Header from "../components/Header";

// const { Sider, Content } = Layout;

// const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation(); // LẤY ĐƯỜNG DẪN HIỆN TẠI

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   // XÁC ĐỊNH KEY HIỆN TẠI DỰA VÀO PATHNAME
//   const getSelectedKey = () => {
//     const path = location.pathname;
//     if (path.includes("/admin/users")) return "users";
//     if (path.includes("/admin/entries")) return "entries";
//     if (path.includes("/admin/articles")) return "articles";
//     return "users"; // mặc định
//   };

//   const menuItems = [
//     {
//       key: "users",
//       icon: <UserOutlined />,
//       label: <Link to="/admin/users">Quản lý người dùng</Link>,
//     },
//     {
//       key: "entries",
//       icon: <AppstoreOutlined />,
//       label: <Link to="/admin/entries">Quản lý chủ đề</Link>,
//     },
//     {
//       key: "articles",
//       icon: <FileTextOutlined />,
//       label: <Link to="/admin/articles">Quản lý bài viết</Link>,
//     },
//     {
//       key: "logout",
//       icon: <LogoutOutlined />,
//       label: <span onClick={handleLogout}>Đăng xuất</span>,
//     },
//   ];

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       {/* Sidebar trái */}
//       <Sider width={240} >
        
//         <Menu
//           mode="inline"
//           selectedKeys={[getSelectedKey()]} 
//           style={{ height: "100%", borderRight: 0 }}
//           theme="dark"
//           items={menuItems}
//         />
//       </Sider>

//       {/* Nội dung chính */}
//       <Layout>
//         <Header />
//         <Content >
//           <div >
//             {children}
//           </div>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default AdminLayout;