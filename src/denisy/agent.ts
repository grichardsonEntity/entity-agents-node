/**
 * Denisy Agent - Chief Data Officer
 *
 * Expert in data strategy, governance, privacy, analytics, streaming,
 * data modeling, ETL pipelines, and database design.
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { denisyConfig } from './config.js';

export class DenisyAgent extends BaseAgent {
  constructor(config = denisyConfig) {
    super(config);
  }

  async researchSources(topic: string): Promise<TaskResult> {
    await this.notifier.notify(`Researching: ${topic}`);
    const prompt = `Research data sources for: ${topic}\n\nFind: APIs, websites, databases. Evaluate quality.`;
    return this.runTask(prompt);
  }

  async buildScraper(url: string, dataSpec: string): Promise<TaskResult> {
    await this.notifier.notify(`Building scraper for: ${url}`);
    const prompt = `Build web scraper for: ${url}\n\nData to extract: ${dataSpec}\n\nInclude: error handling, rate limiting.`;
    return this.runTask(prompt);
  }

  async designSchema(requirements: string): Promise<TaskResult> {
    const prompt = `Design database schema for:\n\n${requirements}\n\nInclude: tables, indexes, migrations.`;
    return this.runTask(prompt);
  }

  async buildETL(source: string, destination: string): Promise<TaskResult> {
    const prompt = `Build ETL pipeline: ${source} -> ${destination}\n\nInclude: extraction, transformation, validation.`;
    return this.runTask(prompt);
  }

  async dataGovernanceFramework(organization: string, domains: string[]): Promise<TaskResult> {
    await this.notifier.notify(`Designing data governance framework for: ${organization}`);

    const domainsList = domains.map(d => `- ${d}`).join('\n');
    const prompt = `Design a comprehensive data governance framework for: ${organization}

**Data Domains:**
${domainsList}

**Deliver the following:**

### 1. Data Governance Policy
- Vision and objectives
- Scope and applicability
- Roles and responsibilities (Data Owner, Data Steward, Data Custodian)
- Decision rights and escalation paths
- Policy enforcement mechanisms

### 2. Data Ownership Model
- Domain-to-owner mapping
- RACI matrix for data operations (Create, Read, Update, Delete, Share)
- Stewardship assignments per domain
- Accountability framework and review cadence

### 3. Data Quality Standards
For each domain, define:
| Domain | Quality Dimension | Rule | Threshold | Measurement Method |
|--------|------------------|------|-----------|-------------------|
| ... | Completeness | ... | >=99% | ... |
| ... | Accuracy | ... | >=98% | ... |
| ... | Timeliness | ... | <1hr | ... |
| ... | Consistency | ... | 100% | ... |

### 4. Data Catalog Structure
- Catalog taxonomy and hierarchy
- Required metadata fields per asset type
- Business glossary template
- Data dictionary standards
- Tagging and classification scheme
- Search and discovery guidelines

### 5. Governance Operating Model
- Data governance council charter
- Meeting cadence and agenda templates
- KPIs for governance effectiveness
- Maturity assessment criteria
- Continuous improvement roadmap`;

    return this.runTask(prompt);
  }

  async privacyAssessment(dataSources: string[], regulations: string[]): Promise<TaskResult> {
    await this.notifier.notify(`Conducting privacy assessment for ${dataSources.length} data sources`);

    const sourcesList = dataSources.map(s => `- ${s}`).join('\n');
    const regsList = regulations.map(r => `- ${r}`).join('\n');
    const prompt = `Conduct a comprehensive data privacy and compliance assessment.

**Data Sources:**
${sourcesList}

**Applicable Regulations:**
${regsList}

**Deliver the following:**

### 1. PII Inventory
For each data source:
| Source | PII Field | Category | Sensitivity | Storage Location | Encrypted | Retention |
|--------|-----------|----------|-------------|-----------------|-----------|-----------|
| ... | ... | Direct/Quasi/Sensitive | High/Med/Low | ... | Yes/No | ... |

### 2. Compliance Gap Analysis
For each regulation:
| Requirement | Current State | Gap | Risk Level | Remediation |
|-------------|--------------|-----|-----------|-------------|
| ... | ... | ... | Critical/High/Med/Low | ... |

### 3. Anonymization Recommendations
For each PII category, recommend techniques:
- **Direct identifiers**: Tokenization, pseudonymization approach
- **Quasi-identifiers**: k-anonymity (k>=5), l-diversity strategy
- **Sensitive attributes**: Differential privacy (epsilon recommendations)
- **Free text**: NER-based redaction pipeline

### 4. Consent Requirements
- Consent collection points and mechanisms
- Consent granularity (purpose-specific vs. broad)
- Preference center design
- Consent withdrawal workflow
- Audit trail requirements
- Cross-border transfer consent needs

### 5. Privacy Impact Assessment Summary
- Overall risk rating
- Critical findings requiring immediate action
- 30/60/90 day remediation roadmap
- Ongoing monitoring recommendations`;

    return this.runTask(prompt);
  }

  async designAnalyticsDashboard(metrics: string[], audience: string): Promise<TaskResult> {
    await this.notifier.notify(`Designing analytics dashboard for: ${audience}`);

    const metricsList = metrics.map(m => `- ${m}`).join('\n');
    const prompt = `Design a comprehensive analytics dashboard.

**Key Metrics:**
${metricsList}

**Target Audience:** ${audience}

**Deliver the following:**

### 1. Dashboard Layout
- Page/tab structure with information hierarchy
- Above-the-fold KPI summary cards
- Drill-down navigation paths
- Filter and date range controls
- Responsive layout for desktop and mobile

### 2. Chart Type Selection
For each metric:
| Metric | Chart Type | Rationale | Dimensions | Filters |
|--------|-----------|-----------|------------|---------|
| ... | Line/Bar/Gauge/Table/... | ... | Time/Category/... | ... |

### 3. KPI Definitions
For each KPI:
- **Name**: Clear business name
- **Formula**: Precise calculation
- **Data source**: Table/column references
- **Granularity**: Time grain and dimensions
- **Benchmarks**: Target, warning, critical thresholds
- **Leading/Lagging**: Indicator type classification

### 4. Refresh Strategy
| Data Layer | Refresh Frequency | Method | SLA |
|-----------|-------------------|--------|-----|
| Real-time metrics | ... | Streaming/WebSocket | ... |
| Hourly aggregates | ... | Scheduled ETL | ... |
| Daily summaries | ... | Batch job | ... |

### 5. Implementation Recommendations
- Recommended tool (Superset / Metabase / Custom)
- Data model requirements (pre-aggregated tables, materialized views)
- Caching strategy
- Access control and row-level security
- Alert configuration for anomalies`;

    return this.runTask(prompt);
  }

  async dataLineageMap(pipelineDescription: string): Promise<TaskResult> {
    await this.notifier.notify('Mapping data lineage');

    const prompt = `Map comprehensive end-to-end data lineage for:

${pipelineDescription}

**Deliver the following:**

### 1. End-to-End Lineage Diagram
Document the complete data flow:
\`\`\`
[Source A] --> [Ingestion] --> [Raw Layer] --> [Transform 1] --> [Staging]
[Source B] --> [Ingestion] --> [Raw Layer] --> [Transform 2] --> [Staging]
[Staging] --> [Business Logic] --> [Curated Layer] --> [Serving Layer]
\`\`\`

### 2. Column-Level Lineage
| Target Table | Target Column | Source Table | Source Column | Transformation |
|-------------|--------------|-------------|--------------|----------------|
| ... | ... | ... | ... | Direct/Derived/Aggregated: formula |

### 3. Transformation Documentation
For each transformation step:
- **Step name**: Descriptive identifier
- **Input**: Tables/columns consumed
- **Logic**: Business rules applied (SQL/code snippet)
- **Output**: Tables/columns produced
- **Data quality impact**: How this step affects quality metrics

### 4. Quality Checkpoints
| Checkpoint | Location | Validation Rule | Action on Failure |
|-----------|----------|----------------|-------------------|
| ... | After ingestion | Row count delta < 5% | Alert + pause pipeline |
| ... | After transform | No nulls in key columns | Quarantine records |
| ... | Before serving | Schema match | Block promotion |

### 5. Impact Analysis
- Upstream dependency map (what breaks if source changes)
- Downstream consumer map (what is affected if this pipeline fails)
- SLA cascade analysis
- Change management checklist for schema evolution`;

    return this.runTask(prompt);
  }

  async designStreamingPipeline(
    sources: string[],
    destinations: string[],
    requirements: string
  ): Promise<TaskResult> {
    await this.notifier.notify(`Designing streaming pipeline: ${sources.length} sources -> ${destinations.length} destinations`);

    const sourcesList = sources.map(s => `- ${s}`).join('\n');
    const destsList = destinations.map(d => `- ${d}`).join('\n');
    const prompt = `Design a real-time streaming data pipeline.

**Sources:**
${sourcesList}

**Destinations:**
${destsList}

**Requirements:**
${requirements}

**Deliver the following:**

### 1. Architecture Overview
- Streaming platform selection (Kafka / Redis Streams) with justification
- Producer and consumer topology
- Partitioning strategy and key design
- Consumer group configuration
- Exactly-once vs at-least-once semantics decision

### 2. Event Schema Design
For each event type:
\`\`\`json
{
  "event_type": "...",
  "version": "1.0",
  "timestamp": "ISO-8601",
  "source": "...",
  "correlation_id": "uuid",
  "payload": {
    // Strongly-typed fields
  },
  "metadata": {
    // Processing metadata
  }
}
\`\`\`
- Schema registry configuration
- Schema evolution strategy (backward/forward compatibility)

### 3. Pipeline Implementation
\`\`\`typescript
// Kafka producer example (KafkaJS)
import { Kafka, Partitioners } from 'kafkajs';

class EventProducer {
  private producer;

  constructor(brokers: string[], topic: string) {
    const kafka = new Kafka({ brokers });
    this.producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
      idempotent: true,
    });
  }

  async emit(key: string, event: Record<string, unknown>): Promise<void> {
    await this.producer.send({
      topic: this.topic,
      messages: [{ key, value: JSON.stringify(event) }],
    });
  }
}

// Consumer with error handling
class EventConsumer {
  private consumer;

  constructor(brokers: string[], groupId: string, topics: string[]) {
    const kafka = new Kafka({ brokers });
    this.consumer = kafka.consumer({ groupId });
  }

  async process(handler: (event: Record<string, unknown>) => Promise<void>): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value!.toString());
          await handler(event);
        } catch (error) {
          await this.sendToDLQ(message, error);
        }
      },
    });
  }
}
\`\`\`

### 4. Error Handling & Resilience
- Dead letter queue (DLQ) design and retry policy
- Backpressure handling strategy
- Circuit breaker configuration
- Poison message detection
- Consumer lag monitoring and alerting

### 5. Operational Runbook
- Scaling triggers and procedures
- Rebalancing procedures
- Offset reset procedures
- Monitoring dashboards (consumer lag, throughput, error rates)
- Incident response for common failure modes`;

    return this.runTask(prompt);
  }

  async dataModel(requirements: string, modelingApproach: string = 'dimensional'): Promise<TaskResult> {
    await this.notifier.notify(`Designing ${modelingApproach} data model`);

    const approachHeader = modelingApproach === 'dimensional'
      ? '#### Dimensional Model (Kimball)'
      : `#### ${modelingApproach.charAt(0).toUpperCase() + modelingApproach.slice(1)} Model`;

    const prompt = `Design a comprehensive data model.

**Requirements:**
${requirements}

**Modeling Approach:** ${modelingApproach}

**Deliver the following:**

### 1. Conceptual Model
- Entity-relationship overview
- Business process identification
- Grain declaration for each fact table
- Conformed dimension identification

### 2. Logical Model
${approachHeader}

**Fact Tables:**
\`\`\`sql
-- Fact table: captures business events at declared grain
CREATE TABLE fact_<process> (
    fact_key BIGSERIAL PRIMARY KEY,
    -- Dimension foreign keys
    date_key INT REFERENCES dim_date(date_key),
    -- Degenerate dimensions
    -- Measures (additive, semi-additive, non-additive)
    amount NUMERIC(18,2),        -- Additive
    balance NUMERIC(18,2),       -- Semi-additive
    conversion_rate NUMERIC(8,4) -- Non-additive
);
\`\`\`

**Dimension Tables:**
\`\`\`sql
-- Dimension with SCD Type 2
CREATE TABLE dim_<entity> (
    <entity>_key BIGSERIAL PRIMARY KEY,
    <entity>_id VARCHAR(50) NOT NULL,   -- Natural/business key
    -- Attributes
    name VARCHAR(255),
    category VARCHAR(100),
    -- SCD Type 2 tracking
    effective_date DATE NOT NULL,
    expiration_date DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE,
    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### 3. Slowly Changing Dimensions Strategy
| Dimension | Attribute | SCD Type | Rationale |
|-----------|-----------|----------|-----------|
| ... | ... | Type 1 (Overwrite) | ... |
| ... | ... | Type 2 (History) | ... |
| ... | ... | Type 3 (Previous) | ... |

### 4. Physical Model
- Partitioning strategy (range, hash, list)
- Indexing strategy (B-tree, GIN, BRIN)
- Materialized views for common aggregations
- Table statistics and vacuum configuration
- Storage estimation

### 5. ETL Patterns
- Dimension loading pattern (SCD merge logic)
- Fact table loading pattern (insert-only, late-arriving facts)
- Date dimension generator
- Data quality checks between staging and target
- Incremental vs full refresh strategy per table`;

    return this.runTask(prompt);
  }

  async dataQualityFramework(dataSources: string[]): Promise<TaskResult> {
    await this.notifier.notify(`Designing data quality framework for ${dataSources.length} sources`);

    const sourcesList = dataSources.map(s => `- ${s}`).join('\n');
    const prompt = `Design a comprehensive data quality monitoring framework.

**Data Sources:**
${sourcesList}

**Deliver the following:**

### 1. Quality Rules
For each data source, define rules across dimensions:
| Source | Dimension | Rule Name | SQL/Logic | Severity |
|--------|-----------|-----------|-----------|----------|
| ... | Completeness | not_null_<col> | col IS NOT NULL | Critical |
| ... | Accuracy | valid_email | col ~ '^[a-zA-Z0-9.]+@' | High |
| ... | Consistency | fk_exists | EXISTS (SELECT 1 FROM ref...) | Critical |
| ... | Timeliness | fresh_data | max(updated_at) > NOW() - '1h' | High |
| ... | Uniqueness | unique_key | COUNT(*) = COUNT(DISTINCT key) | Critical |
| ... | Validity | valid_range | col BETWEEN min AND max | Medium |

### 2. Monitoring & Alerts
\`\`\`typescript
// Data quality check framework
interface QualityCheckResult {
  check: string;
  passed: boolean;
  actual: number;
  threshold: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

class DataQualityMonitor {
  constructor(
    private db: DatabaseConnection,
    private alertChannels: AlertChannel[]
  ) {}

  async checkCompleteness(table: string, columns: string[]): Promise<QualityCheckResult[]> {
    const results: QualityCheckResult[] = [];
    for (const col of columns) {
      const { total, nonNull } = await this.db.query(\`
        SELECT COUNT(*) as total, COUNT(\${col}) as non_null
        FROM \${table}
      \`);
      const pct = (nonNull / total) * 100;
      results.push({
        check: \`completeness_\${table}_\${col}\`,
        passed: pct >= 99.5,
        actual: pct,
        threshold: 99.5,
        severity: 'critical',
      });
    }
    return results;
  }

  async checkFreshness(table: string, timestampCol: string, maxAgeMinutes: number): Promise<QualityCheckResult> {
    // Check data is within freshness SLA
  }

  async checkVolume(table: string, expectedMin: number, expectedMax: number): Promise<QualityCheckResult> {
    // Check record count is within expected range
  }
}
\`\`\`

### 3. SLA Definitions
| Data Asset | Dimension | SLA Target | Measurement Window | Escalation |
|-----------|-----------|-----------|-------------------|-----------|
| ... | Freshness | < 1 hour | Rolling 24h | Page on-call |
| ... | Completeness | >= 99.5% | Per batch | Slack alert |
| ... | Accuracy | >= 99.9% | Daily audit | Email + ticket |
| ... | Availability | 99.95% uptime | Monthly | Incident report |

### 4. Remediation Procedures
For each failure type:
- **Detection**: How the issue is identified (automated alert, user report)
- **Triage**: Severity classification and impact assessment
- **Resolution**: Step-by-step remediation runbook
- **Prevention**: Root cause analysis template and preventive measures
- **Communication**: Stakeholder notification templates

### 5. Quality Scorecard
- Overall data health score calculation
- Domain-level quality scores
- Trend analysis and regression detection
- Executive summary dashboard design
- Monthly quality report template`;

    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
