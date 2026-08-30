# Signal Center Page Rules

상위 기준: `design-system/MASTER.md`

## Information hierarchy

1. 서비스명과 “못 알아들은 순간도 대화를 이어 가는 신호”라는 학습 약속
2. `오늘의 첫 행동` 한 문장
3. 학년 선택과 음성 선택(음성은 선택 사항)
4. 추천 미션 카드 하나와 `gi-pulse` 시작 CTA
5. 나머지 미션 카드 4개
6. 오늘의 전략 한 줄과 접힌 상세 도움말

개인정보 경계는 짧은 보조 문장으로 보이게 하되 추천 CTA보다 긴 수직 공간을 차지하지 않는다.

## Setup panel

- `SetupPanelProps`는 현재 `gradeBand`, `voiceEnabled`, 두 callback만 전달받는다.
- 학년 버튼은 `aria-pressed`와 “현재 선택” 텍스트를 함께 제공한다.
- 음성 checkbox는 꺼짐을 기본값으로 하고, summary에 선택 사항·발음 점수 없음·대본 가능을 남긴다.
- setup 영역은 320px에서 한 열로 흐르고 추천 card의 첫 CTA를 밀어내지 않는다.

## Mission cards

- 첫 카드만 `data-recommended="true"`, `추천 미션` 또는 `먼저 해 보기` 보조 label, `gi-pulse`를 가진다.
- 모든 카드의 제목·상황·학년/상황 맥락·시작 CTA 순서를 동일하게 한다.
- 추천을 “정답”으로 표현하지 않고 먼저 시도할 경로로만 표현한다.
- 640px 이하 한 열, 641px 이상 두 열; 카드 내부는 긴 영어/한국어 문장에 대응한다.

## Empty and support states

- 미션 데이터가 없으면 빈 grid보다 복구 가능한 안내와 center return action을 보여 준다.
- 전략 도움말은 전체 예시를 details로 접되, 네 전략 목적을 한 줄 요약으로 먼저 안내할 수 있다.
- 업데이트 trigger는 화면 오른쪽 아래에 두되 모바일 CTA와 겹치면 normal flow fallback을 사용한다.
