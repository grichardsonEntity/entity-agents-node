# Claude Code: Complete Agent Optimization & Consolidation (Node/TypeScript)

## What This Does

This is a comprehensive prompt that transforms your Node/TypeScript agent team:

1. **ANALYZE** - Score every agent on 7 dimensions, identify weaknesses
2. **IMPROVE** - Apply optimizations to make each agent a superstar  
3. **CONSOLIDATE** - Merge Sydney+Valentina and Sugar+Harper
4. **VERIFY** - Ensure everything compiles and works
5. **SYNC** - Commit to Git and push to GitHub

**Run this in your `entity-agents-node` directory.**

---

# PART 1: DISCOVERY & ANALYSIS

## Step 1.1: Find All Agents

```bash
# Check both root and src/ directories
find . -type d -maxdepth 2 -name "[a-z]*" | grep -v node_modules | grep -v _archived | grep -v dist | grep -v shared | grep -v docs | sort
```

Expected agents: sydney, valentina, amber, victoria, brettjr, tango, sugar, sophie, asheton, maxwell, harper, quinn

## Step 1.2: Read Every Agent File Completely

For EACH agent, read in full:
- `<agent>/config.ts` - Configuration and system prompt
- `<agent>/agent.ts` - Methods and implementation  
- `<agent>/index.ts` - Exports

Also read:
- `shared/baseAgent.ts`
- `shared/config.ts`
- `shared/types.ts`

**Do not skim. Read every line.**

## Step 1.3: Score Each Agent (1-5)

Evaluate each agent on:

| Dimension | 5 (Excellent) | 3 (Adequate) | 1 (Poor) |
|-----------|---------------|--------------|----------|
| **Identity & Role** | Crystal clear, memorable | Defined but vague | Confusing |
| **Expertise** | Specific, actionable skills | Generic skills listed | Vague "good at X" |
| **Code Patterns** | 2+ complete realistic examples | Some incomplete examples | No examples |
| **Guardrails** | 5+ specific DO NOT rules | Few vague rules | None |
| **Output Formats** | Clear templates defined | Some guidance | None |
| **Task Methods** | Detailed prompts with verification | Basic prompts | Just passes to runTask |
| **Tools** | Perfectly matched to role | Mostly appropriate | Wrong tools |

## Step 1.4: Document Findings for Each Agent

For each agent, note:
- **Score** for each dimension
- **Strengths** (2-3)
- **Issues** (with specific locations)
- **Required Improvements**

## Step 1.5: Create Analysis Report

Save to `docs/agent-analysis-report.md`:

```markdown
# Entity Agents Analysis Report (Node/TypeScript)

**Date:** [DATE]
**Team Score:** X.X / 5.0

## Scores Summary

| Agent | Identity | Expertise | Patterns | Guardrails | Output | Methods | Tools | **Avg** |
|-------|----------|-----------|----------|------------|--------|---------|-------|---------|
| Sydney | X | X | X | X | X | X | X | X.X |
| Valentina | X | X | X | X | X | X | X | X.X |
| Amber | X | X | X | X | X | X | X | X.X |
| Victoria | X | X | X | X | X | X | X | X.X |
| Brett Jr | X | X | X | X | X | X | X | X.X |
| Tango | X | X | X | X | X | X | X | X.X |
| Sugar | X | X | X | X | X | X | X | X.X |
| Sophie | X | X | X | X | X | X | X | X.X |
| Asheton | X | X | X | X | X | X | X | X.X |
| Maxwell | X | X | X | X | X | X | X | X.X |
| Harper | X | X | X | X | X | X | X | X.X |
| Quinn | X | X | X | X | X | X | X | X.X |

## Individual Analysis

### [Agent Name] - [Role]
**Overall:** X.X / 5.0

**Strengths:**
1. [Strength]
2. [Strength]

**Issues:**
1. [Issue + location]
2. [Issue + location]

**Improvements Needed:**
1. [Specific improvement]
2. [Specific improvement]

[Repeat for all 12 agents]

## Priority Improvements
1. [Agent] - [Change]
2. [Agent] - [Change]
...
```

---

# PART 2: APPLY IMPROVEMENTS

## Improvement Patterns

Apply these based on each agent's scores:

### If Code Patterns < 4: Add Golden Examples

Add to `config.ts` systemPrompt:
```typescript
systemPrompt: `
...
## Code Patterns

