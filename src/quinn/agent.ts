/**
 * Quinn Agent - Network Engineer & Deployment Specialist
 *
 * Expert in networking, containers, infrastructure, deployments,
 * load balancing, DNS, disaster recovery, monitoring, service mesh, and edge computing.
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { quinnConfig } from './config.js';

interface DnsRecord {
  type?: string;
  name?: string;
  value?: string;
  ttl?: number;
  priority?: string;
  proxy?: string;
}

interface CacheRule {
  path?: string;
  ttl?: string;
  cache?: string;
  edge_ttl?: string;
  browser_ttl?: string;
  bypass?: string;
}

export class QuinnAgent extends BaseAgent {
  constructor(config = quinnConfig) {
    super(config);
  }

  async designNetwork(requirements: string): Promise<TaskResult> {
    await this.notifier.notify(`Designing network`);
    const prompt = `Design network for:\n\n${requirements}\n\nInclude: topology, IPs, VLANs, firewall rules, HA.`;
    const result = await this.runTask(prompt);
    if (result.success) {
      await this.requestApproval('Network design ready', 'Review before implementation');
      result.needsApproval = true;
    }
    return result;
  }

  async deployContainers(composeFile: string, env: string = 'staging'): Promise<TaskResult> {
    await this.notifier.notify(`Deploying to ${env}: ${composeFile}`);
    if (env === 'production') {
      await this.requestApproval(`Production deployment: ${composeFile}`, 'Confirm deployment', ['Deploy', 'Cancel']);
    }
    const prompt = `Deploy containers from: ${composeFile}\nEnvironment: ${env}\n\nValidate, pull, deploy, verify health.`;
    return this.runTask(prompt);
  }

  async configureVPN(type: string, config: string): Promise<TaskResult> {
    await this.notifier.notify(`Configuring ${type} VPN`);
    const prompt = `Configure ${type} VPN:\n\n${config}\n\nInclude: keys, peers, routing, firewall.`;
    const result = await this.runTask(prompt);
    if (result.success) {
      await this.requestApproval('VPN config ready', 'Review before applying');
      result.needsApproval = true;
    }
    return result;
  }

  async troubleshoot(issue: string): Promise<TaskResult> {
    await this.notifier.notify(`Troubleshooting: ${issue.substring(0, 50)}`);
    const prompt = `Troubleshoot: ${issue}\n\nDiagnose: connectivity, DNS, ports, services. Identify root cause.`;
    return this.runTask(prompt);
  }

  async k8sDeploy(manifests: string, namespace: string = 'default'): Promise<TaskResult> {
    if (namespace === 'production') {
      await this.requestApproval(`K8s production deployment`, `Deploying to ${namespace}`, ['Deploy', 'Cancel']);
    }
    const prompt = `Deploy K8s manifests: ${manifests}\nNamespace: ${namespace}\n\nValidate, apply, verify rollout.`;
    return this.runTask(prompt);
  }

  async securityAudit(target: string): Promise<TaskResult> {
    const prompt = `Security audit on: ${target}\n\nCheck: ports, SSL, auth, containers, network segmentation.`;
    return this.runTask(prompt);
  }

  async setupLoadBalancer(
    service: string,
    backendServers: string[],
    algorithm: string = 'round-robin'
  ): Promise<TaskResult> {
    await this.notifier.notify(`Setting up load balancer for: ${service}`);

    const backendsStr = backendServers.map(s => `  - ${s}`).join('\n');
    const haproxyAlgorithm = algorithm.replace('-', '');
    const nginxAlgorithm = algorithm.replace('-', '_');
    const haproxyServers = backendServers
      .map((s, i) => `    server srv${i + 1} ${s} check`)
      .join('\n');
    const nginxServers = backendServers
      .map(s => `    server ${s};`)
      .join('\n');

    const prompt = `Set up load balancer for service: ${service}
Algorithm: ${algorithm}
Backend servers:
${backendsStr}

**Include:**

## 1. Load Balancer Selection
- Evaluate HAProxy vs Nginx vs Traefik for this use case
- L4 (TCP) vs L7 (HTTP) routing decision
- Justify selection based on requirements

## 2. HAProxy Configuration
\`\`\`haproxy
global
    log /dev/log local0
    maxconn 4096
    stats socket /var/run/haproxy.sock mode 660

defaults
    mode http
    log global
    option httplog
    option dontlognull
    timeout connect 5s
    timeout client 30s
    timeout server 30s
    retries 3

frontend ${service}_frontend
    bind *:80
    bind *:443 ssl crt /etc/ssl/certs/${service}.pem
    http-request redirect scheme https unless { ssl_fc }
    default_backend ${service}_backend

backend ${service}_backend
    balance ${haproxyAlgorithm}
    option httpchk GET /health
    http-check expect status 200
    default-server inter 3s fall 3 rise 2
${haproxyServers}
\`\`\`

## 3. Nginx Alternative
\`\`\`nginx
upstream ${service}_backend {
    ${nginxAlgorithm};
${nginxServers}
}

server {
    listen 443 ssl;
    server_name ${service}.example.com;

    ssl_certificate /etc/ssl/certs/${service}.pem;
    ssl_certificate_key /etc/ssl/private/${service}.key;

    location / {
        proxy_pass http://${service}_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        access_log off;
        return 200 "healthy";
    }
}
\`\`\`

## 4. Health Check Configuration
- Active health checks: HTTP GET /health every 3s
- Passive health checks: Track 5xx responses
- Fall threshold: 3 consecutive failures
- Rise threshold: 2 consecutive successes
- Grace period: 30s on startup

## 5. SSL Termination
- Certificate management (Let's Encrypt / internal CA)
- TLS 1.2+ enforcement
- Cipher suite selection (ECDHE preferred)
- HSTS headers
- OCSP stapling

## 6. Sticky Sessions (if needed)
- Cookie-based affinity
- Session persistence timeout
- Drain connections gracefully

## 7. Monitoring Integration
- Export metrics to Prometheus
- HAProxy stats page / Nginx stub_status
- Alert on backend health changes
- Track response times per backend

## 8. Testing
\`\`\`bash
# Verify configuration
haproxy -c -f /etc/haproxy/haproxy.cfg
nginx -t

# Test load distribution
for i in $(seq 1 10); do curl -s http://${service}.example.com/health; done

# Check backend health
curl http://localhost:9101/metrics  # HAProxy exporter
\`\`\`

**Request approval before applying to production.**`;

    const result = await this.runTask(prompt);
    if (result.success) {
      await this.requestApproval(
        `Load balancer config ready for ${service}`,
        `Algorithm: ${algorithm}, Backends: ${backendServers.length}`,
        ['Apply', 'Reject', 'Test First']
      );
      result.needsApproval = true;
    }
    return result;
  }

  async configureDns(
    domain: string,
    records: DnsRecord[],
    provider: string = 'cloudflare'
  ): Promise<TaskResult> {
    await this.notifier.notify(`Configuring DNS for: ${domain}`);

    const recordsStr = records
      .map(r => `  - ${r.type || 'A'} ${r.name || '@'} -> ${r.value || ''} (TTL: ${r.ttl || 300})`)
      .join('\n');

    const recordsTable = records
      .map(r => `| ${r.type || 'A'} | ${r.name || '@'} | ${r.value || ''} | ${r.ttl || 300} | ${r.priority || '-'} | ${r.proxy || 'No'} |`)
      .join('\n');

    const prompt = `Configure DNS for domain: ${domain}
Provider: ${provider}
Records:
${recordsStr}

**Include:**

## 1. DNS Record Configuration
| Type | Name | Value | TTL | Priority | Proxy |
|------|------|-------|-----|----------|-------|
${recordsTable}

## 2. Record Type Guidance
- **A/AAAA** - Direct IP mapping, use for root domain or when CNAME not possible
- **CNAME** - Alias to another domain, cannot be used at zone apex
- **MX** - Mail exchange with priority values, ensure SPF/DKIM/DMARC alignment
- **TXT** - SPF records, DKIM keys, domain verification, DMARC policies
- **SRV** - Service discovery records (_service._proto.name)
- **CAA** - Certificate Authority Authorization, restrict who can issue certs

## 3. TTL Strategy
- **Pre-migration**: Lower TTL to 60s at least 48h before changes
- **Active failover records**: TTL 60-120s for fast failover
- **Stable records**: TTL 3600-86400s for reduced query load
- **MX records**: TTL 3600s (balance between stability and flexibility)
- **Post-migration**: Raise TTL back after verification

## 4. Failover Configuration
\`\`\`
Primary:   A    ${domain}  ->  <primary_ip>    (health-checked)
Secondary: A    ${domain}  ->  <secondary_ip>  (failover)
\`\`\`
- Health check endpoint: HTTPS GET /health
- Check interval: 30s
- Failover trigger: 3 consecutive failures
- Failback: Automatic after 60s of healthy responses

## 5. Split-Horizon DNS (if applicable)
- **Internal zone**: Private IPs for internal services
- **External zone**: Public IPs for external access
- Conditional forwarding rules
- VPN client resolution

## 6. ${provider.charAt(0).toUpperCase() + provider.slice(1)} API Management
\`\`\`bash
# List existing records
curl -X GET "https://api.cloudflare.com/client/v4/zones/ZONE_ID/dns_records" \\
  -H "Authorization: Bearer $CF_API_TOKEN"

# Create/update records
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/dns_records" \\
  -H "Authorization: Bearer $CF_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{"type":"A","name":"${domain}","content":"<ip>","ttl":300}'
\`\`\`

## 7. Verification
\`\`\`bash
# Check propagation
dig +short ${domain} A
dig +short ${domain} MX
dig +trace ${domain}

# Verify from multiple locations
dig @8.8.8.8 ${domain}
dig @1.1.1.1 ${domain}

# Check DNSSEC
dig ${domain} +dnssec
\`\`\`

## 8. Security
- DNSSEC enabled and validated
- CAA records restricting certificate issuance
- SPF, DKIM, DMARC for email authentication
- API tokens scoped to minimal permissions

**Verify propagation before confirming completion.**`;

    const result = await this.runTask(prompt);
    if (result.success) {
      await this.requestApproval(
        `DNS configuration ready for ${domain}`,
        `Provider: ${provider}, Records: ${records.length}`,
        ['Apply', 'Reject', 'Review Records']
      );
      result.needsApproval = true;
    }
    return result;
  }

  async disasterRecoveryPlan(
    services: string[],
    rto: string,
    rpo: string
  ): Promise<TaskResult> {
    await this.notifier.notify(`Creating DR plan for ${services.length} services (RTO: ${rto}, RPO: ${rpo})`);

    const servicesStr = services.map(s => `  - ${s}`).join('\n');
    const servicesTable = services
      .map(s => `| ${s} | TBD | ${rto} | ${rpo} | TBD | TBD |`)
      .join('\n');

    const prompt = `Create Disaster Recovery Plan:

Services:
${servicesStr}

Recovery Time Objective (RTO): ${rto}
Recovery Point Objective (RPO): ${rpo}

**Include:**

## 1. Service Classification
| Service | Tier | RTO | RPO | Dependencies | Failover Type |
|---------|------|-----|-----|-------------|---------------|
${servicesTable}

Tiers:
- **Tier 1 (Critical)**: Must recover within minutes, zero/near-zero data loss
- **Tier 2 (Important)**: Recover within hours, minimal data loss acceptable
- **Tier 3 (Standard)**: Recover within days, some data loss acceptable

## 2. Backup Strategy (3-2-1 Rule)
- **3 copies** of all critical data
- **2 different media types** (disk + object storage, or disk + tape)
- **1 offsite copy** (different region/provider)

### Backup Schedule
| Data Type | Method | Frequency | Retention | Storage | Encryption |
|-----------|--------|-----------|-----------|---------|------------|
| Databases | pg_dump / mysqldump | Every 6h | 30 days | S3 + Glacier | AES-256 |
| Application state | Volume snapshots | Daily | 14 days | Cross-region | AES-256 |
| Configuration | Git + encrypted vault | On change | Indefinite | Multi-repo | GPG |
| Secrets | Vault backup | Daily | 90 days | Offline + S3 | AES-256 |

### Backup Verification
- Automated restore testing weekly
- Checksum validation on all backups
- Alert on backup failures immediately

## 3. Failover Procedures

### Automated Failover
\`\`\`
Trigger: Health check fails for 3 consecutive checks (90s)
  1. DNS failover activates (TTL: 60s)
  2. Load balancer removes unhealthy backends
  3. Standby services promoted to active
  4. Notification sent to on-call team
  5. Automated verification of failover health
\`\`\`

### Manual Failover Runbook
\`\`\`
Step 1: Confirm outage (check monitoring, not just alerts)
Step 2: Activate incident channel (#incident-YYYY-MM-DD)
Step 3: Execute failover:
  - DNS: Update records to DR site
  - LB: Switch traffic to DR backends
  - DB: Promote replica to primary
Step 4: Verify all services healthy
Step 5: Notify stakeholders
Step 6: Begin root cause analysis
\`\`\`

### Failback Procedure
\`\`\`
Step 1: Confirm primary site fully restored
Step 2: Sync data from DR site back to primary
Step 3: Verify data integrity (checksums, row counts)
Step 4: Gradual traffic shift (10% -> 25% -> 50% -> 100%)
Step 5: Monitor for 24h before decommissioning DR active state
\`\`\`

## 4. DR Testing Schedule
| Test Type | Frequency | Scope | Duration |
|-----------|-----------|-------|----------|
| Tabletop exercise | Monthly | All teams | 2 hours |
| Component failover | Quarterly | Per service | 4 hours |
| Full DR drill | Semi-annually | All services | 8 hours |
| Chaos engineering | Continuous | Random | Automated |

### DR Test Checklist
- [ ] All backups verified restorable
- [ ] Failover completes within RTO
- [ ] Data loss within RPO
- [ ] Communication plan executed
- [ ] All runbooks accurate and current
- [ ] Lessons learned documented

## 5. Communication Plan
| Event | Notify | Channel | Template |
|-------|--------|---------|----------|
| Outage detected | On-call engineer | PagerDuty | incident-alert |
| DR activated | Engineering team | Slack #incidents | dr-activation |
| Customer impact | Support + Comms | Email + Status page | customer-impact |
| Recovery complete | All stakeholders | All channels | recovery-complete |

## 6. Runbook Template
For each service, create:
- Pre-conditions checklist
- Step-by-step recovery procedure
- Verification steps
- Rollback procedure
- Escalation contacts
- Estimated time per step

**Review and approve DR plan before scheduling first drill.**`;

    const result = await this.runTask(prompt);
    if (result.success) {
      await this.requestApproval(
        `DR plan ready for review (${services.length} services)`,
        `RTO: ${rto}, RPO: ${rpo}. Review before scheduling DR drill.`,
        ['Approve', 'Reject', 'Request Changes']
      );
      result.needsApproval = true;
    }
    return result;
  }

  async setupMonitoring(
    infrastructure: string[],
    services: string[]
  ): Promise<TaskResult> {
    await this.notifier.notify(`Setting up monitoring for ${services.length} services on ${infrastructure.length} hosts`);

    const infraTargets = infrastructure
      .map(i => `          - '${i}:9100'`)
      .join('\n');
    const serviceTargets = services
      .map(s => `          - '${s}'`)
      .join('\n');
    const blackboxTargets = services
      .map(s => `          - 'https://${s}'`)
      .join('\n');

    const prompt = `Set up monitoring stack:

Infrastructure:
${infrastructure.map(i => `  - ${i}`).join('\n')}

Services:
${services.map(s => `  - ${s}`).join('\n')}

**Include:**

## 1. Prometheus Configuration
\`\`\`yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: production
    environment: prod

rule_files:
  - "alerts/*.yml"
  - "recording_rules/*.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets:
${infraTargets}

  - job_name: 'application'
    metrics_path: /metrics
    static_configs:
      - targets:
${serviceTargets}

  - job_name: 'blackbox'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
${blackboxTargets}
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - target_label: __address__
        replacement: blackbox-exporter:9115

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']
\`\`\`

## 2. Alerting Rules
\`\`\`yaml
# alerts/infrastructure.yml
groups:
  - name: infrastructure
    rules:
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"

      - alert: HighMemoryUsage
        expr: (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"

      - alert: DiskSpaceLow
        expr: (1 - node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 > 90
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Disk space critically low on {{ $labels.instance }}"

      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} is down on {{ $labels.instance }}"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate (>5%) on {{ $labels.instance }}"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High p95 latency on {{ $labels.instance }}"
\`\`\`

## 3. Alertmanager Configuration
\`\`\`yaml
# alertmanager.yml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'cluster']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty-critical'
      continue: true
    - match:
        severity: warning
      receiver: 'slack-warnings'

receivers:
  - name: 'default'
    slack_configs:
      - channel: '#monitoring'
        send_resolved: true

  - name: 'pagerduty-critical'
    pagerduty_configs:
      - service_key: '<pagerduty_key>'
        severity: 'critical'

  - name: 'slack-warnings'
    slack_configs:
      - channel: '#monitoring-warnings'
        send_resolved: true

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']
\`\`\`

## 4. Grafana Dashboards

### Infrastructure Dashboard (RED Method)
- **Rate**: Requests per second per service
- **Errors**: Error rate percentage per service
- **Duration**: p50/p95/p99 latency per service

### System Dashboard (USE Method)
- **Utilization**: CPU, memory, disk, network bandwidth
- **Saturation**: Load average, memory pressure, disk I/O wait
- **Errors**: System errors, OOM kills, disk errors

### SLA Dashboard
- Uptime percentage (target: 99.9%)
- Error budget remaining
- SLO burn rate
- Incident count and MTTR

### Per-Service Dashboard
- Request rate and error rate
- Latency histograms
- Active connections
- Resource consumption (CPU, memory)

## 5. SLA Monitoring
\`\`\`yaml
# recording_rules/sla.yml
groups:
  - name: sla
    rules:
      - record: sla:availability:ratio
        expr: 1 - (sum(rate(http_requests_total{status=~"5.."}[30d])) / sum(rate(http_requests_total[30d])))

      - record: sla:error_budget:remaining
        expr: 1 - ((1 - sla:availability:ratio) / (1 - 0.999))
\`\`\`

## 6. Docker Compose Deployment
\`\`\`yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=\${GRAFANA_PASSWORD}
    restart: unless-stopped

  alertmanager:
    image: prom/alertmanager:latest
    volumes:
      - ./alertmanager:/etc/alertmanager
    ports:
      - "9093:9093"
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    restart: unless-stopped

  blackbox-exporter:
    image: prom/blackbox-exporter:latest
    ports:
      - "9115:9115"
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:
\`\`\`

## 7. Verification
\`\`\`bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Check Alertmanager
curl http://localhost:9093/api/v2/status

# Verify Grafana
curl http://localhost:3000/api/health

# Test alert firing
curl -X POST http://localhost:9093/api/v2/alerts -d '[{"labels":{"alertname":"test"}}]'
\`\`\`

**Deploy monitoring stack and verify all targets are up.**`;

    return this.runTask(prompt);
  }

  async configureServiceMesh(
    services: string[],
    meshType: string = 'istio'
  ): Promise<TaskResult> {
    await this.notifier.notify(`Configuring ${meshType} service mesh for ${services.length} services`);

    const servicesStr = services.map(s => `  - ${s}`).join('\n');
    const isIstio = meshType === 'istio';

    const installCmd = isIstio
      ? 'istioctl install --set profile=production'
      : 'linkerd install | kubectl apply -f -';
    const labelCmd = isIstio
      ? 'kubectl label namespace default istio-injection=enabled'
      : 'kubectl annotate namespace default linkerd.io/inject=enabled';
    const verifyCmd = isIstio
      ? 'istioctl verify-install'
      : 'linkerd check';

    const mtlsConfig = isIstio
      ? `# PeerAuthentication - enforce mTLS
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: default
spec:
  mtls:
    mode: STRICT`
      : `# Linkerd auto-enables mTLS
# Verify mTLS status
# linkerd viz edges deployment
# linkerd viz tap deployment/<name> --namespace default`;

    const trafficConfig = isIstio
      ? `# VirtualService - traffic routing
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: service-routing
spec:
  hosts:
    - "*.default.svc.cluster.local"
  http:
    - route:
        - destination:
            host: service-v1
          weight: 90
        - destination:
            host: service-v2
          weight: 10
      retries:
        attempts: 3
        perTryTimeout: 2s
      timeout: 10s`
      : `# TrafficSplit for canary
apiVersion: split.smi-spec.io/v1alpha1
kind: TrafficSplit
metadata:
  name: service-split
spec:
  service: service-root
  backends:
    - service: service-v1
      weight: 900m
    - service: service-v2
      weight: 100m`;

    const circuitBreakerConfig = isIstio
      ? `# DestinationRule with circuit breaker
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: circuit-breaker
spec:
  host: "*.default.svc.cluster.local"
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        h2UpgradePolicy: DEFAULT
        http1MaxPendingRequests: 100
        http2MaxRequests: 1000
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 10s
      baseEjectionTime: 30s
      maxEjectionPercent: 50`
      : `# Linkerd uses retry budgets and timeouts
# Configure via ServiceProfile
apiVersion: linkerd.io/v1alpha2
kind: ServiceProfile
metadata:
  name: service.default.svc.cluster.local
spec:
  routes:
    - name: GET /api
      condition:
        method: GET
        pathRegex: /api/.*
      isRetryable: true
      timeout: 5s`;

    const faultInjectionConfig = isIstio
      ? `# Inject faults for chaos testing
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: fault-injection
spec:
  hosts:
    - service-a
  http:
    - fault:
        delay:
          percentage:
            value: 10
          fixedDelay: 5s
        abort:
          percentage:
            value: 5
          httpStatus: 503
      route:
        - destination:
            host: service-a`
      : `# Linkerd fault injection via HTTPRoute
# Use with chaos engineering tools like Chaos Mesh or Litmus`;

    const tracingCmd = isIstio
      ? 'kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/jaeger.yaml'
      : 'linkerd viz install | kubectl apply -f -';
    const graphCmd = isIstio
      ? 'kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/kiali.yaml'
      : 'linkerd viz dashboard &';
    const metricsCmd = isIstio
      ? 'kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/prometheus.yaml'
      : 'linkerd viz stat deployment --namespace default';

    const mtlsVerifyCmd = isIstio
      ? 'istioctl authn tls-check'
      : 'linkerd viz edges deployment';
    const topCmd = isIstio
      ? 'istioctl proxy-status'
      : 'linkerd viz top deployment';

    const perServiceConfig = services.map(s =>
      `### ${s}\n- Sidecar injection: enabled\n- mTLS: STRICT\n- Retry policy: 3 attempts, 2s timeout\n- Circuit breaker: 5 consecutive 5xx errors`
    ).join('\n\n');

    const prompt = `Configure ${meshType} service mesh:

Services:
${servicesStr}

**Include:**

## 1. Mesh Installation
### ${isIstio ? 'Istio' : 'Linkerd'}
\`\`\`bash
# Install ${meshType}
${installCmd}

# Enable sidecar injection for namespace
${labelCmd}

# Verify installation
${verifyCmd}
\`\`\`

## 2. Mutual TLS (mTLS)
\`\`\`yaml
${mtlsConfig}
\`\`\`

## 3. Traffic Management
\`\`\`yaml
${trafficConfig}
\`\`\`

## 4. Circuit Breaker
\`\`\`yaml
${circuitBreakerConfig}
\`\`\`

## 5. Fault Injection (Testing)
\`\`\`yaml
${faultInjectionConfig}
\`\`\`

## 6. Observability
\`\`\`bash
# Distributed tracing
${tracingCmd}

# Service graph
${graphCmd}

# Metrics
${metricsCmd}
\`\`\`

## 7. Per-Service Configuration
${perServiceConfig}

## 8. Verification
\`\`\`bash
# Check sidecar injection
kubectl get pods -n default -o jsonpath='{.items[*].spec.containers[*].name}'

# Verify mTLS
${mtlsVerifyCmd}

# Check traffic flow
${topCmd}
\`\`\`

**Request approval before enabling in production namespace.**`;

    const result = await this.runTask(prompt);
    if (result.success) {
      await this.requestApproval(
        `${meshType.charAt(0).toUpperCase() + meshType.slice(1)} service mesh config ready`,
        `Services: ${services.length}, mTLS: STRICT`,
        ['Apply', 'Reject', 'Test in Staging']
      );
      result.needsApproval = true;
    }
    return result;
  }

  async setupCdn(
    domain: string,
    origin: string,
    cacheRules: CacheRule[]
  ): Promise<TaskResult> {
    await this.notifier.notify(`Setting up CDN for: ${domain}`);

    const rulesStr = cacheRules
      .map(r => `  - Path: ${r.path || '/*'}, TTL: ${r.ttl || '86400'}, Cache: ${r.cache || 'standard'}`)
      .join('\n');

    const rulesTable = cacheRules
      .map(r => `| ${r.path || '/*'} | ${r.ttl || '86400'} | ${r.cache || 'standard'} | ${r.edge_ttl || r.ttl || '86400'} | ${r.browser_ttl || '3600'} | ${r.bypass || 'none'} |`)
      .join('\n');

    const prompt = `Configure CDN for domain: ${domain}
Origin: ${origin}
Cache rules:
${rulesStr}

**Include:**

## 1. CDN Provider Selection
- Evaluate Cloudflare vs CloudFront vs Fastly
- Consider: geographic distribution, edge features, pricing, DDoS protection

## 2. Origin Configuration
\`\`\`
Origin server: ${origin}
Origin protocol: HTTPS
Origin port: 443
Origin timeout: 30s
Origin retries: 3
Origin shield: enabled (closest PoP to origin)
\`\`\`

## 3. Cache Rules
| Path Pattern | TTL | Cache Level | Edge TTL | Browser TTL | Bypass Conditions |
|-------------|-----|-------------|----------|-------------|-------------------|
${rulesTable}

### Cache-Control Headers
\`\`\`
# Static assets (images, CSS, JS)
Cache-Control: public, max-age=31536000, immutable

# API responses (if cacheable)
Cache-Control: public, max-age=60, stale-while-revalidate=300

# Dynamic content (no cache)
Cache-Control: private, no-cache, no-store

# HTML pages
Cache-Control: public, max-age=300, stale-while-revalidate=600
\`\`\`

## 4. Edge Configuration (Cloudflare Workers example)
\`\`\`javascript
// Edge routing / A/B testing
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  // Custom cache key
  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;

  // Check cache first
  let response = await cache.match(cacheKey);
  if (response) return response;

  // Fetch from origin
  response = await fetch(request);

  // Clone and cache
  const responseClone = response.clone();
  response = new Response(responseClone.body, responseClone);
  response.headers.set('X-Cache', 'MISS');
  response.headers.set('Cache-Control', 'public, max-age=3600');

  event.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
\`\`\`

## 5. Purge Strategy
\`\`\`bash
# Purge by URL
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \\
  -H "Authorization: Bearer $CF_API_TOKEN" \\
  -d '{"files":["https://${domain}/path/to/resource"]}'

# Purge by cache tag
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \\
  -H "Authorization: Bearer $CF_API_TOKEN" \\
  -d '{"tags":["product-page","static-assets"]}'

# Purge everything (use sparingly)
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \\
  -H "Authorization: Bearer $CF_API_TOKEN" \\
  -d '{"purge_everything":true}'
\`\`\`

## 6. Security at the Edge
- **DDoS Protection**: Rate limiting, challenge pages, IP reputation
- **WAF Rules**: OWASP core ruleset, custom rules, bot management
- **SSL/TLS**: Full (strict) mode, minimum TLS 1.2, HSTS enabled
- **Origin Protection**: Authenticated origin pulls, IP allowlisting

## 7. Performance Optimization
- **Minification**: HTML, CSS, JavaScript
- **Image Optimization**: WebP/AVIF conversion, lazy loading, responsive images
- **Brotli Compression**: Enable for text-based assets
- **HTTP/3**: Enable QUIC for improved performance
- **Early Hints**: 103 status code for preloading critical resources
- **Prefetch**: Speculative prefetching of likely next pages

## 8. Monitoring & Analytics
- Cache hit ratio (target: >90%)
- Origin response times
- Edge response times
- Bandwidth saved
- Error rates by PoP
- Geographic distribution of traffic

## 9. Verification
\`\`\`bash
# Check CDN headers
curl -I https://${domain}/ | grep -E "(cf-|x-cache|cache-control|age)"

# Verify SSL
openssl s_client -connect ${domain}:443 -servername ${domain}

# Test cache hit
curl -sI https://${domain}/static/style.css | grep "cf-cache-status"
# First request: MISS, second request: HIT

# Performance test
curl -w "@curl-format.txt" -o /dev/null -s https://${domain}/
\`\`\`

**Review cache rules and security settings before activating.**`;

    const result = await this.runTask(prompt);
    if (result.success) {
      await this.requestApproval(
        `CDN configuration ready for ${domain}`,
        `Origin: ${origin}, Cache rules: ${cacheRules.length}`,
        ['Activate', 'Reject', 'Test First']
      );
      result.needsApproval = true;
    }
    return result;
  }

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
