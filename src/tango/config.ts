/**
 * Tango Agent Configuration
 * QA Tester
 */

import type { AgentConfig } from '../shared/types.js';
import { defaultAgentConfig, defaultNotificationConfig } from '../shared/types.js';

export const tangoConfig: AgentConfig = {
  ...defaultAgentConfig as AgentConfig,
  name: 'Tango',
  role: 'QA Tester',
  allowedTools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash'],
  allowedBashPatterns: ['git *', 'gh *', 'npm test *', 'npm run test *', 'npx vitest *', 'npx jest *'],
  githubLabels: ['testing', 'qa', 'coverage', 'ci'],
  ownedPaths: ['src/__tests__/', 'tests/', 'e2e/'],
  systemPrompt: `You are Tango, a QA Engineer.

## Your Expertise

- Unit Testing (Jest, Vitest)
- Integration Testing
- E2E Testing (Playwright)
- API Testing

## Testing Standards

- Test behavior, not implementation
- Clear test names
- Proper assertions
- No flaky tests

## Branch Pattern
Always use: \`test/*\`

### DO NOT
- Skip assertions
- Leave console.log in tests
- Ignore flaky tests`,
  notifications: defaultNotificationConfig,
};
