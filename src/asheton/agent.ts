/**
 * Asheton Agent - Product Strategist
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { ashetonConfig } from './config.js';

export class AshetonAgent extends BaseAgent {
  constructor(config = ashetonConfig) {
    super(config);
  }

  async evaluateFeature(feature: string): Promise<TaskResult> {
    await this.notifier.notify(`Evaluating: ${feature}`);
    const prompt = `Evaluate feature: ${feature}\n\nProvide: user story, acceptance criteria, priority, effort.`;
    return this.runTask(prompt);
  }

  async prioritizeBacklog(items: string[]): Promise<TaskResult> {
    const itemList = items.join('\n- ');
    const prompt = `Prioritize backlog items:\n- ${itemList}\n\nProvide: priority matrix, recommended order.`;
    return this.runTask(prompt);
  }

  async createRoadmap(timeframe: string, goals: string): Promise<TaskResult> {
    const prompt = `Create roadmap for: ${timeframe}\n\nGoals: ${goals}\n\nProvide: phases, features, metrics.`;
    return this.runTask(prompt);
  }

  async writeUserStories(feature: string): Promise<TaskResult> {
    const prompt = `Write user stories for: ${feature}\n\nFormat: As a [user], I want [goal], so that [benefit].`;
    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
