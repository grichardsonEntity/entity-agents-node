/**
 * Valentina Agent - Technical Writer & Content Strategist
 * Documentation: API docs, architecture docs, README files
 * Grant Writing: Proposals, budgets, needs statements
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { valentinaConfig } from './config.js';

export class ValentinaAgent extends BaseAgent {
  constructor(config = valentinaConfig) {
    super(config);
  }

  // ============================================
  // DOCUMENTATION METHODS
  // ============================================

  async documentFeature(feature: string, targetAudience: string = 'developers'): Promise<TaskResult> {
    await this.notifier.notify(`Documenting: ${feature}`);

    const prompt = `
Document feature: ${feature}
Target audience: ${targetAudience}

**Documentation Structure:**
1. Overview (2-3 sentences)
2. Prerequisites
3. Getting Started / Quick Start
4. Detailed Usage
5. Configuration Options
6. Code Examples (working, tested)
7. Common Issues / Troubleshooting
8. Related Documentation

**Requirements:**
- Verify all code examples compile/run
- Use consistent terminology
- Include both basic and advanced examples
- Add cross-references to related docs

**Verification:**
- [ ] All code examples are tested
- [ ] Links are valid
- [ ] Terminology is consistent
- [ ] Prerequisites are accurate
`;

    return this.runTask(prompt);
  }

  async documentAPI(endpoint: string): Promise<TaskResult> {
    await this.notifier.notify(`Documenting API: ${endpoint}`);

    const prompt = `
Document API endpoint: ${endpoint}

**API Documentation Pattern:**

## [METHOD] /api/path

Brief description of the endpoint.

### Authentication
Required auth method (Bearer token, API key, etc.)

### Request

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token |

**Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| field1 | string | Yes | Description |

### Example Request
\\\`\\\`\\\`bash
curl -X POST https://api.example.com/endpoint \\
  -H "Authorization: Bearer token" \\
  -H "Content-Type: application/json" \\
  -d '{"field1": "value"}'
\\\`\\\`\\\`

### Response

**Success (200):**
\\\`\\\`\\\`json
{
  "data": {}
}
\\\`\\\`\\\`

**Errors:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | INVALID_INPUT | Validation failed |
| 401 | UNAUTHORIZED | Invalid or missing token |

**Verification:**
- [ ] Request/response matches actual API
- [ ] Error codes are accurate
- [ ] Example curl command works
- [ ] All fields documented
`;

    return this.runTask(prompt);
  }

  async createDiagram(subject: string, type: 'flow' | 'sequence' | 'er' | 'class' = 'flow'): Promise<TaskResult> {
    await this.notifier.notify(`Creating ${type} diagram: ${subject}`);

    const diagramTemplates: Record<string, string> = {
      flow: `
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`,
      sequence: `
sequenceDiagram
    participant U as User
    participant A as API
    participant D as Database
    U->>A: Request
    A->>D: Query
    D-->>A: Data
    A-->>U: Response`,
      er: `
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "is in"`,
      class: `
classDiagram
    class User {
        +String id
        +String email
        +login()
        +logout()
    }`,
    };

    const prompt = `
Create a ${type} diagram for: ${subject}

**Use Mermaid syntax. Template:**
\`\`\`mermaid
${diagramTemplates[type]}
\`\`\`

**Requirements:**
1. Read the relevant code/system to understand relationships
2. Create accurate diagram reflecting actual architecture
3. Use clear, descriptive labels
4. Keep complexity manageable (max 10-15 nodes)
5. Add to docs/ with descriptive filename

**Verification:**
- [ ] Diagram renders correctly in Mermaid live editor
- [ ] Labels are clear and descriptive
- [ ] Relationships are accurate
- [ ] Complexity is appropriate
`;

    return this.runTask(prompt);
  }

  async updateReadme(projectPath: string = '.'): Promise<TaskResult> {
    await this.notifier.notify(`Updating README: ${projectPath}`);

    const prompt = `
Update README.md for project at: ${projectPath}

**README Structure:**
1. Project name and badges
2. One-line description
3. Key features (bullet list)
4. Quick Start (< 5 steps to run)
5. Installation
6. Usage with examples
7. Configuration
8. API Reference (if applicable)
9. Contributing
10. License

**Requirements:**
- Verify installation instructions work
- All code examples must be tested
- Links must be valid
- Keep it concise but complete

**Verification:**
- [ ] Quick start works on fresh environment
- [ ] All commands are correct
- [ ] Links are valid
- [ ] No outdated information
`;

    return this.runTask(prompt);
  }

  // ============================================
  // GRANT WRITING METHODS
  // ============================================

  async researchFunding(projectType: string, fundingAmount: string = 'any'): Promise<TaskResult> {
    await this.notifier.notify(`Researching funding for: ${projectType}`);

    const prompt = `
Research funding opportunities for: ${projectType}
Target amount: ${fundingAmount}

**Search Sources:**
1. Federal: Grants.gov, NSF, NIH, DOE
2. Foundations: Foundation Directory Online, 990 Finder
3. Corporate: Company giving programs
4. State/Local: State arts councils, community foundations

**For each opportunity, provide:**

| Field | Value |
|-------|-------|
| Name | [Opportunity name] |
| Funder | [Organization] |
| Type | Federal/Foundation/Corporate |
| Amount | $X - $X |
| Deadline | [Date] |
| Eligibility | [Key requirements] |
| Focus Areas | [Priorities] |
| Fit Score | High/Medium/Low |
| Recommendation | Pursue/Consider/Skip |

**Deliverables:**
- [ ] Minimum 5 opportunities identified
- [ ] Fit scores based on alignment with project
- [ ] Deadline calendar
- [ ] Go/no-go recommendations with rationale
`;

    return this.runTask(prompt);
  }

  async writeNeedsStatement(problem: string, population: string, evidence: string[] = []): Promise<TaskResult> {
    await this.notifier.notify(`Writing needs statement: ${problem}`);

    const prompt = `
Write a compelling needs statement:

**Problem:** ${problem}
**Target Population:** ${population}
**Evidence provided:** ${evidence.length > 0 ? evidence.join(', ') : 'Research needed'}

**Needs Statement Structure:**

[PROBLEM]: Clear, specific statement of the problem
- What is the issue?
- How severe is it?

[EVIDENCE]: 3-5 data points from credible sources
- Statistics from peer-reviewed sources
- Government data (Census, BLS, CDC)
- Recent reports (within 3 years)

[IMPACT]: Who is affected and how
- Number of people affected
- Geographic scope
- Consequences if unaddressed

[GAP]: What's missing in current solutions
- What has been tried?
- Why is it insufficient?

[URGENCY]: Why action is needed now
- Trending worse?
- Window of opportunity?

[ALIGNMENT]: Connection to funder's priorities
- Match to stated focus areas
- Previous similar grants

**Requirements:**
- All statistics must be cited
- Sources must be credible and recent
- Avoid jargon
- Write for non-experts

**Verification:**
- [ ] All statistics are verified
- [ ] Sources are cited properly
- [ ] Language is accessible
- [ ] Urgency is compelling
`;

    return this.runTask(prompt);
  }

  async createBudget(project: string, totalAmount: number, duration: string = '12 months'): Promise<TaskResult> {
    await this.notifier.notify(`Creating budget: ${project}`);

    const prompt = `
Create a grant budget:

**Project:** ${project}
**Total Amount:** $${totalAmount.toLocaleString()}
**Duration:** ${duration}

**Budget Categories:**

| Category | Amount | % |
|----------|--------|---|
| Personnel | | |
| Fringe Benefits | | |
| Travel | | |
| Equipment | | |
| Supplies | | |
| Contractual | | |
| Other Direct | | |
| Indirect (if allowed) | | |
| **TOTAL** | $${totalAmount.toLocaleString()} | 100% |

**Budget Narrative Format:**

**Personnel ($X)**
- [Name], [Title] (X FTE): $X salary x X% effort = $X
- [Role] - Responsible for [duties]

**Fringe Benefits ($X)**
- Calculated at X% of salaries
- Includes: health insurance, FICA, retirement

**[Continue for each category...]**

**Requirements:**
- All costs must be allowable under 2 CFR 200
- Each line item needs justification
- Personnel effort must align with project scope
- No unallowable costs (entertainment, alcohol, etc.)

**Verification:**
- [ ] Math is correct
- [ ] All costs are allowable
- [ ] Justifications are clear
- [ ] Personnel effort is reasonable
`;

    return this.runTask(prompt);
  }

  async evaluateOpportunity(opportunityName: string, funderUrl: string = ''): Promise<TaskResult> {
    await this.notifier.notify(`Evaluating: ${opportunityName}`);

    const prompt = `
Evaluate funding opportunity: ${opportunityName}
${funderUrl ? `URL: ${funderUrl}` : ''}

**Evaluation Criteria:**

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Mission Alignment | | |
| Capacity to Implement | | |
| Competitive Advantage | | |
| Likelihood of Success | | |
| Effort vs. Reward | | |
| **TOTAL** | /25 | |

**Analysis:**

**Eligibility Check:**
- [ ] Organization type eligible
- [ ] Geographic area eligible
- [ ] Project type eligible
- [ ] Indirect cost rate acceptable

**Funder Profile:**
- Recent grants in this area
- Average grant size
- Funding priorities
- Review criteria

**Competitive Analysis:**
- Typical applicant pool
- Our strengths vs. competitors
- Unique value proposition

**Recommendation:**
[ ] PURSUE - Strong fit, high priority
[ ] CONSIDER - Good fit, moderate priority
[ ] SKIP - Poor fit or low ROI

**Rationale:**
[Explain recommendation]

**If pursuing, next steps:**
1. [Action item with deadline]
2. [Action item with deadline]
3. [Action item with deadline]
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
