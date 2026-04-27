"use client";

import React from "react";
import { Descriptions, Avatar, Space, Tag, Divider } from "antd";

interface Employee {
  id: number;
  fullName: string;
  email: string;
  code: string;
  department: string;
  position: string;
  role: "Admin" | "Manager" | "Staff";
  joiningDate: string;
  status: "Đang làm" | "Nghỉ việc";
  avatarColor?: string;
}

interface EmployeeDetailProps {
  employee: Employee | null;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employee }) => {
  if (!employee) return null;

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-6">
        <Avatar size={64} style={{ backgroundColor: employee.avatarColor }}>
          {employee.fullName.charAt(0)}
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold m-0">{employee.fullName}</h2>
          <p className="text-gray-400 m-0">{employee.email}</p>
          <Tag color="blue" className="mt-2">{employee.code}</Tag>
        </div>
      </div>
      
      <Divider />
      
      <Descriptions title="Thông tin công tác" bordered column={1}>
        <Descriptions.Item label="Phòng ban">{employee.department}</Descriptions.Item>
        <Descriptions.Item label="Chức vụ">{employee.position}</Descriptions.Item>
        <Descriptions.Item label="Vai trò">{employee.role}</Descriptions.Item>
        <Descriptions.Item label="Ngày vào làm">{employee.joiningDate}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={employee.status === "Đang làm" ? "success" : "default"}>
            {employee.status}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default EmployeeDetail;
