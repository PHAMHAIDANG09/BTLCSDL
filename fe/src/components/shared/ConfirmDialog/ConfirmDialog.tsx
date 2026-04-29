"use client";

import React from "react";
import { Modal } from "antd";
import { 
  ExclamationCircleFilled, 
  QuestionCircleFilled, 
  CheckCircleFilled, 
  InfoCircleFilled 
} from "@ant-design/icons";

interface ConfirmDialogProps {
  title?: string;
  content: string;
  type?: "danger" | "warning" | "success" | "info";
  okText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

/**
 * Premium Confirm Dialog component using 100% Ant Design Modal.confirm
 * Linked 100% to system colors in globals.css via CSS Variables.
 */
const ConfirmDialog = {
  show: ({
    title = "Xác nhận",
    content,
    type = "warning",
    okText = "Xác nhận",
    cancelText = "Hủy",
    onConfirm,
    onCancel,
  }: ConfirmDialogProps) => {
    let icon: React.ReactNode;
    let okButtonProps: any = { 
      style: { borderRadius: 8, height: 32, fontWeight: 600, border: 'none' } 
    };

    // Map types to CSS Variables for 100% synchronization
    switch (type) {
      case "danger":
        icon = <ExclamationCircleFilled style={{ color: "var(--error-color)", fontSize: 22 }} />;
        okButtonProps.style.backgroundColor = "var(--error-color)";
        okButtonProps.style.color = "#fff";
        break;
      case "warning":
        icon = <ExclamationCircleFilled style={{ color: "var(--warning-color)", fontSize: 22 }} />;
        okButtonProps.style.backgroundColor = "var(--warning-color)";
        okButtonProps.style.color = "#fff";
        break;
      case "success":
        icon = <CheckCircleFilled style={{ color: "var(--success-color)", fontSize: 22 }} />;
        okButtonProps.style.backgroundColor = "var(--success-color)";
        okButtonProps.style.color = "#fff";
        break;
      case "info":
        icon = <InfoCircleFilled style={{ color: "var(--info-color)", fontSize: 22 }} />;
        okButtonProps.style.backgroundColor = "var(--info-color)";
        okButtonProps.style.color = "#fff";
        break;
      default:
        icon = <QuestionCircleFilled style={{ color: "var(--primary-color)", fontSize: 22 }} />;
        okButtonProps.style.backgroundColor = "var(--primary-color)";
        okButtonProps.style.color = "#fff";
    }

    return Modal.confirm({
      title: title,
      content: content,
      icon: icon,
      okText,
      cancelText,
      centered: true,
      width: 320,
      okButtonProps,
      cancelButtonProps: {
        style: { borderRadius: 8, height: 32, fontWeight: 600 }
      },
      onOk: onConfirm,
      onCancel,
    });
  },
};

export default ConfirmDialog;
