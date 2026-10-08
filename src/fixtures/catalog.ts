import P5source from '../../fixtures/canonical/P5/source.jsonl?raw';
import P5target from '../../fixtures/canonical/P5/target.jsonl?raw';
import P5context from '../../fixtures/canonical/P5/context.json?raw';
import P4source from '../../fixtures/canonical/P4/source.jsonl?raw';
import P4target from '../../fixtures/canonical/P4/target.jsonl?raw';
import P4context from '../../fixtures/canonical/P4/context.json?raw';
import P3source from '../../fixtures/canonical/P3/source.jsonl?raw';
import P3target from '../../fixtures/canonical/P3/target.jsonl?raw';
import P3context from '../../fixtures/canonical/P3/context.json?raw';
import P2source from '../../fixtures/canonical/P2/source.jsonl?raw';
import P2target from '../../fixtures/canonical/P2/target.jsonl?raw';
import P2context from '../../fixtures/canonical/P2/context.json?raw';
import P1source from '../../fixtures/canonical/P1/source.jsonl?raw';
import P1target from '../../fixtures/canonical/P1/target.jsonl?raw';
import P1context from '../../fixtures/canonical/P1/context.json?raw';
import { z } from 'zod';
import type { CanonicalWitness } from './canonical';
import Csource from '../../fixtures/canonical/C/source.jsonl?raw';
import Ctarget from '../../fixtures/canonical/C/target.jsonl?raw';
import Ccontext from '../../fixtures/canonical/C/context.json?raw';
import Dsource from '../../fixtures/canonical/D/source.jsonl?raw';
import Dtarget from '../../fixtures/canonical/D/target.jsonl?raw';
import Dcontext from '../../fixtures/canonical/D/context.json?raw';
import Esource from '../../fixtures/canonical/E/source.jsonl?raw';
import Etarget from '../../fixtures/canonical/E/target.jsonl?raw';
import Econtext from '../../fixtures/canonical/E/context.json?raw';
import Fsource from '../../fixtures/canonical/F/source.jsonl?raw';
import Ftarget from '../../fixtures/canonical/F/target.jsonl?raw';
import Fcontext from '../../fixtures/canonical/F/context.json?raw';
import Jsource from '../../fixtures/canonical/J/source.jsonl?raw';
import Jtarget from '../../fixtures/canonical/J/target.jsonl?raw';
import Jcontext from '../../fixtures/canonical/J/context.json?raw';
export const FixtureInput = z.strictObject({
  fixtureId: z.enum(['C', 'D', 'E', 'F', 'J', 'P1', 'P2', 'P3', 'P4', 'P5']),
});
export const bundledWitnesses: Record<
  z.infer<typeof FixtureInput>['fixtureId'],
  CanonicalWitness
> = {
  P1: { source: P1source, target: P1target, context: P1context },
  P2: { source: P2source, target: P2target, context: P2context },
  P3: { source: P3source, target: P3target, context: P3context },
  P4: { source: P4source, target: P4target, context: P4context },
  P5: { source: P5source, target: P5target, context: P5context },
  C: { source: Csource, target: Ctarget, context: Ccontext },
  D: { source: Dsource, target: Dtarget, context: Dcontext },
  E: { source: Esource, target: Etarget, context: Econtext },
  F: { source: Fsource, target: Ftarget, context: Fcontext },
  J: { source: Jsource, target: Jtarget, context: Jcontext },
};
