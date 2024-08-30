import { Logger, Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class LoggerService extends Logger {
  private logStream: fs.WriteStream;

  constructor(context: string) {
    super(context);
    this.logStream = fs.createWriteStream('application.log', { flags: 'a' }); // Ghi log vào file application.log
  }
  setContext(context: string) {
    this.context = context;
  }

  log(message: string) {
    // Ghi log thông thường
    super.log(message);
    this.writeLogToFile('LOG', message);
  }

  error(message: string, trace?: string) {
    // Ghi log lỗi
    super.error(message, trace);
    this.writeLogToFile('ERROR', `${message} - Trace: ${trace}`);
  }

  warn(message: string) {
    // Ghi log cảnh báo
    super.warn(message);
    this.writeLogToFile('WARN', message);
  }

  debug(message: string) {
    // Ghi log debug
    super.debug(message);
    this.writeLogToFile('DEBUG', message);
  }

  verbose(message: string) {
    // Ghi log chi tiết
    super.verbose(message);
    this.writeLogToFile('VERBOSE', message);
  }

  private writeLogToFile(level: string, message: string) {
    const timestamp = this.getCurrentTimestamp();
    const logMessage = `${timestamp} [${level}] ${message}\n`;
    this.logStream.write(logMessage); // Ghi log vào file
  }

  private getCurrentTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = this.padZero(now.getMonth() + 1); // Tháng bắt đầu từ 0
    const day = this.padZero(now.getDate());
    const hour = this.padZero(now.getHours());
    const minute = this.padZero(now.getMinutes());
    const second = this.padZero(now.getSeconds());
    const millisecond = this.padZero(now.getMilliseconds(), 3);

    return `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`;
  }

  private padZero(value: number, length: number = 2): string {
    return value.toString().padStart(length, '0');
  }
}
