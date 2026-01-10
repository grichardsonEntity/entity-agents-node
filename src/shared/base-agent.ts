/**
 * Base Agent class for Entity Agents
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import type {
  AgentConfig,
  AgentStatus,
  TaskResult,
  ApprovalRequest,
  CommitResult,
} from './types.js';
import { Logger } from './logger.js';
import { Notifier } from './notifier.js';
import { GitHubClient } from './github.js';
import { GitClient } from './git.js';

const execAsync = promisify(exec);

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected logger: Logger;
  protected notifier: Notifier;
  protected github: GitHubClient;
  protected git: GitClient;
  protected taskHistory: TaskResult[] = [];
  protected pendingApprovals: ApprovalRequest[] = [];

  constructor(config: AgentConfig) {
    this.config = config;
    this.logger = new Logger(
      config.name,
      path.join(config.outputDir, 'logs', 'agent.log')
    );
    this.notifier = new Notifier(config.name, config.notifications);
    this.github = new GitHubClient(config.github);
    this.git = new GitClient(config.projectRoot);
    this.setupDirectories();
  }

  private setupDirectories(): void {
    const dirs = [
      this.config.outputDir,
      path.join(this.config.outputDir, 'logs'),
    ];

    for (const dir of dirs) {
      const fullPath = dir.replace('~', process.env.HOME || '');
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
  }

  get name(): string {
    return this.config.name;
  }

  get role(): string {
    return this.config.role;
  }

  /**
   * Execute a Claude CLI task
   */
  async runTask(prompt: string, timeout: number = 600000): Promise<TaskResult> {
    const startTime = Date.now();
    this.logger.info(`Starting task: ${prompt.substring(0, 50)}...`);
    await this.notifier.notify(`Starting task...`);

    try {
      const { stdout, stderr } = await execAsync(
        `claude --print --system-prompt "${this.config.systemPrompt.replace(/"/g, '\\"')}" "${prompt.replace(/"/g, '\\"')}"`,
        {
          cwd: this.config.projectRoot,
          timeout,
          maxBuffer: 10 * 1024 * 1024, // 10MB
        }
      );

      const taskResult: TaskResult = {
        success: true,
        output: stdout,
        filesChanged: [],
        duration: Date.now() - startTime,
      };

      this.taskHistory.push(taskResult);
      this.logger.success('Task completed successfully');
      await this.notifier.notify('Task completed successfully');
      return taskResult;
    } catch (error: any) {
      const taskResult: TaskResult = {
        success: false,
        output: error.stderr || error.message,
        filesChanged: [],
        duration: Date.now() - startTime,
      };

      this.taskHistory.push(taskResult);
      this.logger.error(`Task failed: ${taskResult.output.substring(0, 100)}`);
      await this.notifier.notify(`Task failed: ${taskResult.output.substring(0, 50)}`, 'error');
      return taskResult;
    }
  }

  /**
   * Request approval for a dangerous operation
   */
  async requestApproval(
    description: string,
    details: string,
    options: string[] = ['Approve', 'Reject', 'Modify']
  ): Promise<ApprovalRequest> {
    const request: ApprovalRequest = {
      taskId: `approval_${Date.now()}`,
      description,
      details,
      options,
      createdAt: new Date(),
    };

    this.pendingApprovals.push(request);

    // Save to file
    const approvalsPath = path.join(this.config.outputDir, 'pending_approvals.json');
    fs.writeFileSync(approvalsPath, JSON.stringify(this.pendingApprovals, null, 2));

    await this.notifier.notify(`Approval needed: ${description}`, 'approval');

    return request;
  }

  /**
   * Commit changes with agent attribution
   */
  async commitChanges(message: string, issueNumber?: number): Promise<CommitResult> {
    const changedFiles = await this.git.diffNames();

    if (changedFiles.length === 0) {
      return { hash: null, files: [] };
    }

    await this.git.add('.');

    let fullMessage = message;
    if (issueNumber) {
      fullMessage += `\n\nFixes #${issueNumber}`;
    }
    fullMessage += `\n\nCo-Authored-By: ${this.config.name} <noreply@entity.com>`;

    const hash = await this.git.commit(fullMessage);
    return { hash, files: changedFiles, message: fullMessage };
  }

  /**
   * Get agent status
   */
  getStatus(): AgentStatus {
    return {
      name: this.config.name,
      role: this.config.role,
      tasksCompleted: this.taskHistory.length,
      tasksSucceeded: this.taskHistory.filter((t) => t.success).length,
      ownedPaths: this.config.ownedPaths,
      isRunning: false,
      pendingApprovals: this.pendingApprovals.length,
    };
  }

  /**
   * Abstract method for agent-specific work
   */
  abstract work(task: string): Promise<TaskResult>;
}
