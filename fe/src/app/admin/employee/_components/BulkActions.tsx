"use client";

import React from "react";
import { Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Button from "../../../../components/shared/Button/Button";

interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkEdit: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedCount, onBulkDelete, onBulkEdit }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-2xl border-none animate-in slide-in-from-bottom-4 duration-300">
      <Space size="middle">
        <span className="font-bold text-gray-700">Đã chọn {selectedCount} nhân viên</span>
        <Button size="small" icon={<EditOutlined />}>Sửa hàng loạt</Button>
        <Button size="small" type="primary" danger icon={<DeleteOutlined />} onClick={onBulkDelete}>Xoá đã chọn</Button>
      </Space>
    </div>
  );
};

export default BulkActions;
