"use client";

import React, { useEffect, useState } from "react";
import ProfileView from "@/components/profile/ProfileView";
import { getProfileApi } from "@/services/auth.service";
import { Spin, message } from "antd";

export default function AdminProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data: any = await getProfileApi();
      
      // Mapping dữ liệu từ BE sang format FE đang dùng
      const mappedData = {
        fullName: data.HoTen,
        email: data.Email,
        phone: data.SoDienThoai || "Chưa cập nhật",
        dob: data.NgaySinh || "1990-01-01",
        gender: data.GioiTinh === "Nam" ? "male" : data.GioiTinh === "Nữ" ? "female" : "other",
        address: data.DiaChi || "Chưa cập nhật",
        avatarColor: "#ab3e40",
        identityCard: data.SoCCCD || "Chưa cập nhật",
        taxCode: data.MaSoThue || "Chưa cập nhật",
        dependents: data.SoNguoiPhuThuoc || 0,
        bankAccount: data.SoTaiKhoan || "Chưa cập nhật",
        bankName: data.TenNganHang || "",
        bankBranch: data.ChiNhanhNganHang || "",
        
        employeeCode: data.MaNhanVien,
        department: data.phongBan?.TenPhong || "Chưa gán",
        position: data.chucVu?.TenChucVu || "Chưa gán",
        startDate: data.NgayVaoLam,
        status: data.TrangThai === "Active" ? "Đang làm" : "Nghỉ việc",
        
        contractType: "Chính thức",
        contractNumber: "HĐ-" + data.MaNhanVien,
        baseSalary: 15000000, 
        contractSignDate: data.NgayVaoLam,
        contractExpiredDate: null,
      };
      
      setProfileData(mappedData);
    } catch (error: any) {
      message.error("Không thể lấy thông tin hồ sơ: " + (error.message || "Lỗi hệ thống"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Spin size="large" description="Đang tải hồ sơ..." />
      </div>
    );
  }

  return <ProfileView data={profileData} isAdmin={true} onRefresh={fetchProfile} />;
}
