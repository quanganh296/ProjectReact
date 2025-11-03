import React from 'react';
import { Card, Avatar, Button, Empty } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import type { RootState } from '../../redux/store';
import PostCard from '../../components/PostCard';
import { getCategoryColor } from '../../utils/categoryColor';
import { useCategories } from '../../context/useCategories';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories } = useCategories();
  const posts = useSelector((state: RootState) => 
    state.posts.filter(post => post.author === user?.name || post.isMine)
  );

  const getCategoryName = (categoryId: number): string => {
    return categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <Empty 
            description="Please log in to view your profile" 
            className="p-8"
          />
          <Button 
            type="primary" 
            onClick={() => navigate('/login')}
            className="mt-4"
          >
            Log In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="mb-6">
        <div className="flex items-start gap-6">
          <Avatar 
            size={100} 
            src={user.avatar} 
            className="flex-shrink-0"
          >
            {!user.avatar && user.name[0].toUpperCase()}
          </Avatar>
          
          <div className="flex-grow">
            <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-600 mb-4">{user.email}</p>
            
            <div className="flex justify-between">
              <Button onClick={() => navigate('/')}>
                Back to Home
              </Button>
              <div className="space-x-4">
                <Button onClick={() => navigate('/update-profile')}>
                  Update Profile
                </Button>
                <Button onClick={() => navigate('/change-password')}>
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="My Posts" className="mb-6">
        {posts.length === 0 ? (
          <Empty description="You haven't created any posts yet" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => {
              const categoryName = getCategoryName(Number(post.category));
              return (
                <PostCard
                  key={post.id}
                  title={post.title}
                  date={post.date}
                  category={categoryName}
                  excerpt={post.excerpt}
                  image={post.image ?? ""}
                  isMine={true}
                  onTitleClick={() => navigate(`/article/${post.id}`)}
                  categoryColor={getCategoryColor(categoryName)}
                />
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserProfile;