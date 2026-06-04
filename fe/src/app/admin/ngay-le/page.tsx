"use client";

import React, { useEffect, useState } from "react";
import { systemService } from "@/services/system.service";
import { NgayLe } from "@/types/system";
import HolidayForm from "./_components/HolidayForm";
import HolidayCalendar from "./_components/HolidayCalendar";
import { App } from "antd";

export default function NgayLePage() {
  const [holidays, setHolidays] = useState<NgayLe[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const data = await systemService.getHolidays();
      setHolidays(data);
    } catch (error: any) {
      message.error(error.message || "Không thể tải danh sách ngày lễ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px 24px", height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", background: "#f7f8fc", boxSizing: "border-box" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a2e", margin: 0 }}>
          Quản Lý Ngày Lễ
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg, #ef5350, #b71c1c)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "10px 22px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(211,47,47,0.35)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "none")}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          Thêm Ngày Lễ
        </button>
      </div>

      {/* Calendar — fills remaining height */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {loading ? (
          <div style={{ textAlign: "center", paddingTop: 80, color: "#bbb", fontSize: 15 }}>
            Đang tải dữ liệu...
          </div>
        ) : (
          <HolidayCalendar holidays={holidays} />
        )}
      </div>

      {/* Add Modal */}
      <HolidayForm
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchHolidays();
        }}
      />
    </div>
  );
}
