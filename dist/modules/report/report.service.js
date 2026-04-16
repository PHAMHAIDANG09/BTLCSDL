"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ExcelJS = __importStar(require("exceljs"));
const cham_cong_entity_1 = require("../attendance/entities/cham-cong.entity");
const phieu_luong_entity_1 = require("../payroll/entities/phieu-luong.entity");
let ReportService = class ReportService {
    chamCongRepository;
    phieuLuongRepository;
    constructor(chamCongRepository, phieuLuongRepository) {
        this.chamCongRepository = chamCongRepository;
        this.phieuLuongRepository = phieuLuongRepository;
    }
    async exportAttendance(thang, nam) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bang Cong');
        worksheet.columns = [
            { header: 'Mã NV', key: 'maNv', width: 15 },
            { header: 'Họ Tên', key: 'hoTen', width: 25 },
            { header: 'Ngày', key: 'ngay', width: 15 },
            { header: 'Giờ Vào', key: 'gioVao', width: 15 },
            { header: 'Giờ Ra', key: 'gioRa', width: 15 },
            { header: 'Phút Muộn', key: 'muon', width: 10 },
            { header: 'Trạng Thái', key: 'trangThai', width: 15 },
        ];
        const data = await this.chamCongRepository.find({
            relations: ['nhanVien'],
        });
        data.forEach((item) => {
            worksheet.addRow({
                maNv: item.nhanVien?.MaNhanVien,
                hoTen: item.nhanVien?.HoTen,
                ngay: item.NgayLamViec.toISOString().split('T')[0],
                gioVao: item.GioVao?.toLocaleTimeString(),
                gioRa: item.GioRa?.toLocaleTimeString(),
                muon: item.SoPhutDiMuon,
                trangThai: item.TrangThai,
            });
        });
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD3D3D3' },
        };
        const buffer = await workbook.xlsx.writeBuffer();
        return new common_1.StreamableFile(Buffer.from(buffer));
    }
    async exportPayroll(thang, nam) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Bang Luong T${thang}`);
        worksheet.columns = [
            { header: 'Họ Tên', key: 'hoTen', width: 25 },
            { header: 'Lương Cơ Bản', key: 'lcb', width: 15 },
            { header: 'Phụ Cấp', key: 'pc', width: 15 },
            { header: 'Làm Thêm', key: 'ot', width: 15 },
            { header: 'Bảo Hiểm', key: 'bh', width: 15 },
            { header: 'Thuế TNCN', key: 'thue', width: 15 },
            { header: 'Thực Nhận', key: 'net', width: 20 },
        ];
        const payslips = await this.phieuLuongRepository.find({
            where: { Thang: thang, Nam: nam },
            relations: ['nhanVien'],
        });
        payslips.forEach((p) => {
            worksheet.addRow({
                hoTen: p.nhanVien?.HoTen,
                lcb: p.LuongCoBan,
                pc: p.PhuCap,
                ot: p.TienLamThem,
                bh: Number(p.BaoHiemXaHoi) + Number(p.BaoHiemYTe) + Number(p.BaoHiemThatNghiep),
                thue: p.ThueTNCN,
                net: p.LuongThucNhan,
            });
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return new common_1.StreamableFile(Buffer.from(buffer));
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cham_cong_entity_1.ChamCong)),
    __param(1, (0, typeorm_1.InjectRepository)(phieu_luong_entity_1.PhieuLuong)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReportService);
//# sourceMappingURL=report.service.js.map