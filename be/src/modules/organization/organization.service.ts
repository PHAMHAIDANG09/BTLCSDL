import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhongBan } from './entities/phong-ban.entity';
import { ChucVu } from './entities/chuc-vu.entity';
import { CreatePhongBanDto, UpdatePhongBanDto } from './dto/phong-ban.dto';
import { CreateChucVuDto, UpdateChucVuDto } from './dto/chuc-vu.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(PhongBan)
    private phongBanRepository: Repository<PhongBan>,
    @InjectRepository(ChucVu)
    private chucVuRepository: Repository<ChucVu>,
  ) {}

  async createPhongBan(dto: CreatePhongBanDto) {
    const pb = this.phongBanRepository.create(dto);
    return this.phongBanRepository.save(pb);
  }

  async findAllPhongBan() {
    return this.phongBanRepository.find({ relations: ['manager'] });
  }

  async findOnePhongBan(id: number) {
    const pb = await this.phongBanRepository.findOne({
      where: { Id: id },
      relations: ['manager', 'parentDepartment'],
    });
    if (!pb) throw new NotFoundException('Phong ban not found');
    return pb;
  }

  async updatePhongBan(id: number, dto: UpdatePhongBanDto) {
    const pb = await this.findOnePhongBan(id);
    Object.assign(pb, dto);
    return this.phongBanRepository.save(pb);
  }

  async deletePhongBan(id: number) {
    const pb = await this.findOnePhongBan(id);
    return this.phongBanRepository.remove(pb);
  }

  // --- Chuc Vu APIs ---
  async createChucVu(dto: CreateChucVuDto) {
    const cv = this.chucVuRepository.create(dto);
    return this.chucVuRepository.save(cv);
  }

  async findAllChucVu() {
    return this.chucVuRepository.find();
  }

  async findOneChucVu(id: number) {
    const cv = await this.chucVuRepository.findOne({ where: { Id: id } });
    if (!cv) throw new NotFoundException('Chuc vu not found');
    return cv;
  }

  async updateChucVu(id: number, dto: UpdateChucVuDto) {
    const cv = await this.findOneChucVu(id);
    Object.assign(cv, dto);
    return this.chucVuRepository.save(cv);
  }

  async deleteChucVu(id: number) {
    const cv = await this.findOneChucVu(id);
    return this.chucVuRepository.remove(cv);
  }

  // API Nghiệp vụ khó: Sơ đồ tổ chức đa cấp
  async getDepartmentTree() {
    const allDepts = await this.phongBanRepository.find();
    return this.buildTree(allDepts, null);
  }

  private buildTree(departments: PhongBan[], parentId: number | null): any[] {
    return departments
      .filter((dept) => dept.MaPhongCha === parentId)
      .map((dept) => ({
        ...dept,
        children: this.buildTree(departments, dept.Id),
      }));
  }
}
