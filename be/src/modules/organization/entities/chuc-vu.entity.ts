import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { NhanVien } from '../../auth/entities/nhan-vien.entity';

@Entity('ChucVu')
export class ChucVu {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'nvarchar', length: 100 })
  TenChucVu: string;

  @Column({ type: 'int', default: 1 })
  CapDo: number;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  MoTa: string;

  @OneToMany(() => NhanVien, (nv) => nv.chucVu)
  nhanViens: NhanVien[];
}
