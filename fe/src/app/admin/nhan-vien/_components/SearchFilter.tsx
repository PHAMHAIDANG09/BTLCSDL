"use client";

import React from "react";
import { Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchFilterProps {
  onSearch?: (value: string) => void;
  onFilterChange?: (filterName: string, value: any) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onFilterChange }) => {
  return (
    <div className="flex items-center gap-3 py-3 mb-8">
      <Input
        placeholder="Tìm theo tên, mã NV, email..."
        prefix={<SearchOutlined className="text-gray-400" />}
        onChange={(e) => onSearch?.(e.target.value)}
        style={{ width: 280, height: 32, borderRadius: 8 }}
      />
      <Space size="small">
        <Select 
          placeholder="Tất cả phòng" 
          onChange={(v) => onFilterChange?.('department', v)}
          style={{ minWidth: 140, height: 32 }} 
        />
        <Select 
          placeholder="Trạng thái" 
          onChange={(v) => onFilterChange?.('status', v)}
          style={{ minWidth: 140, height: 32 }} 
        />
      </Space>
    </div>
  );
};

export default SearchFilter;