### [Pattern Name]
\`\`\`typescript
// Complete, realistic example showing expected output style
[working code]
\`\`\`
`
```

### If Guardrails < 4: Add Specific Rules

Add to `config.ts` systemPrompt:
```typescript
systemPrompt: `
...
## DO NOT
- [Specific mistake] because [consequence]
- [Another mistake specific to this domain]
- [Security/quality concern]
`
```

### If Output Formats < 4: Add Templates

Add to `config.ts` systemPrompt:
```typescript
systemPrompt: `
...
## Output Formats

### For [Task Type]
\`\`\`
[Template structure]
\`\`\`
`
```

### If Methods < 4: Add Verification Steps

Update methods in `agent.ts`:
```typescript
const prompt = `
${originalPrompt}

**Before delivering, verify:**
- [ ] [Check 1]
- [ ] [Check 2]
- [ ] [Check 3]
`;
```

## Apply to Each Agent

Go through ALL 12 agents and apply needed improvements based on their scores.

After each agent, verify TypeScript compiles:
```bash
npx tsc --noEmit
```

---

# PART 3: CONSOLIDATE AGENTS

## Step 3.1: Merge Sydney + Valentina → Sydney (Full Stack)

### Create merged config.ts:

The new `sydney/config.ts` must include:
- **name:** "Sydney"
- **role:** "Full Stack Developer"
- **allowedTools:** Union of both agents (deduplicated)
- **allowedBashPatterns:** Union of both agents
- **githubLabels:** Union + "fullstack"
- **systemPrompt:** Merged with this structure:

```typescript
export const sydneyConfig: BaseConfig = {
  name: 'Sydney',
  role: 'Full Stack Developer',
  
  allowedTools: [
    // Union of both
  ],
  
  allowedBashPatterns: [
    // Union of both
  ],
  
  githubLabels: [
    // Union + 'fullstack'
  ],
  
  systemPrompt: `You are Sydney, a Full Stack Developer...

## Your Approach
[New section on full-stack thinking]

## Backend Expertise
[ALL of Sydney's expertise - complete]

## Frontend Expertise
[ALL of Valentina's expertise - complete]

## Backend Patterns
[ALL of Sydney's code patterns]

## Frontend Patterns  
[ALL of Valentina's code patterns]

## Integration Patterns
[NEW section showing backend+frontend together]

## Your Responsibilities
[Merged list]

## DO NOT
[Merged list + new full-stack rules]
`,
};
```

### Create merged agent.ts:

Include:
- ALL methods from Sydney's agent.ts
- ALL methods from Valentina's agent.ts
- NEW methods: `createFeature()`, `createCrudFeature()`

```typescript
export class SydneyAgent extends BaseAgent {
  constructor(config = sydneyConfig) {
    super(config);
  }

  // ALL Sydney methods
  // ALL Valentina methods
  
  // NEW full-stack methods
  async createFeature(
    name: string,
    description: string,
    requirements: string[]
  ): Promise<TaskResult> {
    // Implementation
  }

  async createCrudFeature(
    resourceName: string,
    fields: string[]
  ): Promise<TaskResult> {
    // Implementation
  }
}
```

### Archive original Valentina:

```bash
mkdir -p _archived
mv valentina _archived/valentina
# Or if in src/:
mv src/valentina _archived/valentina
```

### Verify:

```bash
npx tsc --noEmit
npx ts-node -e "import { SydneyAgent } from './sydney'; const s = new SydneyAgent(); console.log(s.config.name, '-', s.config.role);"
# Expected: Sydney - Full Stack Developer
```

## Step 3.2: Merge Sugar + Harper → Valentina (Technical Writer)

### Create new valentina directory:

```bash
mkdir -p valentina
# Or: mkdir -p src/valentina
```

### Create valentina/config.ts:

```typescript
export const valentinaConfig: BaseConfig = {
  name: 'Valentina',
  role: 'Technical Writer & Content Strategist',
  
  allowedTools: [
    'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash',
    'WebSearch', 'WebFetch',  // For research
  ],
  
  allowedBashPatterns: [
    // Union from both
  ],
  
  githubLabels: [
    'documentation', 'docs', 'readme', 'technical-writing',
    'grants', 'funding', 'proposal', 'compliance', 'api-docs',
  ],
  
  systemPrompt: `You are Valentina, a Technical Writer...

## Your Expertise

### Technical Documentation
[ALL of Sugar's expertise]

### Grant Writing & Proposals
[ALL of Harper's expertise]

## Documentation Patterns
[ALL of Sugar's templates]

## Grant Writing Patterns
[ALL of Harper's patterns]

## Your Responsibilities
[Merged]

## DO NOT
[Merged]
`,
};
```

### Create valentina/agent.ts:

```typescript
export class ValentinaAgent extends BaseAgent {
  constructor(config = valentinaConfig) {
    super(config);
  }

