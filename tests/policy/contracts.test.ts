import { describe, expect, it } from 'vitest';
import { PackSchema } from '../../src/policy/model';
import {
  publicAddressQuality,
  resolvePack,
} from '../../src/policy/public-address-quality';
describe('versioned public authority contract', () => {
  it('validates six rules with source metadata and no automatic severity', () => {
    const p = PackSchema.parse(publicAddressQuality);
    expect(p.rules).toHaveLength(6);
    for (const r of p.rules) {
      expect(r.authority.sourceStatus).toBe('CURRENT');
      expect(r.authority.accessedDate).toBe('2026-10-07');
      expect(r.authority.effectiveDate).toBeNull();
      expect(r.authority.sourceSection.length).toBeGreaterThan(10);
      expect(r.severity).toBe('UNASSIGNED');
    }
  });
  it('rejects URL-only metadata and duplicate rule IDs', () => {
    const copy = structuredClone(publicAddressQuality);
    Reflect.deleteProperty(copy.rules[0]!.authority, 'sourceVersion');
    expect(PackSchema.safeParse(copy).success).toBe(false);
    expect(
      PackSchema.safeParse({
        ...publicAddressQuality,
        rules: [publicAddressQuality.rules[0], publicAddressQuality.rules[0]],
      }).success,
    ).toBe(false);
  });
  it('pins exact versions without mutable latest or unknown fallback', () => {
    expect(resolvePack('public-address-quality', '0.1.0')).toBe(
      publicAddressQuality,
    );
    expect(() => resolvePack('public-address-quality', 'latest')).toThrow();
    expect(() => resolvePack('fedwire', '0.1.0')).toThrow();
    expect(Object.isFrozen(publicAddressQuality.rules[0]!.authority)).toBe(
      true,
    );
  });
});
