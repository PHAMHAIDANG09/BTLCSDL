import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';

interface MainLayoutProps {
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState({ HoTen: 'Nguyễn Văn Hùng', TenVaiTro: 'Admin' });
  const [badgeContracts, setBadgeContracts] = useState(2);
  const [badgeLeave, setBadgeLeave] = useState(3);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        onLogout(); // Nếu token invalid, logout
      }
    };
    fetchProfile();

    // Fetch badges, ví dụ
    // fetch('.../pending-counts').then(data => { setBadgeContracts(data.contracts); setBadgeLeave(data.leaves); });
  }, []);

  const navigate = (page: string) => {
    setActivePage(page);
  };

  // Placeholder cho các page
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <Employees />;
      case 'organization':
        return <div>Organization Content</div>;
      case 'contracts':
        return <div>Contracts Content</div>;
      case 'attendance':
        return <div>Attendance Content</div>;
      case 'leave':
        return <div>Leave Content</div>;
      case 'overtime':
        return <div>Overtime Content</div>;
      case 'payroll':
        return <div>Payroll Content</div>;
      case 'salary-history':
        return <div>Salary History Content</div>;
      case 'reports':
        return <div>Reports Content</div>;
      case 'holidays':
        return <div>Holidays Content</div>;
      case 'audit':
        return <div>Audit Content</div>;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div id="app-layout" className="visible">
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">N</div>
          NextHR
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Tổng quan</div>
          <div className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => navigate('dashboard')}>
            <span className="nav-icon">📊</span> Dashboard
          </div>

          <div className="nav-section-label">Nhân sự</div>
          <div className={`nav-item ${activePage === 'employees' ? 'active' : ''}`} onClick={() => navigate('employees')}>
            <span className="nav-icon">👥</span> Nhân viên
          </div>
          <div className={`nav-item ${activePage === 'organization' ? 'active' : ''}`} onClick={() => navigate('organization')}>
            <span className="nav-icon">🏢</span> Cơ cấu tổ chức
          </div>
          <div className={`nav-item ${activePage === 'contracts' ? 'active' : ''}`} onClick={() => navigate('contracts')}>
            <span className="nav-icon">📄</span> Hợp đồng
            <span className="nav-badge" id="badge-contracts">{badgeContracts}</span>
          </div>

          <div className="nav-section-label">Chấm công & Nghỉ phép</div>
          <div className={`nav-item ${activePage === 'attendance' ? 'active' : ''}`} onClick={() => navigate('attendance')}>
            <span className="nav-icon">⏱️</span> Chấm công
          </div>
          <div className={`nav-item ${activePage === 'leave' ? 'active' : ''}`} onClick={() => navigate('leave')}>
            <span className="nav-icon">🏖️</span> Nghỉ phép
            <span className="nav-badge" id="badge-leave">{badgeLeave}</span>
          </div>
          <div className={`nav-item ${activePage === 'overtime' ? 'active' : ''}`} onClick={() => navigate('overtime')}>
            <span className="nav-icon">🕐</span> Làm thêm giờ
          </div>

          <div className="nav-section-label">Tài chính</div>
          <div className={`nav-item ${activePage === 'payroll' ? 'active' : ''}`} onClick={() => navigate('payroll')}>
            <span className="nav-icon">💰</span> Bảng lương
          </div>
          <div className={`nav-item ${activePage === 'salary-history' ? 'active' : ''}`} onClick={() => navigate('salary-history')}>
            <span className="nav-icon">📈</span> Lịch sử lương
          </div>

          <div className="nav-section-label">Hệ thống</div>
          <div className={`nav-item ${activePage === 'reports' ? 'active' : ''}`} onClick={() => navigate('reports')}>
            <span className="nav-icon">📋</span> Báo cáo
          </div>
          <div className={`nav-item ${activePage === 'holidays' ? 'active' : ''}`} onClick={() => navigate('holidays')}>
            <span className="nav-icon">🗓️</span> Ngày lễ
          </div>
          <div className={`nav-item ${activePage === 'audit' ? 'active' : ''}`} onClick={() => navigate('audit')}>
            <span className="nav-icon">🔍</span> Nhật ký
          </div>
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar" id="user-avatar-sidebar">{user.HoTen ? user.HoTen[0] : 'A'}</div>
          <div className="user-info">
            <div className="user-name" id="user-name-sidebar">{user.HoTen}</div>
            <div className="user-role" id="user-role-sidebar">{user.TenVaiTro}</div>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Đăng xuất">⎋</button>
        </div>
      </aside>
      <main className="main-content">
        <div className="topbar">
          <div className="topbar-title" id="topbar-title">{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</div>
          <div className="topbar-actions">
            {/* Thêm notif và user chip */}
          </div>
        </div>
        <div className="page-content">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;