"use client";

import ProfileView from "@/components/profile/ProfileView";

// Mock data cho Staff
const MOCK_EMPLOYEE = {
  fullName: "Nguyễn Văn A",
  email: "a.nguyen@company.com",
  phone: "0901234567",
  dob: "1995-03-15",
  gender: "male",
  address: "123 Đường Láng, Đống Đa, Hà Nội",
  avatarColor: "var(--primary-color)",
  identityCard: "001095001234",
  taxCode: "8523456789",
  dependents: 1,
  bankAccount: "1903456789012",
  bankName: "Techcombank",
  bankBranch: "Chi nhánh Đống Đa",

  employeeCode: "EMP-2025-001",
  department: "IT",
  position: "SDEV",
  startDate: "2025-02-01",
  status: "Đang làm",

  contractType: "1year",
  contractNumber: "HĐ-2025-001",
  baseSalary: 15000000,
  contractSignDate: "2025-02-01",
  contractExpiredDate: "2026-02-01",
};

export default function StaffProfilePage() {
  return <ProfileView data={MOCK_EMPLOYEE} />;
}
