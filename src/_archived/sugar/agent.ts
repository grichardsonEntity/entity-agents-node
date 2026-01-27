/**
 * Sugar Agent - Documentation Specialist
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { sugarConfig } from './config.js';

export class SugarAgent extends BaseAgent {
  constructor(config = sugarConfig) {
    super(config);
  }

  async documentFeature(feature: string): Promise<TaskResult> {
    await this.notifier.notify(`Documenting: ${feature}`);
    const prompt = `Document feature: ${feature}\n\nInclude: overview, usage, examples, troubleshooting.`;
    return this.runTask(prompt);
  }

  async documentAPI(endpoint: string): Promise<TaskResult> {
    await this.notifier.notify(`Documenting API: ${endpoint}`);
    const prompt = `Document API endpoint: ${endpoint}\n\nInclude: request/response, examples, errors.`;
    return this.runTask(prompt);
  }

  async createDiagram(subject: string, type: string = 'flow'): Promise<TaskResult> {
    const prompt = `Create ${type} diagram for: ${subject}\n\nUse Mermaid syntax.`;
    return this.runTask(prompt);
  }

  async updateReadme(projectPath: string = '.'): Promise<TaskResult> {
    const prompt = `Update README for project at: ${projectPath}\n\nEnsure: features, setup, usage, examples.`;
    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
