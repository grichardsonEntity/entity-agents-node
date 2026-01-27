/**
 * Sydney Agent - Full Stack Developer
 * Backend: Node.js, APIs, Databases
 * Frontend: React, CSS, Accessibility
 */

import { BaseAgent, type TaskResult, type GitHubIssue } from '../shared/index.js';
import { sydneyConfig } from './config.js';

export class SydneyAgent extends BaseAgent {
  constructor(config = sydneyConfig) {
    super(config);
  }

  // ============================================
  // BACKEND METHODS
  // ============================================

  async createEndpoint(method: string, path: string, description: string): Promise<TaskResult> {
    await this.notifier.notify(`Creating endpoint: ${method} ${path}`);

    const prompt = `
Create a new API endpoint:

**Method:** ${method}
**Path:** ${path}
**Description:** ${description}

**Requirements:**
1. Follow existing patterns in src/api/routes/
2. Add request/response validation using Zod
3. Include proper error handling with try/catch
4. Use correct HTTP status codes
5. Add OpenAPI/JSDoc documentation
6. Write a basic test in src/api/routes/__tests__/

**Verification:**
- [ ] TypeScript compiles without errors
- [ ] Validation rejects invalid input
- [ ] Error responses follow standard format
- [ ] Test passes
`;

    return this.runTask(prompt);
  }

  async createService(name: string, description: string): Promise<TaskResult> {
    await this.notifier.notify(`Creating service: ${name}`);

    const prompt = `
Create a new service:

**Service Name:** ${name}
**Description:** ${description}

**Structure:**
src/services/${name}/
├── index.ts           # Public exports
├── ${name}.service.ts # Main service class
├── ${name}.types.ts   # Type definitions
└── ${name}.test.ts    # Unit tests

**Requirements:**
1. Include /health endpoint if standalone service
2. Use environment variables for configuration
3. Add proper error handling and logging
4. Include Dockerfile if containerized service
5. Follow dependency injection pattern

**Verification:**
- [ ] Service initializes without errors
- [ ] Health check passes
- [ ] Tests pass
- [ ] No hardcoded credentials
`;

    return this.runTask(prompt);
  }

  async optimizeQuery(queryLocation: string): Promise<TaskResult> {
    await this.notifier.notify(`Optimizing query: ${queryLocation}`);

    const prompt = `
Optimize the database query at: ${queryLocation}

**Analysis Steps:**
1. Read the current query and understand its purpose
2. Run EXPLAIN ANALYZE to identify bottlenecks
3. Check for missing indexes
4. Look for N+1 query patterns

**Optimization Options:**
1. Add appropriate indexes (document with migration)
2. Optimize JOIN operations
3. Implement query caching if beneficial
4. Add pagination for large result sets
5. Consider query batching

**Deliverables:**
- [ ] Migration file for any index changes
- [ ] Updated query with explanation of changes
- [ ] Before/after performance comparison
- [ ] Any caching implementation
`;

    return this.runTask(prompt);
  }

  async createMigration(description: string): Promise<TaskResult> {
    await this.notifier.notify(`Creating migration: ${description}`);

    const prompt = `
Create a database migration:

**Description:** ${description}

**Requirements:**
1. Create migration file with timestamp prefix
2. Include both UP and DOWN migrations
3. Handle existing data if needed
4. Add indexes for frequently queried columns
5. Update TypeScript types/models to match

**File Format:**
\`\`\`sql
-- migrations/YYYYMMDDHHMMSS_${description.toLowerCase().replace(/\s+/g, '_')}.sql
-- +migrate Up
-- SQL for applying the migration

-- +migrate Down
-- SQL for reverting the migration
\`\`\`

**Verification:**
- [ ] UP migration applies cleanly
- [ ] DOWN migration reverts completely
- [ ] TypeScript types updated
- [ ] No data loss on rollback
`;

    return this.runTask(prompt);
  }

  // ============================================
  // FRONTEND METHODS
  // ============================================

