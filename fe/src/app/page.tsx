import Link from 'next/link';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import Button from '@/components/shared/Button/Button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 mb-2">NEXHR</h1>
        <p className="text-gray-500 mb-8 font-medium">Hệ thống quản trị nhân sự tổng thể</p>
        
        <div className="space-y-4">
          <Link href="/admin/dashboard" className="block">
            <Button 
              type="primary" 
              size="large" 
              icon={<SettingOutlined />} 
              className="w-full h-14 text-lg"
            >
              Vào Cổng Admin
            </Button>
          </Link>
          
          <Link href="/staff/home" className="block">
            <Button 
              size="large" 
              icon={<UserOutlined />} 
              className="w-full h-14 text-lg border-gray-200"
            >
              Vào Cổng Nhân Viên
            </Button>
          </Link>
        </div>
        
        <p className="mt-8 text-xs text-gray-400">
          Chưa tích hợp Login. Vui lòng chọn vai trò để tiếp tục.
        </p>
      </div>
    </div>
  );
}