# Entity Agents - Node/TypeScript Edition

A team of 11 specialized autonomous AI agents for software development, powered by Claude.

## Quick Start

```typescript
import { getAgent } from 'entity-agents';

// Get an agent by name
const valentina = getAgent('valentina');

// Run a task
const result = await valentina.fixBug(123);
console.log(result.output);
```

## Agents

| Agent | Role | Specialty |
|-------|------|-----------|
| **Valentina** | UI Developer | React, TypeScript, CSS, accessibility |
| **Sydney** | Senior Backend Developer | Node.js, APIs, databases, Docker |
| **Amber** | Systems Architect | System design, microservices, APIs |
| **Victoria** | AI Researcher | LLMs, embeddings, RAG, vector DBs |
| **Brett Jr** | Cybersecurity Specialist | Security audits, auth, encryption |
| **Tango** | QA Tester | Jest, Vitest, testing strategies |
| **Sugar** | Documentation Specialist | Technical writing, API docs, diagrams |
| **Sophie** | Mobile Developer | React Native, PWA, iOS, Android |
| **Asheton** | Product Strategist | Requirements, roadmap, prioritization |
| **Maxwell** | Data Research Engineer | Web scraping, ETL, databases |
| **Harper** | Grant Researcher & Writer | Funding, proposals, compliance |
| **Quinn** | Network Engineer | Infrastructure, Docker, K8s, VPN |

## Installation

```bash
npm install entity-agents

# Or from source
git clone https://github.com/grichardsonEntity/entity-agents-node.git
cd entity-agents-node
npm install
npm run build
```

## Requirements

- Node.js 18+
- Claude CLI installed and configured (`claude` command available)

## Usage

### Direct Import

```typescript
import { SydneyAgent, ValentinaAgent } from 'entity-agents';

const sydney = new SydneyAgent();
const valentina = new ValentinaAgent();

await sydney.createEndpoint('POST', '/api/users', 'Create a new user');
await valentina.createComponent('Button', 'Accessible button component');
```

### CLI Usage

```bash
# Build first
npm run build

# Sydney - Backend Developer
npm run sydney -- --endpoint POST /api/users --description "Create user"

# Valentina - UI Developer
npm run valentina -- --component Button --description "Primary button"

# Tango - QA Tester
npm run tango -- --write src/utils.ts --type unit

# Quinn - Network Engineer
npm run quinn -- --deploy docker-compose.yml --env staging
```

## Configuration

```typescript
import { BaseAgent, type AgentConfig } from 'entity-agents';

const config: AgentConfig = {
  name: 'Sydney',
  role: 'Senior Backend Developer',
  projectRoot: '/path/to/project',
  github: { owner: 'myorg', repo: 'myrepo' },
  notifications: {
    fileEnabled: true,
    macosEnabled: true,
    smsEnabled: true,
    smsPhone: '+1234567890',
  },
  // ... other config
};

const sydney = new SydneyAgent(config);
```

## Notifications

Agents can notify via:

- **File logging** - Writes to `.entity-agents/logs/`
- **macOS notifications** - Native desktop notifications
- **SMS (iMessage)** - Via macOS Messages app

## Approval Workflow

Dangerous operations require approval:

```typescript
// This will request approval before deploying to production
await quinn.deployContainers('docker-compose.yml', 'production');

// Check pending approvals
console.log(quinn.getStatus().pendingApprovals);
```

## Project Structure

```
entity-agents-node/
├── src/
│   ├── shared/           # Base classes and utilities
│   ├── valentina/        # UI Developer
│   ├── sydney/           # Backend Developer
│   ├── amber/            # Systems Architect
│   ├── victoria/         # AI Researcher
│   ├── brettjr/          # Cybersecurity
│   ├── tango/            # QA Tester
│   ├── sugar/            # Documentation
│   ├── sophie/           # Mobile Developer
│   ├── asheton/          # Product Strategist
│   ├── maxwell/          # Data Engineer
│   ├── harper/           # Grant Writer
│   └── quinn/            # Network Engineer
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT

## Links

- [Entity Agents (Prompt Files)](https://github.com/grichardsonEntity/entity-agents)
- [Entity Agents Python](https://github.com/grichardsonEntity/entity-agents-python)
