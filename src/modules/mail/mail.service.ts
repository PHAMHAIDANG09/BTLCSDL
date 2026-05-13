import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  /**
   * Gửi email thông báo phiếu lương
   * @param data { email, name, month, year, netSalary }
   */
  async sendPayrollEmail(data: {
    email: string;
    name: string;
    month: number;
    year: number;
    basicSalary: number;
    allowance: number;
    netSalary: number;
  }) {
    try {
      const formatCurrency = (value: number) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value);

      await this.mailerService.sendMail({
        to: data.email,
        subject: `[NextHR] Phiếu lương tháng ${data.month}/${data.year} - ${data.name}`,
        template: './payroll',
        context: {
          name: data.name,
          month: data.month,
          year: data.year,
          basicSalary: formatCurrency(data.basicSalary),
          allowance: formatCurrency(data.allowance),
          netSalary: formatCurrency(data.netSalary),
        },
      });


      this.logger.log(`Email phiếu lương đã gửi tới: ${data.email}`);
    } catch (error) {
      this.logger.error(`Lỗi khi gửi email tới ${data.email}: ${error.message}`);
      throw error;
    }
  }
}
