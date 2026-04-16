import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  DataSource,
} from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { NhatKyHeThong } from './entities/nhat-ky-he-thong.entity';

@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  private readonly logger = new Logger(AuditSubscriber.name);

  constructor(private readonly dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
  }

  afterInsert(event: InsertEvent<any>) {
    this.logAction(event, 'INSERT', null, event.entity);
  }

  afterUpdate(event: UpdateEvent<any>) {
    this.logAction(event, 'UPDATE', event.databaseEntity, event.entity);
  }

  private async logAction(event: any, action: string, oldVal: any, newVal: any) {
    const tableName = event.metadata.tableName;
    if (tableName === 'NhatKyHeThong') return; // Avoid infinite loop

    try {
      const logRepo = event.manager.getRepository(NhatKyHeThong);
      const log = logRepo.create({
        TenBang: tableName,
        MaBanGhi: newVal?.Id || oldVal?.Id || 0,
        HanhDong: action,
        GiaTriCu: oldVal ? JSON.stringify(oldVal) : null,
        GiaTriMoi: newVal ? JSON.stringify(newVal) : null,
        MaNguoiThucHienId: 1, // Default System Admin if not identifiable in subscriber context
        NgayThucHien: new Date(),
      });
      await logRepo.save(log);
    } catch (err) {
      this.logger.error(`Failed to log audit for ${tableName}: ${err.message}`);
    }
  }
}
