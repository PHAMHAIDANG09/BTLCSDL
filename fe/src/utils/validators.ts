/**
 * Form Validation Rules
 * Các quy tắc validate chuẩn hóa cho Ant Design Form
 */

import { Rule } from "antd/es/form";

export const ValidationErrorMessages = {
  required: (label: string) => `Vui lòng nhập ${label.toLowerCase()}`,
  email: "Email không đúng định dạng",
  phone: "Số điện thoại không đúng định dạng",
  number: (label: string) => `${label} phải là chữ số`,
  min: (label: string, min: number) => `${label} phải có tối thiểu ${min} ký tự`,
  max: (label: string, max: number) => `${label} không được vượt quá ${max} ký tự`,
};

export const CommonRules = {
  // Required rule
  required: (label: string): Rule => ({
    required: true,
    message: ValidationErrorMessages.required(label),
  }),

  // Email rule
  email: (): Rule => ({
    type: "email",
    message: ValidationErrorMessages.email,
  }),

  // Phone number (Vietnam format)
  phone: (): Rule => ({
    pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
    message: ValidationErrorMessages.phone,
  }),

  // Password confirmation
  confirmPassword: (passwordFieldName: string): Rule => ({
    validator: (_, value) => {
      if (!value || (typeof passwordFieldName === 'string' && value === (passwordFieldName))) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
    },
  }),

  // Date range validation
  dateRange: (label: string): Rule => ({
    type: 'array' as const,
    required: true,
    message: `Vui lòng chọn khoảng ngày cho ${label.toLowerCase()}`,
  }),
};

/**
 * Zod schemas can be added here if project uses Zod for validation
 */
