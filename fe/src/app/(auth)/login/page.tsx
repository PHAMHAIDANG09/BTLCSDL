'use client';

/**
 * Login Page - Minimalist Style
 * Giao diện tối giản với khung đăng nhập tập trung ở giữa trang.
 * Nền trắng sạch sẽ, chuyên nghiệp.
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Checkbox, App } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyOutlined,
} from '@ant-design/icons';
import { loginApi } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { ROLE_HOME_MAP } from '@/constants/role';
import type { LoginRequest } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && user) {
      const destination = ROLE_HOME_MAP[user.role] || '/admin/bang-dieu-khien';
      window.location.replace(destination);
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (values: LoginRequest & { remember?: boolean }) => {
    setLoading(true);
    try {
      const result = await loginApi({ email: values.email, password: values.password });
      setAuth(result.access_token, result.user);
      message.success(`Chào mừng trở lại, ${result.user.hoTen}!`);
      
      const destination = ROLE_HOME_MAP[result.user.role] || '/admin/bang-dieu-khien';
      setTimeout(() => {
        window.location.replace(destination);
      }, 500);
    } catch (err: any) {
      const errorMsg = err?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        {/* Logo & Title */}
        <div style={styles.header}>
          <div style={styles.logoCircle}>
            <SafetyOutlined style={{ fontSize: 28, color: '#fff' }} />
          </div>
          <h1 style={styles.title}>NextHR</h1>
          <p style={styles.subtitle}>Đăng nhập để quản lý hệ thống của bạn</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            label={<span style={styles.label}>Email</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="admin@nexthr.com"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={styles.label}>Mật khẩu</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="••••••••"
              style={styles.input}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <div style={styles.extraRow}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ fontSize: 13, color: '#595959' }}>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <a href="#" style={styles.forgotPass}>Quên mật khẩu?</a>
          </div>

          <Form.Item style={{ marginBottom: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={styles.submitBtn}
            >
              {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
            </Button>
          </Form.Item>
        </Form>

        {/* Demo Accounts */}
        <div style={styles.demoSection}>
          <p style={styles.demoLabel}>TRẢI NGHIỆM NHANH</p>
          <div style={styles.demoButtons}>
            {[
              { label: 'Admin', email: 'admin@nexthr.com', color: '#ab3e40' },
              { label: 'Staff', email: 'ha.pham@nexthr.vn', color: '#059669' },
            ].map((acc) => (
              <button
                key={acc.label}
                type="button"
                onClick={() => form.setFieldsValue({ email: acc.email, password: '123456' })}
                style={{ ...styles.demoBtn, borderColor: acc.color, color: acc.color }}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div style={styles.footer}>
        © 2026 NextHR. All rights reserved.
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: '20px',
  },
  loginCard: {
    width: '100%',
    maxWidth: '400px',
    padding: '36px 32px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
    border: '1px solid #f0f0f0',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoCircle: {
    width: '52px',
    height: '52px',
    backgroundColor: '#ab3e40',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
    boxShadow: '0 4px 12px rgba(171, 62, 64, 0.2)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#1a1a1a',
    margin: '0 0 4px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#8c8c8c',
    margin: 0,
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#434343',
  },
  input: {
    borderRadius: '8px',
    height: '46px',
  },
  extraRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  forgotPass: {
    fontSize: '13px',
    color: '#ab3e40',
    fontWeight: 500,
  },
  submitBtn: {
    height: '46px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 700,
    backgroundColor: '#ab3e40',
    borderColor: '#ab3e40',
    boxShadow: '0 4px 12px rgba(171, 62, 64, 0.15)',
  },
  demoSection: {
    marginTop: '4px',
    paddingTop: '20px',
    borderTop: '1px dashed #e8e8e8',
  },
  demoLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#bfbfbf',
    letterSpacing: '1px',
    textAlign: 'center',
    marginBottom: '12px',
  },
  demoButtons: {
    display: 'flex',
    gap: '10px',
  },
  demoBtn: {
    flex: 1,
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid',
    backgroundColor: 'transparent',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  footer: {
    marginTop: '32px',
    fontSize: '12px',
    color: '#bfbfbf',
  }
};
