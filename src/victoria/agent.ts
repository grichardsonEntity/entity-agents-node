/**
 * Victoria Agent - AI Researcher
 *
 * Expert in LLMs, embeddings, RAG architectures, vector databases,
 * fine-tuning, prompt engineering, multi-modal AI, agent architecture,
 * AI cost analysis, AI safety, and on-device inference.
 */

import { BaseAgent, type TaskResult } from '../shared/index.js';
import { victoriaConfig } from './config.js';

export class VictoriaAgent extends BaseAgent {
  constructor(config = victoriaConfig) {
    super(config);
  }

  // ── Existing Methods ────────────────────────────────────────────

  async evaluateEmbedding(modelName: string): Promise<TaskResult> {
    await this.notifier.notify(`Evaluating: ${modelName}`);
    const prompt = `Evaluate embedding model: ${modelName}\n\nAnalyze: Latency, dimension, memory, MTEB scores, compatibility.`;
    return this.runTask(prompt);
  }

  async designRAG(requirements: string): Promise<TaskResult> {
    await this.notifier.notify('Designing RAG architecture');
    const prompt = `Design RAG architecture for:\n\n${requirements}\n\nInclude: Chunking, embedding, retrieval, context management.`;
    return this.runTask(prompt);
  }

  async benchmarkLLM(modelName: string): Promise<TaskResult> {
    await this.notifier.notify(`Benchmarking: ${modelName}`);
    const prompt = `Benchmark LLM: ${modelName}\n\nMeasure: TTFT, throughput, memory, quality.`;
    return this.runTask(prompt);
  }

  // ── New Methods ─────────────────────────────────────────────────

  async designPromptSystem(useCase: string, model: string = 'gpt-4'): Promise<TaskResult> {
    await this.notifier.notify(`Designing prompt system for: ${useCase} (model: ${model})`);

    const prompt = `Design a comprehensive prompt system for the following use case:

**Use Case:** ${useCase}
**Target Model:** ${model}

## 1. System Prompt Design
- Role definition and persona
- Behavioral constraints and guardrails
- Output format specification
- Error handling instructions
- Token budget considerations for ${model}

## 2. Few-Shot Examples
- Design 3-5 representative examples covering:
  - Happy path (standard input/output)
  - Edge cases (ambiguous input, missing data)
  - Boundary conditions (very long input, multi-part queries)
- Example selection strategy (static vs dynamic retrieval-based)

## 3. Chain-of-Thought Patterns
- Step-by-step reasoning template
- When to use CoT vs direct answer (latency/cost tradeoff)
- Self-consistency sampling strategy if applicable
- Decomposition approach for complex queries

## 4. Tool Use Integration
- Function/tool schemas if applicable
- Tool selection prompting strategy
- ReAct pattern implementation
- Structured output format (JSON mode considerations)

## 5. Evaluation Plan
- Test cases for prompt quality assessment
- A/B testing methodology
- Regression detection strategy
- Metrics: accuracy, format compliance, latency, cost-per-call

## 6. Optimization Notes
- Token optimization opportunities (shorter prompts, caching)
- Model-specific adaptations (${model} strengths and limitations)
- Fallback strategy if primary model unavailable

**Provide the complete prompt system ready for implementation.**`;

    return this.runTask(prompt);
  }

  async evaluateFineTuning(
    baseModel: string,
    datasetDescription: string,
    goals: string
  ): Promise<TaskResult> {
    await this.notifier.notify(`Evaluating fine-tuning for: ${baseModel}`);

    const prompt = `Evaluate fine-tuning feasibility and approach:

**Base Model:** ${baseModel}
**Dataset Description:** ${datasetDescription}
**Goals:** ${goals}

## 1. Fine-Tuning vs Prompt Engineering Decision
- Can this be solved with better prompting? (few-shot, CoT, RAG)
- Quantify the gap between current prompt-based performance and target
- Cost comparison: fine-tuning investment vs prompt engineering iteration
- Decision matrix with clear recommendation

## 2. Recommended Approach
| Method | VRAM Required | Training Time | Quality Impact | Cost |
|--------|--------------|---------------|----------------|------|
| Full Fine-Tune | ... | ... | ... | ... |
| LoRA (r=16) | ... | ... | ... | ... |
| QLoRA (4-bit) | ... | ... | ... | ... |
| Prefix Tuning | ... | ... | ... | ... |

- **Recommended method** with justification
- Hyperparameter starting points (learning rate, epochs, rank)
- Hardware requirements (GPU type, count, training time estimate)

## 3. Dataset Requirements
- Minimum dataset size for this task
- Data quality checklist
- Synthetic data generation opportunities
- Data augmentation strategies
- Train/validation/test split ratios

## 4. Evaluation Strategy
- Benchmark metrics specific to ${goals}
- Baseline measurement approach
- Automated evaluation pipeline (lm-eval-harness, custom benchmarks)
- Human evaluation protocol if needed
- Regression testing against base model capabilities
- Hallucination rate measurement pre/post fine-tuning

## 5. Production Deployment
- Model serving considerations (vLLM, TGI, Ollama)
- A/B testing rollout plan
- Rollback criteria and strategy
- Ongoing monitoring and retraining triggers

## 6. Cost Analysis
- Training cost estimate (GPU hours x rate)
- Inference cost comparison (base vs fine-tuned)
- Total cost of ownership over 6 months`;

    return this.runTask(prompt);
  }

