import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { NhanVien } from '../../auth/entities/nhan-vien.entity';

@Entity('LichSuLuong')
@Index('IDX_LichSuLuong_HienTai', ['MaNhanVienId', 'DangHieuLuc'])
export class LichSuLuong {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  MaNhanVienId: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  LuongCoBan: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  PhuCap: number;

  @Column({ type: 'date' })
  NgayBatDau: Date;

  @Column({ type: 'date', nullable: true })
  NgayKetThuc: Date;

  @Column({ type: 'bit', default: 1 })
  DangHieuLuc: boolean;

  @Column({ type: 'int' })
  NguoiThayDoiId: number;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  GhiChu: string;

  @CreateDateColumn({ type: 'datetime' })
  NgayTao: Date;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'MaNhanVienId' })
  nhanVien: NhanVien;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'NguoiThayDoiId' })
  nguoiThayDoi: NhanVien;
}
