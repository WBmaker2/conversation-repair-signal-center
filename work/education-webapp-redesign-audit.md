# Conversation Repair Signal Center — Initial UX/UI Audit

작성일: 2026-08-29
감사 범위: 로컬 production preview `http://127.0.0.1:4176/`, 대표 미션 `g34-classroom-box`, 음성 기본 꺼짐
감사 방식: 코드·콘텐츠·CSS 정적 검토와 승인된 외부 headless Chromium으로 320/375/768/1280px 측정
초기 감사(2026-08-29) 지원 역할 상태: `impeccable` unavailable/not run; 당시에는 동일 체크리스트를 오케스트레이터가 직접 수행했으며, 2026-08-30 재감사에서 실제 설치 경로를 다시 확인함
VoiceOver: 프로젝트 규칙에 따라 구현·검증하지 않음

## 학습 목표와 현재 흐름

현재 앱은 영어 대화에서 불명확한 부분을 찾고, `repeat/specify/confirm/rephrase` 전략을 선택한 뒤 상대의 응답과 의미를 연결하는 4단계 흐름을 제공한다. 10개 미션, 음성 off 완주, 메모리 전용 세션, 학생 이름·점수·순위·서버 저장 없음은 유지해야 한다.

관찰된 화면 순서:

```text
서비스 제목/약속 → 개인정보 안내 → 학년 선택 → 음성 선택 → 미션 5개 → 오늘의 전략 → 접힌 전략 도움말
```

대표 미션 진입 후 `1/4 다시 물어볼 부분 찾기`가 표시되고, 핵심 CTA는 `모호한 부분 찾기`다. 현재 페이지에서 오답·단계 복귀·완료 기록은 코드와 기존 테스트에 존재하지만, 시각적 위계는 센터와 같은 공통 토큰으로 더 정리할 여지가 있다.

## 측정된 baseline

| viewport | scrollWidth/clientWidth | mission-grid | 추천 CTA bounding box | 관찰 |
|---|---:|---|---|---|
| 320×812 | 320/320 | 1열, 288px | y 826.33, h 44.80, bottom 871.13 | 가로 overflow 없음; 첫 CTA가 첫 viewport 밖 |
| 375×812 | 375/375 | 1열, 343px | y 757.70, h 44.80, bottom 802.50 | 첫 CTA가 viewport 안; 하단 여유가 작음 |
| 768×900 | 768/768 | 2열, 360px + 360px | y 795.20, h 45.69, bottom 840.89 | 두 열은 동작하지만 첫 행동이 접힘 아래에 가까움 |
| 1280×900 | 1280/1280 | 2열, 440px + 440px | y 850.42, h 47.27, bottom 897.69 | CTA가 하단에 붙어 시선·스크롤 부담 |

추가 baseline:

- `<title>`과 `h1`은 `대화 수리 신호센터`로 일치한다.
- 센터에는 `3~4학년`, `5~6학년`, 선택 상태 문구, 음성 선택 사항, 추천 CTA, `업데이트 내역` 버튼이 있다.
- 대표 미션 클릭 후 진행 표시는 `1/4 다시 물어볼 부분 찾기`로 보인다.
- 375px dialog는 x 16, y 16, w 343, h 780이며 내부 `scrollHeight 1139`로 스크롤된다. 제목·닫기 버튼은 dialog 내부에 남는다.
- `prefers-reduced-motion: reduce`에서 추천 CTA의 `animationName=none`, `outlineWidth=3px`가 계산된다.
- 감사 중 콘솔 오류 0건, 로컬 preview origin 밖 요청 0건이었다.
- 미션 단계에서는 `App.tsx`가 `UpdateHistoryButton`을 렌더링하지 않아 `업데이트 내역`을 열 수 없다.

## 우선순위별 발견 사항

### P1 — 320px에서 첫 학습 행동이 첫 viewport 밖으로 밀림

