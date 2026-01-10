/**
 * Notification system for agents
 */

import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import type { NotificationConfig } from './types.js';

export class Notifier {
  private agentName: string;
  private config: NotificationConfig;

  constructor(agentName: string, config: NotificationConfig) {
    this.agentName = agentName;
    this.config = config;
  }

  async notify(message: string, level: string = 'info'): Promise<void> {
    const promises: Promise<void>[] = [];

    if (this.config.fileEnabled) {
      promises.push(this.notifyFile(message, level));
    }

    if (this.config.macosEnabled) {
      promises.push(this.notifyMacOS(message));
    }

    if (this.config.smsEnabled && this.config.smsPhone) {
      promises.push(this.notifySMS(message));
    }

    await Promise.allSettled(promises);
  }

  private async notifyFile(message: string, level: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level.toUpperCase()}] ${this.agentName}: ${message}\n`;
    const logPath = this.config.filePath.replace('~', process.env.HOME || '');

    const dir = path.dirname(logPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.appendFileSync(logPath, formatted);
  }

  private async notifyMacOS(message: string): Promise<void> {
    return new Promise((resolve) => {
      const escapedMessage = message.replace(/"/g, '\\"');
      const script = `display notification "${escapedMessage}" with title "${this.agentName}"`;

      exec(`osascript -e '${script}'`, (error) => {
        if (error) {
          console.warn(`macOS notification failed: ${error.message}`);
        }
        resolve();
      });
    });
  }

  private async notifySMS(message: string): Promise<void> {
    if (!this.config.smsPhone) return;

    return new Promise((resolve) => {
      const phone = this.config.smsPhone;
      const smsMessage = `${this.agentName}: ${message}`;
      const escapedMessage = smsMessage.replace(/"/g, '\\"');

      const script = `
tell application "Messages"
    set targetService to 1st account whose service type = iMessage
    set targetBuddy to participant "${phone}" of targetService
    send "${escapedMessage}" to targetBuddy
end tell`;

      exec(`osascript -e '${script}'`, (error) => {
        if (error) {
          console.warn(`SMS notification failed: ${error.message}`);
        }
        resolve();
      });
    });
  }
}
