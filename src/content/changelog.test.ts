import { describe, expect, it } from 'vitest';
import { CHANGELOG } from './changelog';

describe('CHANGELOG', () => {
  it('starts with the 2026-08-31 learner-language improvement record', () => {
    expect(CHANGELOG[0]).toEqual(expect.objectContaining({ date: '2026-08-31' }));
    expect(CHANGELOG[0]?.detailKo).toMatch(/업데이트|미션|전략|학생/);
  });

  it('keeps dated design, development, content, curriculum, and accessibility records', () => {
    expect(CHANGELOG).toEqual([
      {
        date: '2026-08-31',
        category: '콘텐츠',
        detailKo: '학생이 이해하기 쉬운 학습 기록 이름과 복구 안내로 문구를 다듬었습니다.',
      },
      {
        date: '2026-08-30',
        category: '접근성',
        detailKo: '업데이트 기록 영역을 넓히고, 빈 미션·전략 요약·학생용 결과 문구를 보완했습니다.',
      },
      {
        date: '2026-08-29',
        category: '개발',
        detailKo: '첫 추천 미션과 단계별 학습 행동을 앞세우고, 완료 화면의 다음 행동을 분명하게 정리했습니다.',
      },
      {
        date: '2026-08-28',
        category: '개발',
        detailKo: '추천 미션과 단계 진행 표시를 앞세우고, 학생용 문구·오디오 오류 안내·확대 대화상자를 개선했습니다.',
      },
      { date: '2026-08-27', category: '개발', detailKo: '공개 Pages 배포와 브라우저 탭 아이콘을 추가했습니다.' },
      { date: '2026-08-26', category: '접근성', detailKo: '화면과 음성 대본을 일치시키고 음성 선택 영역을 44px 이상으로 넓혔습니다.' },
      { date: '2026-08-26', category: '접근성', detailKo: '375px 모바일과 200% 확대에서 본문·업데이트 대화상자의 가로·세로 잘림을 막았습니다.' },
      { date: '2026-08-26', category: '접근성', detailKo: '업데이트 대화상자 키보드 초점 범위와 개인정보 안전 검사를 강화했습니다.' },
      { date: '2026-08-26', category: '접근성', detailKo: '키보드, 375px 모바일, 200% 확대, 스크린 리더용 언어 표기와 모션 감소 대체 규칙을 점검했습니다.' },
      { date: '2026-08-26', category: '교육과정', detailKo: '4영02-10과 6영02-07·09·10을 미션별 성취 증거에 연결했습니다.' },
      { date: '2026-08-26', category: '콘텐츠', detailKo: '대화 문구 10개와 번들 음원 대본 20개를 학년 수준과 포용성 기준으로 검수했습니다.' },
      { date: '2026-08-26', category: '개발', detailKo: '수준 2단계, 미션 10개, 네 가지 수리 전략, 문자·번들 음원 학습 흐름을 구현했습니다.' },
      { date: '2026-08-26', category: '설계', detailKo: '최초 설계 문서를 작성했습니다.' },
    ]);
  });
});
