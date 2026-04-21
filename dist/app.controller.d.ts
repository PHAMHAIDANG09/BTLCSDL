import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getStatus(): Promise<{
        message: string;
        database: {
            type: string;
            host: string;
            port: number;
            database: string;
            synchronize: boolean;
        };
        redis: {
            connected: boolean;
        } | {
            connected: boolean;
            message: string;
        };
        controlApi: {
            connected: boolean;
            baseUrl: string;
            statusCode: number;
            message?: undefined;
        } | {
            connected: boolean;
            baseUrl: string;
            message: string;
            statusCode?: undefined;
        };
    }>;
}
