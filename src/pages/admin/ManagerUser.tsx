import React, { useState, useMemo } from "react";
import { Table, Button, Input, Tag, Avatar } from "antd";
import { SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import AdminLayout from "../../layout/AdminLayout";

interface User {
  id: number;
  avatar?: string;
  name: string;
  email: string;
  status: "active" | "blocked";
}

const ManagerUser: React.FC = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const [users, setUsers] = useState<User[]>([
    { id: 1, avatar: "https://via.placeholder.com/40", name: "Olivia Lynes", email: "olivialynes@gmail.com", status: "active" },
    { id: 2, avatar: "https://via.placeholder.com/40", name: "Phoenix Baker", email: "phoenixbaker@gmail.com", status: "active" },
    { id: 3, avatar: "https://via.placeholder.com/40", name: "Lana Steiner", email: "lanasteiner@gmail.com", status: "active" },
    { id: 4, avatar: "https://via.placeholder.com/40", name: "Dani Wilkinson", email: "daniwilkinson@gmail.com", status: "active" },
    { id: 5, avatar: "https://via.placeholder.com/40", name: "Candice Wu", email: "candicewu@gmail.com", status: "active" },
    { id: 6, avatar: "https://via.placeholder.com/40", name: "Natalie Fung", email: "nataliefung@gmail.com", status: "active" },
    { id: 7, avatar: "https://via.placeholder.com/40", name: "Drew Cano", email: "drewcano@gmail.com", status: "active" },
    { id: 8, avatar: "https://via.placeholder.com/40", name: "Orlando Gibbs", email: "orlandogibbs@gmail.com", status: "active" },
    { id: 9, avatar: "https://via.placeholder.com/40", name: "Andi Lane", email: "andilane@gmail.com", status: "active" },
    { id: 10, avatar: "https://via.placeholder.com/40", name: "Kate Morris", email: "katemorris@gmail.com", status: "active" },
  ]);

  const handleBlock = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "blocked" } : u));
  };

  const handleUnblock = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "active" } : u));
  };

  // Lọc theo search
  const filteredAndSortedUsers = useMemo(() => {
  const result = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (sortOrder) {
    result.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === "asc" 
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }

  return result;
}, [users, search, sortOrder]);

  const handleSort = () => {
    if (!sortOrder) setSortOrder("asc");
    else if (sortOrder === "asc") setSortOrder("desc");
    else setSortOrder(null);
  };

  const columns = [
    {
      title: () => (
        <div className="flex items-center gap-1 cursor-pointer select-none" onClick={handleSort}>
          Name
          {sortOrder === "asc" && <SortAscendingOutlined className="text-blue-500" />}
          {sortOrder === "desc" && <SortDescendingOutlined className="text-blue-500" />}
          {!sortOrder && <SortAscendingOutlined className="text-gray-400" />}
        </div>
      ),
      dataIndex: "name",
      render: (name: string, record: User) => (
        <div className="flex items-center">
          <Avatar src={record.avatar} size={32} />
          <span className="ml-2">{name}</span>
        </div>
      ),
      width: 220
    },
    {
      title: "Email address",
      dataIndex: "email",
      width: 250
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: "active" | "blocked") => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Blocked"}
        </Tag>
      ),
      width: 120
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: User) => (
        <div className="flex gap-2">
          <Button 
            size="small" 
            danger 
            onClick={() => handleBlock(record.id)}
            disabled={record.status === "blocked"}
          >
            Block
          </Button>
          <Button 
            size="small" 
            onClick={() => handleUnblock(record.id)}
            disabled={record.status === "active"}
          >
            Unblock
          </Button>
        </div>
      ),
      width: 160
    }
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Team members</h2>
          <span className="text-gray-500 ml-2">{filteredAndSortedUsers.length} users</span>
        </div>
        <Input.Search 
          placeholder="Search user" 
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-72"
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredAndSortedUsers}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: filteredAndSortedUsers.length,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
          onChange: (page) => setCurrentPage(page)
        }}
        className="custom-table"
        scroll={{ x: 900 }}
      />
    </AdminLayout>
  );
};

export default ManagerUser;