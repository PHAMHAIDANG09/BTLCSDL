"use client";

import React from "react";
import { Form, Input, Select, FormInstance } from "antd";
import { Department } from "@/services/organization.service";
import { Employee } from "@/services/employee.service";

const { Option } = Select;

interface DepartmentFormProps {
  form: FormInstance;
  editingId: number | null;
  departments: Department[];
  employees: Employee[];
}

export default function DepartmentForm({
  form,
  editingId,
  departments,
  employees,
}: DepartmentFormProps) {
  return (
    <Form
      form={form}
      layout="vertical"
      className="pt-4"
      initialValues={{ MaPhongCha: undefined, MaQuanLy: undefined }}
    >
      <Form.Item
        name="MaPhong"
        label="Mã phòng ban"
        rules={[
          { required: true, message: "Vui lòng nhập mã phòng ban" },
          { max: 20, message: "Mã phòng không được vượt quá 20 ký tự" }
        ]}
      >
        <Input placeholder="Ví dụ: DEV, HR, ACC" disabled={editingId !== null} />
      </Form.Item>

      <Form.Item
        name="TenPhong"
        label="Tên phòng ban"
        rules={[
          { required: true, message: "Vui lòng nhập tên phòng ban" },
          { max: 100, message: "Tên phòng không được vượt quá 100 ký tự" }
        ]}
      >
        <Input placeholder="Ví dụ: Phòng Phát triển phần mềm" />
      </Form.Item>

      <Form.Item
        name="MaPhongCha"
        label="Phòng ban trực thuộc (Phòng ban cha)"
      >
        <Select 
          placeholder="Chọn phòng ban cha (nếu có)" 
          allowClear 
          showSearch 
          filterOption={(input, option) =>
            (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
          }
        >
          {departments
            .filter(d => editingId === null || d.Id !== editingId) // exclude self
            .map(d => (
              <Option key={d.Id} value={d.Id}>{d.TenPhong} ({d.MaPhong})</Option>
            ))
          }
        </Select>
      </Form.Item>

      <Form.Item
        name="MaQuanLy"
        label="Trưởng phòng (Quản lý)"
      >
        <Select 
          placeholder="Chọn nhân viên quản lý" 
          allowClear 
          showSearch 
          filterOption={(input, option) =>
            (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
          }
        >
          {employees.map(emp => (
            <Option key={emp.Id} value={emp.Id}>{emp.HoTen} ({emp.MaNhanVien})</Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
}
