import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NhanVien } from '../../auth/entities/nhan-vien.entity';

@Entity('DonLamThem')
export class DonLamThem {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  MaNhanVienId: number;

  @Column({ type: 'date' })
  NgayLamThem: Date;

  @Column({ type: 'time' })
  GioBatDau: string;

  @Column({ type: 'time' })
  GioKetThuc: string;

  @Column({ type: 'float' })
  TongSoGio: number;

  @Column({ type: 'nvarchar', length: 20, default: 'NgayThuong' })
  LoaiOT: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 1.5 })
  HeSoOT: number;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  LyDo: string;

  @Column({ type: 'nvarchar', length: 20, default: 'Pending' })
  TrangThai: string;

  @Column({ type: 'int', nullable: true })
  NguoiDuyetId: number;

  @CreateDateColumn({ type: 'datetime' })
  NgayTao: Date;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'MaNhanVienId' })
  nhanVien: NhanVien;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'NguoiDuyetId' })
  nguoiDuyet: NhanVien;
}
