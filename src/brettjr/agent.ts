/**
 * Brett Jr Agent - Cybersecurity Specialist
 *
 * Expert in security audits, authentication, encryption, compliance,
 * threat modeling, supply chain security, and zero trust architecture.
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { brettjrConfig } from './config.js';

export class BrettJrAgent extends BaseAgent {
  constructor(config = brettjrConfig) {
    super(config);
  }

  async securityAudit(target: string): Promise<TaskResult> {
    await this.notifier.notify(`Security audit: ${target}`);
    const prompt = `Perform security audit on: ${target}\n\nCheck OWASP Top 10, secrets, injection vulnerabilities.`;
    return this.runTask(prompt);
  }

  async reviewAuth(codePath: string): Promise<TaskResult> {
    await this.notifier.notify(`Reviewing auth: ${codePath}`);
    const prompt = `Review authentication at: ${codePath}\n\nVerify: password storage, tokens, sessions, MFA.`;
    return this.runTask(prompt);
  }

  async checkSecrets(directory: string = '.'): Promise<TaskResult> {
    await this.notifier.notify(`Scanning for secrets in: ${directory}`);
    const prompt = `Scan for exposed secrets in: ${directory}\n\nSearch for: API keys, passwords, private keys.`;
    return this.runTask(prompt);
  }

  async complianceAudit(framework: string, scope: string): Promise<TaskResult> {
    await this.notifier.notify(`Compliance audit (${framework}): ${scope}`);

    const prompt = `Conduct a comprehensive compliance audit for: ${scope}
Framework: ${framework}

**Phase 1: Control Mapping**
Map the system's existing security controls to the ${framework} framework requirements.
For each control family/domain, identify:
- Control ID and description
- Current implementation status (Implemented / Partially Implemented / Not Implemented / Not Applicable)
- Evidence available (logs, configs, policies, procedures)

**Phase 2: Gap Analysis**
For each gap identified:
- Control requirement that is not met
- Current state vs. required state
- Risk level (Critical / High / Medium / Low)
- Business impact of non-compliance

**Phase 3: Remediation Plan**
For each gap, provide:
- Specific remediation steps
- Estimated effort (hours/days)
- Priority ranking
- Owner recommendation
- Timeline for completion

**Framework-Specific Guidance:**
- SOC 2 Type II: Map to Trust Service Criteria (CC1-CC9, availability, processing integrity, confidentiality, privacy)
- PCI-DSS: Map to 12 requirements with sub-requirements, identify CDE scope
- NIST 800-53: Map to control families (AC, AU, CA, CM, CP, IA, IR, MA, MP, PE, PL, PM, PS, RA, SA, SC, SI, SR)
- ISO 27001: Map to Annex A controls, assess ISMS maturity
- FedRAMP: Determine impact level (Low/Moderate/High), map to baseline controls
- HIPAA: Assess administrative, physical, technical safeguards, identify ePHI flows

**Output Format:**
1. Executive Summary with compliance score percentage
2. Control mapping matrix
3. Gap analysis with risk ratings
4. Prioritized remediation roadmap
5. Evidence collection checklist`;

    return this.runTask(prompt);
  }

  async threatModel(systemDescription: string, assets: string): Promise<TaskResult> {
    await this.notifier.notify(`Threat modeling: ${systemDescription.substring(0, 50)}...`);

    const prompt = `Build a comprehensive threat model for the following system.

**System Description:** ${systemDescription}

**Critical Assets:** ${assets}

**Phase 1: System Decomposition**
- Identify trust boundaries
- Map data flows (DFD Level 0 and Level 1)
- Enumerate entry points and exit points
- Identify external dependencies and third-party integrations

**Phase 2: STRIDE Analysis**
For each component and data flow, analyze threats using STRIDE:

| Threat Category | Component | Threat Description | Attack Vector |
|----------------|-----------|-------------------|---------------|
| **S**poofing | ... | ... | ... |
| **T**ampering | ... | ... | ... |
| **R**epudiation | ... | ... | ... |
| **I**nformation Disclosure | ... | ... | ... |
| **D**enial of Service | ... | ... | ... |
| **E**levation of Privilege | ... | ... | ... |

**Phase 3: DREAD Risk Scoring**
For each identified threat, score using DREAD (1-10 each):
- **D**amage Potential: How much damage if exploited?
- **R**eproducibility: How easy to reproduce?
- **E**xploitability: How easy to exploit?
- **A**ffected Users: How many users impacted?
- **D**iscoverability: How easy to discover?

Calculate overall risk score: (D + R + E + A + D) / 5

**Phase 4: Attack Trees**
For the top 3 highest-risk threats, create attack trees:
- Root goal (attacker objective)
- AND/OR decomposition of sub-goals
- Leaf nodes with cost/effort/probability
- Highlight most likely attack paths

**Phase 5: Mitigations**
For each threat, recommend:
- Preventive controls
- Detective controls
- Corrective controls
- MITRE ATT&CK technique mapping where applicable

**Output:**
1. Threat matrix with all identified threats
2. Risk-scored and prioritized threat list
3. Attack trees for top threats
4. Mitigation recommendations with implementation priority
5. Residual risk assessment after mitigations`;

    return this.runTask(prompt);
  }

  async dependencyAudit(projectPath: string): Promise<TaskResult> {
    await this.notifier.notify(`Dependency audit: ${projectPath}`);

    const prompt = `Conduct a comprehensive supply chain security audit for project at: ${projectPath}

**Phase 1: Dependency Inventory**
- Enumerate all direct and transitive dependencies
- Identify dependency managers (pip, npm, cargo, go mod, etc.)
- Check lock file presence and integrity
- Map the full dependency tree

**Phase 2: Vulnerability Scanning**
For each dependency:
- Check against NVD (National Vulnerability Database)
- Check against GitHub Advisory Database
- Check against OSV (Open Source Vulnerabilities)
- Report CVE IDs, severity (CVSS score), and affected versions
- Identify if patches/updates are available
- Flag end-of-life or unmaintained packages

**Phase 3: License Compliance**
- Identify license for each dependency
- Flag copyleft licenses (GPL, AGPL, LGPL)
- Identify license incompatibilities
- Check for packages with no license or unknown license
- Generate license obligation summary

**Phase 4: SBOM Generation**
Generate Software Bill of Materials including:
- Package name, version, supplier
- Download location, checksums
- Relationship type (direct/transitive)
- Output in CycloneDX or SPDX format recommendations

**Phase 5: Supply Chain Risk Assessment**
- Identify typosquatting risks
- Check package maintainer reputation and activity
- Assess dependency freshness (time since last update)
- Flag single-maintainer critical dependencies
- Check for dependency confusion risks

**Output:**
1. Dependency inventory with risk ratings
2. Vulnerability report with remediation actions
3. License compliance matrix
4. SBOM structure recommendation
5. Supply chain risk summary with prioritized actions`;

    return this.runTask(prompt);
  }

  async setupSast(projectPath: string, language: string): Promise<TaskResult> {
    await this.notifier.notify(`Setting up SAST for ${language} project: ${projectPath}`);

    const prompt = `Configure comprehensive static analysis (SAST) for the project at: ${projectPath}
Primary Language: ${language}

**Phase 1: Tool Selection and Configuration**

Based on language (${language}), configure appropriate tools:

For Python:
- Bandit configuration (.bandit, pyproject.toml)
- Semgrep rules (custom + community rulesets)
- Safety for dependency checking
- mypy for type safety (security-relevant)

For JavaScript/TypeScript:
- ESLint with security plugins (eslint-plugin-security, eslint-plugin-no-secrets)
- Semgrep rules for JS/TS
- npm audit configuration
- CodeQL queries for JavaScript

For Go:
- gosec configuration
- Semgrep rules for Go
- govulncheck setup

For Java:
- SpotBugs with FindSecBugs plugin
- Semgrep rules for Java
- OWASP Dependency-Check

General (all languages):
- Semgrep custom rules for project-specific patterns
- CodeQL workflow configuration
- Secret detection (gitleaks, trufflehog)

**Phase 2: Rule Configuration**
- Define severity thresholds (what blocks CI)
- Configure false positive suppressions
- Create custom rules for project-specific security patterns
- Set up baseline for existing findings

**Phase 3: CI/CD Integration**
Provide configurations for:
- GitHub Actions workflow
- Pre-commit hooks (.pre-commit-config.yaml)
- Pull request annotations
- SARIF output for GitHub Security tab

**Phase 4: Triage Workflow**
- Define process for reviewing findings
- Create suppression/ignore file templates
- Set up finding tracking and metrics
- Define SLA for fixing findings by severity

**Output:**
1. Tool configuration files (ready to use)
2. CI/CD pipeline configuration
3. Pre-commit hook setup
4. Custom rule examples
5. Triage process documentation
6. Metric tracking recommendations`;

    return this.runTask(prompt);
  }

  async incidentResponsePlan(system: string, threatScenarios: string): Promise<TaskResult> {
    await this.notifier.notify(`Creating IR plan for: ${system}`);

    const prompt = `Create a comprehensive Incident Response Plan for the following system and threat scenarios.

**System:** ${system}

**Threat Scenarios:** ${threatScenarios}

**Phase 1: Preparation**
- IR team roles and responsibilities (Incident Commander, Technical Lead, Communications, Legal)
- Communication channels and escalation paths
- Tool inventory (SIEM, EDR, forensics tools)
- Runbook maintenance and training schedule
- Tabletop exercise schedule

**Phase 2: Detection and Analysis**
For each threat scenario, define:
- Detection indicators (IOCs - Indicators of Compromise)
- Alert sources (SIEM rules, IDS/IPS, application logs, cloud alerts)
- Severity classification criteria:
  - **P1 (Critical):** Active data breach, ransomware, complete service compromise
  - **P2 (High):** Confirmed intrusion, privilege escalation, data exfiltration attempt
  - **P3 (Medium):** Suspicious activity, policy violation, vulnerability exploitation attempt
  - **P4 (Low):** Reconnaissance, failed attacks, minor policy violations
- Initial triage checklist
- Evidence collection procedures

**Phase 3: Containment**
- Short-term containment (immediate actions)
  - Network isolation procedures
  - Account suspension/password reset
  - Service shutdown criteria
- Long-term containment (while preparing remediation)
  - Temporary security controls
  - Enhanced monitoring
  - Communication with affected parties
- Containment verification steps

**Phase 4: Eradication**
- Root cause identification procedures
- Malware removal steps
- Vulnerability patching process
- Configuration hardening
- Credential rotation scope and procedure
- Third-party notification requirements

**Phase 5: Recovery**
- System restoration procedures
- Data integrity verification
- Phased service restoration plan
- Enhanced monitoring during recovery
- User communication and access restoration
- Business continuity activation criteria

**Phase 6: Post-Incident**
- Post-incident review template (within 72 hours)
- Root cause analysis (5 Whys, fishbone diagram)
- Lessons learned documentation
- Control improvement recommendations
- Metrics: MTTD, MTTR, MTTC, Mean Time to Recover

**Phase 7: Breach Notification**
- Regulatory requirements by jurisdiction
  - GDPR: 72-hour notification to DPA
  - US State laws: Varies by state
  - HIPAA: 60-day notification
  - PCI-DSS: Immediate notification to acquirer
- Notification templates (regulators, customers, public)
- Legal review checklist
- PR/communications plan

**Output:**
1. Complete IR playbook for each threat scenario
2. Escalation matrix
3. Communication templates
4. Evidence collection checklist
5. Post-incident review template
6. Breach notification decision tree`;

    return this.runTask(prompt);
  }

  async zeroTrustAssessment(architectureDescription: string): Promise<TaskResult> {
    await this.notifier.notify(`Zero trust assessment: ${architectureDescription.substring(0, 50)}...`);

    const prompt = `Conduct a Zero Trust Architecture maturity assessment for the following system.

**Architecture Description:** ${architectureDescription}

**Assessment Pillars:**

### 1. Identity
- Authentication mechanisms (SSO, MFA, passwordless)
- Identity providers and federation
- Service-to-service identity (mTLS, SPIFFE/SPIRE)
- Conditional access policies
- Identity governance and lifecycle
**Maturity Rating:** (Traditional / Advanced / Optimal)

### 2. Devices
- Device inventory and management (MDM/UEM)
- Device health attestation
- Endpoint detection and response (EDR)
- BYOD policies and controls
**Maturity Rating:** (Traditional / Advanced / Optimal)

### 3. Networks
- Micro-segmentation implementation
- Software-defined perimeter
- Encrypted communications (mTLS everywhere)
- DNS security
- East-west traffic inspection
**Maturity Rating:** (Traditional / Advanced / Optimal)

### 4. Applications and Workloads
- Application access policies
- Application-level authentication
- Container/serverless security
- CI/CD pipeline security
- Runtime application self-protection (RASP)
**Maturity Rating:** (Traditional / Advanced / Optimal)

### 5. Data
- Data classification and labeling
- Data loss prevention (DLP)
- Encryption at rest and in transit
- Access logging and monitoring
- Data rights management
**Maturity Rating:** (Traditional / Advanced / Optimal)

### 6. Visibility and Analytics
- Security Information and Event Management (SIEM)
- User and Entity Behavior Analytics (UEBA)
- Network Detection and Response (NDR)
- Centralized logging and correlation
- Threat intelligence integration
**Maturity Rating:** (Traditional / Advanced / Optimal)

### 7. Automation and Orchestration
- Security Orchestration, Automation and Response (SOAR)
- Automated policy enforcement
- Infrastructure as Code security
- Automated incident response
**Maturity Rating:** (Traditional / Advanced / Optimal)

**Output:**
1. Current maturity scorecard (per pillar)
2. Overall Zero Trust maturity level
3. Gap analysis for each pillar
4. Prioritized roadmap (quick wins, medium-term, long-term)
5. Architecture recommendations with diagrams (text-based)
6. Implementation cost/effort estimates
7. Key metrics and KPIs to track progress`;

    return this.runTask(prompt);
  }

  async apiSecurityReview(apiSpec: string): Promise<TaskResult> {
    await this.notifier.notify(`API security review: ${apiSpec.substring(0, 50)}...`);

    const prompt = `Conduct a comprehensive API security review for the following API specification/system.

**API Specification:** ${apiSpec}

**Phase 1: Authentication and Authorization Review**
- OAuth 2.0 flow analysis:
  - Authorization Code + PKCE (recommended for SPAs and mobile)
  - Client Credentials (service-to-service)
  - Verify no Implicit or Resource Owner Password grants
- OpenID Connect implementation:
  - ID token validation
  - UserInfo endpoint security
  - Proper scope definitions
- Token security:
  - Token lifetime and rotation
  - Token storage (secure, no localStorage for sensitive tokens)
  - Token revocation mechanism
  - JWT algorithm verification (RS256 preferred, reject 'none')
- API key management:
  - Key rotation policy
  - Scope/permission restrictions
  - Key exposure monitoring

**Phase 2: Input Validation and Data Protection**
- Request validation:
  - Schema validation (OpenAPI/JSON Schema enforcement)
  - Content-Type enforcement
  - Payload size limits
  - Parameter type checking
- Injection prevention:
  - SQL injection (parameterized queries)
  - NoSQL injection
  - Command injection
  - GraphQL injection (if applicable)
- Data exposure:
  - Response field filtering (no over-fetching)
  - Sensitive data masking in logs
  - Error message information leakage
  - Stack trace exposure prevention

**Phase 3: Rate Limiting and Abuse Prevention**
- Rate limiting strategy:
  - Per-user/per-IP limits
  - Per-endpoint limits (sensitive endpoints more restrictive)
  - Token bucket vs. sliding window algorithm
  - Distributed rate limiting (Redis-backed)
- Abuse prevention:
  - Bot detection
  - Request fingerprinting
  - Anomaly detection
- DDoS protection:
  - Layer 7 DDoS mitigation
  - Request queuing
  - Circuit breaker patterns

**Phase 4: API Gateway and Infrastructure**
- Gateway configuration:
  - TLS 1.2+ enforcement
  - Certificate management
  - CORS policy review
  - Security headers (HSTS, CSP, X-Content-Type-Options)
- Network security:
  - mTLS for internal services
  - VPN/private network for admin APIs
  - IP whitelisting for partner APIs
- Monitoring and logging:
  - API access logging
  - Anomaly detection
  - Real-time alerting
  - Audit trail completeness

**Phase 5: API-Specific Vulnerabilities**
- BOLA (Broken Object Level Authorization)
- BFLA (Broken Function Level Authorization)
- Mass assignment
- Excessive data exposure
- Server-Side Request Forgery (SSRF)
- Improper inventory management (shadow APIs)

**Output:**
1. Security scorecard by category
2. Critical and high findings with remediation
3. OAuth/OIDC flow recommendations
4. Rate limiting configuration templates
5. API gateway hardening checklist
6. Monitoring and alerting recommendations`;

    return this.runTask(prompt);
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