  // ALL Sugar methods
  // ALL Harper methods
  
  // NEW combined method
  async createDocumentationSuite(
    projectPath: string,
    docTypes: string[] = ['readme', 'api', 'architecture', 'contributing']
  ): Promise<TaskResult> {
    // Implementation
  }
}
```

### Create valentina/index.ts:

```typescript
export { ValentinaAgent } from './agent';
export { valentinaConfig } from './config';
```

### Archive Sugar and Harper:

```bash
mv sugar _archived/sugar
mv harper _archived/harper
```

### Verify:

```bash
npx tsc --noEmit
npx ts-node -e "import { ValentinaAgent } from './valentina'; const v = new ValentinaAgent(); console.log(v.config.name, '-', v.config.role);"
# Expected: Valentina - Technical Writer & Content Strategist
```

## Step 3.3: Update Package Exports

Edit `index.ts` (or `src/index.ts`):

```typescript
export { SydneyAgent, sydneyConfig } from './sydney';
export { ValentinaAgent, valentinaConfig } from './valentina';
export { AmberAgent, amberConfig } from './amber';
export { VictoriaAgent, victoriaConfig } from './victoria';
export { BrettJrAgent, brettjrConfig } from './brettjr';
export { TangoAgent, tangoConfig } from './tango';
export { SophieAgent, sophieConfig } from './sophie';
export { AshetonAgent, ashetonConfig } from './asheton';
export { MaxwellAgent, maxwellConfig } from './maxwell';
export { QuinnAgent, quinnConfig } from './quinn';

export * from './shared/types';
```

---

# PART 4: FINAL VERIFICATION

```bash
echo "=== TypeScript Compile Check ==="
npx tsc --noEmit && echo "✓ TypeScript compiles"

echo ""
echo "=== Import Test ==="
npx ts-node -e "
import { SydneyAgent } from './src';
import { ValentinaAgent } from './src';
import { AmberAgent } from './src';
import { VictoriaAgent } from './src';
import { SophieAgent } from './src';

const s = new SydneyAgent();
const v = new ValentinaAgent();

console.log('✓ Sydney:', s.config.role);
console.log('✓ Valentina:', v.config.role);
console.log('✓ All agents loaded!');
"

echo ""
echo "=== Archived ==="
ls _archived/
```

---

# PART 5: GIT COMMIT AND SYNC

```bash
# Review
git status
git diff --stat

# Commit
git add .
git commit -m "feat: Optimize and consolidate Node/TypeScript agent team

Analysis:
- Scored all 12 agents on 7 dimensions
- Report saved to docs/agent-analysis-report.md

Improvements Applied:
- Added code examples to agents missing them
- Strengthened guardrails across team
- Added verification steps to methods
- Defined output formats

Consolidations (12 → 10 agents):
- Sydney + Valentina → Sydney (Full Stack Developer)
- Sugar + Harper → Valentina (Technical Writer)

Archived: _archived/valentina, _archived/sugar, _archived/harper

BREAKING CHANGE: ValentinaAgent now refers to Technical Writer"

# Push
git push origin main

# Sync to DGX
ssh your-dgx-server "cd ~/projects/entity-agents-node && git pull origin main && npx ts-node -e \"import { SydneyAgent } from './src'; console.log('Sync OK');\""
```

---

# CRITICAL RULES

1. **READ COMPLETELY** - Read every file in full, don't assume
2. **PRESERVE ALL METHODS** - Don't lose any functionality  
3. **PRESERVE ALL CONTENT** - Include complete expertise, patterns, don't summarize
4. **APPLY IMPROVEMENTS** - Make agents better, not just merged
5. **VERIFY EACH STEP** - TypeScript must compile
6. **ARCHIVE DON'T DELETE** - Keep originals in _archived/
7. **SAVE THE REPORT** - docs/agent-analysis-report.md is valuable

---

# DELIVERABLES

After completing this prompt:

- [ ] `docs/agent-analysis-report.md` - Full analysis with scores
- [ ] All 10 agents improved based on analysis
- [ ] `sydney/` - Full Stack Developer (merged + improved)
- [ ] `valentina/` - Technical Writer (merged + improved)
- [ ] `_archived/valentina/` - Original UI agent
- [ ] `_archived/sugar/` - Original docs agent
- [ ] `_archived/harper/` - Original grants agent
- [ ] Updated `index.ts`
- [ ] TypeScript compiles
- [ ] Git committed and pushed
- [ ] Synced to DGX
