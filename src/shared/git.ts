/**
 * Git operations utility
 */

import { exec } from 'child_process';
import { promisify } from 'util';
// CommitResult type is used by consumers of this module

const execAsync = promisify(exec);

export class GitClient {
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  private async run(command: string): Promise<string> {
    const { stdout } = await execAsync(command, { cwd: this.projectRoot });
    return stdout.trim();
  }

  async status(): Promise<string> {
    return this.run('git status --porcelain');
  }

  async diffNames(): Promise<string[]> {
    const output = await this.run('git diff --name-only');
    return output ? output.split('\n').filter(Boolean) : [];
  }

  async add(path: string = '.'): Promise<void> {
    await this.run(`git add ${path}`);
  }

  async commit(message: string, author?: string): Promise<string | null> {
    try {
      const authorArg = author ? `--author="${author} <noreply@entity.com>"` : '';
      await this.run(`git commit -m "${message}" ${authorArg}`);
      const hash = await this.run('git rev-parse HEAD');
      return hash;
    } catch (error) {
      console.warn(`Commit failed: ${error}`);
      return null;
    }
  }

  async push(branch?: string): Promise<boolean> {
    try {
      const branchArg = branch ? branch : '';
      await this.run(`git push origin ${branchArg}`);
      return true;
    } catch (error) {
      console.warn(`Push failed: ${error}`);
      return false;
    }
  }

  async createBranch(name: string): Promise<boolean> {
    try {
      await this.run(`git checkout -b ${name}`);
      return true;
    } catch (error) {
      console.warn(`Branch creation failed: ${error}`);
      return false;
    }
  }

  async checkout(branch: string): Promise<boolean> {
    try {
      await this.run(`git checkout ${branch}`);
      return true;
    } catch (error) {
      console.warn(`Checkout failed: ${error}`);
      return false;
    }
  }

  async currentBranch(): Promise<string> {
    return this.run('git branch --show-current');
  }
}
