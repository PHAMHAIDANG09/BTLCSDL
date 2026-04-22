import React, { useState, useEffect } from 'react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ totalEmployees: 0, presentToday: 0, pendingLeaves: 0, expiringContracts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page active" id="page-dashboard">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Dashboard</h1>
          <p id="dash-greeting">Xin chào! Hôm nay là thứ Hai, 21/04/2026</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm">📋 Xuất báo cáo</button>
          <button className="btn btn-accent btn-sm">⏱️ Chấm công</button>
        </div>
      </div>

      <div className="stats-grid" id="stats-grid">
        <div className="stat-card">
          <div className="stat-card-accent"></div>
          <div className="stat-icon stat-icon-blue">👥</div>
          <div className="stat-num">{stats.totalEmployees}</div>
          <div className="stat-label">Tổng nhân viên</div>
          <div className="stat-change change-up">↑ 1 tháng này</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-accent" style={{background: 'var(--accent-3)'}}></div>
          <div className="stat-icon stat-icon-green">✅</div>
          <div className="stat-num">{stats.presentToday}</div>
          <div className="stat-label">Có mặt hôm nay</div>
          <div className="stat-change change-up">↑ 80% tỷ lệ</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-accent" style={{background: 'var(--accent-warn)'}}></div>
          <div className="stat-icon stat-icon-amber">⏳</div>
          <div className="stat-num">{stats.pendingLeaves}</div>
          <div className="stat-label">Đơn chờ duyệt</div>
          <div className="stat-change change-down">↓ cần xử lý</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-accent" style={{background: 'var(--accent)'}}></div>
          <div className="stat-icon stat-icon-red">⚠️</div>
          <div className="stat-num">{stats.expiringContracts}</div>
          <div className="stat-label">HĐ sắp hết hạn</div>
          <div className="stat-change change-down">↓ trong 30 ngày</div>
        </div>
      </div>

      {/* Thêm các phần còn lại từ mẫu HTML, thay mock data bằng API calls tương tự */}
    </div>
  );
};

export default Dashboard;