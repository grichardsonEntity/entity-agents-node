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
  // DOCUMENT GENERATION METHODS
  // ============================================

  async createPresentation(
    title: string,
    content: Record<string, unknown>,
    templatePath?: string,
    outputPath?: string
  ): Promise<TaskResult> {
    await this.notifier.notify(`Creating presentation: ${title}`);

    const output = outputPath || `output/${title.toLowerCase().replace(/\s+/g, '-')}.pptx`;

    const prompt = `
Create a PowerPoint presentation using pptxgenjs (Node.js):

**Title:** ${title}
**Template:** ${templatePath || 'Create from scratch with professional styling'}
**Output:** ${output}
**Content:** ${JSON.stringify(content, null, 2)}

**Implementation:**
\`\`\`typescript
import PptxGenJS from 'pptxgenjs';

const pptx = new PptxGenJS();

// Set presentation properties
pptx.author = 'ARES Security';
pptx.title = '${title}';
pptx.subject = 'Training/Product Documentation';

// Define master slide with branding
pptx.defineSlideMaster({
  title: 'ARES_MASTER',
  background: { color: 'FFFFFF' },
  objects: [
    { rect: { x: 0, y: 6.9, w: '100%', h: 0.6, fill: { color: '003366' } } },
    { text: { text: 'ARES Security', options: { x: 0.5, y: 7.0, w: 3, h: 0.4, color: 'FFFFFF', fontSize: 10 } } }
  ]
});

// Add title slide
let slide = pptx.addSlide();
slide.addText('${title}', { x: 0.5, y: 2.5, w: '90%', h: 1.5, fontSize: 44, bold: true, color: '003366', align: 'center' });
slide.addText(new Date().toLocaleDateString(), { x: 0.5, y: 4.5, w: '90%', h: 0.5, fontSize: 18, color: '666666', align: 'center' });

// Add content slides based on content object
for (const [sectionTitle, sectionContent] of Object.entries(content)) {
  slide = pptx.addSlide({ masterName: 'ARES_MASTER' });
  slide.addText(sectionTitle, { x: 0.5, y: 0.5, w: '90%', h: 1, fontSize: 32, bold: true, color: '003366' });

  if (Array.isArray(sectionContent)) {
    // Bullet points
    slide.addText(sectionContent.map(item => ({ text: item, options: { bullet: true } })),
      { x: 0.5, y: 1.5, w: '90%', h: 5, fontSize: 18, color: '333333' });
  } else {
    slide.addText(String(sectionContent), { x: 0.5, y: 1.5, w: '90%', h: 5, fontSize: 18, color: '333333' });
  }
}

// Save presentation
await pptx.writeFile({ fileName: '${output}' });
\`\`\`

**Slide Structure Guidelines:**
1. Title slide with presentation title and date
2. Agenda/overview slide
3. Content slides (one key message per slide)
4. Summary/conclusion slide

**Before delivering, verify:**
- [ ] All slides render correctly
- [ ] Formatting is consistent
- [ ] Text is readable
- [ ] File saves without errors
`;

    return this.runTask(prompt);
  }

  async createDocument(
    title: string,
    content: Record<string, unknown>,
    templatePath?: string,
    outputPath?: string,
    docType: 'report' | 'prd' | 'training' = 'report'
  ): Promise<TaskResult> {
    await this.notifier.notify(`Creating document: ${title}`);

    const output = outputPath || `output/${title.toLowerCase().replace(/\s+/g, '-')}.docx`;

    const prompt = `
Create a Word document using docx (Node.js):

**Title:** ${title}
**Type:** ${docType}
**Template:** ${templatePath || 'Create from scratch with professional styling'}
**Output:** ${output}
**Content:** ${JSON.stringify(content, null, 2)}

**Implementation:**
\`\`\`typescript
import { Document, Packer, Paragraph, TextRun, HeadingLevel, TableOfContents, Header, Footer, PageNumber } from 'docx';
import * as fs from 'fs';

const doc = new Document({
  creator: 'ARES Security',
  title: '${title}',
  description: '${docType} document',
  sections: [{
    properties: {},
    headers: {
      default: new Header({
        children: [new Paragraph({ text: '${title}', alignment: 'right' })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          children: [new TextRun('Page '), PageNumber.CURRENT, new TextRun(' of '), PageNumber.TOTAL_PAGES]
        })]
      })
    },
    children: [
      // Title
      new Paragraph({
        text: '${title}',
        heading: HeadingLevel.TITLE,
        spacing: { after: 400 }
      }),

      // Table of Contents
      new TableOfContents('Table of Contents', {
        hyperlink: true,
        headingStyleRange: '1-3'
      }),

      // Content sections
      ${docType === 'report' ? `
      // Report structure
      new Paragraph({ text: 'Executive Summary', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.executiveSummary || '[Executive summary content]' }),

      new Paragraph({ text: 'Introduction', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.introduction || '[Introduction content]' }),

      new Paragraph({ text: 'Findings', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.findings || '[Findings content]' }),

      new Paragraph({ text: 'Recommendations', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.recommendations || '[Recommendations content]' }),

      new Paragraph({ text: 'Conclusion', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.conclusion || '[Conclusion content]' }),
      ` : ''}
      ${docType === 'prd' ? `
      // PRD structure
      new Paragraph({ text: 'Overview', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.overview || '[Overview content]' }),

      new Paragraph({ text: 'Problem Statement', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.problem || '[Problem statement]' }),

      new Paragraph({ text: 'Goals & Objectives', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.goals || '[Goals content]' }),

      new Paragraph({ text: 'Requirements', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.requirements || '[Requirements content]' }),

      new Paragraph({ text: 'User Stories', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.userStories || '[User stories content]' }),
      ` : ''}
      ${docType === 'training' ? `
      // Training plan structure
      new Paragraph({ text: 'Training Overview', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.overview || '[Training overview]' }),

      new Paragraph({ text: 'Learning Objectives', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.objectives || '[Objectives content]' }),

      new Paragraph({ text: 'Curriculum', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.curriculum || '[Curriculum content]' }),

      new Paragraph({ text: 'Schedule', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.schedule || '[Schedule content]' }),

      new Paragraph({ text: 'Assessment', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content.assessment || '[Assessment content]' }),
      ` : ''}
    ]
  }]
});

// Save document
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync('${output}', buffer);
\`\`\`

**Before delivering, verify:**
- [ ] Document opens correctly
- [ ] Styles are consistent
- [ ] Headers/footers are set
- [ ] Table of contents works
`;

    return this.runTask(prompt);
  }

  async createPdf(
    title: string,
    content: Record<string, unknown>,
    outputPath?: string,
    fromDocx?: string
  ): Promise<TaskResult> {
    await this.notifier.notify(`Creating PDF: ${title}`);

    const output = outputPath || `output/${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;

    const prompt = `
Create a PDF document:

**Title:** ${title}
**Output:** ${output}
**Content:** ${JSON.stringify(content, null, 2)}
${fromDocx ? `**Source DOCX:** ${fromDocx}` : ''}

**Implementation with PDFKit (Node.js):**
\`\`\`typescript
import PDFDocument from 'pdfkit';
import * as fs from 'fs';

const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 72, bottom: 72, left: 72, right: 72 },
  info: {
    Title: '${title}',
    Author: 'ARES Security'
  }
});

const stream = fs.createWriteStream('${output}');
doc.pipe(stream);

// Title
doc.fontSize(24)
   .fillColor('#003366')
   .text('${title}', { align: 'center' });

doc.moveDown(2);

// Content sections
const content = ${JSON.stringify(content)};

for (const [sectionTitle, sectionContent] of Object.entries(content)) {
  // Section heading
  doc.fontSize(16)
     .fillColor('#003366')
     .text(sectionTitle);

  doc.moveDown(0.5);

  // Section content
  doc.fontSize(11)
     .fillColor('#333333')
     .text(String(sectionContent), { align: 'justify' });

  doc.moveDown(1.5);
}

// Footer with page numbers
const pages = doc.bufferedPageRange();
for (let i = 0; i < pages.count; i++) {
  doc.switchToPage(i);
  doc.fontSize(10)
     .fillColor('#666666')
     .text(\`Page \${i + 1} of \${pages.count}\`,
       72, doc.page.height - 50,
       { align: 'center', width: doc.page.width - 144 });
}

doc.end();
\`\`\`

${fromDocx ? `
**Alternative: Convert from DOCX using libreoffice-convert:**
\`\`\`typescript
import libre from 'libreoffice-convert';
import * as fs from 'fs';
import { promisify } from 'util';

const convert = promisify(libre.convert);
const docxBuffer = fs.readFileSync('${fromDocx}');
const pdfBuffer = await convert(docxBuffer, '.pdf', undefined);
fs.writeFileSync('${output}', pdfBuffer);
\`\`\`
` : ''}