  async designAgentArchitecture(requirements: string): Promise<TaskResult> {
    await this.notifier.notify('Designing agent architecture');

    const prompt = `Design an agent architecture for the following requirements:

${requirements}

## 1. Architecture Pattern Selection
- Single agent vs multi-agent decision with rationale
- Orchestration pattern: Sequential / Parallel / Hierarchical / DAG
- Communication protocol: Direct call / Message queue / A2A protocol / MCP
- Architecture diagram (text-based)

## 2. Agent Design
For each agent in the system:
- **Name & Role** — Clear responsibility boundary
- **Model Selection** — Which LLM and why (cost/quality tradeoff)
- **System Prompt** — Key behavioral instructions
- **Tools Available** — Function schemas with input/output types
- **Memory Strategy** — Context window management, long-term storage

## 3. MCP Server Integration
- Resource definitions (what data each agent can access)
- Tool registrations (what actions each agent can perform)
- Server implementation approach (stdio vs HTTP)
- Authentication and authorization model
- Error handling and retry strategies

## 4. Tool Use Design
- Function calling schemas for each tool
- Input validation and sanitization
- Output parsing and error handling
- Fallback chains when tools fail
- Rate limiting and cost controls

## 5. Orchestration & Flow
- Task decomposition strategy
- Agent routing and delegation logic
- Result aggregation and conflict resolution
- Parallel execution opportunities
- Timeout and circuit breaker patterns

## 6. Memory & State Management
- Short-term: Context window strategy (summarization, sliding window)
- Long-term: Vector store for episodic memory
- Shared state: How agents share context and results
- Session management for multi-turn interactions

## 7. Error Handling & Resilience
- Retry strategies with exponential backoff
- Fallback models (primary -> secondary -> local)
- Graceful degradation when components fail
- Logging and observability (traces, metrics)
- Dead letter queue for failed tasks

## 8. Cost & Performance Estimates
- Token usage per interaction (estimated)
- Latency budget per step
- Monthly cost projection at expected scale
- Optimization opportunities (caching, batching, model routing)`;

    return this.runTask(prompt);
  }

  async analyzeAICosts(models: string[], usagePatterns: string): Promise<TaskResult> {
    await this.notifier.notify(`Analyzing AI costs for: ${models.join(', ')}`);

    const modelRows = models.map(m => `| ${m} | ... | ... | ... | ... |`).join('\n');

    const prompt = `Analyze AI costs and optimize spending:

**Models to Analyze:** ${models.join(', ')}
**Usage Patterns:** ${usagePatterns}

## 1. Token Cost Comparison
| Model | Input $/1M tokens | Output $/1M tokens | Context Window | Batch Discount |
|-------|-------------------|---------------------|----------------|----------------|
${modelRows}

## 2. Usage Analysis
- Estimated tokens per request (input + output)
- Daily/monthly request volume projection
- Peak vs average usage patterns
- Context caching opportunities (prompt caching savings)

## 3. Monthly Cost Projection
| Model | Daily Cost | Monthly Cost | Annual Cost | Cost/Query |
|-------|-----------|-------------|-------------|------------|
${modelRows}

## 4. Optimization Strategies
- **Model Routing** — Use cheaper models for simple tasks, expensive for complex
- **Prompt Optimization** — Reduce input tokens without quality loss
- **Caching** — Semantic cache hit rate estimates, prompt prefix caching
- **Batching** — Batch API usage for non-real-time workloads (50% discount)
- **Context Management** — Summarization vs full context, sliding window strategies
- **Fine-Tuning** — When a fine-tuned smaller model beats a larger general model on cost

## 5. Quality-Cost Tradeoff Matrix
| Scenario | Best Model | Cost/Query | Quality Score | Recommendation |
|----------|-----------|------------|---------------|----------------|
| Simple classification | ... | ... | ... | ... |
| Complex reasoning | ... | ... | ... | ... |
| Code generation | ... | ... | ... | ... |
| Summarization | ... | ... | ... | ... |

## 6. Infrastructure Cost Considerations
- Self-hosted vs API cost crossover point
- GPU rental vs purchase analysis (if applicable)
- Embedding generation costs (batch vs real-time)
- Vector database hosting costs at scale

## 7. Recommendations
- Immediate savings opportunities (ranked by impact)
- Medium-term optimization roadmap
- Cost monitoring and alerting thresholds
- Budget allocation recommendation`;

    return this.runTask(prompt);
  }

