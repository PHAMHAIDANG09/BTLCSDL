"use client";

import React, { useState, useEffect } from "react";
import { Typography, Tag, Button, Space, message, Card } from "antd";
import Table from "@/components/shared/Table/Table";
import type { TableColumnsType } from "antd";
import { EyeOutlined, FilePdfOutlined, ReloadOutlined } from "@ant-design/icons";
import payrollService from "@/services/payroll.service";
import { PhieuLuong } from "@/types/payroll";
import PayrollDetailModal from "@/components/payroll/PayrollDetailModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title, Text } = Typography;

const fmt = (n: number) => n.toLocaleString("vi-VN") + " đ";

export default function StaffPayslipPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PhieuLuong[]>([]);
  const [selectedItem, setSelectedItem] = useState<PhieuLuong | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    fetchMyPaySlips();
  }, []);

  const handleDownloadPDF = (record: PhieuLuong) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text("PHIEU LUONG NHAN VIEN", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Ky luong: Thang ${record.Thang}/${record.Nam}`, 105, 30, { align: "center" });
    
    // Employee Info
    doc.setFontSize(11);
    doc.text(`Ho ten: ${record.nhanVien?.HoTen || "N/A"}`, 20, 45);
    doc.text(`Ma NV: ${record.nhanVien?.MaNhanVien || "N/A"}`, 20, 52);
    
    // Table data
    const tableData = [
      ["Khoan muc", "So tien"],
      ["Luong co ban", fmt(record.LuongCoBan)],
      ["Phu cap", fmt(record.PhuCap)],
      ["Tien lam them (OT)", fmt(record.TienLamThem)],
      ["Tong luong gop", fmt(record.TongLuongGop)],
      ["BH Xa hoi (8%)", fmt(record.BaoHiemXaHoi)],
      ["BH Y te (1.5%)", fmt(record.BaoHiemYTe)],
      ["BH That nghiep (1%)", fmt(record.BaoHiemThatNghiep)],
      ["Thue TNCN", fmt(record.ThueTNCN)],
      ["Khau tru khac", fmt(record.CacKhoanKhauTruKhac)],
      ["LUONG THUC NHAN", fmt(record.LuongThucNhan)],
    ];

    autoTable(doc, {
      startY: 60,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: "grid",
      headStyles: { fillColor: [29, 78, 216] }, // primary blue
      columnStyles: {
        1: { halign: "right" },
      },
      didParseCell: function (data) {
        if (data.row.index === tableData.length - 2) {
            data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    doc.save(`Phieu_Luong_${record.Thang}_${record.Nam}.pdf`);
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
      render: (s) => (
        <Tag color={s === "Paid" ? "green" : "orange"}>
          {s === "Paid" ? "Đã thanh toán" : "Chờ xử lý"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="m-0">Phiếu lương</Title>
          <Text type="secondary">Lịch sử và chi tiết các khoản thu nhập của bạn</Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchMyPaySlips}
          loading={loading}
        >
          Làm mới
        </Button>
      </div>

      <Table<PhieuLuong>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="Id"
        searchable={false}
        totalText="phiếu lương"
        locale={{ emptyText: "Bạn chưa có phiếu lương nào" }}
      />

      <PayrollDetailModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedItem}
      />
    </div>
  );
}
