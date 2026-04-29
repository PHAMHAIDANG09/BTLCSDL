"use client";

import React from "react";
import ConfirmDialog from "../../../../components/shared/ConfirmDialog/ConfirmDialog";

interface DeleteConfirmProps {
  title?: string;
  content?: string;
  onConfirm: () => void | Promise<void>;
}

const DeleteConfirm = {
  show: ({ 
    title = "Xác nhận xoá nhân viên", 
    content = "Dữ liệu nhân viên này sẽ bị xoá vĩnh viễn và không thể khôi phục. Bạn có chắc chắn muốn tiếp tục?", 
    onConfirm 
  }: DeleteConfirmProps) => {
    ConfirmDialog.show({
      title,
      content,
      type: "danger",
      okText: "Xoá nhân viên",
      cancelText: "Hủy bỏ",
      onConfirm: async () => {
        await onConfirm();
      },
    });
  }
};

export default DeleteConfirm;
