"use client";

import React from "react";
import type { ColumnsType } from "antd/es/table";
import { Tag } from "antd";
import Button from "@/components/shared/Button/Button";
import { NgayLe } from "@/types/system";
import Table from "@/components/shared/Table/Table";
import dayjs from "dayjs";
import { SyncOutlined, PlusOutlined } from "@ant-design/icons";

interface HolidayTableProps {
  dataSource: NgayLe[];
  loading: boolean;
  onRefresh: () => void;
  onAddNew: () => void;
}

export default function HolidayTable({
  dataSource,
  loading,
  onRefresh,
  onAddNew,
}: HolidayTableProps) {
  const columns: ColumnsType<NgayLe> = [
    {
      title: "ID",
      dataIndex: "Id",
      key: "Id",
      width: 80,
      sorter: (a, b) => a.Id - b.Id,
    },
    {
      title: "Tên Ngày Lễ",
      dataIndex: "TenNgayLe",
      key: "TenNgayLe",
      sorter: (a, b) => a.TenNgayLe.localeCompare(b.TenNgayLe),
    },
    {
      title: "Ngày",
      dataIndex: "NgayLe",
      key: "NgayLe",
      render: (text: string) => <span className="font-semibold text-blue-600">{dayjs(text).format("DD/MM/YYYY")}</span>,
      sorter: (a, b) => dayjs(a.NgayLe).unix() - dayjs(b.NgayLe).unix(),
      defaultSortOrder: "descend",
    },
    {
      title: "Lặp lại",
      dataIndex: "LapLaiHangNam",
      key: "LapLaiHangNam",
      render: (lapLai: boolean) => (
        <Tag color={lapLai ? "green" : "default"}>
          {lapLai ? "Hằng năm" : "Một lần"}
        </Tag>
      ),
      filters: [
        { text: 'Hằng năm', value: true },
        { text: 'Một lần', value: false },
      ],
      onFilter: (value, record) => record.LapLaiHangNam === value,
    }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-end gap-2 mb-4">
        <Button 
          icon={<SyncOutlined />} 
          onClick={onRefresh}
          loading={loading}
        >
          Làm mới
        </Button>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAddNew}
        >
          Thêm Mới
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="Id"
        loading={loading}
        searchable={true}
        searchPlaceholder="Tìm kiếm tên ngày lễ..."
      />
    </div>
  );
}
