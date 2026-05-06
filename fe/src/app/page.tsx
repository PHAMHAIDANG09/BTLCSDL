/**
 * Root page – Redirect về /login
 * Middleware sẽ xử lý redirect tiếp theo dựa trên trạng thái đăng nhập
 */
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
}