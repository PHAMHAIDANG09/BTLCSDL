"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Typography, 
  Space, 
  Row, 
  Col, 
  Breadcrumb,
  Alert
} from "antd";
import { 
  FileProtectOutlined, 
  PlusOutlined, 
  HomeOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";

// Shared Components
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/shared/Modal/Modal";
import Toast from "@/components/shared/Toast/Toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog/ConfirmDialog";
import StatsCard from "@/components/shared/StatsCard/StatsCard";

// Module Components
import ContractTable from "./_components/ContractTable";
import ContractForm from "./_components/ContractForm";
import ContractFilter from "./_components/ContractFilter";

// API
import { 
  getContractsApi, 
  createContractApi, 
  updateContractApi, 
  deleteContractApi,
  getExpiringContractsApi 
} from "@/services/employee.service";

const { Title } = Typography;

export default function ContractPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [expiringContracts, setExpiringContracts] = useState<any[]>([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    searchText: "",
    type: undefined,
    status: undefined,
    dateRange: null
  });

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const data = await getContractsApi();
      setContracts(data);
      
      // Calculate expiring and expired in real-time
      const today = dayjs();
      const expiring = data.filter(c => {
        if (!c.NgayKetThuc || c.TrangThai === "Terminated") return false;
        const endDate = dayjs(c.NgayKetThuc);
        const diff = endDate.diff(today, 'day');
        return diff >= 0 && diff <= 30;
      });
      setExpiringContracts(expiring);
    } catch (error) {
      Toast.error("Không thể tải danh sách hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleInputChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    Toast.info("Đã áp dụng bộ lọc");
  };

  const handleClear = () => {
    setFilters({
      searchText: "",
      type: undefined,
      status: undefined,
      dateRange: null
    });
  };

  const filteredData = useMemo(() => {
    let result = [...contracts];
    
    if (filters.searchText) {
      const lower = filters.searchText.toLowerCase();
      result = result.filter(c => 
        c.MaHopDong?.toLowerCase().includes(lower) || 
        c.nhanVien?.HoTen?.toLowerCase().includes(lower)
      );
    }
    
    if (filters.type) {
      result = result.filter(c => c.LoaiHopDong === filters.type);
    }
    
    if (filters.status) {
      result = result.filter(c => c.TrangThai === filters.status);
    }
    
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const start = filters.dateRange[0];
      const end = filters.dateRange[1];
      result = result.filter(c => {
        const date = dayjs(c.NgayKy);
        return date.isAfter(start) && date.isBefore(end);
      });
    }
    
    return result;
  }, [contracts, filters]);

  const handleAdd = () => {
    setModalMode("add");
    setSelectedContract(null);
    setIsModalOpen(true);
  };

  const handleEdit = (contract: any) => {
    setModalMode("edit");
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const handleView = (contract: any) => {
    setModalMode("view");
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    ConfirmDialog.show({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa hợp đồng này?",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteContractApi(id);
          Toast.success("Đã xóa hợp đồng");
          fetchContracts();
        } catch (error) {
          Toast.error("Xóa thất bại");
        }
      },
    });
  };

  const handleFormFinish = async (values: any) => {
    try {
      if (modalMode === "add") {
        await createContractApi(values);
        Toast.success("Tạo hợp đồng thành công");
      } else {
        await updateContractApi(selectedContract.Id, values);
        Toast.success("Cập nhật thành công");
      }
      setIsModalOpen(false);
      fetchContracts();
    } catch (error) {
      Toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className="bg-white min-h-screen pt-4">

      {/* Stats Section - USING REUSABLE STATS CARD */}
      <Row gutter={[16, 16]} className="mb-14">
        <Col xs={24} sm={6}>
          <StatsCard 
            label="TỔNG SỐ HỢP ĐỒNG"
            value={contracts.length}
            icon={<FileProtectOutlined />}
            color="#8c1212"
            bg="#fff2f0"
            size="small"
          />
        </Col>
        <Col xs={24} sm={6}>
          <StatsCard 
            label="ĐANG HIỆU LỰC"
            value={contracts.filter(c => c.TrangThai === "Active").length}
            icon={<CheckCircleOutlined />}
            color="#0958d9"
            bg="#e6f4ff"
            size="small"
          />
        </Col>
        <Col xs={24} sm={6}>
          <StatsCard 
            label="SẮP HẾT HẠN"
            value={expiringContracts.length}
            icon={<WarningOutlined />}
            color="#d46b08"
            bg="#fff7e6"
            size="small"
          />
        </Col>
        <Col xs={24} sm={6}>
          <StatsCard 
            label="ĐÃ HẾT HẠN"
            value={contracts.filter(c => {
              if (!c.NgayKetThuc) return false;
              return dayjs(c.NgayKetThuc).isBefore(dayjs(), 'day');
            }).length}
            icon={<InfoCircleOutlined />}
            color="#531dab"
            bg="#f9f0ff"
            size="small"
          />
        </Col>
      </Row>

      {/* Spacer */}
      <div style={{ height: 40 }} />

      {/* Warning Section */}
      {expiringContracts.length > 0 && (
        <Alert
          message={<span style={{ color: '#b80f23ff', fontWeight: 'bold', fontSize: '16px' }}>Cảnh báo Hợp đồng sắp hết hạn</span>}
          description={
            <ul className="m-0 pl-4 list-disc text-sm text-red-700">
              {expiringContracts.slice(0, 3).map(c => (
                <li key={c.Id}>
                  <span className="font-bold">{c.nhanVien?.HoTen}</span> - Hết hạn vào {dayjs(c.NgayKetThuc).format("DD/MM/YYYY")}
                </li>
              ))}
            </ul>
          }
          type="warning"
          showIcon
          className="mb-6 bg-orange-50 border-orange-200 rounded-2xl p-6 shadow-sm"
        />
      )}

      {/* Fixed Spacer to ensure distance */}
      <div style={{ height: 30 }} />

      {/* Filter Section */}
      <ContractFilter 
        filters={filters}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onClear={handleClear}
        onExport={() => Toast.success("Đang xuất file Excel...")}
      />

      {/* Main Action Bar */}
      <div className="flex justify-between items-center mb-3">
        <Title level={5} className="m-0 font-bold">Dòng thời gian hợp đồng</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="middle" 
          onClick={handleAdd}
          className="bg-red-700 hover:bg-red-800 border-none rounded-lg h-9 px-6 shadow-sm"
        >
          Ký hợp đồng mới
        </Button>
      </div>

      {/* Table Section */}
      <ContractTable 
        contracts={filteredData} 
        loading={loading} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={
          <Space size={8}>
            <FileTextOutlined style={{ color: '#c41d4cff', fontSize: '20px' }} />
            <span className="text-xl font-bold">
              {modalMode === "add" ? "Ký kết hợp đồng mới" : modalMode === "edit" ? "Cập nhật phụ lục" : "Chi tiết hợp đồng"}
            </span>
          </Space>
        }
        width={800}
        footer={null}
      >
        <ContractForm 
          initialValues={selectedContract}
          onFinish={handleFormFinish}
          loading={false}
          onCancel={() => setIsModalOpen(false)}
          isViewOnly={modalMode === "view"}
        />
      </Modal>
    </div>
  );
}
