/**
 * Logger utility for agents
 */

import * as fs from 'fs';
import * as path from 'path';

export class Logger {
  private agentName: string;
  private logPath: string;

  constructor(agentName: string, logPath: string) {
    this.agentName = agentName;
    this.logPath = logPath.replace('~', process.env.HOME || '');
    this.ensureLogDir();
  }

  private ensureLogDir(): void {
    const dir = path.dirname(this.logPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${this.agentName}: ${message}`;
  }

  private log(level: string, message: string): void {
    const formatted = this.formatMessage(level, message);
    console.log(formatted);

    try {
      fs.appendFileSync(this.logPath, formatted + '\n');
    } catch (error) {
      // Silently fail if log file can't be written
    }
  }

  info(message: string): void {
    this.log('info', message);
  }

  success(message: string): void {
    this.log('success', message);
  }

  warn(message: string): void {
    this.log('warn', message);
  }

  error(message: string): void {
    this.log('error', message);
  }

  debug(message: string): void {
    if (process.env.DEBUG) {
      this.log('debug', message);
    }
  }
}
