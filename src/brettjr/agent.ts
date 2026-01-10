/**
 * Brett Jr Agent - Cybersecurity Specialist
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { brettjrConfig } from './config.js';

export class BrettJrAgent extends BaseAgent {
  constructor(config = brettjrConfig) {
    super(config);
  }

  async securityAudit(target: string): Promise<TaskResult> {
    await this.notifier.notify(`Security audit: ${target}`);
    const prompt = `Perform security audit on: ${target}\n\nCheck OWASP Top 10, secrets, injection vulnerabilities.`;
    return this.runTask(prompt);
  }

  async reviewAuth(codePath: string): Promise<TaskResult> {
    await this.notifier.notify(`Reviewing auth: ${codePath}`);
    const prompt = `Review authentication at: ${codePath}\n\nVerify: password storage, tokens, sessions, MFA.`;
    return this.runTask(prompt);
  }

  async checkSecrets(directory: string = '.'): Promise<TaskResult> {
    await this.notifier.notify(`Scanning for secrets in: ${directory}`);
    const prompt = `Scan for exposed secrets in: ${directory}\n\nSearch for: API keys, passwords, private keys.`;
    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
