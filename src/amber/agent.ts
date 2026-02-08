/**
 * Amber Agent - Systems Architect
 *
 * Expert in system design, microservices, event-driven architecture,
 * domain-driven design, cloud-native patterns, performance engineering,
 * legacy migration, and architectural decisions.
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

  async designEventArchitecture(domain: string, events: string, consumers: string): Promise<TaskResult> {
    await this.notifier.notify(`Designing event architecture for: ${domain.substring(0, 50)}...`);

    const prompt = `
Design an event-driven architecture for the following domain:

**Domain:** ${domain}
**Key Events:** ${events}
**Consumers:** ${consumers}

**Provide:**

## 1. Event Catalog
For each domain event:
- Event name (past tense, e.g., OrderPlaced)
- Event schema (JSON with versioning)
- Producer service
- Consumer services
- Ordering guarantees required

## 2. Event Bus Selection
- Recommended technology (Kafka, RabbitMQ, Redis Streams, NATS) with justification
- Topic/queue design and partitioning strategy
- Retention and replay policies
- Dead letter queue configuration

## 3. CQRS Design
- Command model (write side) — aggregates, command handlers, validators
- Query model (read side) — projections, materialized views, query handlers
- Synchronization strategy between write and read models

## 4. Event Sourcing (if applicable)
- Event store design
- Snapshot strategy for aggregate rehydration
- Event versioning and upcasting approach
- Projection rebuild strategy

## 5. Saga Orchestration
- Saga flow diagram for multi-step processes
- Compensating actions for each step (rollback strategy)
- Saga state machine definition
- Timeout and retry policies

## 6. Idempotency & Deduplication
- Idempotency key strategy
- Deduplication mechanism (at-least-once to effectively-once)
- Consumer offset management

## 7. Consistency & Error Handling
- Eventual consistency boundaries
- Error handling and dead letter processing
- Monitoring and alerting for event processing lag

## 8. Trade-offs
- Why this approach over synchronous alternatives
- Complexity cost vs. scalability gain
`;

    return this.runTask(prompt);
  }

  async planMigration(legacySystem: string, targetArchitecture: string): Promise<TaskResult> {
    await this.notifier.notify(`Planning migration from: ${legacySystem.substring(0, 50)}...`);

    const prompt = `
Create a migration plan from legacy to target architecture:

**Legacy System:** ${legacySystem}
**Target Architecture:** ${targetArchitecture}

**Provide:**

## 1. Current State Assessment
- Legacy system inventory (services, databases, integrations)
- Pain points and technical debt catalog
- Dependency map and coupling analysis
- Data flow documentation

## 2. Migration Strategy
- **Strangler Fig Pattern** application plan:
  - Facade/proxy layer design
  - Feature-by-feature migration sequence
  - Routing rules (legacy vs new)
- **Branch by Abstraction** opportunities:
  - Abstraction layer interfaces
  - Switchover mechanism
- **Anti-Corruption Layer** design:
  - Translation boundaries
  - Data mapping between old and new models

## 3. Parallel Run Plan
- Shadow traffic configuration
- Dual-write strategy with reconciliation
- Comparison and verification tooling
- Divergence detection and alerting

## 4. Incremental Milestones
For each phase:
- Scope (what migrates)
- Duration estimate
- Success criteria
- Rollback procedure
- Dependencies and blockers

## 5. Data Migration
- Data mapping between legacy and target schemas
- ETL/CDC pipeline design
- Data validation and reconciliation approach
- Zero-downtime cutover strategy

## 6. Risk Assessment
- Migration risks ranked by impact and likelihood
- Rollback strategy for each milestone
- Feature flags for gradual rollout
- Communication plan for stakeholders

## 7. Timeline & Resource Estimate
- Phased timeline with dependencies
- Team allocation per phase
- Infrastructure requirements during transition
`;

    return this.runTask(prompt);
  }

  async performanceBaseline(systemDescription: string, slas: string): Promise<TaskResult> {
    await this.notifier.notify(`Building performance baseline for: ${systemDescription.substring(0, 50)}...`);

    const prompt = `
Create a performance engineering framework:

**System:** ${systemDescription}
**SLA Requirements:** ${slas}

**Provide:**

## 1. Performance Baseline
- Key performance metrics to capture (latency p50/p95/p99, throughput, error rate)
- Baseline measurement methodology
- Benchmark test suite design
- Historical trend analysis approach

## 2. Profiling Strategy
- **CPU Profiling**: Hot path identification, flame graph analysis
- **Memory Profiling**: Heap analysis, leak detection, GC tuning
- **I/O Profiling**: Disk I/O patterns, network I/O analysis
- **Database Profiling**: Query performance, connection pool sizing, index effectiveness
- Recommended tools per technology stack

## 3. Bottleneck Identification
- Amdahl's Law application to parallelizable components
- Queuing theory analysis (Little's Law) for service capacity
- Resource saturation points per component
- Critical path analysis through the system

## 4. Capacity Model
- Load model: expected traffic patterns (steady state, peak, burst)
- Resource requirements per request type
- Scaling curves: linear vs. sublinear scaling analysis
- Cost per unit of capacity

## 5. Load Testing Plan
- Test scenarios: smoke, load, stress, soak, spike
- Test data generation strategy
- Environment requirements for realistic testing
- Success criteria per test type

## 6. Optimization Recommendations
- Quick wins (caching, connection pooling, query optimization)
- Medium-term improvements (architecture changes, async processing)
- Long-term investments (re-architecture, technology migration)
- Priority matrix (impact vs effort)

## 7. SLA Mapping
- SLI definitions for each SLA target
- Error budget calculation
- Alerting thresholds and escalation procedures
- Capacity headroom requirements
`;

    return this.runTask(prompt);
  }

  async designDDD(domainDescription: string): Promise<TaskResult> {
    await this.notifier.notify(`Designing DDD for: ${domainDescription.substring(0, 50)}...`);

    const prompt = `
Design a Domain-Driven Design architecture:

**Domain Description:** ${domainDescription}

**Provide:**

## 1. Domain Analysis
- Core domain identification (competitive advantage)
- Supporting domains
- Generic domains (buy/outsource candidates)
- Domain expert roles and ubiquitous language glossary

## 2. Bounded Contexts
For each bounded context:
- Name and responsibility
- Ubiquitous language terms specific to this context
- Team ownership
- Data ownership and storage strategy

## 3. Context Map
- Relationships between bounded contexts:
  - Partnership
  - Shared Kernel
  - Customer-Supplier
  - Conformist
  - Anti-Corruption Layer
  - Open Host Service / Published Language
- Diagram of context relationships

## 4. Aggregate Design
For each key aggregate:
- Aggregate root entity
- Value objects
- Invariants (business rules enforced)
- Consistency boundary
- Expected size and transaction scope

## 5. Domain Events
- Events that cross bounded context boundaries (integration events)
- Events within a bounded context (domain events)
- Event naming conventions (past tense, business language)
- Event schema with versioning strategy

## 6. Application Services & Use Cases
- Key use cases per bounded context
- Command/query separation
- Transaction boundaries
- Cross-context coordination (sagas, process managers)

## 7. Implementation Guidance
- Module/package structure per bounded context
- Repository pattern and persistence strategy
- Domain event publishing mechanism
- Testing strategy (unit, integration, contract tests)
`;

    return this.runTask(prompt);
  }

  async cloudNativeReview(application: string): Promise<TaskResult> {
    await this.notifier.notify(`Cloud-native review for: ${application.substring(0, 50)}...`);

    const prompt = `
Perform a comprehensive cloud-native architecture review:

**Application:** ${application}

**Provide:**

## 1. Twelve-Factor App Compliance
For each factor, assess current state and provide recommendations:
1. **Codebase** — One codebase tracked in VCS, many deploys
2. **Dependencies** — Explicitly declare and isolate dependencies
3. **Config** — Store config in the environment
4. **Backing Services** — Treat backing services as attached resources
5. **Build, Release, Run** — Strictly separate build and run stages
6. **Processes** — Execute the app as stateless processes
7. **Port Binding** — Export services via port binding
8. **Concurrency** — Scale out via the process model
9. **Disposability** — Maximize robustness with fast startup and graceful shutdown
10. **Dev/Prod Parity** — Keep development, staging, and production similar
11. **Logs** — Treat logs as event streams
12. **Admin Processes** — Run admin/management tasks as one-off processes

Compliance rating per factor: Compliant / Partially / Non-Compliant

## 2. Resilience Patterns Assessment
- **Circuit Breakers**: Implementation status, configuration, fallback strategies
- **Bulkheads**: Thread pool / connection pool isolation
- **Retry Patterns**: Exponential backoff, jitter, max retries, idempotency
- **Timeouts**: Connection, read, write timeouts per dependency
- **Rate Limiting**: Client-side and server-side rate limiting
- **Graceful Degradation**: Feature flag fallbacks, reduced functionality mode

## 3. Container & Orchestration Review
- Dockerfile best practices (multi-stage, non-root, minimal base)
- Resource limits and requests (CPU, memory)
- Health checks (liveness, readiness, startup probes)
- Pod disruption budgets and anti-affinity rules
- Horizontal Pod Autoscaler configuration

## 4. Observability Assessment
- Distributed tracing implementation
- Structured logging with correlation IDs
- Metrics exposure (Prometheus, OpenMetrics)
- Dashboard and alerting coverage
- SLI/SLO definitions

## 5. Security Posture
- Secrets management (Vault, sealed secrets, external secrets)
- Network policies and service mesh mTLS
- Image scanning and supply chain security
- RBAC and least-privilege access

## 6. Recommendations
- Priority-ordered action items
- Quick wins vs. strategic investments
- Migration path for non-compliant items
`;

    return this.runTask(prompt);
  }

  async designObservability(services: string, requirements: string): Promise<TaskResult> {
    await this.notifier.notify(`Designing observability for: ${services.substring(0, 50)}...`);

    const prompt = `
Design a comprehensive observability architecture:

**Services:** ${services}
**Requirements:** ${requirements}

**Provide:**

## 1. OpenTelemetry Setup
- Instrumentation strategy: auto-instrumentation vs manual spans
- SDK configuration per language/framework
- Collector deployment topology (sidecar vs gateway vs agent)
- Sampling strategy (head-based, tail-based, adaptive)
- Resource attributes and semantic conventions

## 2. Distributed Tracing Design
- Trace context propagation (W3C TraceContext, B3)
- Span naming conventions and attribute standards
- Critical path tracing for key user journeys
- Trace-to-log and trace-to-metric correlation
- Backend selection (Jaeger, Tempo, X-Ray) with justification

## 3. Structured Logging Architecture
- Log format standard (JSON with required fields)
- Required fields: timestamp, level, service, traceId, spanId, correlationId
- Log levels policy (when to use each level)
- Log aggregation pipeline (Fluentd/Fluent Bit to Elasticsearch/Loki)
- Log retention and rotation policies
- Sensitive data redaction rules

## 4. Metrics Design
- **RED Method** (Rate, Errors, Duration) per service
- **USE Method** (Utilization, Saturation, Errors) per resource
- **Four Golden Signals** mapping
- Custom business metrics definition
- Metric naming conventions and label standards
- Cardinality management strategy
- Backend selection (Prometheus, Mimir, CloudWatch)

## 5. SLI/SLO Definitions
For each critical service:
- Service Level Indicators (SLIs) with measurement method
- Service Level Objectives (SLOs) with target percentages
- Error budget calculation and burn rate alerts
- SLA mapping (external commitments vs internal objectives)
- Rolling window configuration (30-day, 7-day)

## 6. Dashboard Design
- Executive overview dashboard (system health at a glance)
- Service-level dashboards (per-service deep dive)
- Infrastructure dashboards (node, pod, container metrics)
- Business metrics dashboards
- On-call dashboards with runbook links
- Grafana/Datadog layout recommendations

## 7. Alerting Strategy
- Alert hierarchy: page, ticket, log
- Alert routing rules and escalation paths
- Alert fatigue prevention (grouping, inhibition, silencing)
- Runbook template for each alert
- On-call rotation integration

## 8. Cost & Scaling
- Data volume estimation per signal type
- Storage and retention cost model
- Sampling trade-offs for cost optimization
- Scaling plan for observability infrastructure
`;

    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