- 근거: 320×812에서 추천 CTA bottom이 871.13px이고, 375px에서만 802.50px로 들어온다.
- 영향: 폭이 좁은 휴대전화에서 학생이 “어디서 시작하지?”를 바로 찾지 못하고 불필요한 스크롤을 한다.
- 제안: `LearningPromise`와 `SetupPanel`의 세로 간격을 줄이고 추천 미션의 제목·설명·CTA를 한 묶음으로 앞당긴다. 개인정보·음성 설명은 짧은 보조 문장으로 유지한다.
- 수용 기준: 320×812와 375×812에서 추천 CTA의 `bottom <= viewport height`, scrollWidth가 viewport 이하이며 CTA는 44px 이상이다.

### P1 — 추천 미션과 일반 미션의 시각적 위계가 약함

- 근거: 현재 카드가 같은 3px 상단선·동일한 기본 버튼 규칙을 공유하고 추천 표시는 작은 `먼저 해 보기` 문장으로만 구분된다.
- 영향: 초등학생이 첫 카드가 권장 경로인지, 나머지 카드가 선택 가능한 대안인지 한눈에 비교하기 어렵다.
- 제안: 추천 카드는 `추천 미션` 배지·한 문장 학습 목표·단일 signal 표면을 사용하고, 일반 카드는 중립 표면을 사용한다. 모든 버튼에 pulse를 적용하지 않는다.
- 수용 기준: `[data-recommended="true"]`가 정확히 하나이고 해당 카드의 CTA만 `gi-pulse`이며, 나머지 카드도 동일한 정보 순서를 갖는다.

### P1 — 미션 단계에서 업데이트 내역 접근이 끊김

- 근거: `App.tsx`의 `session.phase !== 'center'` 분기에서 `UpdateHistoryButton`과 dialog가 렌더링되지 않는다.
- 영향: 학생·교사가 단계 중 개선 내역과 음성/콘텐츠 변경 기록을 확인하려면 센터로 돌아가야 한다.
- 제안: `AppShell` 수준으로 업데이트 트리거/dialog 조립을 올리고, 미션 화면에서도 현재 학습을 가리지 않는 고정 위치·focus 복원을 제공한다.
- 수용 기준: center와 observe/repair/response/confirm/record에서 동일한 버튼으로 dialog를 열고 Escape/닫기 후 트리거로 focus가 돌아온다.

### P1 — 긴 설명이 핵심 행동보다 먼저 시선을 차지함

- 근거: 1440×900 캡처에서 서비스 약속·개인정보·학년 fieldset·음성 fieldset가 긴 세로 공간을 차지하고 미션 CTA가 하단에 배치된다.
- 영향: “오늘 무엇을 연습하는가”보다 설정·정책 문장을 먼저 처리해야 한다.
- 제안: 학습 약속을 짧은 hero 문장과 `오늘의 첫 행동`으로 묶고, 개인정보 경계·음성 도움말은 시각적으로 낮춘 보조 영역으로 정리한다.
- 수용 기준: 첫 화면에서 제목, 학습 목표 한 문장, 학년 선택, 추천 미션 CTA가 이 순서로 읽히며 정책·도움말은 학습 CTA를 밀어내지 않는다.

### P2 — 단계 progress가 정보는 있지만 시각적 지도 역할이 약함

- 근거: `PhaseProgress`가 네 라벨과 `aria-current`를 제공하지만, 모든 단계가 같은 텍스트 밀도로 표시되어 현재 단계와 완료/다음 단계의 차이가 작다.
- 영향: 긴 영어 대화 화면에서 학생이 현재 위치와 남은 작업량을 다시 해석해야 한다.
- 제안: 숫자·짧은 행동 라벨·현재 상태를 한 줄 구조로 정리하고 완료된 단계는 정적 check/색상+텍스트로 구분한다. 의미를 아이콘에만 맡기지 않는다.
- 수용 기준: 현재 단계 하나에만 `aria-current="step"`, 시각적 signal, 행동 라벨이 있고 320px에서도 줄바꿈이 안전하다.

### P2 — 선택지·전략 카드·피드백의 상태 대비가 약함

