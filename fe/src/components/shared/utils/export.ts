import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { message } from "antd";

const fmt = (n: number) => n.toLocaleString("vi-VN") + " đ";

export const exportService = {
  /**
   * Xuất danh sách dữ liệu ra Excel
   */
  exportToExcel: (data: any[], fileName: string, sheetName = "Data") => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, `${fileName}.xlsx`);
      message.success(`Đã xuất dữ liệu ${fileName} thành công`);
    } catch (error: any) {
      message.error("Xuất Excel thất bại: " + error.message);
    }
  },

  /**
   * Xuất phiếu lương cá nhân ra file PDF
   */
  exportPayslipToPDF: (record: any) => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text("PHIEU LUONG NHAN VIEN", 105, 20, { align: "center" });
      doc.setFontSize(12);
      doc.text(`Ky luong: Thang ${record.Thang}/${record.Nam}`, 105, 30, { align: "center" });
      
      // Employee Info
      doc.setFontSize(11);
      doc.text(`Ho ten: ${record.nhanVien?.HoTen || "N/A"}`, 20, 45);
      doc.text(`Ma NV: ${record.nhanVien?.MaNhanVien || "N/A"}`, 20, 52);
      
      // Table data
      const tableData = [
        ["Khoan muc", "So tien"],
        ["Luong co ban", fmt(record.LuongCoBan)],
        ["Phu cap", fmt(record.PhuCap)],
        ["Tien lam them (OT)", fmt(record.TienLamThem)],
        ["Tong luong gop", fmt(record.TongLuongGop)],
        ["BH Xa hoi (8%)", fmt(record.BaoHiemXaHoi)],
        ["BH Y te (1.5%)", fmt(record.BaoHiemYTe)],
        ["BH That nghiep (1%)", fmt(record.BaoHiemThatNghiep)],
        ["Thue TNCN", fmt(record.ThueTNCN)],
        ["Khau tru khac", fmt(record.CacKhoanKhauTruKhac)],
        ["LUONG THUC NHAN", fmt(record.LuongThucNhan)],
      ];

      autoTable(doc, {
        startY: 60,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: "grid",
        headStyles: { fillColor: [29, 78, 216] }, // primary blue
        columnStyles: {
          1: { halign: "right" },
        },
        didParseCell: function (data) {
          if (data.row.index === tableData.length - 2) {
              data.cell.styles.fontStyle = 'bold';
          }
        }
      });

      doc.save(`Phieu_Luong_${record.Thang}_${record.Nam}.pdf`);
      message.success(`Đã xuất dữ liệu phiếu lương Tháng ${record.Thang}/${record.Nam} thành công`);
    } catch (error: any) {
      message.error("Xuất PDF thất bại: " + error.message);
    }
  }
};

export default exportService;
