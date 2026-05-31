"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Spin, Tabs, message } from "antd";
import dayjs from "dayjs";
import reportService from "@/services/report.service";

// ─── Sub-components ──────────────────────────────────────────────────
import ReportHeader from "./_components/ReportHeader";
import OverviewStats from "./_components/OverviewStats";
import ExportSection from "./_components/ExportSection";
import HRReportTab from "./_components/HRReportTab";
import AttendanceReportTab from "./_components/AttendanceReportTab";
import PayrollReportTab from "./_components/PayrollReportTab";
import { MonthlyReportRow } from "./_components/reportHelpers";

export default function ReportingCenter() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await reportService.getChartStats();
      setData(res);
    } catch (error: any) {
      console.error(error);
      message.error(error.message || "Không thể tải dữ liệu thống kê báo cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ─── Compute standard 6-month periods ───────────────────────────────
  const periods = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = dayjs().subtract(i, "month");
      return {
        month: d.month() + 1,
        year: d.year(),
        label: `${d.month() + 1}/${d.year()}`,
      };
    }).reverse();
  }, []);

  // ─── Format combined data for charts and tables ─────────────────────
  const monthlyReportData: MonthlyReportRow[] = useMemo(() => {
    if (!data) return [];

    return periods
      .map((p) => {
        const bl =
          data.quyLuong?.find(
            (x: any) => x.Thang === p.month && x.Nam === p.year
          ) || {};
        const cc =
          data.diMuon?.find(
            (x: any) => x.Thang === p.month && x.Nam === p.year
          ) || {};
        const tm =
          data.bienDong?.find(
            (x: any) => x.Thang === p.month && x.Nam === p.year
          ) || {};
        const nv =
          data.nghiViec?.find(
            (x: any) => x.Thang === p.month && x.Nam === p.year
          ) || {};

        const totalComat = cc.TongNgayCoMat || 0;
        const totalDimuon = cc.TongNgayDiMuon || 0;

        return {
          key: `${p.month}-${p.year}`,
          month: p.month,
          year: p.year,
          label: `Tháng ${p.label}`,
          tuyenMoi: tm.SoTuyenMoi || 0,
          nghiViec: nv.SoNghiViec || 0,
          netChange: (tm.SoTuyenMoi || 0) - (nv.SoNghiViec || 0),
          tongNgayCoMat: totalComat,
          tongNgayDiMuon: totalDimuon,
          diMuonRate:
            totalComat > 0
              ? Number(((totalDimuon / totalComat) * 100).toFixed(1))
              : 0,
          tongLuongCoBan: bl.TongLuongCoBan || 0,
          tongTienOT: bl.TongTienLamThem || 0,
          tongThucNhan: bl.TongThucNhan || 0,
        };
      })
      .reverse(); // Latest month first in tables
  }, [data, periods]);

  // Chart data: oldest first
  const chartData = useMemo(() => {
    return [...monthlyReportData].reverse();
  }, [monthlyReportData]);

  // Latest month summary for overview cards
  const latestMonthData = useMemo(() => {
    return (
      monthlyReportData[0] || {
        key: "0-0",
        month: 0,
        year: 0,
        label: "",
        tuyenMoi: 0,
        nghiViec: 0,
        netChange: 0,
        tongNgayCoMat: 0,
        tongNgayDiMuon: 0,
        diMuonRate: 0,
        tongLuongCoBan: 0,
        tongTienOT: 0,
        tongThucNhan: 0,
      }
    );
  }, [monthlyReportData]);

  // ─── Loading state ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Spin size="large" tip="Đang truy vấn dữ liệu báo cáo..." />
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <div
      style={{ maxWidth: "1600px", margin: "0 auto", padding: "16px" }}
      className="custom-table-wrapper"
    >
      <ReportHeader
        title="Trung tâm Báo cáo & Thống kê"
        description="Báo cáo thống kê nhân sự, chấm công đi muộn và chi phí lương. Sử dụng toàn diện dữ liệu từ cơ sở dữ liệu."
      />

      <Tabs
        type="card"
        defaultActiveKey="1"
        size="large"
        className="admin-tabs"
        items={[
          {
            key: "1",
            label: "Tổng quan & Xuất báo cáo",
            children: (
              <div className="pt-4">
                <OverviewStats latestMonthData={latestMonthData} />
                <div style={{ marginTop: 32 }}>
                  <ExportSection />
                </div>
              </div>
            ),
          },
          {
            key: "2",
            label: "Biến động Nhân sự",
            children: (
              <HRReportTab
                chartData={chartData}
                tableData={monthlyReportData}
              />
            ),
          },
          {
            key: "3",
            label: "Báo cáo Chấm công",
            children: (
              <AttendanceReportTab
                chartData={chartData}
                tableData={monthlyReportData}
              />
            ),
          },
          {
            key: "4",
            label: "Báo cáo Quỹ lương",
            children: (
              <PayrollReportTab
                chartData={chartData}
                tableData={monthlyReportData}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
