import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { NhanVien } from '../../auth/entities/nhan-vien.entity';

@Entity('ChamCong')
@Unique('UQ_ChamCong_NhanVienNgay', ['MaNhanVienId', 'NgayLamViec'])
export class ChamCong {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  MaNhanVienId: number;

  @Column({ type: 'date' })
  NgayLamViec: Date;

  @Column({ type: 'datetime', nullable: true })
  GioVao: Date;

  @Column({ type: 'datetime', nullable: true })
  GioRa: Date;

  @Column({ type: 'float', nullable: true })
  SoGioLam: number;

  @Column({ type: 'int', default: 0 })
  SoPhutDiMuon: number;

  @Column({ type: 'nvarchar', length: 20 })
  TrangThai: string;

  @Column({ type: 'nvarchar', length: 20, default: 'Manual' })
  NguonChamCong: string;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'MaNhanVienId' })
  nhanVien: NhanVien;
}
