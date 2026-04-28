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
  const isPrimary = type === "primary";
  
  const customStyle: React.CSSProperties = {
    borderRadius: "8px",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
    
    // Ant Design Standard Heights
    height: size === 'small' ? '24px' : size === 'large' ? '40px' : '32px',
    
    // Primary specific styles
    boxShadow: isPrimary ? "0 2px 0 rgba(var(--primary-rgb), 0.045)" : undefined,
    
    ...style,
  };

  return (
    <AntButton
      type={type}
      size={size}
      loading={loading}
      className={`admin-btn ${isPrimary ? 'bg-[var(--primary-color)] border-[var(--primary-color)] text-white hover:opacity-90' : ''} ${className}`}
      style={customStyle}
      {...restProps}
    >
      {loading && loadingText ? loadingText : children}
    </AntButton>
  );
};

export default Button;
