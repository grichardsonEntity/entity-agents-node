/**
 * Asheton Agent - Product Strategist
 *
 * Expert in product vision, feature prioritization, requirements,
 * competitive analysis, market research, and go-to-market strategy.
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { ashetonConfig } from './config.js';

export class AshetonAgent extends BaseAgent {
  constructor(config = ashetonConfig) {
    super(config);
  }

  async evaluateFeature(feature: string): Promise<TaskResult> {
    await this.notifier.notify(`Evaluating: ${feature}`);
    const prompt = `Evaluate feature: ${feature}\n\nProvide: user story, acceptance criteria, priority, effort.`;
    return this.runTask(prompt);
  }

  async prioritizeBacklog(items: string[]): Promise<TaskResult> {
    const itemList = items.join('\n- ');
    const prompt = `Prioritize backlog items:\n- ${itemList}\n\nProvide: priority matrix, recommended order.`;
    return this.runTask(prompt);
  }

  async createRoadmap(timeframe: string, goals: string): Promise<TaskResult> {
    const prompt = `Create roadmap for: ${timeframe}\n\nGoals: ${goals}\n\nProvide: phases, features, metrics.`;
    return this.runTask(prompt);
  }

  async writeUserStories(feature: string): Promise<TaskResult> {
    const prompt = `Write user stories for: ${feature}\n\nFormat: As a [user], I want [goal], so that [benefit].`;
    return this.runTask(prompt);
  }

  async competitiveAnalysis(market: string, competitors?: string[]): Promise<TaskResult> {
    await this.notifier.notify(`Analyzing competitive landscape: ${market}`);

    const competitorsText = competitors
      ? `\nKnown competitors to evaluate:\n${competitors.map(c => `- ${c}`).join('\n')}`
      : '';

    const prompt = `Conduct a comprehensive competitive analysis for the market: ${market}
${competitorsText}

## Competitive Landscape

### Market Overview
[Industry context, market maturity, key dynamics]

### Competitor Profiles
For each major competitor:
- Company, Positioning, Target Audience, Strengths, Weaknesses, Pricing, Market Share

### Feature Comparison Matrix
| Feature | Our Product | Competitor A | Competitor B | Competitor C |
|---------|-------------|-------------|-------------|-------------|

### SWOT Analysis
- Strengths, Weaknesses, Opportunities, Threats

### Competitive Positioning Map
[Describe positioning on key axes: price vs features, ease-of-use vs power]

### Differentiation Strategy
- Current differentiators
- Moat opportunities
- Gaps to close
- Blue ocean areas

### Strategic Recommendations
[Numbered recommendations with rationale]`;

    return this.runTask(prompt);
  }

  async marketResearch(productArea: string, targetAudience: string): Promise<TaskResult> {
    await this.notifier.notify(`Researching market: ${productArea} for ${targetAudience}`);

    const prompt = `Conduct comprehensive market research for: ${productArea}
Target audience: ${targetAudience}

## Market Research Report

### Executive Summary

### Market Sizing
#### TAM (Total Addressable Market)
- Size, Methodology, Growth rate, Time horizon
#### SAM (Serviceable Addressable Market)
- Size, Geographic scope, Segment focus
#### SOM (Serviceable Obtainable Market)
- Size, Realistic capture %, Timeline, Assumptions

### Customer Segments
| Segment | Size | Pain Points | Willingness to Pay | Priority |

#### Ideal Customer Profile (ICP)
- Company size, Industry, Budget, Decision maker, Key pain points

### Market Trends
[Numbered trends with description, impact, timeline]

### Growth Opportunities
[Numbered opportunities with potential, effort, timeline]

### Risks and Barriers

### Recommendations`;

    return this.runTask(prompt);
  }

  async stakeholderMap(project: string, stakeholders: string[]): Promise<TaskResult> {
    await this.notifier.notify(`Mapping stakeholders for: ${project}`);

    const stakeholdersText = stakeholders.map(s => `- ${s}`).join('\n');

    const prompt = `Create stakeholder analysis for project: ${project}

Stakeholders to map:
${stakeholdersText}

## Stakeholder Analysis

### Project Context

### Stakeholder Profiles
For each stakeholder: Name/Role, Interest, Influence level, Interest level, Current stance, Key concerns, Needs

### Influence/Interest Matrix
|  | Low Interest | High Interest |
|---|-------------|---------------|
| **High Influence** | KEEP SATISFIED | MANAGE CLOSELY |
| **Low Influence** | MONITOR | KEEP INFORMED |

#### Quadrant Placement

### Communication Plan
| Stakeholder | Channel | Frequency | Content | Owner |

### Alignment Strategy
1. Coalition building
2. Resistance management
3. Escalation path

### RACI Matrix
| Decision | Responsible | Accountable | Consulted | Informed |`;

    return this.runTask(prompt);
  }

  async defineOkrs(period: string, strategicGoals: string[]): Promise<TaskResult> {
    await this.notifier.notify(`Defining OKRs for: ${period}`);

    const goalsText = strategicGoals.map(g => `- ${g}`).join('\n');

    const prompt = `Define OKR framework for period: ${period}

Strategic goals:
${goalsText}

## OKR Framework

### Period: ${period}

### Strategic Context

### Objective 1: [Bold, qualitative goal]
**Key Results:**
1. KR1: [Measurable outcome] — Baseline: [X] → Target: [Y]
2. KR2: [Measurable outcome] — Baseline: [X] → Target: [Y]
3. KR3: [Measurable outcome] — Baseline: [X] → Target: [Y]
**Leading Indicators:**
**Initiatives:**

### Objective 2: [Bold, qualitative goal]
**Key Results:**
1. KR1 — Baseline → Target
2. KR2 — Baseline → Target
3. KR3 — Baseline → Target

### Objective 3: [Bold, qualitative goal]
**Key Results:**
1. KR1 — Baseline → Target
2. KR2 — Baseline → Target
3. KR3 — Baseline → Target

### Tracking Plan
| Key Result | Metric | Source | Cadence | Owner |

### Scoring Methodology
- 0.0-0.3: Significant miss
- 0.4-0.6: Progress but fell short
- 0.7-1.0: Strong delivery
- 1.0+: May not have been ambitious enough

### Health Metrics (Always-On)`;

    return this.runTask(prompt);
  }

  async synthesizeFeedback(feedbackSources: string[], productArea: string): Promise<TaskResult> {
    await this.notifier.notify(`Synthesizing feedback for: ${productArea}`);

    const sourcesText = feedbackSources.map(s => `- ${s}`).join('\n');

    const prompt = `Synthesize customer feedback for product area: ${productArea}

Feedback sources:
${sourcesText}

## Customer Feedback Synthesis

### Executive Summary

### Feedback Volume & Sources
| Source | Volume | Time Period | Reliability |

### Theme Analysis
For each theme: Name, Frequency, Sentiment, Representative quotes, Impact, Recommendation

### Sentiment Overview
| Dimension | Score | Trend |
| Overall NPS | CSAT | Feature satisfaction | Support satisfaction |

### Feature Request Triage
| Request | Frequency | Strategic Fit | Effort | Priority |

### Pain Point Severity Map
| Pain Point | Severity | Frequency | Workaround Exists | Action |

### Insights & Recommendations
**Immediate Actions (This Sprint):**
**Short-term (Next Quarter):**
**Strategic (Long-term):**

### Gaps in Feedback`;

    return this.runTask(prompt);
  }

  async goToMarketPlan(product: string, targetMarket: string): Promise<TaskResult> {
    await this.notifier.notify(`Building GTM plan: ${product} → ${targetMarket}`);

    const prompt = `Create go-to-market plan for: ${product}
Target market: ${targetMarket}

## Go-to-Market Strategy

### Executive Summary

### Product Positioning
- For: [Target customer]
- Who: [Statement of need]
- Our product is: [Product category]
- That: [Key benefit]
- Unlike: [Primary competitor]
- Our product: [Primary differentiation]

### Target Market Definition
- Primary segment
- Secondary segment
- Beachhead market

### Pricing Strategy
| Tier | Price | Features | Target |
| Free/Trial | Pro | Enterprise |

### Channel Strategy
| Channel | Role | Investment | Expected CAC | Timeline |

### Messaging Framework
| Audience | Pain Point | Message | Proof Point |

### Launch Plan
#### Pre-Launch (T-8 to T-4 weeks)
#### Launch Week (T-0)
#### Post-Launch (T+1 to T+4 weeks)

### Success Metrics
| Metric | Target (30 day) | Target (90 day) | Target (6 month) |

### Budget & Resources
| Category | Investment | Expected Return |

### Risk Mitigation
| Risk | Probability | Impact | Mitigation |`;

    return this.runTask(prompt);
  }

  async productAnalyticsPlan(product: string, metrics?: string[]): Promise<TaskResult> {
    await this.notifier.notify(`Designing analytics plan: ${product}`);

    const metricsText = metrics
      ? `\nKey metrics of interest:\n${metrics.map(m => `- ${m}`).join('\n')}`
      : '';

    const prompt = `Design a product analytics plan for: ${product}
${metricsText}

## Product Analytics Framework

### Analytics Philosophy

### North Star Metric
- Metric, Why, Current value, Target

### Metric Hierarchy
#### Level 1: Business Metrics
| Metric | Definition | Target | Owner |
#### Level 2: Product Metrics
| Metric | Definition | Target | Owner |
#### Level 3: Feature Metrics
| Metric | Definition | Target | Owner |

### Funnel Analysis
Stage 1: Awareness → Stage 2: Signup → Stage 3: Activation → Stage 4: Engagement → Stage 5: Revenue → Stage 6: Referral
[With conversion rates and targets at each stage]

### Cohort Analysis Strategy
| Cohort Type | Definition | Key Question |
| Acquisition cohort | Behavioral cohort | Feature cohort |

### Retention Framework
- D1, D7, D30, D90 retention targets

### A/B Testing Plan
For each test: Hypothesis, Primary metric, Secondary metrics, Guardrail metrics, Sample size, Duration, Segments

### Testing Prioritization
| Test | Expected Impact | Effort | Confidence | Priority |

### Instrumentation Requirements
- Events to track
- Properties to capture
- Tools needed

### Dashboard Design
1. Executive dashboard
2. Product dashboard
3. Experiment dashboard

### Review Cadence
- Daily, Weekly, Monthly, Quarterly`;

    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
