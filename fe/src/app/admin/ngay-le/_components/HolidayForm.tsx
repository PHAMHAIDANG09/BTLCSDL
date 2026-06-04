"use client";

import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Checkbox, message } from "antd";
import { systemService } from "@/services/system.service";
import { CreateNgayLeDto } from "@/types/system";
import dayjs from "dayjs";

interface HolidayFormProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function HolidayForm({ open, onCancel, onSuccess }: HolidayFormProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (values: any) => {
    try {
      setSubmitting(true);
      const data: CreateNgayLeDto = {
        TenNgayLe: values.TenNgayLe,
        NgayLe: values.NgayLe.format("YYYY-MM-DD"),
        LapLaiHangNam: values.LapLaiHangNam || false,
      };

      await systemService.createHoliday(data);
      messageApi.success("Thêm ngày lễ thành công!");
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      messageApi.error(error.message || "Thêm ngày lễ thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Thêm Ngày Lễ Mới"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      okText="Lưu"
      cancelText="Hủy"
    >
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ LapLaiHangNam: false }}
      >
        <Form.Item
          name="TenNgayLe"
          label="Tên Ngày Lễ"
          rules={[{ required: true, message: "Vui lòng nhập tên ngày lễ!" }]}
        >
          <Input placeholder="VD: Tết Nguyên Đán" />
        </Form.Item>

        <Form.Item
          name="NgayLe"
          label="Ngày"
          rules={[{ required: true, message: "Vui lòng chọn ngày lễ!" }]}
        >
          <DatePicker 
            format="DD/MM/YYYY" 
            className="w-full"
            placeholder="Chọn ngày"
          />
        </Form.Item>

        <Form.Item
          name="LapLaiHangNam"
          valuePropName="checked"
        >
          <Checkbox>Lặp lại hằng năm (Ví dụ: Giỗ Tổ, Quốc Khánh)</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}
