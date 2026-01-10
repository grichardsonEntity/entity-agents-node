/**
 * Type definitions for Entity Agents
 */

export interface NotificationConfig {
  fileEnabled: boolean;
  filePath: string;
  macosEnabled: boolean;
  smsEnabled: boolean;
  smsPhone?: string;
}

export interface GitHubConfig {
  repo?: string;
  owner?: string;
}

export interface AgentConfig {
  name: string;
  role: string;
  systemPrompt: string;
  projectRoot: string;
  outputDir: string;
  allowedTools: string[];
  allowedBashPatterns: string[];
  ownedPaths: string[];
  githubLabels: string[];
  github: GitHubConfig;
  notifications: NotificationConfig;
}

export interface TaskResult {
  success: boolean;
  output: string;
  filesChanged: string[];
  duration?: number;
  commitHash?: string;
  needsApproval?: boolean;
  approvalPrompt?: string;
}

export interface ApprovalRequest {
  taskId: string;
  description: string;
  details: string;
  options: string[];
  createdAt: Date;
}

export interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  labels: string[];
  state: 'open' | 'closed';
  assignees: string[];
}

export interface AgentStatus {
  name: string;
  role: string;
  tasksCompleted: number;
  tasksSucceeded: number;
  ownedPaths: string[];
  isRunning: boolean;
  pendingApprovals?: number;
}

export interface CommitResult {
  hash: string | null;
  files: string[];
  message?: string;
}

export const defaultNotificationConfig: NotificationConfig = {
  fileEnabled: true,
  filePath: '~/.entity-agents/logs/agent.log',
  macosEnabled: true,
  smsEnabled: false,
};

export const defaultAgentConfig: Partial<AgentConfig> = {
  projectRoot: process.cwd(),
  outputDir: '.entity-agents',
  allowedTools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash'],
  allowedBashPatterns: ['git *', 'gh *', 'npm *'],
  ownedPaths: [],
  githubLabels: [],
  github: {},
  notifications: defaultNotificationConfig,
};
