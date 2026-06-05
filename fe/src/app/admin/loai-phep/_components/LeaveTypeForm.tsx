"use client";

import React from "react";
import { Form, Input, InputNumber, Switch, FormInstance } from "antd";

interface LeaveTypeFormProps {
  form: FormInstance;
  editingId: number | null;
}

export default function LeaveTypeForm({ form, editingId }: LeaveTypeFormProps) {
  return (
    <Form
      form={form}
      layout="vertical"
      className="pt-4"
      initialValues={{ CoHuongLuong: true, SoNgayToiDaNam: 12 }}
    >
      <Form.Item
        name="TenLoaiPhep"
        label="Tên loại nghỉ phép"
        rules={[
          { required: true, message: "Vui lòng nhập tên loại nghỉ phép" },
          { max: 50, message: "Tên loại phép không được vượt quá 50 ký tự" }
        ]}
      >
        <Input placeholder="Ví dụ: Nghỉ phép năm, Nghỉ ốm đau, Nghỉ kết hôn..." />
      </Form.Item>

      <Form.Item
        name="CoHuongLuong"
        label="Có hưởng lương không?"
        valuePropName="checked"
      >
        <Switch 
          checkedChildren="Có hưởng lương" 
          unCheckedChildren="Không hưởng lương" 
        />
      </Form.Item>

      <Form.Item
        name="SoNgayToiDaNam"
        label="Số ngày phép tối đa được nghỉ trong năm"
        rules={[
          { required: true, message: "Vui lòng nhập số ngày nghỉ tối đa" },
          { type: "number", min: 1, max: 365, message: "Số ngày nghỉ phải nằm trong khoảng từ 1 đến 365 ngày" }
        ]}
      >
        <InputNumber className="w-full" min={1} max={365} placeholder="Nhập số ngày (mặc định: 12 ngày)" />
      </Form.Item>

      <Form.Item
        name="MoTa"
        label="Mô tả loại nghỉ phép"
        rules={[
          { max: 255, message: "Mô tả không được vượt quá 255 ký tự" }
        ]}
      >
        <Input.TextArea rows={3} placeholder="Nhập quy định hoặc mô tả bổ sung cho loại nghỉ phép này..." />
      </Form.Item>
    </Form>
  );
}
