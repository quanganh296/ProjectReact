import React, { useState } from "react";
import { Button, Card } from "antd";
import AdminLayout from "../../layout/AdminLayout";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useCategories } from "../../context/useCategories";

const ManagerPost: React.FC = () => {
  const posts = useSelector((state: RootState) => state.posts);  
  const { categories } = useCategories();
const [showForm] = useState(false);

// consume biến để tránh ESLint cảnh báo
void categories;
void showForm;


  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Manage Articles</h2>

        {/*  Giữ nút — cho admin thêm bài sau */}
        <Button type="primary">
          Thêm mới
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Chưa có bài viết nào!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <Card key={post.id} title={post.title} className="shadow">
              <p>
                <strong>Category:</strong> {post.category}
              </p>

              <p>
                <strong>Status:</strong> {post.status ?? "public"}
              </p>

              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-32 h-32 mt-2 rounded object-cover"
                />
              )}
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default ManagerPost;
