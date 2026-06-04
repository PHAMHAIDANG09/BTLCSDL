"use client";

import React, { useEffect, useState } from "react";
import { systemService } from "@/services/system.service";
import { NhatKyHeThong } from "@/types/system";
import AuditLogTable from "./_components/AuditLogTable";
import { App } from "antd";
import { AuditOutlined } from "@ant-design/icons";

export default function NhatKyHeThongPage() {
  const [logs, setLogs] = useState<NhatKyHeThong[]>([]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await systemService.getLogs(500);
      setLogs(data);
    } catch (error: any) {
      message.error(error.message || "Không thể tải danh sách nhật ký hệ thống");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1600, margin: "0 auto", padding: "24px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", gap: 16 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: "#1a1a2e", lineHeight: 1.2 }}>
            Nhật Ký Hệ Thống
          </h1>
      </div>

      <AuditLogTable
        dataSource={logs}
        loading={loading}
        onRefresh={fetchLogs}
      />
    </div>
  );
}
