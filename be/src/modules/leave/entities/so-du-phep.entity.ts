import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { NhanVien } from '../../auth/entities/nhan-vien.entity';
import { LoaiNghiPhep } from './loai-nghi-phep.entity';

@Entity('SoDuPhep')
export class SoDuPhep {
  @PrimaryColumn({ type: 'int' })
  MaNhanVienId: number;

  @PrimaryColumn({ type: 'int' })
  MaLoaiPhepId: number;

  @PrimaryColumn({ type: 'int' })
  Nam: number;

  @Column({ type: 'int', default: 12 })
  TongNgayPhep: number;

  @Column({ type: 'int', default: 0 })
  DaSuDung: number;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'MaNhanVienId' })
  nhanVien: NhanVien;

  @ManyToOne(() => LoaiNghiPhep, (lnp) => lnp.soDuPheps)
  @JoinColumn({ name: 'MaLoaiPhepId' })
  loaiNghiPhep: LoaiNghiPhep;
}
