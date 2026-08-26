import { describe, expect, it } from 'vitest';
import { CHANGELOG } from './changelog';

describe('CHANGELOG', () => {
  it('keeps dated design, development, content, curriculum, and accessibility records', () => {
    expect(CHANGELOG).toEqual([
      { date: '2026-08-26', category: '접근성', detailKo: '키보드, 375px 모바일, 200% 확대, 스크린 리더 언어, 모션 감소 대체를 검증했습니다.' },
      { date: '2026-08-26', category: '교육과정', detailKo: '4영02-10과 6영02-07·09·10을 미션별 성취 증거에 연결했습니다.' },
      { date: '2026-08-26', category: '콘텐츠', detailKo: '대화 문구 10개와 번들 음원 대본 20개를 학년 수준과 포용성 기준으로 검수했습니다.' },
      { date: '2026-08-26', category: '개발', detailKo: '수준 2단계, 미션 10개, 네 가지 수리 전략, 문자·번들 음원 학습 흐름을 구현했습니다.' },
      { date: '2026-08-26', category: '설계', detailKo: '최초 설계 문서를 작성했습니다.' },
    ]);
  });
});