  async getAssignedBugs(): Promise<GitHubIssue[]> {
    const allIssues = await this.github.getIssues(['bug'], 'open');

    return allIssues.filter((issue) => {
      const labels = this.config.githubLabels || [];
      const hasRelevantLabel = issue.labels.some((l) =>
        labels.includes(l.toLowerCase())
      );

      const bodyLower = issue.body.toLowerCase();
      const mentionsRelevant = [
        'component', 'display', 'render', 'style', 'css', 'layout', 'responsive',
        'api', 'endpoint', 'database', 'query', 'service', 'backend', 'server'
      ].some((kw) => bodyLower.includes(kw));

      return hasRelevantLabel || mentionsRelevant;
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
Fix this bug:

**Issue #${issue.number}:** ${issue.title}

**Description:**
${issue.body}

**Instructions:**
1. Read the relevant files (components, services, or API routes)
2. Identify the root cause
3. Implement minimal fix
4. If UI: ensure accessibility is maintained
5. If API: ensure validation and error handling
6. DO NOT add unnecessary changes

**Verification:**
- [ ] Bug is fixed
- [ ] No regressions introduced
- [ ] TypeScript compiles
- [ ] Tests pass
`;

    const result = await this.runTask(prompt);

    if (result.success) {
      const commit = await this.commitChanges(`fix: ${issue.title.substring(0, 50)}`, issueNumber);
      result.commitHash = commit.hash || undefined;
      result.filesChanged = commit.files;

      await this.github.addComment(
        issueNumber,
        `## Fix Applied\n\nSydney has implemented a fix.\n\n**Commit:** ${commit.hash || 'See git log'}`
      );
    }

    return result;
  }

  async createComponent(name: string, description: string): Promise<TaskResult> {
    await this.notifier.notify(`Creating component: ${name}`);

    const prompt = `
Create a new React component:

**Component Name:** ${name}
**Description:** ${description}

**Structure:**
src/components/${name}/
├── ${name}.tsx           # Main component
├── ${name}.module.css    # Styles (CSS Modules)
├── ${name}.test.tsx      # Tests
└── index.ts              # Public export

**Requirements:**
1. TypeScript with proper interfaces
2. Use forwardRef if interactive
3. Accessible (ARIA, keyboard navigation)
4. CSS Modules for styling
5. Mobile-responsive

**Component Template:**
\`\`\`typescript
import { forwardRef, type ComponentPropsWithRef } from 'react';
import styles from './${name}.module.css';

export interface ${name}Props extends ComponentPropsWithRef<'div'> {
  // Add props here
}

export const ${name} = forwardRef<HTMLDivElement, ${name}Props>(
  ({ children, ...props }, ref) => (
    <div ref={ref} className={styles.root} {...props}>
      {children}
    </div>
  )
);
${name}.displayName = '${name}';
\`\`\`

**Verification:**
- [ ] Component renders correctly
- [ ] Accessibility audit passes
- [ ] Tests pass
- [ ] Mobile responsive
`;

    return this.runTask(prompt);
  }

  async improveAccessibility(componentPath: string): Promise<TaskResult> {
    await this.notifier.notify(`Improving accessibility: ${componentPath}`);

    const prompt = `
Improve accessibility of component: ${componentPath}

**WCAG 2.1 AA Checklist:**

**Perceivable:**
- [ ] Alt text on images
- [ ] Color contrast 4.5:1 minimum
- [ ] Text can be resized to 200%
- [ ] No information conveyed by color alone

**Operable:**
- [ ] Keyboard accessible (Tab, Enter, Escape, Arrows)
- [ ] Visible focus indicators
- [ ] No keyboard traps
- [ ] Skip links for navigation

**Understandable:**
- [ ] Error messages are clear
- [ ] Labels on all form fields
- [ ] Consistent navigation

**Robust:**
- [ ] Valid HTML
- [ ] ARIA used correctly
- [ ] Works with screen readers

**Testing:**
- Run axe-core or similar tool
- Test with keyboard only
- Test with screen reader (VoiceOver/NVDA)
`;

    return this.runTask(prompt);
  }

  // ============================================
  // GENERAL
  // ============================================

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
