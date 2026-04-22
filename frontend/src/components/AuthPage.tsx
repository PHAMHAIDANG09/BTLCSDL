import React, { useState } from 'react';

interface AuthPageProps {
  onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@nexthr.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      localStorage.setItem('token', data.access_token); // Giả sử backend trả access_token
      setError('');
      onLogin();
    } catch (err) {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  return (
    <div id="auth-page">
      <div className="auth-left">
        <div className="auth-logo">
          <div className="auth-logo-icon">N</div>
          NextHR
        </div>
        <div className="auth-hero">
          <h1>Quản trị <span>nhân sự</span> thông minh.</h1>
          <p>Hệ thống HR toàn diện — từ chấm công, nghỉ phép đến tính lương, tất cả trong một nền tảng.</p>
        </div>
        <div className="auth-stats">
          <div>
            <div className="auth-stat-num">5+</div>
            <div className="auth-stat-label">Module</div>
          </div>
          <div>
            <div className="auth-stat-num">∞</div>
            <div className="auth-stat-label">Nhân viên</div>
          </div>
          <div>
            <div className="auth-stat-num">24/7</div>
            <div className="auth-stat-label">Uptime</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2>Đăng nhập</h2>
          <p>Chào mừng trở lại! Vui lòng nhập thông tin đăng nhập.</p>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={handleLogin}>Đăng nhập</button>
          <div className="auth-divider">hoặc dùng tài khoản demo</div>
          <div className="auth-hint">
            🔑 <strong>Admin:</strong> admin@nexthr.com / 123456<br/>
            🔑 <strong>Manager:</strong> lan.tran@nexthr.vn / 123456<br/>
            🔑 <strong>Staff:</strong> ha.pham@nexthr.vn / 123456
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;