/**
 * Custom Modal Component
 * Bọc Ant Design Modal để tái sử dụng trên toàn hệ thống
 */

"use client";

import React from "react";
import { Modal as AntModal, ModalProps as AntModalProps } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

/**
 * Custom Modal Props
 */
export interface ModalProps extends Omit<AntModalProps, "onOk" | "onCancel"> {
  title?: string;
  children?: React.ReactNode;
  open: boolean;
  loading?: boolean;
  okText?: string;
  cancelText?: string;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  okButtonProps?: AntModalProps["okButtonProps"];
  cancelButtonProps?: AntModalProps["cancelButtonProps"];
  centered?: boolean;
  width?: number;
}

/**
 * Custom Modal Component
 */
export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  open,
  loading = false,
  okText = "Đồng ý",
  cancelText = "Hủy",
  onOk,
  onCancel,
  okButtonProps = {},
  cancelButtonProps = {},
  centered = true,
  width = 520,
  ...restProps
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  /**
   * Handle OK button click
   */
  const handleOk = async () => {
    if (onOk) {
      setIsSubmitting(true);
      try {
        await onOk();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  /**
   * Handle Cancel button click
   */
  const handleCancel = () => {
    if (!isSubmitting) {
      onCancel?.();
    }
  };

  return (
    <AntModal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      centered={centered}
      width={width}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={loading || isSubmitting}
      okButtonProps={{
        loading: loading || isSubmitting,
        ...okButtonProps,
      }}
      cancelButtonProps={{
        disabled: loading || isSubmitting,
        ...cancelButtonProps,
      }}
      {...restProps}
    >
      {children}
    </AntModal>
  );
};

/**
 * Confirmation Modal (Delete, Confirm actions)
 */
export const ConfirmModal = {
  confirm: (config: {
    title?: string;
    content?: string;
    okText?: string;
    cancelText?: string;
    onOk: () => void | Promise<void>;
    onCancel?: () => void;
    okButtonDanger?: boolean;
  }) => {
    AntModal.confirm({
      title: config.title || "Xác nhận",
      content:
        config.content || "Bạn có chắc chắn muốn thực hiện hành động này?",
      icon: <ExclamationCircleOutlined />,
      okText: config.okText || "Xác nhận",
      cancelText: config.cancelText || "Hủy",
      okButtonProps: {
        danger: config.okButtonDanger ?? true,
      },
      onOk: config.onOk,
      onCancel: config.onCancel,
    });
  },

  success: (config: {
    title?: string;
    content?: string;
    okText?: string;
    onOk?: () => void;
  }) => {
    AntModal.success({
      title: config.title || "Thành công",
      content: config.content || "Hành động được thực hiện thành công!",
      okText: config.okText || "Đóng",
      onOk: config.onOk,
    });
  },

  error: (config: {
    title?: string;
    content?: string;
    okText?: string;
    onOk?: () => void;
  }) => {
    AntModal.error({
      title: config.title || "Lỗi",
      content: config.content || "Đã xảy ra lỗi!",
      okText: config.okText || "Đóng",
      onOk: config.onOk,
    });
  },

  warning: (config: {
    title?: string;
    content?: string;
    okText?: string;
    cancelText?: string;
    onOk: () => void | Promise<void>;
    onCancel?: () => void;
  }) => {
    AntModal.warning({
      title: config.title || "Cảnh báo",
      content: config.content || "Hành động này không thể hoàn tác!",
      okText: config.okText || "Tiếp tục",
      cancelText: config.cancelText || "Hủy",
      onOk: config.onOk,
      onCancel: config.onCancel,
    });
  },

  info: (config: {
    title?: string;
    content?: string;
    okText?: string;
    onOk?: () => void;
  }) => {
    AntModal.info({
      title: config.title || "Thông tin",
      content: config.content || "Thông tin chi tiết",
      okText: config.okText || "Đóng",
      onOk: config.onOk,
    });
  },
};

export default Modal;
