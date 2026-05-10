"use client";

import React from "react";
import { Row, Col, Select, Input, DatePicker, Space as AntSpace } from "antd";
import { 
  SearchOutlined, 
  FileExcelOutlined, 
  ClearOutlined,
  FilterOutlined 
} from "@ant-design/icons";
import Button from "@/components/shared/Button/Button";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ContractFilterProps {
  onSearch: () => void;
  onClear: () => void;
  onExport: () => void;
  onInputChange: (key: string, value: any) => void;
  filters: any;
}

const ContractFilter: React.FC<ContractFilterProps> = ({
  onSearch,
  onClear,
  onExport,
  onInputChange,
  filters,
}) => {
  return (
    <div className="bg-white p-0 mb-8 mt-12 animate-in fade-in slide-in-from-top-2 duration-500">
      <Row gutter={[16, 24]}>
        <Col xs={24} sm={12} md={6}>
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-bold text-gray-700">Tên nhân viên / Mã HĐ</span>
            <Input 
              placeholder="Tìm kiếm..." 
              value={filters.searchText}
              onChange={(e) => onInputChange('searchText', e.target.value)}
              className="h-10 rounded-lg border-gray-200"
              prefix={<SearchOutlined className="text-gray-400" />}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-bold text-gray-700">Loại hợp đồng</span>
            <Select 
              placeholder="Chọn loại hợp đồng"
              value={filters.type}
              onChange={(val) => onInputChange('type', val)}
              className="h-10 w-full"
              allowClear
            >
              <Option value="Thử việc">Thử việc</Option>
              <Option value="Chính thức">Chính thức</Option>
              <Option value="Cộng tác viên">Cộng tác viên</Option>
            </Select>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-bold text-gray-700">Trạng thái</span>
            <Select 
              placeholder="Chọn trạng thái"
              value={filters.status}
              onChange={(val) => onInputChange('status', val)}
              className="h-10 w-full"
              allowClear
            >
              <Option value="Active">Đang hiệu lực</Option>
              <Option value="Expired">Đã hết hạn</Option>
              <Option value="Terminated">Đã chấm dứt</Option>
            </Select>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-bold text-gray-700">Khoảng ngày ký</span>
            <RangePicker 
              className="h-10 w-full rounded-lg border-gray-200"
              onChange={(dates) => onInputChange('dateRange', dates)}
              format="DD/MM/YYYY"
            />
          </div>
        </Col>

        <Col span={24}>
          <div className="flex justify-end mt-10">
            <AntSpace size={10}>
              <Button 
                type="primary" 
                icon={<SearchOutlined />} 
                onClick={onSearch}
                className="bg-red-700 hover:bg-red-800 border-none h-10 px-8 font-bold shadow-md shadow-red-100"
              >
                Tìm kiếm
              </Button>
              <Button 
                variant="outlined"
                icon={<FileExcelOutlined />} 
                onClick={onExport}
                className="h-10 px-6 font-semibold"
              >
                Xuất Excel
              </Button>
              <Button 
                variant="text"
                icon={<ClearOutlined />} 
                onClick={onClear}
                className="h-10 text-gray-500 font-semibold"
              >
                Xóa bộ lọc
              </Button>
            </AntSpace>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ContractFilter;