  async evaluateAISafety(
    modelOrSystem: string,
    evaluationType: string = 'comprehensive'
  ): Promise<TaskResult> {
    await this.notifier.notify(`Evaluating AI safety: ${modelOrSystem} (${evaluationType})`);

    const prompt = `Evaluate AI safety for: ${modelOrSystem}
Evaluation Type: ${evaluationType}

## 1. Red-Team Evaluation
- **Prompt Injection** — Test for direct and indirect injection vulnerabilities
- **Jailbreak Resistance** — Test common jailbreak patterns (DAN, roleplay, encoding tricks)
- **Information Extraction** — Test for system prompt leakage, training data extraction
- **Harmful Content** — Test refusal behaviors for dangerous, illegal, or unethical requests
- Severity classification for each finding (Critical / High / Medium / Low)

## 2. Bias Detection
- **Demographic Bias** — Test outputs across gender, race, age, nationality dimensions
- **Stereotype Reinforcement** — Check for harmful stereotypes in generated content
- **Representation Analysis** — Evaluate diversity in generated examples and recommendations
- **Fairness Metrics** — Equal opportunity, demographic parity, calibration across groups
- Bias measurement methodology and scoring

## 3. Hallucination Measurement
- **Factual Accuracy** — Test with verifiable claims, measure confabulation rate
- **Groundedness** — When given context, measure faithfulness to source material
- **Citation Accuracy** — Test if referenced sources exist and contain claimed information
- **Confidence Calibration** — Does the model express uncertainty appropriately?
- Hallucination rate: percentage across N test cases
- Domain-specific hallucination patterns

## 4. Guardrail Design
- **Input Guardrails:**
  - Topic boundary enforcement
  - PII detection and redaction (names, emails, SSNs, etc.)
  - Prompt injection detection layer
  - Input length and rate limiting
- **Output Guardrails:**
  - Content classification (Llama Guard, OpenAI moderation, custom)
  - Factuality verification layer
  - Format compliance validation
  - Sensitive information filtering
- **Implementation:**
  - Recommended guardrail framework (NeMo Guardrails, Guardrails AI, custom)
  - Latency impact of each guardrail layer
  - False positive rate targets

## 5. Compliance & Documentation
- Data handling and privacy considerations
- Model card documentation requirements
- Audit trail and logging recommendations
- Incident response plan for safety failures

## 6. Remediation Recommendations
- Priority-ranked list of issues found
- Remediation approach for each issue
- Timeline and effort estimates
- Re-evaluation schedule`;

    return this.runTask(prompt);
  }

  async designMultimodalPipeline(
    modalities: string[],
    requirements: string
  ): Promise<TaskResult> {
    await this.notifier.notify(`Designing multi-modal pipeline: ${modalities.join(', ')}`);

    const prompt = `Design a multi-modal AI pipeline:

**Modalities:** ${modalities.join(', ')}
**Requirements:** ${requirements}

## 1. Pipeline Architecture
- End-to-end flow diagram (text-based)
- Input preprocessing for each modality
- Model selection for each stage
- Output fusion strategy
- Latency budget allocation per stage

## 2. Model Selection per Modality

### Vision (if applicable)
| Model | Task | Latency | VRAM | Quality | Cost |
|-------|------|---------|------|---------|------|
| GPT-4V/4o | General vision | ... | API | ... | ... |
| LLaVA-1.6 | Open-source vision | ... | ... | ... | Free |
| Florence-2 | Detection/OCR | ... | ... | ... | Free |
| CLIP | Embedding/search | ... | ... | ... | Free |

### Audio (if applicable)
| Model | Task | Latency | RAM | Quality | Cost |
|-------|------|---------|-----|---------|------|
| Whisper large-v3 | Transcription | ... | ... | ... | Free |
| Whisper turbo | Fast transcription | ... | ... | ... | Free |
| Deepgram Nova-2 | Real-time ASR | ... | API | ... | ... |
| Speaker diarization | Who spoke when | ... | ... | ... | ... |

### Text
| Model | Task | Latency | Context | Quality | Cost |
|-------|------|---------|---------|---------|------|
| ... | ... | ... | ... | ... | ... |

## 3. Cross-Modal Integration
- How modalities interact (early fusion, late fusion, cross-attention)
- Unified embedding space strategy (CLIP, ImageBind)
- Multi-modal RAG implementation:
  - Image + text chunk storage
  - Cross-modal retrieval strategy
  - Context assembly from mixed modalities

## 4. Preprocessing Pipelines
- Image: resize, normalize, format conversion, OCR extraction
- Audio: sample rate, noise reduction, VAD, chunking for long audio
- Text: tokenization, entity extraction, metadata enrichment
- Video: frame extraction, scene detection, keyframe selection

## 5. Performance Optimization
- Batch processing strategies per modality
- Caching opportunities (embedding cache, transcription cache)
- GPU memory management across models
- Async processing for independent modality paths
- Streaming support for real-time applications

## 6. Quality Assurance
- Per-modality quality metrics
- End-to-end evaluation methodology
- Error handling for degraded input (blurry image, noisy audio)
- Fallback strategies per modality
- Human-in-the-loop verification points

## 7. Deployment Architecture
- Containerization strategy (one container per model vs shared)
- GPU allocation and sharing
- Scaling considerations per modality
- Cost estimate at target throughput`;

    return this.runTask(prompt);
  }

