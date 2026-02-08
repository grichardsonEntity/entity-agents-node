/**
 * Denisy Agent - Chief Data Officer
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { denisyConfig } from './config.js';

export class DenisyAgent extends BaseAgent {
  constructor(config = denisyConfig) {
    super(config);
  }

  async researchSources(topic: string): Promise<TaskResult> {
    await this.notifier.notify(`Researching: ${topic}`);
    const prompt = `Research data sources for: ${topic}\n\nFind: APIs, websites, databases. Evaluate quality.`;
    return this.runTask(prompt);
  }

  async buildScraper(url: string, dataSpec: string): Promise<TaskResult> {
    await this.notifier.notify(`Building scraper for: ${url}`);
    const prompt = `Build web scraper for: ${url}\n\nData to extract: ${dataSpec}\n\nInclude: error handling, rate limiting.`;
    return this.runTask(prompt);
  }

  async designSchema(requirements: string): Promise<TaskResult> {
    const prompt = `Design database schema for:\n\n${requirements}\n\nInclude: tables, indexes, migrations.`;
    return this.runTask(prompt);
  }

  async buildETL(source: string, destination: string): Promise<TaskResult> {
    const prompt = `Build ETL pipeline: ${source} -> ${destination}\n\nInclude: extraction, transformation, validation.`;
    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
