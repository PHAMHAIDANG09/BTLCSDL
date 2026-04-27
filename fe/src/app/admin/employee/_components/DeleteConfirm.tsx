"use client";

import React from "react";
import { ConfirmModal } from "../../../../components/shared/Modal/Modal";
import Toast from "../../../../components/shared/Toast/Toast";

interface DeleteConfirmProps {
  title?: string;
  content?: string;
  onConfirm: () => void;
}

const DeleteConfirm = {
  show: ({ title = "Xác nhận xoá", content = "Dữ liệu này sẽ bị xoá vĩnh viễn và không thể khôi phục. Bạn có chắc chắn?", onConfirm }: DeleteConfirmProps) => {
    ConfirmModal.confirm({
      title,
      content,
      onOk: () => {
        onConfirm();
      },
    });
  }
};

export default DeleteConfirm;
