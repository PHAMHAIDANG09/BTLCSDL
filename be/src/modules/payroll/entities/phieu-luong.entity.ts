import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { NhanVien } from '../../auth/entities/nhan-vien.entity';

@Entity('PhieuLuong')
@Unique('UQ_PhieuLuong_KyLuong', ['MaNhanVienId', 'Thang', 'Nam'])
export class PhieuLuong {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  MaNhanVienId: number;

  @Column({ type: 'int' })
  Thang: number;

  @Column({ type: 'int' })
  Nam: number;

  @Column({ type: 'float' })
  SoNgayCongChuan: number;

  @Column({ type: 'float' })
  SoNgayCongThucTe: number;

  @Column({ type: 'float', default: 0 })
  SoNgayNghiHuongLuong: number;

  @Column({ type: 'float', default: 0 })
  SoGioLamThem: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  LuongCoBan: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  PhuCap: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  TienLamThem: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  KhauTruDiMuon: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  BaoHiemXaHoi: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  BaoHiemYTe: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  BaoHiemThatNghiep: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  ThueTNCN: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  CacKhoanKhauTruKhac: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  TongLuongGop: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  LuongThucNhan: number;

  @Column({ type: 'nvarchar', length: 20, default: 'Draft' })
  TrangThai: string;

  @Column({ type: 'datetime', nullable: true })
  NgayThanhToan: Date;

  @CreateDateColumn({ type: 'datetime' })
  NgayTao: Date;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  GhiChu: string;

  @Column({ type: 'int' })
  NguoiTaoId: number;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'MaNhanVienId' })
  nhanVien: NhanVien;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'NguoiTaoId' })
  nguoiTao: NhanVien;
}