- 근거: 기본 버튼과 선택 label이 같은 surface/line 토큰을 공유하고, feedback은 빈 `role=status` 영역으로 레이아웃 공간만 차지한다.
- 영향: 선택됨·오답 힌트·정답 진행 상태가 학생 눈에 즉시 들어오지 않을 수 있다.
- 제안: 선택됨/오답/정답 상태의 border·background·텍스트를 토큰으로 정의하고, 빈 상태 영역은 높이를 예약하되 시각적으로 조용하게 유지한다.
- 수용 기준: 색상 외에 텍스트와 border로 상태를 구분하고 대비 4.5:1 이상을 유지한다.

### P2 — 전략 도움말이 학습 시작 전에는 완전히 접혀 있음

- 근거: `StrategyLegend`의 `details`가 닫힌 상태라 네 전략의 차이를 미리 알아야 하는 학생에게 추가 행동이 필요하다.
- 영향: 미션을 시작하기 전에 “다시 말해 주세요”와 “더 구체적으로”의 차이를 모르는 학생이 선택지를 무작위로 고를 수 있다.
- 제안: 첫 미션 CTA를 가리지 않는 한 줄 요약을 센터에 제공하고, 전체 예시는 접힌 details에 유지한다.
- 수용 기준: 전략 네 가지의 한국어 목적을 한 문장씩 안내하되 직접 정답을 노출하지 않는다.

### P2 — 완료 화면의 다음 행동이 시각적으로 약함

- 근거: `CommunicationRecord`는 `LearnerTakeaway`와 두 recovery button을 제공하지만 기본 버튼 스타일이 동일해 “다음에 해 보기”와 “센터로 돌아가기”의 우선순위가 같아 보인다.
- 영향: 학생이 학습 takeaway를 읽은 뒤 무엇을 이어 할지 망설일 수 있다.
- 제안: takeaway를 결과 상단의 한 카드로 고정하고, `이 미션 다시 하기`와 `신호센터로 돌아가기` 중 하나만 primary로 지정한다.
- 수용 기준: 배운 점·다음 행동이 교사용 details 밖에 보이고, 다음 학습 행동이 버튼 순서·텍스트로 명확하다.

## 접근성·안전 감사

- 통과 관찰: 라이트 모드, `lang="ko"` root, 영어/한국어 `lang`, `fieldset/legend`, skip link, `aria-pressed`, `aria-current`, 44px 기본 control 규칙이 존재한다.
- 통과 관찰: local preview에서 콘솔 오류 0건, 외부 요청 0건; 기존 privacy/audio 계약과 저장소 금지 규칙을 유지해야 한다.
- 개선 필요: 미션 단계에서 업데이트 dialog를 열 수 없고, P1 첫 CTA geometry는 320px에서 실패한다.
- 수동 게이트: 실제 Chrome 키보드/터치 체감, physical 200% 확대, 학생·교사 문구 적합성은 자동 결과로 대체하지 않는다.
- 제외: VoiceOver 구현·검증은 프로젝트 규칙에 따라 수행하지 않는다.

## 자산 감사 요약

- `public/`에는 `favicon.svg`와 `public/audio/**`의 번들 MP3가 있고, `src/`에는 raster image import·`srcset`·CSS background image 사용이 없다.
- favicon과 MP3/대본은 정체성·증거·학습 콘텐츠 자산이므로 자동 생성·교체하지 않는다.
- 현재 화면은 종이색·신호선·타이포그래피만으로 학습 정보를 전달하므로 장식 이미지를 추가할 학습상 근거가 없다.
- `imagegen` 호출은 `not run`으로 기록한다. 향후 일반 장식 이미지가 필요해지면 asset-safety 검토와 별도 사람 검토 없이는 삽입하지 않는다.

## 다음 설계·구현 수용 기준

1. P1 네 항목(320px 첫 CTA, 추천 위계, 단계 중 업데이트 접근, 긴 설명 위계)을 디자인 시스템과 테스트에 연결한다.
2. P2 단계 progress·선택 상태·전략 요약·완료 CTA 위계를 같은 토큰으로 구현한다.
3. 콘텐츠 ID·판정·오디오·privacy 경계를 변경하지 않고 모든 source 파일을 499줄 이하로 유지한다.
4. 최종 보고서에서 `unavailable/not run` 역할, 자동 결과, 브라우저 결과, 사람 검토 `pending`을 서로 섞지 않는다.

