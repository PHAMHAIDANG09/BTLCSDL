import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NhanVien } from '../../auth/entities/nhan-vien.entity';

@Entity('NhatKyHeThong')
export class NhatKyHeThong {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 100 })
  TenBang: string;

  @Column({ type: 'int' })
  MaBanGhi: number;

  @Column({ type: 'nvarchar', length: 20 })
  HanhDong: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  GiaTriCu: string | null;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  GiaTriMoi: string | null;

  @Column({ type: 'int' })
  MaNguoiThucHienId: number;

  @CreateDateColumn({ type: 'datetime' })
  NgayThucHien: Date;

  @ManyToOne(() => NhanVien)
  @JoinColumn({ name: 'MaNguoiThucHienId' })
  nguoiThucHien: NhanVien;
}
