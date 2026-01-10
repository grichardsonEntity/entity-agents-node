/**
 * Amber Agent - Systems Architect
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { amberConfig } from './config.js';

export class AmberAgent extends BaseAgent {
  constructor(config = amberConfig) {
    super(config);
  }

  async designSystem(requirements: string): Promise<TaskResult> {
    await this.notifier.notify(`Designing system for: ${requirements.substring(0, 50)}...`);

    const prompt = `
Design a system architecture for:

${requirements}

**Provide:**

## 1. Problem Statement
What we're solving and why

## 2. Proposed Architecture
\`\`\`
[ASCII or Mermaid diagram]
\`\`\`

## 3. Component Details
For each component: Purpose, Technology, Scaling

## 4. Data Model
SQL schema or document structure

## 5. API Contracts
Key endpoints with request/response

## 6. Integration Points
How components communicate

## 7. Trade-offs & Risks
Pros/cons, what could go wrong, mitigation
`;

    return this.runTask(prompt);
  }

  async reviewArchitecture(description: string): Promise<TaskResult> {
    const prompt = `
Review this architectural proposal:

${description}

**Evaluate:**
1. Scalability - Will it scale?
2. Maintainability - Easy to modify?
3. Reliability - Failure modes?
4. Security - Attack surface?
5. Performance - Bottlenecks?
6. Cost - Infrastructure costs?

**Provide:**
- Rating (1-10) for each
- Specific concerns
- Recommendations
- Alternative approaches
`;

    return this.runTask(prompt);
  }

  async createADR(title: string, context: string, decision: string): Promise<TaskResult> {
    await this.notifier.notify(`Creating ADR: ${title}`);

    const prompt = `
Create an Architecture Decision Record:

**Title:** ${title}
**Context:** ${context}
**Decision:** ${decision}

**Format:**
\`\`\`markdown
# ADR-XXX: ${title}

## Status
Proposed

## Context
${context}

## Decision
${decision}

## Consequences
- Positive consequences
- Negative consequences
- Risks

## Alternatives Considered
- Alternative 1
- Alternative 2
\`\`\`
`;

    return this.runTask(prompt);
  }

  async designAPIContract(resource: string, operations: string): Promise<TaskResult> {
    const prompt = `
Design API contract for resource: ${resource}

Operations: ${operations}

**Include:**
1. RESTful endpoints
2. Request/response schemas
3. Error responses
4. Authentication requirements
5. Rate limiting
6. OpenAPI specification
`;

    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