## 최종 리디자인 검토

검토일: 2026-08-29
검토 빌드: 로컬 `npm run build` 성공 후 production preview `http://127.0.0.1:4194/`
브라우저: 승인된 headless Chromium, 브라우저 기반 자동 검증과 오케스트레이터 직접 측정

### P1/P2 해결 대조

| 발견 | 구현 연결 | 최종 근거 | 상태 |
|---|---|---|---|
| 320px 추천 CTA가 첫 viewport 밖 | `LearningPromise.tsx`, `MissionCard.tsx`, `layout.css`, `components.css` | 320×812에서 CTA y 756.33, h 44.80, bottom 801.13; scrollWidth/clientWidth 320/320 | 해결 |
| 추천 미션 위계가 약함 | `MissionCard.tsx`의 `추천 미션` 배지·labels row·`primary-action`·단일 `gi-pulse` | 추천 카드 1개, 추천 CTA 1개만 `gi-pulse primary-action`, 일반 카드 4개는 pulse 없음 | 해결 |
| 미션 단계에서 업데이트 내역 단절 | `App.tsx`의 공통 `updateLayer` | center와 대표 observe 진입 뒤 모두 같은 `업데이트 내역` 버튼·dialog 사용; Escape 후 트리거 focus 복원; 모바일은 CTA를 덮지 않도록 normal-flow fallback | 해결 |
| 긴 설명이 핵심 행동보다 앞섬 | `LearningPromise.tsx`, `SetupPanel.tsx`, `SignalCenter.tsx`, 모바일 간격 토큰 | 제목·학습 약속·첫 행동·설정·추천 CTA 순서로 DOM 배치; 개인정보·상태 문구를 미션 목록 뒤 보조 영역으로 이동 | 해결 |
| 단계 progress의 지도 역할 약함 | `PhaseProgress.tsx`, `components.css` | 현재 하나에 `aria-current="step"`, 각 항목에 `complete/current/upcoming` 상태와 색·텍스트 구분 | 해결 |
| 선택·피드백 상태 대비 약함 | 네 phase 컴포넌트, `FeedbackNotice.tsx`, `tokens.css`, `components.css` | 선택 label signal surface, 오답 warning border, 정답 success border·text가 표시되고 기존 axe/contrast 테스트 통과 | 해결 |
| 전략 도움말이 완전히 닫힘 | `SignalCenter.tsx`, 기존 `StrategyLegend.tsx` | `오늘의 전략` 한 문장을 미션 목록 뒤에 유지하고 네 전략 상세는 기존 details로 보존 | 해결 |
| 완료 후 다음 행동이 약함 | `CommunicationRecord.tsx`, `components.css` | `오늘 배운 점`·`다음에 해 보기`가 기록 상단에 보이고 `이 미션 다시 하기`만 primary로 강조 | 해결 |

### 최종 반응형·상태 측정

| viewport | scrollWidth/clientWidth | grid | 추천 CTA | 판정 |
|---|---:|---|---|---|
| 320×812 | 320/320 | 1열, 288px | y 756.33, h 44.80, bottom 801.13 | 통과 |
| 375×812 | 375/375 | 1열, 343px | y 663.58, h 44.80, bottom 708.38 | 통과 |
| 768×900 | 768/768 | 2열, 360px + 360px | y 762.05, h 45.69, bottom 807.73 | 통과 |
| 1280×900 | 1280/1280 | 2열, 440px + 440px | y 821.84, h 47.27, bottom 869.11 | 통과 |

추가 측정:

