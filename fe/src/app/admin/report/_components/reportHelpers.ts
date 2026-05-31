import { Space, Progress } from "antd";
import React from "react";

// ─── Types ───────────────────────────────────────────────────────────
export interface MonthlyReportRow {
  key: string;
  month: number;
  year: number;
  label: string;
  tuyenMoi: number;
  nghiViec: number;
  netChange: number;
  tongNgayCoMat: number;
  tongNgayDiMuon: number;
  diMuonRate: number;
  tongLuongCoBan: number;
  tongTienOT: number;
  tongThucNhan: number;
}

// ─── Formatting helpers ──────────────────────────────────────────────
export const formatVND = (n: number) => {
  return n.toLocaleString("vi-VN") + " đ";
};

export const formatVNDShort = (n: number) => {
  if (n >= 1000000000) return (n / 1000000000).toFixed(2) + " tỷ đ";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + " triệu đ";
  return n.toLocaleString("vi-VN") + " đ";
};

// ─── Table Column Definitions ────────────────────────────────────────
export const getHrColumns = (token: any) => [
  { title: "Thời Kỳ", dataIndex: "label", key: "label" },
  {
    title: "Tuyển Mới",
    dataIndex: "tuyenMoi",
    key: "tuyenMoi",
    render: (val: number) =>
      React.createElement(
        "span",
        { className: "font-semibold", style: { color: token.colorSuccess } },
        `+${val} người`
      ),
  },
  {
    title: "Nghỉ Việc",
    dataIndex: "nghiViec",
    key: "nghiViec",
    render: (val: number) =>
      React.createElement(
        "span",
        { className: "font-semibold", style: { color: token.colorPrimary } },
        `-${val} người`
      ),
  },
  {
    title: "Biến Động Ròng",
    dataIndex: "netChange",
    key: "netChange",
    render: (val: number) =>
      React.createElement(
        "span",
        {
          className: "font-bold",
          style: { color: val >= 0 ? token.colorSuccess : token.colorPrimary }
        },
        `${val >= 0 ? `+${val}` : val} người`
      ),
  },
];

export const getAttendanceColumns = (token: any) => [
  { title: "Thời Kỳ", dataIndex: "label", key: "label" },
  {
    title: "Tổng Công Có Mặt",
    dataIndex: "tongNgayCoMat",
    key: "tongNgayCoMat",
    render: (val: number) => `${val} công`,
  },
  {
    title: "Số Lần Đi Muộn",
    dataIndex: "tongNgayDiMuon",
    key: "tongNgayDiMuon",
    render: (val: number) => `${val} lần`,
  },
  {
    title: "Tỷ Lệ Đi Muộn",
    dataIndex: "diMuonRate",
    key: "diMuonRate",
    render: (val: number) =>
      React.createElement(
        Space,
        { size: "middle" },
        React.createElement(Progress, {
          percent: val,
          size: "small",
          status: val > 10 ? "exception" : "normal",
          strokeColor: val > 10 ? token.colorPrimary : token.colorInfo,
          style: { width: 120 },
        }),
        React.createElement("span", { className: "font-bold" }, `${val}%`)
      ),
  },
];

export const getPayrollColumns = (token: any) => [
  { title: "Thời Kỳ", dataIndex: "label", key: "label" },
  {
    title: "Tổng Quỹ Lương Cơ Bản",
    dataIndex: "tongLuongCoBan",
    key: "tongLuongCoBan",
    render: formatVND,
  },
  {
    title: "Tổng Lương OT",
    dataIndex: "tongTienOT",
    key: "tongTienOT",
    render: (val: number) =>
      React.createElement(
        "span",
        { className: "font-medium", style: { color: token.colorWarningActive || token.colorWarning } },
        formatVND(val)
      ),
  },
  {
    title: "Tổng Thực Lĩnh (Net)",
    dataIndex: "tongThucNhan",
    key: "tongThucNhan",
    render: (val: number) =>
      React.createElement(
        "b",
        { style: { color: token.colorPrimary } },
        formatVND(val)
      ),
  },
];

