import { EntitySubscriberInterface, InsertEvent, UpdateEvent, DataSource } from 'typeorm';
export declare class AuditSubscriber implements EntitySubscriberInterface {
    private readonly dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    afterInsert(event: InsertEvent<any>): void;
    afterUpdate(event: UpdateEvent<any>): void;
    private logAction;
}