**Before delivering, verify:**
- [ ] PDF opens correctly
- [ ] All pages render
- [ ] Text is selectable
- [ ] File size is reasonable
`;

    return this.runTask(prompt);
  }

  async applyTemplate(
    templatePath: string,
    data: Record<string, unknown>,
    outputPath: string
  ): Promise<TaskResult> {
    await this.notifier.notify(`Applying template: ${templatePath}`);

    const fileExt = templatePath.split('.').pop()?.toLowerCase() || '';

    const prompt = `
Apply data to template:

**Template:** ${templatePath}
**Output:** ${outputPath}
**Data:** ${JSON.stringify(data, null, 2)}
**Format:** ${fileExt.toUpperCase()}

**Placeholder Pattern:**
Templates use {{PLACEHOLDER}} syntax for variable replacement.

${fileExt === 'pptx' ? `
**Implementation for PPTX:**
\`\`\`typescript
import PptxGenJS from 'pptxgenjs';
// Note: pptxgenjs doesn't support loading existing files
// Use officegen or consider python-pptx for template modification

// Alternative approach: recreate presentation with template styling
const pptx = new PptxGenJS();
const data = ${JSON.stringify(data)};

// Apply data to recreated slides matching template structure
// ...
\`\`\`
` : ''}

${fileExt === 'docx' ? `
**Implementation for DOCX:**
\`\`\`typescript
import * as fs from 'fs';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

const templateContent = fs.readFileSync('${templatePath}', 'binary');
const zip = new PizZip(templateContent);

const doc = new Docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true,
});

const data = ${JSON.stringify(data)};
doc.render(data);

const buffer = doc.getZip().generate({
  type: 'nodebuffer',
  compression: 'DEFLATE',
});

fs.writeFileSync('${outputPath}', buffer);
\`\`\`
` : ''}

