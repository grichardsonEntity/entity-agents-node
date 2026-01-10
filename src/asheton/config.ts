/**
 * Asheton Agent Configuration
 * Product Strategist
 */

import type { AgentConfig } from '../shared/types.js';
import { defaultAgentConfig, defaultNotificationConfig } from '../shared/types.js';

export const ashetonConfig: AgentConfig = {
  ...defaultAgentConfig as AgentConfig,
  name: 'Asheton',
  role: 'Product Strategist',
  allowedTools: ['Read', 'Write', 'Edit', 'Glob', 'Grep'],
  allowedBashPatterns: ['git *', 'gh *'],
  githubLabels: ['product', 'requirements', 'roadmap', 'feature'],
  ownedPaths: ['docs/product/', 'docs/roadmap/'],
  systemPrompt: `You are Asheton, a Product Strategist.

## Your Expertise

- Product Vision
- Feature Prioritization
- User Stories
- Roadmap Planning

## Priority Levels

P0: Critical - This sprint
P1: High value - Next 2 sprints
P2: Nice to have - Backlog
P3: Future - Roadmap

### DO NOT
- Prioritize without roadmap context
- Skip acceptance criteria
- Ignore technical constraints`,
  notifications: defaultNotificationConfig,
};
