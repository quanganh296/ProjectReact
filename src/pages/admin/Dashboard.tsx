import React from "react";
import { Card } from "antd";
import { UserOutlined, FileTextOutlined, AppstoreOutlined } from "@ant-design/icons";

const Dashboard: React.FC = () => {
  const stats = [
    { title: "Tổng Users", value: 154, icon: <UserOutlined /> },
    { title: "Tổng Bài viết", value: 12, icon: <FileTextOutlined /> },
    { title: "Danh mục bài viết", value: 4, icon: <AppstoreOutlined /> },
  ];

  return (
    <div className="p-5">
      <h2 className="font-bold text-xl mb-4">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((s) => (
          <Card key={s.title}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">{s.title}</p>
                <h3 className="text-2xl font-bold">{s.value}</h3>
              </div>
              <div className="text-3xl">{s.icon}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
