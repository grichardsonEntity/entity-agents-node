/**
 * Tango Agent - QA Tester
 *
 * Expert in testing strategies, test automation, quality assurance,
 * security testing, accessibility auditing, and visual regression.
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { tangoConfig } from './config.js';

export class TangoAgent extends BaseAgent {
  constructor(config = tangoConfig) {
    super(config);
  }

  async writeTests(target: string, testType: string = 'unit'): Promise<TaskResult> {
    await this.notifier.notify(`Writing ${testType} tests for: ${target}`);

    const prompt = `Write ${testType} tests for: ${target}

**First:**
1. Read and understand the code
2. Identify testable functions/methods
3. Find edge cases and error conditions

**Test Structure:**
\`\`\`typescript
import { describe, it, expect, vi } from 'vitest';
import { target } from './module';

describe('Target', () => {
  it('should handle normal case', () => {
    const result = target('input');
    expect(result).toBe('expected');
  });

  it('should throw for invalid input', () => {
    expect(() => target(null)).toThrow();
  });
});
\`\`\`

**Cover:**
1. Happy path (normal operation)
2. Edge cases (empty, null, boundary values)
3. Error cases (invalid input, exceptions)
4. Integration points (if integration test)

**Requirements:**
- Descriptive test names
- Proper assertions with messages
- Use beforeEach/afterEach for common setup
- Mock external dependencies with vi.mock or jest.mock`;

    return this.runTask(prompt);
  }

  async runTests(path?: string): Promise<TaskResult> {
    await this.notifier.notify(`Running tests${path ? `: ${path}` : ''}`);

    const prompt = `Run tests${path ? ` for ${path}` : ''}:

**Commands:**
\`\`\`bash
npm run test${path ? ` -- ${path}` : ''} -- --coverage
\`\`\`

**Report:**
1. Total tests run
2. Passed/Failed/Skipped counts
3. Coverage percentage
4. Failed test details
5. Recommendations for failing tests`;

    return this.runTask(prompt);
  }

  async analyzeCoverage(path?: string): Promise<TaskResult> {
    const prompt = `Analyze test coverage${path ? ` for ${path}` : ''}:

**Generate coverage:**
\`\`\`bash
npx vitest run --coverage ${path || ''}
\`\`\`

**Analyze:**
1. Overall coverage percentage
2. Files with lowest coverage
3. Uncovered lines and branches
4. Critical paths without tests

**Recommendations:**
- Priority order for new tests
- Specific functions/methods needing coverage
- Test scaffolding for gaps`;

    return this.runTask(prompt);
  }

  async writeApiTests(endpoint: string, spec?: string): Promise<TaskResult> {
    await this.notifier.notify(`Writing API tests for: ${endpoint}`);

    const prompt = `Write API tests for endpoint: ${endpoint}

${spec ? `Specification: ${spec}` : ''}

**Test cases:**

## Success Cases
- Valid request returns correct response
- All required fields present in response
- Correct status codes

## Authentication
- Unauthenticated request returns 401
- Invalid token returns 401/403
- Expired token handling

## Validation
- Missing required fields return 400
- Invalid field types return 400
- Out of range values

## Edge Cases
- Empty request body
- Large payloads
- Special characters
- Concurrent requests

**Test Pattern:**
\`\`\`typescript
import request from 'supertest';
import { app } from '../app';

describe('${endpoint}', () => {
  it('should return 200 for valid request', async () => {
    const response = await request(app)
      .post('${endpoint}')
      .send({ field: 'value' })
      .expect(200);

    expect(response.body).toHaveProperty('result');
  });

  it('should return 401 without auth', async () => {
    await request(app)
      .get('${endpoint}')
      .expect(401);
  });

  it('should return 400 for invalid body', async () => {
    await request(app)
      .post('${endpoint}')
      .send({})
      .expect(400);
  });
});
\`\`\``;

    return this.runTask(prompt);
  }

  async performanceTest(target: string, config?: string): Promise<TaskResult> {
    await this.notifier.notify(`Performance testing: ${target}`);

    const prompt = `Performance test: ${target}

${config ? `Config: ${config}` : ''}

**Metrics to capture:**
1. Response time (p50, p95, p99)
2. Throughput (requests/second)
3. Error rate under load
4. Resource usage (CPU, memory)

**Test scenarios:**
1. Baseline (single user)
2. Normal load (expected users)
3. Stress test (2x expected)
4. Spike test (sudden surge)

**Tools:**
\`\`\`typescript
// k6 example
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // ramp up
    { duration: '1m', target: 20 },    // steady
    { duration: '30s', target: 100 },  // stress
    { duration: '10s', target: 0 },    // ramp down
  ],
};

export default function () {
  const res = http.get('${target}');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
\`\`\`

**Report:**
- Baseline metrics
- Performance under load
- Breaking point
- Recommendations`;

    return this.runTask(prompt);
  }

  async createTestPlan(feature: string): Promise<TaskResult> {
    const prompt = `Create test plan for feature: ${feature}

## Test Plan: ${feature}

### 1. Scope
- What's being tested
- What's out of scope
- Dependencies

### 2. Test Strategy
- Unit test coverage targets
- Integration test approach
- E2E test scenarios

### 3. Test Cases

#### Unit Tests
| ID | Description | Priority |
|----|-------------|----------|
| UT-01 | ... | High |

#### Integration Tests
| ID | Description | Priority |
|----|-------------|----------|
| IT-01 | ... | High |

#### E2E Tests
| ID | Description | Priority |
|----|-------------|----------|
| E2E-01 | ... | High |

### 4. Test Data
- Required fixtures
- Mock data
- Edge case data

### 5. Environment
- Test environment setup
- Dependencies
- CI/CD integration`;

    return this.runTask(prompt);
  }

  async securityTest(target: string, testType: string = 'owasp'): Promise<TaskResult> {
    await this.notifier.notify(`Security testing (${testType}): ${target}`);

    const prompt = `Run security tests on: ${target}
Test type: ${testType}

## OWASP Top 10 Test Suite

### A01: Broken Access Control
- Test horizontal privilege escalation (access other users' data)
- Test vertical privilege escalation (access admin functions)
- Test IDOR (Insecure Direct Object References)
- Verify CORS configuration
- Test directory traversal

### A02: Cryptographic Failures
- Check for sensitive data in plaintext
- Verify TLS configuration
- Check password hashing algorithms
- Validate token generation entropy

### A03: Injection
- **SQL Injection**: parameterized query bypass attempts
- **XSS**: reflected, stored, DOM-based payloads
- **Command Injection**: shell metacharacter testing
- **NoSQL Injection**: MongoDB operator injection

\`\`\`typescript
describe('Injection Tests', () => {
  const sqlPayloads = [
    "' OR '1'='1", "'; DROP TABLE users;--",
    "1 UNION SELECT * FROM information_schema.tables",
    "admin'--",
  ];

  const xssPayloads = [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:alert(1)',
  ];

  it.each(sqlPayloads)('should not be vulnerable to SQL injection: %s', async (payload) => {
    const response = await request(app).get(\`/api/search?q=\${encodeURIComponent(payload)}\`);
    expect(response.status).not.toBe(500);
    expect(response.text.toLowerCase()).not.toContain('sql');
  });

  it.each(xssPayloads)('should not reflect XSS payload: %s', async (payload) => {
    const response = await request(app).post('/api/data').send({ input: payload });
    expect(response.text).not.toContain(payload);
  });
});
\`\`\`

### A04: Insecure Design
- Test rate limiting on sensitive endpoints
- Verify account lockout mechanisms

### A05: Security Misconfiguration
- Check default credentials
- Verify security headers (CSP, HSTS, X-Frame-Options)
- Test error handling (no stack traces exposed)

### A07: Authentication Bypass
- Token manipulation (JWT algorithm confusion, signature stripping)
- Session fixation attacks
- Credential stuffing protection
- Password reset flow vulnerabilities

### Secrets Scanning
\`\`\`bash
# Scan for hardcoded secrets
npx secretlint ${target}
trivy fs ${target} --security-checks secret
semgrep --config=p/secrets ${target}
\`\`\`

**Report:**
- Vulnerabilities found (severity: Critical/High/Medium/Low)
- OWASP category mapping
- Proof of concept for each finding
- Remediation recommendations
- Coordinate with BrettJr for pipeline integration`;

    return this.runTask(prompt);
  }

  async accessibilityAudit(target: string, standard: string = 'wcag-aa'): Promise<TaskResult> {
    await this.notifier.notify(`Accessibility audit (${standard}): ${target}`);

    const prompt = `Run accessibility audit on: ${target}
Standard: ${standard}

## WCAG 2.1 AA Compliance Audit

### Automated Testing
\`\`\`typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should have no WCAG 2.1 AA violations', async ({ page }) => {
    await page.goto('${target}');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    const critical = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(critical).toEqual([]);
  });
});
\`\`\`

\`\`\`bash
# CLI audit tools
npx pa11y ${target} --standard WCAG2AA --reporter json
npx lighthouse ${target} --only-categories=accessibility --output=json
\`\`\`

### Manual Checks

#### 1. Keyboard Navigation
- [ ] All interactive elements reachable via Tab key
- [ ] Logical tab order (left-to-right, top-to-bottom)
- [ ] Visible focus indicators on all focusable elements
- [ ] No keyboard traps (can Tab away from all elements)
- [ ] Skip links present for main content
- [ ] Custom keyboard shortcuts documented
- [ ] Escape key closes modals/popups
- [ ] Arrow keys work in custom widgets (menus, sliders, tabs)

#### 2. Screen Reader Compatibility
- [ ] All images have meaningful alt text (or alt="" for decorative)
- [ ] Form inputs have associated labels
- [ ] ARIA landmarks used (main, nav, banner, contentinfo)
- [ ] ARIA live regions for dynamic content updates
- [ ] Heading hierarchy is logical (h1 -> h2 -> h3, no skipping)
- [ ] Tables have proper headers (th, scope, caption)
- [ ] Custom widgets have correct ARIA roles and states
- [ ] Error messages announced to screen readers

#### 3. Color Contrast
- [ ] Normal text: minimum 4.5:1 contrast ratio
- [ ] Large text (18px+ or 14px+ bold): minimum 3:1 contrast ratio
- [ ] UI components and graphics: minimum 3:1 contrast ratio
- [ ] Focus indicators: minimum 3:1 contrast ratio
- [ ] Information not conveyed by color alone
- [ ] Links distinguishable from body text without color

#### 4. Responsive Accessibility
- [ ] Content reflows at 400% zoom without horizontal scrolling
- [ ] Touch targets minimum 44x44 CSS pixels
- [ ] Text resizable up to 200% without loss of functionality
- [ ] Orientation not locked (works portrait and landscape)

#### 5. Motion and Animation
- [ ] Respects prefers-reduced-motion media query
- [ ] No auto-playing content that lasts >5 seconds
- [ ] No content that flashes more than 3 times per second

**Report:**
- Total violations by impact (critical, serious, moderate, minor)
- WCAG success criteria mapping
- Screenshots of violations
- Remediation steps with code examples
- Coordinate with Sophie for mobile accessibility`;

    return this.runTask(prompt);
  }

  async visualRegressionTest(target: string, baselinePath?: string): Promise<TaskResult> {
    await this.notifier.notify(`Visual regression testing: ${target}`);

    const prompt = `Run visual regression tests on: ${target}
${baselinePath ? `Baseline path: ${baselinePath}` : 'Generate new baselines if none exist.'}

## Visual Regression Test Suite

### Screenshot Capture
\`\`\`typescript
import { test, expect } from '@playwright/test';

const breakpoints = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 900 },
  wide: { width: 1920, height: 1080 },
};

for (const [name, viewport] of Object.entries(breakpoints)) {
  test(\`visual regression - \${name}\`, async ({ browser }) => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto('${target}');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot(\`\${name}.png\`, {
      maxDiffPixelRatio: 0.01,
      fullPage: true,
    });

    await context.close();
  });
}
\`\`\`

### Layout Validation
- Verify critical element positions have not shifted
- Check element dimensions against expected ranges
- Validate z-index stacking order
- Detect overflow and clipping issues

### Responsive Breakpoints
| Breakpoint | Width | Key Checks |
|------------|-------|------------|
| Mobile | 375px | Hamburger menu visible, single column, touch targets |
| Tablet | 768px | Sidebar collapses, grid adjusts, navigation adapts |
| Desktop | 1280px | Full layout, sidebar visible, multi-column |
| Wide | 1920px | Content max-width respected, no stretching |

### Cross-Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Workflow
1. Capture current screenshots at all breakpoints
2. Compare against baselines (if they exist)
3. Generate diff images highlighting changes
4. Report pixel-diff percentage per viewport
5. Update baselines when changes are intentional

**Report:**
- Pass/fail per breakpoint and browser
- Diff percentage and highlighted diff images
- Layout drift warnings
- Recommendations for responsive fixes`;

    return this.runTask(prompt);
  }

  async contractTest(apiSpec: string, implementation: string): Promise<TaskResult> {
    await this.notifier.notify(`Contract testing: ${apiSpec} vs ${implementation}`);

    const prompt = `Run contract tests:
- API Spec: ${apiSpec}
- Implementation: ${implementation}

## API Contract Verification

### OpenAPI Spec Validation
\`\`\`typescript
import SwaggerParser from '@apidevtools/swagger-parser';
import Ajv from 'ajv';

describe('API Contract', () => {
  let spec: any;

  beforeAll(async () => {
    spec = await SwaggerParser.validate('${apiSpec}');
  });

  it('spec should be valid OpenAPI', () => {
    expect(spec).toBeDefined();
    expect(spec.openapi).toMatch(/^3\\./);
  });

  it('all spec endpoints should be implemented', async () => {
    const routes = getAppRoutes();
    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const method of Object.keys(methods as object)) {
        if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          expect(routes).toContainEqual({ path, method });
        }
      }
    }
  });
});
\`\`\`

### Schema Validation
\`\`\`typescript
import Ajv from 'ajv';

describe('Response Schema Validation', () => {
  const ajv = new Ajv({ allErrors: true });

  it('response should match schema', async () => {
    const response = await request(app).get('/api/resource');
    const schema = spec.paths['/api/resource'].get.responses['200'].content['application/json'].schema;
    const validate = ajv.compile(schema);
    const valid = validate(response.body);
    expect(valid).toBe(true);
  });
});
\`\`\`

### Consumer-Driven Contracts (Pact)
\`\`\`typescript
import { PactV3 } from '@pact-foundation/pact';

const provider = new PactV3({
  consumer: 'frontend',
  provider: 'api',
  dir: './pacts',
});

describe('Pact Consumer Tests', () => {
  it('should get user by id', async () => {
    await provider
      .given('a user exists')
      .uponReceiving('a request for a user')
      .withRequest({ method: 'GET', path: '/api/users/1' })
      .willRespondWith({
        status: 200,
        body: { id: 1, name: 'Test User' },
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(\`\${mockServer.url}/api/users/1\`);
        const data = await response.json();
        expect(data).toEqual({ id: 1, name: 'Test User' });
      });
  });
});
\`\`\`

### Breaking Change Detection
- Compare current spec against previous version
- Detect removed endpoints or methods
- Detect removed or renamed fields
- Detect type changes in request/response schemas
- Detect changed required field constraints

**Report:**
- Endpoints: implemented vs spec
- Schema validation results
- Breaking changes detected
- Missing or extra fields
- Type mismatches
- Coordinate with Sydney for backend API alignment`;

    return this.runTask(prompt);
  }

  async setupCIPipeline(projectPath: string, testTypes: string[] = ['unit', 'integration', 'e2e']): Promise<TaskResult> {
    await this.notifier.notify(`Setting up CI pipeline for: ${projectPath} (${testTypes.join(', ')})`);

    const prompt = `Set up CI/CD test pipeline for: ${projectPath}
Test types to include: ${testTypes.join(', ')}

## GitHub Actions Test Pipeline

Generate a \`.github/workflows/test.yml\` with the following stages:

### Pipeline Stages
\`\`\`yaml
name: Test Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

concurrency:
  group: tests-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  unit-tests:
    needs: lint
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: ['18', '20']
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - name: Run unit tests (shard \${{ matrix.shard }}/4)
        run: |
          npx vitest run --shard=\${{ matrix.shard }}/4 \\
            --coverage --reporter=junit \\
            --outputFile=results-\${{ matrix.shard }}.xml
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-\${{ matrix.shard }}
          path: coverage/

  integration-tests:
    needs: unit-tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']
      redis:
        image: redis:7
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:integration -- --timeout=60000

  e2e-tests:
    needs: integration-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e -- --retries=2

  security-tests:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm audit --audit-level=high
      - run: npx secretlint "src/**/*"

  accessibility-tests:
    needs: e2e-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx pa11y-ci --config .pa11yci.json

  coverage-report:
    needs: [unit-tests, integration-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
      - name: Merge and report coverage
        run: |
          npx c8 report --reporter=text --check-coverage --lines 75
\`\`\`

### Caching Strategy
- Cache npm dependencies between runs
- Cache Playwright browsers
- Cache Docker layers for service containers
- Use build artifacts for cross-job data

### Test Parallelization
- Split unit tests across 4 shards using Vitest sharding
- Run independent jobs concurrently (lint + security in parallel)
- Use matrix strategy for multi-version testing

### Failure Handling
- Retry flaky E2E tests (max 2 retries)
- Upload test artifacts on failure
- Post failure summary to PR comments

**Output:**
- Complete workflow YAML file
- .pa11yci.json configuration
- README section for CI setup`;

    return this.runTask(prompt);
  }

  async generateTestData(schema: string, count: number = 100): Promise<TaskResult> {
    await this.notifier.notify(`Generating ${count} test data records for: ${schema}`);

    const prompt = `Generate test data for schema: ${schema}
Count: ${count}

## Test Data Generation

### Factory Pattern (fishery)
\`\`\`typescript
import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

interface User {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  isActive: boolean;
  role?: string;
}

const userFactory = Factory.define<User>(({ sequence }) => ({
  id: sequence,
  email: faker.internet.email(),
  name: faker.person.fullName(),
  createdAt: faker.date.past(),
  isActive: true,
}));

// Generate test data
const users = userFactory.buildList(${count});
const inactiveUsers = userFactory.buildList(10, { isActive: false });
const adminUsers = userFactory.buildList(3, { role: 'admin' });

// With traits
const userWithOrders = userFactory
  .associations({ orders: orderFactory.buildList(5) })
  .build();
\`\`\`

### Fixture Strategies
\`\`\`typescript
import { beforeAll, afterEach, describe } from 'vitest';

describe('with seeded data', () => {
  let seedData: { users: User[]; orders: Order[] };

  beforeAll(async () => {
    // Seed database with baseline test data
    const users = userFactory.buildList(50);
    await db.users.insertMany(users);
    const orders = users.slice(0, 20).flatMap(u =>
      orderFactory.buildList(3, { userId: u.id })
    );
    await db.orders.insertMany(orders);
    seedData = { users, orders };
  });

  afterEach(async () => {
    // Transaction rollback between tests
    await db.rollback();
  });

  afterAll(async () => {
    await db.truncate(['users', 'orders']);
  });
});
\`\`\`

### Realistic Data Patterns
Based on the schema: ${schema}

Generate:
1. **Valid records** - ${count} records matching all constraints
2. **Edge case records** - Boundary values, max lengths, unicode, special chars
3. **Invalid records** - For negative testing (missing required fields, wrong types)
4. **Relationships** - Properly linked related records

### Cleanup Strategies
- **Transaction rollback** - Wrap each test in a transaction, rollback after
- **Truncation** - TRUNCATE tables between test suites
- **Isolated databases** - Per-test or per-suite database instances
- **Factory cleanup** - Track and delete factory-created records

### Sensitive Data Handling
- Use faker for realistic but synthetic PII
- Never use real customer data in tests
- Anonymize production data snapshots
- Mask credit cards, SSNs, passwords

**Output:**
- Factory definitions for all schema entities
- Fixture files with proper scoping
- Seed script for database population
- Cleanup hooks for test isolation
- Edge case data sets for boundary testing`;

    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
