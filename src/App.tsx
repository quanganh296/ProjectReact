// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import HomePage from "./pages/user/Home";
import AddArticle from "./pages/user/AddArticle";
import ArticleDetail from "./pages/user/ArticleDetail";
import ManagerPost from "./pages/admin/ManagerPost";
import ManagerUser from "./pages/admin/ManagerUser";
import Dashboard from "./pages/admin/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "./styles.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ManagerUser />} />
            <Route path="/admin/users" element={<ManagerUser />} />
            <Route path="/admin/entries" element={<Dashboard />} />
            <Route path="/admin/articles" element={<ManagerPost />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Add & Edit Article - DÙNG CÙNG 1 COMPONENT */}
            <Route path="/add-article" element={<AddArticle />} />
            <Route path="/add-article/:id" element={<AddArticle />} />

            {/* Article Detail */}
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/article-detail/:id" element={<ArticleDetail />} />
          </Routes>
        </Router>
      </Provider>
    </AuthProvider>
  );
};

export default App;