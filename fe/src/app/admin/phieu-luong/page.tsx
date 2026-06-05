"use client";

import React, { useState, useEffect } from "react";
import { Typography, Tag, Button, Space, message, Card, Tabs } from "antd";
import Table from "@/components/shared/Table/Table";
import type { TableColumnsType } from "antd";
import { EyeOutlined, FilePdfOutlined, ReloadOutlined, HistoryOutlined, DollarOutlined } from "@ant-design/icons";
import payrollService from "@/services/payroll.service";
import { PhieuLuong, LichSuLuong } from "@/types/payroll";
import PayrollDetailModal from "@/components/payroll/PayrollDetailModal";
import exportService from "@/components/shared/utils/export";
import dayjs from "dayjs";
import { useAuthStore } from "@/store/authStore";

const { Title, Text } = Typography;

const fmt = (n: number) => n.toLocaleString("vi-VN") + " đ";

export default function AdminPayslipPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PhieuLuong[]>([]);
  const [salaryHistory, setSalaryHistory] = useState<LichSuLuong[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PhieuLuong | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const fetchMyPaySlips = async () => {
    setLoading(true);
    try {
      const res = await payrollService.getMyPaySlips();
      setData(res);
    } catch (error: any) {
      message.error(error.message || "Không thể tải phiếu lương của bạn");
    } finally {
      setLoading(false);
    }
  };

  const fetchMySalaryHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await payrollService.getMySalaryHistory();
      setSalaryHistory(res);
    } catch (error: any) {
      message.error(error.message || "Không thể tải lịch sử lương");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "1") {
      fetchMyPaySlips();
    } else {
      fetchMySalaryHistory();
    }
  };

  useEffect(() => {
    fetchMyPaySlips();
    fetchMySalaryHistory();
  }, []);

  const handleDownloadPDF = (record: PhieuLuong) => {
    const recordWithUser = {
      ...record,
      nhanVien: record.nhanVien || {
        HoTen: user?.hoTen,
        MaNhanVien: user?.maNhanVien
      }
    };
    exportService.exportPayslipToPDF(recordWithUser);
  };

  const columns: TableColumnsType<PhieuLuong> = [
    {
      title: "Tháng/Năm",
      key: "period",
      width: 120,
      render: (_, r) => `Tháng ${r.Thang}/${r.Nam}`,
    },
    {
      title: "Lương cơ bản",
      dataIndex: "LuongCoBan",
      key: "baseSalary",
      width: 150,
      render: fmt,
    },
    {
      title: "Thực nhận",
      dataIndex: "LuongThucNhan",
      key: "netSalary",
      width: 150,
      render: (v) => <Text strong className="text-blue-600">{fmt(v)}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      key: "status",
      width: 130,
      filters: [
        { text: "Đã thanh toán", value: "Paid" },
        { text: "Chờ xử lý", value: "Draft" },
      ],
      onFilter: (value: any, record: PhieuLuong) => {
        if (value === "Draft") {
          return record.TrangThai !== "Paid";
        }
        return record.TrangThai === value;
      },
      render: (s) => (
        <Tag color={s === "Paid" ? "green" : "orange"}>
          {s === "Paid" ? "Đã thanh toán" : "Chờ xử lý"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedItem(r);
              setIsModalOpen(true);
            }}
          >
            Xem
          </Button>
          <Button
            size="small"
            icon={<FilePdfOutlined />}
            danger
            onClick={() => handleDownloadPDF(r)}
          >
            Tải PDF
          </Button>
        </Space>
      ),
    },
  ];

  const historyColumns: TableColumnsType<LichSuLuong> = [
    {
      title: "Ngày bắt đầu",
      dataIndex: "NgayBatDau",
      key: "startDate",
      width: 120,
      render: (v) => v ? dayjs(v).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "NgayKetThuc",
      key: "endDate",
      width: 120,
      render: (v, r) => r.DangHieuLuc ? <Tag color="green">Hiện tại</Tag> : (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Lương cơ bản",
      dataIndex: "LuongCoBan",
      key: "baseSalary",
      width: 130,
      render: (v) => fmt(Number(v)),
    },
    {
      title: "Phụ cấp",
      dataIndex: "PhuCap",
      key: "allowance",
      width: 120,
      render: (v) => fmt(Number(v)),
    },
    {
      title: "Tổng lương",
      key: "totalSalary",
      width: 130,
      render: (_, r) => fmt(Number(r.LuongCoBan) + Number(r.PhuCap)),
    },
    {
      title: "Trạng thái",
      dataIndex: "DangHieuLuc",
      key: "isActive",
      width: 120,
      render: (v) => (
        <Tag color={v ? "green" : "default"}>
          {v ? "Đang hiệu lực" : "Hết hiệu lực"}
        </Tag>
      ),
    },
    {
      title: "Người cập nhật",
      dataIndex: "nguoiThayDoi",
      key: "updater",
      width: 220,
      render: (v) => v ? `${v.HoTen} (${v.MaNhanVien})` : "Hệ thống",
    },
    {
      title: "Ghi chú",
      dataIndex: "GhiChu",
      key: "note",
      render: (v) => v || "-",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="m-0">Phiếu lương cá nhân</Title>
          <Text type="secondary">Lịch sử và chi tiết các khoản thu nhập của bạn</Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={loading || historyLoading}
        >
          Làm mới
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "1",
            label: (
              <span>
                <DollarOutlined /> Phiếu lương tháng
              </span>
            ),
            children: (
              <Table<PhieuLuong>
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="Id"
                searchable={false}
                totalText="phiếu lương"
                noScroll={true}
                locale={{ emptyText: "Bạn chưa có phiếu lương nào" }}
              />
            ),
          },
          {
            key: "2",
            label: (
              <span>
                <HistoryOutlined /> Lịch sử thay đổi lương
              </span>
            ),
            children: (
              <Table<LichSuLuong>
                columns={historyColumns}
                dataSource={salaryHistory}
                loading={historyLoading}
                rowKey="Id"
                searchable={false}
                totalText="bản ghi lịch sử lương"
                noScroll={true}
                locale={{ emptyText: "Bạn chưa có lịch sử thay đổi lương nào" }}
              />
            ),
          },
        ]}
      />

      <PayrollDetailModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedItem}
      />
    </div>
  );
}
