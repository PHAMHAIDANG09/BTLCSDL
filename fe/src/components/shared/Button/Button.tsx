/**
 * Custom Button Component
 * Bọc Ant Design Button để định nghĩa style chung cho toàn dự án
 */

"use client";

import React from "react";
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";

interface CustomButtonProps extends AntButtonProps {
  // Thêm các prop tùy chỉnh nếu cần (ví dụ: permission check)
  permission?: string;
  loadingText?: string;
}

export const Button: React.FC<CustomButtonProps> = ({
  children,
  type = "default",
  size = "middle",
  loading = false,
  loadingText,
  className = "",
  style,
  ...restProps
}) => {
  // Style bổ sung dựa trên theme dự án
  const isPrimary = type === "primary";
  
  const customStyle: React.CSSProperties = {
    borderRadius: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    transition: "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
    
    // Đảm bảo kích thước đồng nhất
    height: size === 'small' ? '26px' : size === 'large' ? '40px' : '32px',
    padding: size === 'small' ? '0 8px' : size === 'large' ? '0 16px' : '0 12px',
    fontSize: size === 'small' ? '11px' : '12.5px',
    
    boxShadow: isPrimary ? "0 4px 12px rgba(208, 16, 16, 0.15)" : "none",
    border: (isPrimary || type === 'text' || type === 'link') ? 'none' : '1px solid #e5e7eb',
    ...style,
  };

  return (
    <AntButton
      type={type}
      size={size}
      loading={loading}
      className={`admin-btn ${isPrimary ? 'bg-[#d01010] border-[#d01010] hover:bg-[#a00d0d]!' : ''} ${className}`}
      style={customStyle}
      {...restProps}
    >
      {loading && loadingText ? loadingText : children}
    </AntButton>
  );
};

export default Button;
