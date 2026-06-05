"use client";

import React from "react";
import { Form, Input, InputNumber, FormInstance } from "antd";

interface PositionFormProps {
  form: FormInstance;
  editingId: number | null;
}

export default function PositionForm({ form, editingId }: PositionFormProps) {
  return (
    <Form
      form={form}
      layout="vertical"
      className="pt-4"
      initialValues={{ CapDo: 1 }}
    >
      <Form.Item
        name="TenChucVu"
        label="Tên chức vụ"
        rules={[
          { required: true, message: "Vui lòng nhập tên chức vụ" },
          { max: 100, message: "Tên chức vụ không được vượt quá 100 ký tự" }
        ]}
      >
        <Input placeholder="Ví dụ: Trưởng phòng Dev, Lập trình viên Backend..." />
      </Form.Item>

      <Form.Item
        name="CapDo"
        label="Cấp độ chức vụ (1 - 10)"
        rules={[
          { required: true, message: "Vui lòng nhập cấp độ chức vụ" },
          { type: "number", min: 1, max: 10, message: "Cấp độ phải nằm trong khoảng từ 1 đến 10" }
        ]}
      >
        <InputNumber className="w-full" min={1} max={10} placeholder="Chọn cấp độ (1: thấp nhất, 10: cao nhất)" />
      </Form.Item>

      <Form.Item
        name="MoTa"
        label="Mô tả chức vụ"
        rules={[
          { max: 500, message: "Mô tả không được vượt quá 500 ký tự" }
        ]}
      >
        <Input.TextArea rows={4} placeholder="Nhập mô tả nhiệm vụ hoặc quyền hạn của chức vụ..." />
      </Form.Item>
    </Form>
  );
}
