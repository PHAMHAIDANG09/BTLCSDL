import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, LessThan, MoreThanOrEqual, Repository, DataSource } from 'typeorm';
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
    private dataSource: DataSource,
  ) {}

  private formatDate(value?: Date | string | null) {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return date.toISOString().split('T')[0];
  }

  async getChartStats() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentPeriodFilter = `
      (Nam < ${currentYear} OR (Nam = ${currentYear} AND Thang <= ${currentMonth}))
    `;
    // 1. Quỹ lương (vw_BangLuongTongHop)
    const quyLuong = await this.dataSource.query(`
      SELECT TOP 6 Nam, Thang, 
             CAST(SUM(LuongCoBan) AS FLOAT) as TongLuongCoBan, 
             CAST(SUM(TienLamThem) AS FLOAT) as TongTienLamThem, 
             CAST(SUM(LuongThucNhan) AS FLOAT) as TongThucNhan
      FROM dbo.vw_BangLuongTongHop
      WHERE ${currentPeriodFilter}
      GROUP BY Nam, Thang
      ORDER BY Nam DESC, Thang DESC
    `);

    // 2. Chấm công đi muộn (vw_ChamCongThang)
    const diMuon = await this.dataSource.query(`
      SELECT TOP 6 Nam, Thang, 
             CAST(SUM(SoNgayCoMat) AS FLOAT) as TongNgayCoMat, 
             CAST(SUM(SoNgayDiMuon) AS FLOAT) as TongNgayDiMuon
      FROM dbo.vw_ChamCongThang
      WHERE ${currentPeriodFilter}
      GROUP BY Nam, Thang
      ORDER BY Nam DESC, Thang DESC
    `);

    // 3. Tuyển mới (NhanVien - SoTuyenMoi)
    const bienDong = await this.dataSource.query(`
      SELECT TOP 6 
             YEAR(NgayVaoLam) as Nam, 
             MONTH(NgayVaoLam) as Thang,
             COUNT(*) as SoTuyenMoi
      FROM dbo.NhanVien
      WHERE (
        YEAR(NgayVaoLam) < ${currentYear}
        OR (YEAR(NgayVaoLam) = ${currentYear} AND MONTH(NgayVaoLam) <= ${currentMonth})
      )
      GROUP BY YEAR(NgayVaoLam), MONTH(NgayVaoLam)
      ORDER BY YEAR(NgayVaoLam) DESC, MONTH(NgayVaoLam) DESC
    `);

    // 4. Nghỉ việc (NhanVien - SoNghiViec)
    const nghiViec = await this.dataSource.query(`
      SELECT TOP 6 
             YEAR(NgayNghiViec) as Nam, 
             MONTH(NgayNghiViec) as Thang,
             COUNT(*) as SoNghiViec
      FROM dbo.NhanVien
      WHERE NgayNghiViec IS NOT NULL
        AND (
          YEAR(NgayNghiViec) < ${currentYear}
          OR (YEAR(NgayNghiViec) = ${currentYear} AND MONTH(NgayNghiViec) <= ${currentMonth})
        )
      GROUP BY YEAR(NgayNghiViec), MONTH(NgayNghiViec)
      ORDER BY YEAR(NgayNghiViec) DESC, MONTH(NgayNghiViec) DESC
    `);

    return {
      quyLuong: quyLuong.reverse(),
      diMuon: diMuon.reverse(),
      bienDong: bienDong.reverse(),
      nghiViec: nghiViec.reverse(),
    };
  }

  private formatTime(value?: Date | string | null) {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleTimeString('vi-VN', { hour12: false });
  }

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

    const startDate = new Date(nam, thang - 1, 1);
    const endDate = new Date(nam, thang, 1);

    const data = await this.chamCongRepository.find({
      where: {
        NgayLamViec: And(MoreThanOrEqual(startDate), LessThan(endDate)),
      },
      relations: ['nhanVien'],
    });
    
    data.forEach((item) => {
      worksheet.addRow({
        maNv: item.nhanVien?.MaNhanVien,
        hoTen: item.nhanVien?.HoTen,
        ngay: this.formatDate(item.NgayLamViec),
        gioVao: this.formatTime(item.GioVao),
        gioRa: this.formatTime(item.GioRa),
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
