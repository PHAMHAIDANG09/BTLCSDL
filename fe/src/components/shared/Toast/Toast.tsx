/**
 * Toast Notification Utility
 * Sử dụng Ant Design message và notification
 */

import { message, notification } from "antd";
import type { ArgsProps } from "antd/es/notification/interface";

// Cấu hình mặc định cho Message
message.config({
  top: 70,
  duration: 3,
  maxCount: 3,
  rtl: false,
});

/**
 * Toast Object để sử dụng nhanh
 */
export const Toast = {
  // Simple messages
  success: (content: string) => message.success(content),
  error: (content: string) => message.error(content),
  info: (content: string) => message.info(content),
  warning: (content: string) => message.warning(content),
  loading: (content: string) => message.loading(content),

  // Detailed notifications
  notify: (config: ArgsProps) => {
    notification[config.type || "info"]({
      placement: "topRight",
      duration: 4.5,
      ...config,
    });
  },

  // Specialized notifications
  apiError: (error: any) => {
    const content = error?.response?.data?.message || error?.message || "Đã xảy ra lỗi không xác định";
    message.error(content);
  }
};

export default Toast;