  async optimizeInference(
    model: string,
    targetPlatform: string = 'server'
  ): Promise<TaskResult> {
    await this.notifier.notify(`Optimizing inference: ${model} for ${targetPlatform}`);

    const prompt = `Optimize inference for:

**Model:** ${model}
**Target Platform:** ${targetPlatform}

## 1. Quantization Strategy
| Method | Bits | Quality Loss | Speed Gain | VRAM Reduction | Best For |
|--------|------|-------------|------------|----------------|----------|
| GPTQ | 4-bit | ... | ... | ... | GPU inference |
| AWQ | 4-bit | ... | ... | ... | GPU inference |
| GGUF | Q4_K_M | ... | ... | ... | CPU/hybrid |
| GGUF | Q5_K_M | ... | ... | ... | CPU/hybrid |
| INT8 | 8-bit | ... | ... | ... | Balanced |
| FP16 | 16-bit | Baseline | Baseline | Baseline | Reference |

- Recommended quantization for ${targetPlatform}
- Calibration dataset requirements
- Quality benchmarks pre/post quantization

## 2. Serving Framework Selection
| Framework | Throughput | Latency | Features | Complexity |
|-----------|-----------|---------|----------|------------|
| vLLM | ... | ... | PagedAttention, continuous batching | ... |
| TGI | ... | ... | Streaming, multi-LoRA | ... |
| llama.cpp | ... | ... | CPU/GPU hybrid, GGUF | ... |
| Ollama | ... | ... | Easy setup, model management | ... |
| TensorRT-LLM | ... | ... | NVIDIA optimized | ... |
| Core ML | ... | ... | Apple Silicon, Neural Engine | ... |
| ONNX Runtime | ... | ... | Cross-platform | ... |

- **Recommended framework** for ${targetPlatform} with justification

## 3. Batching & Scheduling
- Continuous batching configuration
- Dynamic batch size optimization
- Request scheduling strategy (FCFS, priority-based)
- Prefill vs decode phase optimization
- Speculative decoding applicability

## 4. Caching Strategies
- **KV-Cache Optimization** — Memory management, eviction policies
- **Prompt Caching** — System prompt prefix caching, cache hit rate estimates
- **Semantic Caching** — Similar query detection, cache invalidation strategy
- **Response Caching** — Exact match caching for repeated queries

## 5. Platform-Specific Optimization for ${targetPlatform}
- Hardware utilization recommendations
- Memory management (VRAM allocation, offloading strategies)
- Concurrency configuration
- Thermal and power considerations (if on-device)
- Network optimization (if API-based)

## 6. Monitoring & Benchmarks
- Key metrics to track: TTFT, TPS, p50/p95/p99 latency, throughput
- Load testing methodology
- Regression detection thresholds
- Alerting configuration

## 7. Implementation Plan
- Step-by-step optimization path (ordered by impact/effort ratio)
- Expected improvement per step (quantified)
- Rollback plan for each optimization
- Timeline estimate`;

    return this.runTask(prompt);
  }

  // ── General Work ────────────────────────────────────────────────

  async work(task: string): Promise<TaskResult> {
    await this.notifier.notify(`Starting: ${task.substring(0, 50)}...`);
    return this.runTask(task);
  }
}
