/**
 * Sydney Agent - Senior Backend Developer
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { sydneyConfig } from './config.js';

export class SydneyAgent extends BaseAgent {
  constructor(config = sydneyConfig) {
    super(config);
  }

  async createEndpoint(method: string, path: string, description: string): Promise<TaskResult> {
    await this.notifier.notify(`Creating endpoint: ${method} ${path}`);

    const prompt = `
Create a new API endpoint:

**Method:** ${method}
**Path:** ${path}
**Description:** ${description}

**Requirements:**
1. Follow existing patterns
2. Add request/response validation
3. Include error handling
4. Add OpenAPI documentation
5. Write a basic test
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
├── index.ts           # Entry point
├── ${name}.service.ts # Main service
├── ${name}.types.ts   # Type definitions
└── ${name}.test.ts    # Tests

**Requirements:**
1. Include /health endpoint
2. Use environment variables
3. Add error handling
4. Include Dockerfile if needed
`;

    return this.runTask(prompt);
  }

  async optimizeQuery(queryLocation: string): Promise<TaskResult> {
    const prompt = `
Optimize the database query at: ${queryLocation}

**Analyze and improve:**
1. Add appropriate indexes
2. Optimize JOIN operations
3. Use query caching if beneficial
4. Consider pagination
5. Add query profiling
`;

    return this.runTask(prompt);
  }

  async createMigration(description: string): Promise<TaskResult> {
    const prompt = `
Create a database migration:

**Description:** ${description}

**Requirements:**
1. Create up/down migration
2. Handle data migration if needed
3. Add rollback safety
4. Update models to match
`;

    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
