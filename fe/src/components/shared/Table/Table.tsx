/**
 * Custom Table Component
 * Bọc Ant Design Table với tích hợp search và pagination
 */

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

/**
 * Pagination config interface
 */
export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  onChange?: (page: number, pageSize: number) => void;
}

/**
 * Custom Table Props
 */
export interface TableProps<
  T extends object = Record<string, unknown>,
> extends Omit<
  AntTableProps<T>,
  "pagination" | "columns" | "dataSource" | "rowKey"
> {
  columns: AntTableProps<T>["columns"];
  dataSource: T[];
  loading?: boolean;
  pagination?: PaginationConfig;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (searchText: string) => void;
  rowKey?: AntTableProps<T>["rowKey"];
  className?: string;
  totalText?: string;
}

/**
 * Custom Table Component
 */
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
  totalText = "nhân viên",
  ...restProps
}: TableProps<T>) => {
  const [searchText, setSearchText] = useState("");

  /**
   * Filter data based on search text
   */
  const filteredData = useMemo(() => {
    if (!searchText || !searchable) return dataSource;

    return dataSource.filter((item) => {
      const itemStr = JSON.stringify(item).toLowerCase();
      return itemStr.includes(searchText.toLowerCase());
    });
  }, [dataSource, searchText, searchable]);

  /**
   * Handle search input change
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch?.(value);
  };

  /**
   * Handle pagination change
   */
  const handlePaginationChange = (page: number, pageSize: number) => {
    pagination?.onChange?.(page, pageSize);
  };

  /**
   * Pagination config for Ant Table
   */
  const paginationConfig: TablePaginationConfig | false = useMemo(() => {
    if (dataSource.length === 0) return false;

    const baseConfig: TablePaginationConfig = {
      showSizeChanger: true,
      showTotal: (total: number, range: [number, number]) =>
        `Hiển thị ${range[0]}-${range[1]} / ${total} ${totalText}`,
      pageSizeOptions: ["5", "10", "20", "50"],
      position: ["bottomRight"],
    };

    if (pagination) {
      return {
        ...baseConfig,
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: handlePaginationChange,
      };
    }

    return {
      ...baseConfig,
      defaultPageSize: 10,
    };
  }, [pagination, dataSource.length]);

  return (
    <div className={`custom-table-wrapper ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="mb-4">
          <Input
            placeholder={searchPlaceholder}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearchChange}
            allowClear
            className="w-full sm:w-64"
          />
        </div>
      )}

      {/* Table */}
      <Spin spinning={loading}>
        {filteredData.length === 0 && !loading ? (
          <Empty description="Không có dữ liệu" />
        ) : (
          <AntTable<T>
            columns={columns}
            dataSource={filteredData}
            rowKey={rowKey}
            pagination={paginationConfig}
            loading={loading}
            scroll={{ x: "max-content" }}
            className="bg-white rounded-lg overflow-hidden"
            {...restProps}
          />
        )}
      </Spin>
    </div>
  );
};

export default Table;
