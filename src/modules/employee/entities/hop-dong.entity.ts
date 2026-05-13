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
  SoHopDong: string;

  @Column({ type: 'nvarchar', length: 50 })
  LoaiHopDong: string;

  @Column({ type: 'date' })
  NgayBatDau: Date;

  @Column({ type: 'date', nullable: true })
  NgayKetThuc: Date | null;

  @Column({ type: 'date' })
  NgayKy: Date;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  DuongDanFile: string | null;

  @Column({ type: 'nvarchar', length: 20, default: 'Active' })
  TrangThai: string;

  @CreateDateColumn({ type: 'datetime' })
  NgayTao: Date;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'MaNhanVienId' })
  nhanVien: NhanVien;
}
