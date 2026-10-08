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
  fixtureId: z.enum(['C', 'D', 'E', 'F', 'J']),
});
export const bundledWitnesses: Record<
  z.infer<typeof FixtureInput>['fixtureId'],
  CanonicalWitness
> = {
  C: { source: Csource, target: Ctarget, context: Ccontext },
  D: { source: Dsource, target: Dtarget, context: Dcontext },
  E: { source: Esource, target: Etarget, context: Econtext },
  F: { source: Fsource, target: Ftarget, context: Fcontext },
  J: { source: Jsource, target: Jtarget, context: Jcontext },
};
