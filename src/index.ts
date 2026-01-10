/**
 * Entity Agents - Node/TypeScript Edition
 *
 * A team of 11 specialized autonomous AI agents for software development.
 */

// Shared exports
export * from './shared/index.js';

// Agent exports
export { ValentinaAgent, valentinaConfig } from './valentina/index.js';
export { SydneyAgent, sydneyConfig } from './sydney/index.js';
export { AmberAgent, amberConfig } from './amber/index.js';
export { VictoriaAgent, victoriaConfig } from './victoria/index.js';
export { BrettJrAgent, brettjrConfig } from './brettjr/index.js';
export { TangoAgent, tangoConfig } from './tango/index.js';
export { SugarAgent, sugarConfig } from './sugar/index.js';
export { SophieAgent, sophieConfig } from './sophie/index.js';
export { AshetonAgent, ashetonConfig } from './asheton/index.js';
export { MaxwellAgent, maxwellConfig } from './maxwell/index.js';
export { HarperAgent, harperConfig } from './harper/index.js';
export { QuinnAgent, quinnConfig } from './quinn/index.js';

// Agent registry
export const AGENTS = {
  valentina: ValentinaAgent,
  sydney: SydneyAgent,
  amber: AmberAgent,
  victoria: VictoriaAgent,
  brettjr: BrettJrAgent,
  tango: TangoAgent,
  sugar: SugarAgent,
  sophie: SophieAgent,
  asheton: AshetonAgent,
  maxwell: MaxwellAgent,
  harper: HarperAgent,
  quinn: QuinnAgent,
} as const;

export type AgentName = keyof typeof AGENTS;

/**
 * Get an agent instance by name
 */
export function getAgent(name: string): InstanceType<typeof AGENTS[AgentName]> {
  const normalized = name.toLowerCase().replace(/[\s-]/g, '') as AgentName;
  const AgentClass = AGENTS[normalized];

  if (!AgentClass) {
    throw new Error(`Unknown agent: ${name}. Available: ${Object.keys(AGENTS).join(', ')}`);
  }

  return new AgentClass();
}

// Import agent classes for registry
import { ValentinaAgent } from './valentina/index.js';
import { SydneyAgent } from './sydney/index.js';
import { AmberAgent } from './amber/index.js';
import { VictoriaAgent } from './victoria/index.js';
import { BrettJrAgent } from './brettjr/index.js';
import { TangoAgent } from './tango/index.js';
import { SugarAgent } from './sugar/index.js';
import { SophieAgent } from './sophie/index.js';
import { AshetonAgent } from './asheton/index.js';
import { MaxwellAgent } from './maxwell/index.js';
import { HarperAgent } from './harper/index.js';
import { QuinnAgent } from './quinn/index.js';
