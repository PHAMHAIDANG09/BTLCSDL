import React, { useState, useEffect } from 'react';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/employees', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="page" id="page-employees">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Nhân viên</h1>
          <p>Quản lý thông tin toàn bộ nhân viên</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm">📤 Xuất Excel</button>
          <button className="btn btn-accent btn-sm">+ Thêm nhân viên</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-bar">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Tìm theo tên, mã NV, email..." />
            </div>
            <select className="form-select" style={{width: '150px'}}>
              <option value="">Tất cả phòng</option>
              <option>Ban Giám đốc</option>
              <option>Nhân sự</option>
              <option>Công nghệ</option>
              <option>Kế toán</option>
            </select>
            <select className="form-select" style={{width: '130px'}}>
              <option value="">Trạng thái</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nhân viên</th>
                <th>Mã NV</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Vai trò</th>
                <th>Ngày vào</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp: any) => (
                <tr key={emp.id}>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <div className="avatar" style={{background: '#c84b31'}}>{emp.HoTen[0]}</div>
                      <div>
                        <div style={{fontWeight: 500}}>{emp.HoTen}</div>
                        <div style={{color: 'var(--ink-mute)', fontSize: '0.77rem'}}>{emp.Email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{emp.MaNhanVien}</td>
                  <td>{emp.TenPhong}</td>
                  <td>{emp.TenChucVu}</td>
                  <td>{emp.TenVaiTro}</td>
                  <td>{new Date(emp.NgayVaoLam).toLocaleDateString()}</td>
                  <td>{emp.TrangThai}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm">···</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="paginator">
          <span>Hiển thị 1–{employees.length} / {employees.length} nhân viên</span>
          <div className="page-btns">
            <button className="page-btn">‹</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">›</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;