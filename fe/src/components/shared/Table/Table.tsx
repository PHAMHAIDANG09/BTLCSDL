"use client";

import React, { useState, useMemo } from "react";
import {
  Table as AntTable,
  Input,
  Spin,
  Empty,
  TableProps as AntTableProps,
  TablePaginationConfig,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

export interface PaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
}

export interface TableProps<T extends object = Record<string, unknown>> 
  extends Omit<AntTableProps<T>, "pagination" | "columns" | "dataSource" | "rowKey"> {
  columns: AntTableProps<T>["columns"];
  dataSource: T[];
  loading?: boolean;
  pagination?: PaginationConfig | false;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (searchText: string) => void;
  rowKey?: AntTableProps<T>["rowKey"];
  className?: string;
  totalText?: string;
}

export const Table = <T extends object = Record<string, unknown>>({
  columns,
  dataSource,
  loading = false,
  pagination,
  searchable = true,
  searchPlaceholder = "Tìm kiếm...",
  onSearch,
  rowKey = "id",
  className = "",
  totalText = "bản ghi",
  ...restProps
}: TableProps<T>) => {
  const [searchText, setSearchText] = useState("");

  const filteredData = useMemo(() => {
    if (!searchText || !searchable) return dataSource;
    return dataSource.filter((item) => JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase()));
  }, [dataSource, searchText, searchable]);

  const handlePaginationChange = (page: number, pageSize: number) => {
    if (pagination && typeof pagination === 'object') {
      pagination.onChange?.(page, pageSize);
    }
  };

  const paginationConfig: TablePaginationConfig | false = useMemo(() => {
    if (pagination === false) return false;
    if (dataSource.length === 0) return false;

    const baseConfig: TablePaginationConfig = {
      showSizeChanger: true,
      showTotal: (total: number, range: [number, number]) =>
        `Hiển thị ${range[0]}-${range[1]} / ${total} ${totalText}`,
      position: ["bottomRight"],
    };

    if (pagination && typeof pagination === 'object') {
      return {
        ...baseConfig,
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: handlePaginationChange,
      };
    }

    return { ...baseConfig, defaultPageSize: 10 };
  }, [pagination, dataSource.length, totalText]);

  return (
    <div className={`custom-table-wrapper ${className}`}>
      {searchable && (
        <div className="mb-4">
          <Input
            placeholder={searchPlaceholder}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="w-full sm:w-64"
          />
        </div>
      )}
      <Spin spinning={loading}>
        <AntTable<T>
          columns={columns}
          dataSource={filteredData}
          rowKey={rowKey}
          pagination={paginationConfig}
          loading={loading}
          scroll={restProps.scroll || { x: 1300 }}
          className="bg-white rounded-lg overflow-hidden shadow-sm"
          {...restProps}
        />
      </Spin>
    </div>
  );
};

export default Table;
