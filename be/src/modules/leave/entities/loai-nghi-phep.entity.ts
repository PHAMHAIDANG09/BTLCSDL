import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { SoDuPhep } from './so-du-phep.entity';
import { DonNghiPhep } from './don-nghi-phep.entity';

@Entity('LoaiNghiPhep')
export class LoaiNghiPhep {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'nvarchar', length: 50, unique: true })
  TenLoaiPhep: string;

  @Column({ type: 'bit', default: 1 })
  CoHuongLuong: boolean;

  @Column({ type: 'int', default: 12 })
  SoNgayToiDaNam: number;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  MoTa: string;

  @OneToMany(() => SoDuPhep, (sdp) => sdp.loaiNghiPhep)
  soDuPheps: SoDuPhep[];

  @OneToMany(() => DonNghiPhep, (dnp) => dnp.loaiNghiPhep)
  donNghiPheps: DonNghiPhep[];
}
