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
import { HopDong } from '../../employee/entities/hop-dong.entity';

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
  SoDienThoai: string;

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  GioiTinh: string;

  @Column({ type: 'date', nullable: true })
  NgaySinh: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  SoCCCD: string;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  DiaChi: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  MaSoThue: string;

  @Column({ type: 'int', default: 0 })
  SoNguoiPhuThuoc: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  SoTaiKhoan: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  TenNganHang: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  ChiNhanhNganHang: string;

  @Column({ type: 'int', nullable: true })
  @Index('IDX_NhanVien_MaPhong')
  MaPhongId: number;

  @Column({ type: 'int', nullable: true })
  MaChucVuId: number;

  @Column({ type: 'int' })
  MaVaiTroId: number;

  @Column({ type: 'date' })
  NgayVaoLam: Date;

  @Column({ type: 'date', nullable: true })
  NgayNghiViec: Date;

  @Column({ type: 'nvarchar', length: 20, default: 'Active' })
  @Index('IDX_NhanVien_TrangThai')
  TrangThai: string;

  @CreateDateColumn({ type: 'datetime' })
  NgayTao: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  NgayCapNhat: Date;

  @OneToMany(() => HopDong, (hd) => hd.nhanVien)
  hopDongs: HopDong[];

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
