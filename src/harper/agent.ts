/**
 * Harper Agent - Grant Researcher & Writer
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { harperConfig } from './config.js';

export class HarperAgent extends BaseAgent {
  constructor(config = harperConfig) {
    super(config);
  }

  async researchFunding(projectType: string): Promise<TaskResult> {
    await this.notifier.notify(`Researching funding for: ${projectType}`);
    const prompt = `Research funding for: ${projectType}\n\nSearch: federal, foundation, corporate. Evaluate fit.`;
    return this.runTask(prompt);
  }

  async writeNeedsStatement(problem: string, population: string): Promise<TaskResult> {
    const prompt = `Write needs statement:\n\nProblem: ${problem}\nPopulation: ${population}\n\nInclude: evidence, impact, urgency.`;
    return this.runTask(prompt);
  }

  async createBudget(project: string, amount: number): Promise<TaskResult> {
    const prompt = `Create grant budget:\n\nProject: ${project}\nAmount: $${amount.toLocaleString()}\n\nInclude: personnel, fringe, travel, equipment.`;
    return this.runTask(prompt);
  }

  async evaluateOpportunity(name: string): Promise<TaskResult> {
    const prompt = `Evaluate funding opportunity: ${name}\n\nProvide: eligibility, fit score, go/no-go recommendation.`;
    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