- 375×812 업데이트 dialog는 x 16, y 16, w 343, h 390이며 clientHeight 386, scrollHeight 1258로 내부 스크롤이 유지된다. 제목과 닫기 버튼 모두 dialog 안에 있고 Escape 후 `업데이트 내역` 트리거로 focus가 복원된다.
- `prefers-reduced-motion: reduce`에서 추천 CTA는 `animationName=none`, `animationDuration=0.01ms`, `outlineWidth=3px`이며 대화 턴 transform은 `none`이다.
- 대표 observe 진입 후 진행 텍스트는 `1/4 다시 물어볼 부분 찾기`이고, center·observe에서 업데이트 dialog를 열 수 있다.
- 브라우저 측정 중 콘솔 오류 0건, preview origin 밖 요청 0건이었다.

### 자동 검증 결과

- `npm run test:run`: 23개 파일, 229개 테스트 통과
- `npm run lint`: 통과
- `npm run typecheck`: 통과
- `npm run check:size`: 모든 source 파일 500줄 미만
- `npm run check:privacy`: 금지 capability 0건
- `npm run check:audio`: 로컬 음원 20개 canonical parity·metadata·loudness·duration·edge-silence 통과
- `npm run test:audio-verifier`: 6개 통과
- `npm run test:privacy`: 5개 통과
- `npm run test:release-artifacts`: 1개 통과
- `npm run build`: Vite production build 성공
- `PLAYWRIGHT_PORT=4197 npx playwright test --reporter=line`: 40개 통과

### 남은 수동 게이트와 범위 경계

- 실제 초등학생·교사 사용성, 실제 터치 체감, 물리 기기에서의 200% 확대, 실제 MP3 청취 정합성은 사람이 확인해야 하며 이 문서에서는 `pending`으로 둡니다.
- VoiceOver 구현·검증은 프로젝트 규칙에 따라 수행하지 않았습니다.
- 과거 2026-08-29 실행 기록은 당시 환경에서 세 지원 skill을 `unavailable/not run`으로 남겼습니다. 2026-08-30 재감사에서는 실제 설치 경로를 다시 확인하고 아래 표에 현재 상태를 기록했습니다.

## 2026-08-30 리디자인 재감사

이번 실행에서는 프로젝트 규칙·계획·디자인 시스템을 먼저 읽고, 설치된 지원 Skill의 체크리스트를 적용해 기존 작업 트리를 다시 감사했습니다. `PRODUCT.md`가 없던 상태이므로 저장소 설계 문서와 사용자 요청으로 확인된 제품 사실을 `PRODUCT.md`에 기록한 뒤 시각 작업을 진행합니다. 이 환경에서는 구조화 질문 도구를 사용할 수 없어 별도 인터뷰 대신 명시된 설계 원문을 근거로 삼았습니다.

### 지원 역할 확인

| 역할 | 상태 | 확인 경로·시점 | 이번 감사에서의 사용 |
|---|---|---|---|
| `$impeccable` | available | `/Users/kimhongnyeon/.agents/skills/impeccable/SKILL.md`, 2026-08-30 12:44 KST | context·new-work·craft-floor의 접근성·표면·상태 체크리스트 적용 |
| `$ui-ux-pro-max` | available | `/Users/kimhongnyeon/.codex/skills/ui-ux-pro-max/SKILL.md`, 2026-08-30 12:45 KST | design-system, `ux`, `react` 검색 실행; 검색 결과와 제품 제약을 대조 |
| `$redesign-existing-projects` | available | `/Users/kimhongnyeon/.agents/skills/redesign-existing-projects/SKILL.md`, 2026-08-30 12:44 KST | 기존 스택 보존·scan/diagnose/fix 순서 적용 |
| `$imagegen` | available | `/Users/kimhongnyeon/.codex/skills/.system/imagegen/SKILL.md`, 2026-08-30 12:44 KST | 자산 안전 규칙 확인; 새 이미지 필요성이 없어 호출하지 않음 |

`ui-ux-pro-max` 검색은 외부 폰트와 장식 중심 패턴을 제안했지만, 이 앱의 외부 요청 금지·문자 중심 학습·라이트 모드 계약과 충돌하므로 채택하지 않았습니다. 적용한 검색 근거는 semantic HTML, 44px 조작 영역, 보이는 focus, reduced motion, 고정 요소가 focus를 가리지 않게 하는 규칙입니다.

### 재감사에서 확인한 개선 항목

