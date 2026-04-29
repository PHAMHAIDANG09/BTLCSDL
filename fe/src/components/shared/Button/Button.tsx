/**
 * Custom Button Component
 * Bọc Ant Design Button để định nghĩa style chung cho toàn dự án.
 * Đảm bảo đồng bộ 100% với hệ thống màu của Ant Design và CSS Variables.
 */

"use client";

import React from "react";
import { Button as AntButton, ButtonProps as AntButtonProps, theme } from "antd";

interface CustomButtonProps extends AntButtonProps {
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
  const { token } = theme.useToken();
  const isPrimary = type === "primary" && !restProps.danger;
  const isDanger = restProps.danger && (type === "primary" || type === "default");
  
  const customStyle: React.CSSProperties = {
    borderRadius: `${token.borderRadius}px`,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
    
    // Đồng bộ màu sắc với CSS Variables để khi đổi màu hệ thống sẽ tự cập nhật
    ...(isPrimary && {
      backgroundColor: "var(--primary-color)",
      borderColor: "var(--primary-color)",
      color: "#fff",
    }),

    ...(isDanger && {
      backgroundColor: "var(--error-color)",
      borderColor: "var(--error-color)",
      color: "#fff",
    }),
    
    ...style,
  };

  return (
    <AntButton
      type={type}
      size={size}
      loading={loading}
      className={`admin-btn ${className}`}
      style={customStyle}
      {...restProps}
    >
      {loading && loadingText ? loadingText : children}
    </AntButton>
  );
};

export default Button;
