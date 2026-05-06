'use client';

/**
 * Trang 403 – Forbidden
 * Hiển thị khi người dùng không có quyền truy cập
 */

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ROLE_HOME_MAP } from '@/constants/role';

export default function ForbiddenPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const goHome = () => {
    if (user?.role) {
      router.push(ROLE_HOME_MAP[user.role] || '/login');
    } else {
      router.push('/login');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.errorCode}>403</div>
        <h1 style={styles.title}>Truy Cập Bị Từ Chối</h1>
        <p style={styles.desc}>
          Bạn không có quyền truy cập vào trang này.
          <br />
          Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là nhầm lẫn.
        </p>
        <div style={styles.actions}>
          <button style={styles.primaryBtn} onClick={goHome}>
            Về Trang Chủ
          </button>
          <button
            style={styles.secondaryBtn}
            onClick={() => {
              logout();
              router.push('/login');
            }}
          >
            Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f9fafb 0%, #fef2f2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: '#fff',
    borderRadius: '24px',
    padding: '64px 48px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
    maxWidth: '480px',
    width: '90%',
  },
  errorCode: {
    fontSize: '96px',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #ab3e40, #7c2c2e)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1,
    marginBottom: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 16px 0',
  },
  desc: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: 1.7,
    margin: '0 0 36px 0',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  primaryBtn: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #ab3e40, #8b2e30)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '12px 28px',
    background: 'transparent',
    color: '#6b7280',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
