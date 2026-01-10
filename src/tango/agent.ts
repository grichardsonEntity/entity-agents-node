/**
 * Tango Agent - QA Tester
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { tangoConfig } from './config.js';

export class TangoAgent extends BaseAgent {
  constructor(config = tangoConfig) {
    super(config);
  }

  async writeTests(target: string, testType: string = 'unit'): Promise<TaskResult> {
    await this.notifier.notify(`Writing ${testType} tests for: ${target}`);
    const prompt = `Write ${testType} tests for: ${target}\n\nCover: happy path, edge cases, error cases.`;
    return this.runTask(prompt);
  }

  async runTests(path?: string): Promise<TaskResult> {
    await this.notifier.notify(`Running tests${path ? `: ${path}` : ''}`);
    const prompt = `Run tests${path ? ` for ${path}` : ''}\n\nReport: pass/fail counts, coverage, failed test details.`;
    return this.runTask(prompt);
  }

  async analyzeCoverage(path?: string): Promise<TaskResult> {
    const prompt = `Analyze test coverage${path ? ` for ${path}` : ''}\n\nIdentify: gaps, uncovered lines, priority tests needed.`;
    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
