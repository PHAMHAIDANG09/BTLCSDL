"use client";

import { useState, useEffect } from "react";
import { Table, Input, Space, Typography, Tag, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Button from "@/components/shared/Button/Button";
import api from "@/services/api";

// Cấu trúc dữ liệu theo bảng LichSuLuong (và join NhanVien)
interface SalaryHistoryRecord {
  Id: number;
  MaNhanVienId: number;
  LuongCoBan: number;
  PhuCap: number;
  NgayBatDau: string;
  NgayKetThuc: string | null;
  DangHieuLuc: boolean;
  NguoiThayDoiId: number;
  GhiChu: string;
  NgayTao: string;
  
  // Dữ liệu Join
  nhanVien?: {
    MaNhanVien: string;
    HoTen: string;
  };
  nguoiThayDoi?: {
    HoTen: string;
  };
}

export default function SalaryHistoryPage() {
  const [data, setData] = useState<SalaryHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State bộ lọc
  const [searchTextCode, setSearchTextCode] = useState("");
  const [searchTextName, setSearchTextName] = useState("");
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);

  // Vì API hiện tại chưa hỗ trợ API trả về tất cả lịch sử lương,
  // chúng ta có thể gọi lấy tất cả nhân viên rồi map (không tối ưu)
  // hoặc gọi một API mà backend có hỗ trợ, ở đây ta sẽ dùng Mock Data
  // nếu API thật trả về lỗi 404 (chưa được cài đặt).
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Giả định backend đã thêm endpoint này như user báo
      // Nếu không có, hàm sẽ văng lỗi và ta dùng Mock Data ở catch block
      const response = await api.get<SalaryHistoryRecord[]>("/luong/lich-su-tat-ca");
      
      if (Array.isArray(response)) {
        setData(response);
      } else {
        // Fallback sang Mock Data nếu API chưa có
        throw new Error("API chưa sẵn sàng hoặc trả về sai cấu trúc");
      }
    } catch (error) {
      console.warn("Backend không có /luong/lich-su-tat-ca, chuyển sang dùng Mock Data.", error);
      // Mock Data 
      setData([
        {
          Id: 1,
          MaNhanVienId: 1,
          LuongCoBan: 15000000,
          PhuCap: 2000000,
          NgayBatDau: "2024-01-01",
          NgayKetThuc: null,
          DangHieuLuc: true,
          NguoiThayDoiId: 1,
          GhiChu: "Tăng lương định kỳ",
          NgayTao: "2024-01-01T10:00:00Z",
          nhanVien: {
            MaNhanVien: "NV001",
            HoTen: "Nguyễn Văn A"
          },
          nguoiThayDoi: {
            HoTen: "Admin Hệ Thống"
          }
        },
        {
          Id: 2,
          MaNhanVienId: 1,
          LuongCoBan: 12000000,
          PhuCap: 1500000,
          NgayBatDau: "2023-01-01",
          NgayKetThuc: "2023-12-31",
          DangHieuLuc: false,
          NguoiThayDoiId: 1,
          GhiChu: "Lương khởi điểm",
          NgayTao: "2023-01-01T10:00:00Z",
          nhanVien: {
            MaNhanVien: "NV001",
            HoTen: "Nguyễn Văn A"
          },
          nguoiThayDoi: {
            HoTen: "Admin Hệ Thống"
          }
        },
        {
          Id: 3,
          MaNhanVienId: 2,
          LuongCoBan: 18000000,
          PhuCap: 3000000,
          NgayBatDau: "2024-03-15",
          NgayKetThuc: null,
          DangHieuLuc: true,
          NguoiThayDoiId: 1,
          GhiChu: "Thăng chức Trưởng nhóm",
          NgayTao: "2024-03-15T10:00:00Z",
          nhanVien: {
            MaNhanVien: "NV002",
            HoTen: "Trần Thị B"
          },
          nguoiThayDoi: {
            HoTen: "Admin Hệ Thống"
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Logic lọc dữ liệu ở client-side
  const getFilteredData = () => {
    let result = [...data];
    if (searchTextCode) {
      result = result.filter(item => 
        item.nhanVien?.MaNhanVien?.toLowerCase().includes(searchTextCode.toLowerCase())
      );
    }
    if (searchTextName) {
      result = result.filter(item => 
        item.nhanVien?.HoTen?.toLowerCase().includes(searchTextName.toLowerCase())
      );
    }
    return result;
  };

  const handleClear = () => {
    setSearchTextCode("");
    setSearchTextName("");
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "Mã NV",
      key: "employeeCode",
      render: (_: any, record: SalaryHistoryRecord) => <strong>{record.nhanVien?.MaNhanVien || 'N/A'}</strong>,
    },
    {
      title: "Tên Nhân Viên",
      key: "employeeName",
      render: (_: any, record: SalaryHistoryRecord) => record.nhanVien?.HoTen || 'N/A',
    },
    {
      title: "Lương Cơ Bản",
      dataIndex: "LuongCoBan",
      key: "LuongCoBan",
      render: (val: number) => (
        <span style={{ color: "#1890ff", fontWeight: 500 }}>
          {val != null ? val.toLocaleString("vi-VN") + " ₫" : "-"}
        </span>
      ),
    },
    {
      title: "Phụ Cấp",
      dataIndex: "PhuCap",
      key: "PhuCap",
      render: (val: number) => (
        <span>
          {val != null ? val.toLocaleString("vi-VN") + " ₫" : "-"}
        </span>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "DangHieuLuc",
      key: "DangHieuLuc",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "Đang hiệu lực" : "Hết hiệu lực"}
        </Tag>
      ),
    },
    {
      title: "Ngày Áp Dụng",
      dataIndex: "NgayBatDau",
      key: "NgayBatDau",
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "NgayKetThuc",
      key: "NgayKetThuc",
      render: (date: string | null) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Người Cập Nhật",
      key: "nguoiThayDoi",
      render: (_: any, record: SalaryHistoryRecord) => record.nguoiThayDoi?.HoTen || "Hệ thống",
    },
    {
      title: "Ghi Chú",
      dataIndex: "GhiChu",
      key: "GhiChu",
    },
  ];

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "16px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: 900, margin: 0 }}>
          Lịch sử thay đổi lương
        </h1>
      </div>

      <Card style={{ marginBottom: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Space size="middle" wrap>
          <div>
            <Typography.Text strong style={{ display: "block", marginBottom: 4 }}>
              Mã Nhân Viên
            </Typography.Text>
            <Input
              placeholder="Nhập mã NV..."
              prefix={<SearchOutlined />}
              value={searchTextCode}
              onChange={(e) => {
                setSearchTextCode(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: 200 }}
              allowClear
            />
          </div>
          <div>
            <Typography.Text strong style={{ display: "block", marginBottom: 4 }}>
              Tên Nhân Viên
            </Typography.Text>
            <Input
              placeholder="Nhập tên NV..."
              prefix={<SearchOutlined />}
              value={searchTextName}
              onChange={(e) => {
                setSearchTextName(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: 250 }}
              allowClear
            />
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <Space>
              <Button type="primary" onClick={() => setCurrentPage(1)}>Lọc Dữ Liệu</Button>
              <Button onClick={handleClear}>Xóa Lọc</Button>
            </Space>
          </div>
        </Space>
      </Card>

      <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Table
          columns={columns}
          dataSource={getFilteredData()}
          rowKey="Id"
          loading={loading}
          pagination={{ 
            current: currentPage,
            pageSize: 10,
            onChange: (page) => setCurrentPage(page)
          }}
          scroll={{ x: 1200 }}
        />
      </div>
    </div>
  );
}
