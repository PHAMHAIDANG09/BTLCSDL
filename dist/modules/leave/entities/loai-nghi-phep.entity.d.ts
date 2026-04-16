import { SoDuPhep } from './so-du-phep.entity';
import { DonNghiPhep } from './don-nghi-phep.entity';
export declare class LoaiNghiPhep {
    Id: number;
    TenLoaiPhep: string;
    CoHuongLuong: boolean;
    SoNgayToiDaNam: number;
    MoTa: string;
    soDuPheps: SoDuPhep[];
    donNghiPheps: DonNghiPhep[];
}
