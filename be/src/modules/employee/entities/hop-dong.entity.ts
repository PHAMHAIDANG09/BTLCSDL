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

@Entity('HopDong')
export class HopDong {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  @Index('IDX_HopDong_NhanVien')
  MaNhanVienId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  MaHopDong: string;

  @Column({ type: 'nvarchar', length: 50 })
  LoaiHopDong: string;

  @Column({ type: 'date' })
  NgayBatDau: Date;

  @Column({ type: 'date', nullable: true })
  NgayKetThuc: Date;

  @Column({ type: 'date' })
  NgayKy: Date;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  DuongDanFile: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  LuongCoBan: number;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  GhiChu: string;

  @Column({ type: 'nvarchar', length: 20, default: 'Active' })
  TrangThai: string;

  @CreateDateColumn({ type: 'datetime' })
  NgayTao: Date;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'MaNhanVienId' })
  nhanVien: NhanVien;
}
