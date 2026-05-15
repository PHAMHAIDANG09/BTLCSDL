import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('NgayLe')
export class NgayLe {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'date', unique: true })
  NgayLe: Date;

  @Column({ type: 'nvarchar', length: 100 })
  TenNgayLe: string;

  @Column({ type: 'bit', default: 0 })
  LapLaiHangNam: boolean;
}
