import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { PhongBan } from '../../organization/entities/phong-ban.entity';
import { ChucVu } from '../../organization/entities/chuc-vu.entity';
import { VaiTro } from './vai-tro.entity';

@Entity('NhanVien')
export class NhanVien {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  MaNhanVien: string;

  @Column({ type: 'nvarchar', length: 100 })
  HoTen: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  Email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  MatKhauHash: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  SoDienThoai: string | null;

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  GioiTinh: string | null;

  @Column({ type: 'date', nullable: true })
  NgaySinh: Date | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  SoCCCD: string | null;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  DiaChi: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  MaSoThue: string | null;

  @Column({ type: 'int', default: 0 })
  SoNguoiPhuThuoc: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  SoTaiKhoan: string | null;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  TenNganHang: string | null;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  ChiNhanhNganHang: string | null;

  @Column({ type: 'int', nullable: true })
  @Index('IDX_NhanVien_MaPhong')
  MaPhongId: number | null;

  @Column({ type: 'int', nullable: true })
  MaChucVuId: number | null;

  @Column({ type: 'int' })
  MaVaiTroId: number;

  @Column({ type: 'date' })
  NgayVaoLam: Date;

  @Column({ type: 'date', nullable: true })
  NgayNghiViec: Date | null;

  @Column({ type: 'nvarchar', length: 20, default: 'Active' })
  @Index('IDX_NhanVien_TrangThai')
  TrangThai: string;

  @CreateDateColumn({ type: 'datetime' })
  NgayTao: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  NgayCapNhat: Date | null;

  @ManyToOne(() => PhongBan, (pb) => pb.nhanViens)
  @JoinColumn({ name: 'MaPhongId' })
  phongBan: PhongBan;

  @ManyToOne(() => ChucVu, (cv) => cv.nhanViens)
  @JoinColumn({ name: 'MaChucVuId' })
  chucVu: ChucVu;

  @ManyToOne(() => VaiTro, (vt) => vt.nhanViens)
  @JoinColumn({ name: 'MaVaiTroId' })
  vaiTro: VaiTro;
}
