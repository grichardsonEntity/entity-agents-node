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
  // GRAPHQL
  // ============================================

  async createGraphqlSchema(entities: string, relationships?: string): Promise<TaskResult> {
    await this.notifier.notify(`Creating GraphQL schema for: ${entities.substring(0, 50)}`);

    const prompt = `
Create a complete GraphQL schema:

**Entities:** ${entities}
${relationships ? `**Relationships:** ${relationships}` : ''}

## Deliverables

### 1. Schema Types
- Define GraphQL types for each entity
- Add input types for create/update mutations
- Include connection types for cursor-based pagination (Relay spec)
- Define enums, interfaces, and unions where appropriate

### 2. Queries
- Single entity lookup by ID
- Paginated list queries with cursor-based pagination
- Filter and sort arguments
- Use DataLoader for batched/cached field resolution

### 3. Mutations
- Create, update, delete for each entity
- Input validation with clear error messages
- Return the mutated entity

### 4. Subscriptions
- Real-time updates for entity changes (created, updated, deleted)
- PubSub pattern with proper topic naming
- Filter subscriptions by relevant criteria

### 5. DataLoader Setup
\`\`\`typescript
import DataLoader from 'dataloader';

const userLoader = new DataLoader<string, User>(async (ids) => {
  const users = await db.users.findMany({ where: { id: { in: [...ids] } } });
  const userMap = new Map(users.map(u => [u.id, u]));
  return ids.map(id => userMap.get(id)!);
});
\`\`\`

### 6. Federation (if multi-service)
- Entity references with @key directive
- Extend types across subgraphs
- Gateway composition strategy

**Verification:**
- [ ] All types are properly defined
- [ ] Pagination follows cursor-based spec
- [ ] DataLoader eliminates N+1 queries
- [ ] Subscriptions have proper PubSub setup
- [ ] Input validation is comprehensive
- [ ] Schema compiles without errors
`;

    return this.runTask(prompt);
  }

  // ============================================
  // CACHING
  // ============================================

  async setupCaching(service: string, cacheStrategy: string = 'cache-aside'): Promise<TaskResult> {
    await this.notifier.notify(`Setting up ${cacheStrategy} caching for: ${service}`);

    const prompt = `
Set up a caching layer for service: ${service}

**Cache Strategy:** ${cacheStrategy}

## Deliverables

### 1. Redis Cache Service
\`\`\`typescript
export class CacheService {
  // Implement ${cacheStrategy} pattern
  // - cache-aside: Read from cache first, fetch from DB on miss, populate cache
  // - write-through: Write to cache and DB simultaneously
  // - write-behind: Write to cache immediately, async write to DB
}
\`\`\`

### 2. TTL Strategy
- Define per-entity TTL values based on data volatility
- Implement sliding expiration for frequently accessed data
- Add stale-while-revalidate for improved latency

### 3. Cache Invalidation
- Tag-based invalidation (invalidate all caches related to an entity)
- Event-driven invalidation on writes/updates/deletes
- Pattern-based key cleanup
- Versioned cache keys for safe deployments

### 4. HTTP Caching Headers
- Set Cache-Control, ETag, Last-Modified on API responses
- Implement conditional requests (If-None-Match, If-Modified-Since)
- Configure CDN-friendly headers (Surrogate-Control, Surrogate-Key)

### 5. Cache Middleware
\`\`\`typescript
export function cached(ttl: number = 300, tags?: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = generateCacheKey(req);
    const cached = await cacheService.get(key);
    if (cached) { res.json(cached); return; }
    // Intercept response, cache it, then send
    next();
  };
}
\`\`\`

### 6. Monitoring
- Cache hit/miss ratio metrics
- Latency tracking for cache vs DB reads
- Memory usage monitoring
- Alert on high miss rates

**Verification:**
- [ ] Cache strategy correctly implemented
- [ ] TTL values are appropriate for data type
- [ ] Invalidation covers all write paths
- [ ] No stale data scenarios unhandled
- [ ] HTTP caching headers are correct
- [ ] Monitoring is in place
`;

    return this.runTask(prompt);
  }

  // ============================================
  // WEBSOCKET
  // ============================================

  async createWebsocketEndpoint(path: string, description: string): Promise<TaskResult> {
    await this.notifier.notify(`Creating WebSocket endpoint: ${path}`);

    const prompt = `
Create a WebSocket endpoint:

**Path:** ${path}
**Description:** ${description}

## Deliverables

### 1. Connection Manager
\`\`\`typescript
import { WebSocket } from 'ws';

class ConnectionManager {
  private connections = new Map<string, WebSocket>();
  private rooms = new Map<string, Set<string>>();

  connect(ws: WebSocket, clientId: string): void {
    this.connections.set(clientId, ws);
  }

  disconnect(clientId: string): void {
    this.connections.delete(clientId);
    // Clean up room memberships
  }

  broadcast(message: object, room?: string): void {
    // Send to all or room members
  }

  sendTo(clientId: string, message: object): void {
    // Send to specific client
  }
}
\`\`\`

### 2. WebSocket Endpoint
- Accept connections with authentication
- Parse message types (JSON protocol)
- Route messages to appropriate handlers
- Handle disconnections gracefully

### 3. Heartbeat / Keep-Alive
- Server-initiated ping every 30 seconds
- Client pong response handling
- Disconnect stale connections after 3 missed pongs
- Configurable heartbeat interval

### 4. Message Protocol
\`\`\`typescript
interface WSMessage {
  type: 'subscribe' | 'unsubscribe' | 'message' | 'ping' | 'pong';
  channel?: string;
  payload?: Record<string, unknown>;
  id?: string; // For request-response correlation
}
\`\`\`

### 5. Reconnection Support
- Send connection state on reconnect
- Message queue for offline clients (brief window)
- Last-event-id support for resuming streams
- Exponential backoff guidance for clients

### 6. Scaling Considerations
- Redis Pub/Sub for multi-instance message distribution
- Sticky sessions configuration notes
- Connection count limits and backpressure

**Verification:**
- [ ] Connection lifecycle is complete (connect, message, disconnect)
- [ ] Heartbeat keeps connections alive
- [ ] Authentication is enforced
- [ ] Message protocol is well-defined
- [ ] Reconnection is supported
- [ ] Error handling covers all edge cases
`;

    return this.runTask(prompt);
  }

  // ============================================
  // BACKGROUND JOBS
  // ============================================

  async setupBackgroundJobs(jobDescriptions: string): Promise<TaskResult> {
    await this.notifier.notify(`Setting up background jobs: ${jobDescriptions.substring(0, 50)}`);

    const prompt = `
Set up background job processing:

**Jobs Required:** ${jobDescriptions}

## Deliverables

### 1. BullMQ Queue Configuration
\`\`\`typescript
import { Queue, Worker, QueueScheduler } from 'bullmq';

const connection = { host: 'localhost', port: 6379 };

const orderQueue = new Queue('orders', { connection });
const scheduler = new QueueScheduler('orders', { connection });
\`\`\`

### 2. Job Definitions
- Define each job/task with clear input/output types
- Set appropriate timeouts per job type
- Configure concurrency limits where needed

### 3. Retry Strategy
- Exponential backoff: delay * 2^attempt
- Max retries per job type (default: 3)
- Configurable retry exceptions (transient vs permanent)
- Dead letter queue for permanently failed jobs

### 4. Dead Letter Queue (DLQ)
\`\`\`typescript
const deadLetterQueue = new Queue('dead-letters', { connection });

worker.on('failed', async (job, err) => {
  if (job && job.attemptsMade >= job.opts.attempts!) {
    await deadLetterQueue.add('failed', {
      originalQueue: 'orders',
      jobData: job.data,
      error: err.message,
      failedAt: new Date().toISOString(),
    });
  }
});
\`\`\`

### 5. Scheduling
- Repeatable jobs with cron expressions
- One-off delayed jobs with delay option
- Rate limiting per queue

### 6. Monitoring & Observability
- Bull Board dashboard setup
- Metrics: queue depth, processing time, failure rate
- Alerts on: DLQ growth, queue backlog, worker crashes
- Structured logging for job execution

### 7. Worker Configuration
- Concurrency settings per worker
- Sandboxed processors for isolation
- Graceful shutdown handling

**Verification:**
- [ ] All jobs are defined with proper types
- [ ] Retry logic handles transient failures
- [ ] DLQ captures permanent failures
- [ ] Scheduling is configured correctly
- [ ] Monitoring dashboard is set up
- [ ] Workers handle graceful shutdown
`;

    return this.runTask(prompt);
  }

  // ============================================
  // API VERSIONING
  // ============================================

  async createApiVersion(currentVersion: string, changes: string): Promise<TaskResult> {
    await this.notifier.notify(`Creating API version plan: ${currentVersion} -> next`);

    const prompt = `
Create an API versioning strategy:

**Current Version:** ${currentVersion}
**Planned Changes:** ${changes}

## Deliverables

### 1. Version Strategy
- Determine versioning approach (URL path /api/v2/, header, or content negotiation)
- Define version routing middleware
- Set up version-specific route registration

### 2. New Version Implementation
\`\`\`typescript
import { Router } from 'express';

const v1Router = Router();
const v2Router = Router();

// Shared business logic via services
// Version-specific request/response adapters

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
\`\`\`

### 3. Migration Plan
| Endpoint | v${currentVersion} (Current) | Next Version (Changes) | Breaking? |
|----------|------|------|----------|
| [List affected endpoints with changes] |

### 4. Deprecation Strategy
- Add Sunset header to deprecated endpoints
- Add Deprecation header with date
- Include Link header pointing to new version docs
- Log usage of deprecated endpoints for tracking

\`\`\`typescript
function deprecationMiddleware(sunsetDate: string, successorUrl: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.set('Deprecation', 'true');
    res.set('Sunset', sunsetDate);
    res.set('Link', \\\`<\\\${successorUrl}>; rel="successor-version"\\\`);
    next();
  };
}
\`\`\`

### 5. Client Communication
- Changelog document for the new version
- Migration guide with before/after examples
- SDK/client library update notes
- Timeline: deprecation announcement -> warning period -> sunset

### 6. Coexistence Plan
- Both versions run simultaneously during transition
- Shared service/business logic layer
- Version-specific adapters for request/response transformation
- Database compatibility across versions

**Verification:**
- [ ] Version routing works correctly
- [ ] Deprecation headers are set on old version
- [ ] Migration guide covers all breaking changes
- [ ] Both versions can coexist
- [ ] Client communication is clear
- [ ] Sunset timeline is defined
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
