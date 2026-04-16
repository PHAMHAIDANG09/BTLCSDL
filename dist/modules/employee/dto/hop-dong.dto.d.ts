export declare class CreateHopDongDto {
    MaNhanVienId: number;
    SoHopDong: string;
    LoaiHopDong: string;
    NgayBatDau: string;
    NgayKetThuc?: string;
    NgayKy: string;
}
export declare class UpdateHopDongDto {
    SoHopDong?: string;
    LoaiHopDong?: string;
    NgayBatDau?: string;
    NgayKetThuc?: string;
    TrangThai?: string;
}
