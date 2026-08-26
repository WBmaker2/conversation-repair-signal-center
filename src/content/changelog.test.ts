import { describe, expect, it } from 'vitest';
import { CHANGELOG } from './changelog';

describe('CHANGELOG', () => {
  it('keeps dated design, development, content, curriculum, and accessibility records', () => {
    expect(CHANGELOG).toEqual(expect.arrayContaining([
      expect.objectContaining({ date: '2026-08-26', category: '설계' }),
      expect.objectContaining({ date: '2026-08-26', category: '개발' }),
      expect.objectContaining({ date: '2026-08-26', category: '콘텐츠' }),
      expect.objectContaining({ date: '2026-08-26', category: '교육과정' }),
      expect.objectContaining({ date: '2026-08-26', category: '접근성' }),
    ]));
  });
});
