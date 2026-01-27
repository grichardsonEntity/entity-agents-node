/**
 * Valentina Agent - Senior UI Developer
 */

import { BaseAgent, type TaskResult, type GitHubIssue } from '../shared/index.js';
import { valentinaConfig } from './config.js';

export class ValentinaAgent extends BaseAgent {
  constructor(config = valentinaConfig) {
    super(config);
  }

  async getAssignedBugs(): Promise<GitHubIssue[]> {
    const allIssues = await this.github.getIssues(['bug'], 'open');

    return allIssues.filter((issue) => {
      const hasUILabel = issue.labels.some((l) =>
        ['frontend', 'ui', 'css', 'react', 'component'].includes(l.toLowerCase())
      );

      const bodyLower = issue.body.toLowerCase();
      const mentionsUI = ['component', 'display', 'render', 'style', 'css', 'layout', 'responsive'].some((kw) =>
        bodyLower.includes(kw)
      );

      return hasUILabel || mentionsUI;
    });
  }

  async fixBug(issueNumber: number): Promise<TaskResult> {
    const issue = await this.github.getIssue(issueNumber);

    if (!issue) {
      return { success: false, output: `Issue #${issueNumber} not found`, filesChanged: [] };
    }

    await this.notifier.notify(`Working on: ${issue.title}`);
    await this.github.addLabel(issueNumber, 'in-progress');

    const prompt = `
Fix this UI bug:

**Issue #${issue.number}:** ${issue.title}

**Description:**
${issue.body}

**Instructions:**
1. Read the relevant components and styles
2. Identify the root cause
3. Implement minimal fix
4. Ensure accessibility is maintained
5. DO NOT add unnecessary changes
`;

    const result = await this.runTask(prompt);

    if (result.success) {
      const commit = await this.commitChanges(`fix(ui): ${issue.title.substring(0, 50)}`, issueNumber);
      result.commitHash = commit.hash || undefined;
      result.filesChanged = commit.files;

      await this.github.addComment(issueNumber, `## Fix Applied\n\nValentina has implemented a fix.\n\n**Commit:** ${commit.hash || 'See git log'}`);
    }

    return result;
  }

  async createComponent(name: string, description: string): Promise<TaskResult> {
    await this.notifier.notify(`Creating component: ${name}`);

    const prompt = `
Create a new React component:

**Component Name:** ${name}
**Description:** ${description}

**Requirements:**
1. Create in src/components/${name}/
2. Include:
   - ${name}.tsx - Main component
   - ${name}.module.css - Styles
   - index.ts - Export
3. TypeScript with proper types
4. Accessible (ARIA, keyboard)
5. CSS Modules for styling
`;

    return this.runTask(prompt);
  }

  async improveAccessibility(componentPath: string): Promise<TaskResult> {
    const prompt = `
Improve accessibility of component: ${componentPath}

**Check and fix:**
1. ARIA labels on interactive elements
2. Keyboard navigation (Tab, Enter, Escape)
3. Focus management
4. Color contrast
5. Screen reader compatibility
`;

    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
