import React from "react";
import { Table, Button, Input, Tag } from "antd";

const users = [
  { id: 1, name: "John Doe", email: "john@gmail.com", status: "active" },
  { id: 2, name: "Peter Parker", email: "peter@marvel.com", status: "blocked" }
];

const ManagerUser: React.FC = () => {
  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) =>
        s === "active" ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Blocked</Tag>
    },
    {
      title: "Action",
      render: () => (
        <div className="flex gap-2">
          <Button size="small" danger>Block</Button>
          <Button size="small">Unblock</Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-5">
      <h2 className="font-bold text-xl mb-3">Manage Users</h2>

      <Input.Search placeholder="Search user..." className="max-w-xs mb-3" />

      <Table rowKey="id" dataSource={users} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default ManagerUser;
