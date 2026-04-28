"use client";

import ProfileView from "@/components/profile/ProfileView";

// Mock data cho Admin
const MOCK_ADMIN = {
  fullName: "Quản trị viên Hệ thống",
  email: "admin@company.com",
  phone: "0888999888",
  dob: "1990-01-01",
  gender: "male",
  address: "Toà nhà Innovation, Công viên phần mềm Quang Trung, Quận 12, TP.HCM",
  avatarColor: "#ab3e40",
  identityCard: "001090000001",
  taxCode: "1234567890",
  dependents: 0,
  bankAccount: "001100220033",
  bankName: "Vietcombank",
  bankBranch: "Sở giao dịch",

  employeeCode: "ADM-001",
  department: "BOD",
  position: "Quản trị viên",
  startDate: "2024-01-01",
  status: "Đang làm",

  contractType: "indefinite",
  contractNumber: "HĐ-ADM-001",
  baseSalary: 30000000,
  contractSignDate: "2024-01-01",
  contractExpiredDate: undefined,
};

export default function AdminProfilePage() {
  return <ProfileView data={MOCK_ADMIN} isAdmin={true} />;
}
