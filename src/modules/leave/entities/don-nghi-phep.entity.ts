import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NhanVien } from '../../auth/entities/nhan-vien.entity';
import { LoaiNghiPhep } from './loai-nghi-phep.entity';

@Entity('DonNghiPhep')
export class DonNghiPhep {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  MaNhanVienId: number;

  @Column({ type: 'int' })
  MaLoaiPhepId: number;

  @Column({ type: 'date' })
  NgayBatDau: Date;

  @Column({ type: 'date' })
  NgayKetThuc: Date;

  @Column({ type: 'float' })
  TongSoNgay: number;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  LyDo: string;

  @Column({ type: 'nvarchar', length: 20, default: 'Pending' })
  TrangThai: string;

  @Column({ type: 'int', nullable: true })
  NguoiDuyetId: number;

  @Column({ type: 'datetime', nullable: true })
  NgayDuyet: Date;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  LyDoTuChoi: string;

  @CreateDateColumn({ type: 'datetime' })
  NgayTao: Date;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'MaNhanVienId' })
  nhanVien: NhanVien;

  @ManyToOne(() => LoaiNghiPhep, (lnp) => lnp.donNghiPheps)
  @JoinColumn({ name: 'MaLoaiPhepId' })
  loaiNghiPhep: LoaiNghiPhep;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'NguoiDuyetId' })
  nguoiDuyet: NhanVien;
}