**Before delivering, verify:**
- [ ] All placeholders replaced
- [ ] Formatting preserved
- [ ] No {{PLACEHOLDER}} text remains
- [ ] Output file opens correctly
`;

    return this.runTask(prompt);
  }

  async createTrainingPlan(
    title: string,
    objectives: string[],
    duration: string,
    audience: string,
    outputFormat: 'pptx' | 'docx' | 'pdf' = 'pptx'
  ): Promise<TaskResult> {
    await this.notifier.notify(`Creating training plan: ${title}`);

    const prompt = `
Create a training plan:

**Title:** ${title}
**Learning Objectives:** ${JSON.stringify(objectives)}
**Duration:** ${duration}
**Target Audience:** ${audience}
**Output Format:** ${outputFormat.toUpperCase()}

**Training Plan Structure:**

## 1. Training Overview
- Purpose and scope
- Target audience description
- Prerequisites

## 2. Learning Objectives
By the end of this training, participants will be able to:
${objectives.map(obj => `- ${obj}`).join('\n')}

## 3. Curriculum Outline

| Module | Topic | Duration | Method |
|--------|-------|----------|--------|
| 1 | Introduction & Overview | X hrs | Lecture |
| 2 | Core Concepts | X hrs | Interactive |
| 3 | Hands-on Practice | X hrs | Lab |
| 4 | Advanced Topics | X hrs | Workshop |
| 5 | Assessment & Review | X hrs | Exam/Project |

## 4. Detailed Module Breakdown
[Module details for each...]

## 5. Training Schedule
[Day-by-day schedule...]

## 6. Assessment & Evaluation
- Knowledge checks
- Practical assessments
- Certification criteria

## 7. Resources & Materials
- Training materials list
- Equipment needed

**Output as ${outputFormat.toUpperCase()}:**
${outputFormat === 'pptx' ? 'Create PowerPoint with one module per section, visual aids, and speaker notes' : ''}
${outputFormat === 'docx' ? 'Create Word document with professional formatting and table of contents' : ''}
${outputFormat === 'pdf' ? 'Create PDF with clean layout and print-ready formatting' : ''}

Save to: output/${title.toLowerCase().replace(/\s+/g, '-')}-training-plan.${outputFormat}

**Before delivering, verify:**
- [ ] All modules are complete
- [ ] Timeline is realistic
- [ ] Objectives map to assessments
`;

    return this.runTask(prompt);
  }

  async createPrd(
    productName: string,
    problemStatement: string,
    targetUsers: string,
    outputFormat: 'pptx' | 'docx' | 'pdf' = 'docx'
  ): Promise<TaskResult> {
    await this.notifier.notify(`Creating PRD: ${productName}`);

    const prompt = `
Create a Product Requirements Document (PRD):

**Product:** ${productName}
**Problem:** ${problemStatement}
**Target Users:** ${targetUsers}
**Output Format:** ${outputFormat.toUpperCase()}

**PRD Structure:**

# Product Requirements Document: ${productName}

## 1. Overview
### 1.1 Purpose
### 1.2 Scope
### 1.3 Definitions

## 2. Problem Statement
${problemStatement}

### 2.1 Current State
### 2.2 Pain Points

## 3. Goals & Objectives
### 3.1 Business Goals
### 3.2 User Goals
### 3.3 Success Metrics (KPIs)

## 4. Target Users
${targetUsers}

### 4.1 User Personas
### 4.2 User Journeys

## 5. Requirements
### 5.1 Functional Requirements
### 5.2 Non-Functional Requirements

## 6. User Stories

## 7. Technical Considerations

## 8. Timeline & Milestones

## 9. Risks & Mitigations

Save to: output/${productName.toLowerCase().replace(/\s+/g, '-')}-prd.${outputFormat}

**Before delivering, verify:**
- [ ] All sections complete
- [ ] Requirements are measurable
- [ ] User stories have acceptance criteria
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
