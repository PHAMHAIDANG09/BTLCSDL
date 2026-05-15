import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { ChamCong } from '../attendance/entities/cham-cong.entity';
import { PhieuLuong } from '../payroll/entities/phieu-luong.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ChamCong)
    private chamCongRepository: Repository<ChamCong>,
    @InjectRepository(PhieuLuong)
    private phieuLuongRepository: Repository<PhieuLuong>,
  ) {}

  async exportAttendance(thang: number, nam: number) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bang Cong');

    worksheet.columns = [
      { header: 'Mã NV', key: 'maNv', width: 15 },
      { header: 'Họ Tên', key: 'hoTen', width: 25 },
      { header: 'Ngày', key: 'ngay', width: 15 },
      { header: 'Giờ Vào', key: 'gioVao', width: 15 },
      { header: 'Giờ Ra', key: 'gioRa', width: 15 },
      { header: 'Phút Muộn', key: 'muon', width: 10 },
      { header: 'Trạng Thái', key: 'trangThai', width: 15 },
    ];

    const data = await this.chamCongRepository.find({
      relations: ['nhanVien'],
    });
    // Filter by thang/nam (simplified)

    data.forEach((item) => {
      worksheet.addRow({
        maNv: item.nhanVien?.MaNhanVien,
        hoTen: item.nhanVien?.HoTen,
        ngay: item.NgayLamViec.toISOString().split('T')[0],
        gioVao: item.GioVao?.toLocaleTimeString(),
        gioRa: item.GioRa?.toLocaleTimeString(),
        muon: item.SoPhutDiMuon,
        trangThai: item.TrangThai,
      });
    });

    // Formatting
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' },
    };

    const buffer = await workbook.xlsx.writeBuffer();
    return new StreamableFile(Buffer.from(buffer));
  }

  async exportPayroll(thang: number, nam: number) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Bang Luong T${thang}`);

    worksheet.columns = [
      { header: 'Họ Tên', key: 'hoTen', width: 25 },
      { header: 'Lương Cơ Bản', key: 'lcb', width: 15 },
      { header: 'Phụ Cấp', key: 'pc', width: 15 },
      { header: 'Làm Thêm', key: 'ot', width: 15 },
      { header: 'Bảo Hiểm', key: 'bh', width: 15 },
      { header: 'Thuế TNCN', key: 'thue', width: 15 },
      { header: 'Thực Nhận', key: 'net', width: 20 },
    ];

    const payslips = await this.phieuLuongRepository.find({
      where: { Thang: thang, Nam: nam },
      relations: ['nhanVien'],
    });

    payslips.forEach((p) => {
      worksheet.addRow({
        hoTen: p.nhanVien?.HoTen,
        lcb: p.LuongCoBan,
        pc: p.PhuCap,
        ot: p.TienLamThem,
        bh:
          Number(p.BaoHiemXaHoi) +
          Number(p.BaoHiemYTe) +
          Number(p.BaoHiemThatNghiep),
        thue: p.ThueTNCN,
        net: p.LuongThucNhan,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new StreamableFile(Buffer.from(buffer));
  }
}
