"use client";

import React from "react";
import { Space, Divider } from "antd";
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
    <div className="inline-flex bg-red-50/80 backdrop-blur-sm px-6 py-3 rounded-2xl border-none animate-in slide-in-from-left-5 duration-300 items-center shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <Space size="large">
        <span className="font-bold text-red-800 flex items-center gap-3">
          <span className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center text-sm shadow-lg shadow-red-200">
            {selectedCount}
          </span>
          Đã chọn {selectedCount} nhân viên
        </span>
        <Divider type="vertical" className="h-8 bg-red-200" />
        <Space>
          <Button 
            size="middle" 
            variant="text"
            icon={<EditOutlined />}
            onClick={onBulkEdit}
            className="text-red-700 hover:bg-red-100"
          >
            Sửa nhanh
          </Button>
          <Button 
            size="middle" 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={onBulkDelete}
            className="shadow-md shadow-red-200"
          >
            Xoá đã chọn
          </Button>
        </Space>
      </Space>
    </div>
  );
};

export default BulkActions;