| 우선순위 | 관찰 근거 | 구현할 최소 변경 | 합격 기준 |
|---|---|---|---|
| P1 | `src/styles/components.css`의 업데이트 dialog가 `50dvh`로 제한되어 375px에서 실제 기록 영역이 지나치게 짧음 | dialog를 `70dvh` 이내로 확장하고 200% 확대에서 viewport 안쪽을 유지 | 375×812에서 dialog가 500px 이상이면서 viewport 밖으로 나가지 않고 내부 scroll 유지 |
| P2 | `SignalCenter.tsx`의 빈 `missions` 배열이 빈 grid만 렌더링 | `EmptyMissionState`와 다른 학년 미션 보기 복구 버튼 추가 | 빈 목록에서 안내·복구 버튼이 보이고 callback이 반대 학년으로 호출됨 |
| P2 | `StrategyLegend`의 네 전략 목적이 닫힌 `details` 안에만 있음 | `StrategySummary`로 네 전략 목적을 미션 목록 뒤 한 줄씩 노출 | 네 전략 이름·목적이 details를 열지 않아도 보이고 정답 표현은 노출하지 않음 |
| P2 | `FeedbackNotice`가 결과 전에도 2rem 빈 영역을 예약 | `data-feedback-state="empty"`에 최소 높이·margin을 제거하되 live region DOM은 유지 | 초기 상태의 status 영역이 레이아웃 공간을 차지하지 않고 retry/accepted 상태는 유지 |
| P2 | 완료 기록의 `슬롯`, `처음 이해`, `단계별 시도`가 3~4학년에게 기술적으로 들릴 수 있음 | 학생용 라벨과 시도 제목을 행동 문장으로 교체 | 학생 화면에 `찾은 정보`, `처음 생각한 뜻`, `다시 해 본 횟수`가 보이고 교사용 세부 근거는 유지 |

초기 감사의 해결 항목은 회귀 기준으로 유지합니다. 콘텐츠 ID·판정 reducer·음원·개인정보 경계는 변경하지 않으며, VoiceOver 구현·검증은 프로젝트 범위에서 제외합니다.

### 후속 구현 결과

| 항목 | 구현 파일 | 자동 근거 | 상태 |
|---|---|---|---|
| 업데이트 dialog 기록 영역 | `src/styles/components.css`, `tests/e2e/zoom-geometry.spec.ts` | CSS contract와 build 통과; 375×812 E2E는 macOS Chromium SIGTRAP으로 제품 assertion 전에 중단 | 구현 완료·브라우저 재확인 필요 |
| 빈 미션 복구 | `src/features/center/EmptyMissionState.tsx`, `src/features/center/SignalCenter.tsx`, `src/features/center/SignalCenter.test.tsx` | 빈 목록 alert·반대 학년 callback unit 통과 | 해결 |
| 전략 목적 요약 | `src/features/center/StrategySummary.tsx`, `src/features/center/SignalCenter.test.tsx` | 네 전략 이름·목적 노출 및 details 닫힘 unit 통과 | 해결 |
| 빈 feedback 공간 | `src/shared/FeedbackNotice.tsx`, `src/styles/components.css`, `src/app/accessibility.test.tsx` | `[data-feedback-state="empty"]` contract와 전체 axe unit 통과 | 해결 |
| 학생용 결과 라벨 | `src/features/record/CommunicationRecord.tsx`, `src/features/record/CommunicationRecord.test.tsx` | 행동 중심 라벨·aria-label과 TeacherSummary 경계 unit 통과 | 해결 |

후속 자동 게이트는 `npm run test:run` 23개 파일·231개 테스트, lint, typecheck, source-size, privacy, audio 20개, audio verifier 6개, privacy test 5개, release-artifacts 1개, build가 모두 통과했습니다. 실제 학생·교사 승인, 키보드·터치 체감, 물리 200% 확대는 사람 검토로 남겼고 VoiceOver는 프로젝트 규칙에 따라 실행하지 않았습니다.
- 커밋·푸시·GitHub Pages 배포·HVC 등록은 이번 리디자인 범위에서 수행하지 않았습니다.
