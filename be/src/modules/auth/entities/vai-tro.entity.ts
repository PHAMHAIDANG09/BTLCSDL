import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { NhanVien } from './nhan-vien.entity';

@Entity('VaiTro')
export class VaiTro {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'nvarchar', length: 50, unique: true })
  TenVaiTro: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  MoTa: string;

  @OneToMany(() => NhanVien, (nv) => nv.vaiTro)
  nhanViens: NhanVien[];
}
