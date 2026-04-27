import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { NhanVien } from '../../auth/entities/nhan-vien.entity';

@Entity('PhongBan')
export class PhongBan {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'nvarchar', length: 100 })
  TenPhong: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  MaPhong: string;

  @Column({ type: 'int', nullable: true })
  @Index('IDX_PhongBan_MaPhongCha')
  MaPhongCha: number;

  @Column({ type: 'int', nullable: true })
  MaQuanLy: number;

  @Column({ type: 'bit', default: 1 })
  DangHoatDong: boolean;

  @CreateDateColumn({ type: 'datetime' })
  NgayTao: Date;

  @ManyToOne(() => PhongBan, (pb) => pb.subDepartments)
  @JoinColumn({ name: 'MaPhongCha' })
  parentDepartment: PhongBan;

  @OneToMany(() => PhongBan, (pb) => pb.parentDepartment)
  subDepartments: PhongBan[];

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'MaQuanLy' })
  manager: NhanVien;

  @OneToMany(() => NhanVien, (nv) => nv.phongBan)
  nhanViens: NhanVien[];
}
