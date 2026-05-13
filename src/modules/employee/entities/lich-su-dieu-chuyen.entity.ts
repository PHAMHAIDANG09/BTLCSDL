import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NhanVien } from '../../auth/entities/nhan-vien.entity';
import { PhongBan } from '../../organization/entities/phong-ban.entity';
import { ChucVu } from '../../organization/entities/chuc-vu.entity';

@Entity('LichSuDieuChuyen')
export class LichSuDieuChuyen {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  MaNhanVienId: number;

  @Column({ type: 'int', nullable: true })
  PhongBanCuId: number | null;

  @Column({ type: 'int' })
  PhongBanMoiId: number;

  @Column({ type: 'int', nullable: true })
  ChucVuCuId: number | null;

  @Column({ type: 'int' })
  ChucVuMoiId: number;

  @Column({ type: 'date' })
  NgayHieuLuc: Date;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  LyDo: string | null;

  @Column({ type: 'int' })
  NguoiDuyetId: number;

  @CreateDateColumn({ type: 'datetime' })
  NgayTao: Date;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'MaNhanVienId' })
  nhanVien: NhanVien;

  @ManyToOne(() => PhongBan)
  @JoinColumn({ name: 'PhongBanCuId' })
  phongBanCu: PhongBan;

  @ManyToOne(() => PhongBan)
  @JoinColumn({ name: 'PhongBanMoiId' })
  phongBanMoi: PhongBan;

  @ManyToOne(() => ChucVu)
  @JoinColumn({ name: 'ChucVuCuId' })
  chucVuCu: ChucVu;

  @ManyToOne(() => ChucVu)
  @JoinColumn({ name: 'ChucVuMoiId' })
  chucVuMoi: ChucVu;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'NguoiDuyetId' })
  nguoiDuyet: NhanVien;
}
