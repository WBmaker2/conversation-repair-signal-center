import type { Mission } from './mission';

const fixture = {
  id: 'contract-fixture',
  gradeBand: '3-4',
  allowedStrategyIds: ['specify'],
  audioCues: [],
} satisfies Pick<Mission, 'id' | 'gradeBand' | 'allowedStrategyIds' | 'audioCues'>;

it('keeps mission identifiers and strategy identifiers explicit', () => {
  expect(fixture.gradeBand).toBe('3-4');
  expect(fixture.allowedStrategyIds).toEqual(['specify']);
});
