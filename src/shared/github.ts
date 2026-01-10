/**
 * GitHub API client using gh CLI
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import type { GitHubConfig, GitHubIssue } from './types.js';

const execAsync = promisify(exec);

export class GitHubClient {
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  private get repoArg(): string {
    if (this.config.repo && this.config.owner) {
      return `-R ${this.config.owner}/${this.config.repo}`;
    }
    return '';
  }

  async getIssues(labels: string[] = [], state: string = 'open'): Promise<GitHubIssue[]> {
    try {
      const labelArg = labels.length > 0 ? `--label "${labels.join(',')}"` : '';
      const { stdout } = await execAsync(
        `gh issue list ${this.repoArg} --state ${state} ${labelArg} --json number,title,body,labels,state,assignees`
      );

      const issues = JSON.parse(stdout);
      return issues.map((issue: any) => ({
        number: issue.number,
        title: issue.title,
        body: issue.body || '',
        labels: issue.labels.map((l: any) => l.name),
        state: issue.state,
        assignees: issue.assignees.map((a: any) => a.login),
      }));
    } catch (error) {
      console.warn(`Failed to get issues: ${error}`);
      return [];
    }
  }

  async getIssue(number: number): Promise<GitHubIssue | null> {
    try {
      const { stdout } = await execAsync(
        `gh issue view ${number} ${this.repoArg} --json number,title,body,labels,state,assignees`
      );

      const issue = JSON.parse(stdout);
      return {
        number: issue.number,
        title: issue.title,
        body: issue.body || '',
        labels: issue.labels.map((l: any) => l.name),
        state: issue.state,
        assignees: issue.assignees.map((a: any) => a.login),
      };
    } catch (error) {
      console.warn(`Failed to get issue #${number}: ${error}`);
      return null;
    }
  }

  async addLabel(issueNumber: number, label: string): Promise<boolean> {
    try {
      await execAsync(`gh issue edit ${issueNumber} ${this.repoArg} --add-label "${label}"`);
      return true;
    } catch (error) {
      console.warn(`Failed to add label: ${error}`);
      return false;
    }
  }

  async removeLabel(issueNumber: number, label: string): Promise<boolean> {
    try {
      await execAsync(`gh issue edit ${issueNumber} ${this.repoArg} --remove-label "${label}"`);
      return true;
    } catch (error) {
      console.warn(`Failed to remove label: ${error}`);
      return false;
    }
  }

  async addComment(issueNumber: number, body: string): Promise<boolean> {
    try {
      const escapedBody = body.replace(/"/g, '\\"').replace(/`/g, '\\`');
      await execAsync(`gh issue comment ${issueNumber} ${this.repoArg} --body "${escapedBody}"`);
      return true;
    } catch (error) {
      console.warn(`Failed to add comment: ${error}`);
      return false;
    }
  }

  async createPullRequest(title: string, body: string, base: string = 'main'): Promise<string | null> {
    try {
      const escapedBody = body.replace(/"/g, '\\"').replace(/`/g, '\\`');
      const { stdout } = await execAsync(
        `gh pr create ${this.repoArg} --title "${title}" --body "${escapedBody}" --base ${base}`
      );
      return stdout.trim();
    } catch (error) {
      console.warn(`Failed to create PR: ${error}`);
      return null;
    }
  }
}
