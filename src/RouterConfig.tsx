import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import HomePage from "./pages/user/Home";

const RouterConfig: React.FC = () => {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default RouterConfig;
