# Conversation Repair Signal Center Implementation Plan

작성일: 2026-08-29
대상 저장소: `/Volumes/ External Drive 256G/Dev2/codex/conversation-repair-signal-center`
실행 모드: full redesign

## 1. 조사 결과와 적용 문서

- 프레임워크: React 19 + Vite 8 + TypeScript strict mode를 사용하는 정적 SPA
- 패키지 관리자: npm, `package-lock.json` 존재
- 진입점: `index.html` → `/src/main.tsx` → `/src/app/App.tsx`
- 학습자 흐름: 신호센터 → 대화 관측 → 수리 송신 → 응답 수신 → 확인 통화 → 통신 기록
- 콘텐츠: 3~4학년 5개와 5~6학년 5개, 총 10개 미션; 번들 MP3 20개와 대응 영문 대본
- 현재 상태: 직전 개선 릴리스가 `main`에 병합되어 있으며, 이번 턴 시작 시 기존 리디자인 변경과 `.gstack/` QA 자료를 사용자 작업으로 보존함
- 확인한 기존 문서: `2026-08-26-conversation-repair-signal-center-design.md`, `2026-08-26-conversation-repair-signal-center-implementation-plan.md`, `docs/qa/content-review-matrix.md`, `docs/qa/acceptance-checklist.md`, `docs/qa/improvement-implementation-log.md`
- 저장소에 없는 우선 문서: `AGENTS.md`, `EDUCATION_DESIGN.md`; 내용을 추측해 기존 규칙으로 간주하지 않고, 이미 생성된 `design-system/MASTER.md`와 `PRODUCT.md`를 확인 가능한 기준으로 사용한다.
- 사용 가능한 지원 역할: `$impeccable`, `$ui-ux-pro-max`, `$redesign-existing-projects`, `$imagegen`의 실제 `SKILL.md`를 2026-08-30에 확인했으며, 경로·읽은 시각·실행 범위는 18절에 기록한다.
- 이번 요청에서 하지 않을 일: 커밋, 푸시, 릴리스, 배포, HVC 등록, 외부 서비스 연결, 패키지 설치, 학생 음성 녹음·TTS·발음 채점, VoiceOver 구현·검증

## 2. Goal

초등 3~6학년 학생이 첫 화면에서 “무엇을 배우고 지금 무엇을 누를지”를 한 번에 이해하고, 긴 설명을 읽지 않아도 네 단계 대화 수리 전략을 끝까지 연습하도록 화면 위계를 재정렬한다. 기존의 콘텐츠·판정·개인정보 경계를 유지하면서 다음을 달성한다.

1. 첫 화면에서 학년 선택 → 음성 선택 → 추천 미션 시작의 순서를 시각적으로 분명하게 만든다.
2. 네 단계 진행 상태와 현재 행동을 항상 같은 위치와 표현으로 제공한다.
3. 카드·선택지·피드백·완료 기록의 시각 규칙을 통일해 초등학생의 인지 부담을 줄인다.
4. 핵심 제출 버튼 하나만 `gi-pulse`로 강조하고, `prefers-reduced-motion`에서는 정적인 외곽선으로 대체한다.
5. 모바일 320/375px, 데스크톱 768/1280px, 키보드, 확대 200%에서 학습 흐름이 막히지 않게 한다.
6. `업데이트 내역`과 ISO 날짜 기록, 음성 선택 사항, 로컬 메모리·무학생식별자 경계를 계속 보이게 한다.

## 3. 변경하지 않을 범위

- `src/domain/mission.ts`, `src/domain/evaluation.ts`, `src/domain/session.ts`의 판정 의미와 네 전략 ID(`repeat`, `specify`, `confirm`, `rephrase`)는 유지한다. 상태 복구가 필요하지 않은 한 reducer 계약을 재작성하지 않는다.
- 10개 미션의 ID, 영어 대화 원문, MP3, 정확한 대본, 교육과정 코드는 변경하지 않는다. 문구가 학습자 위계에 맞지 않는 근거가 확인될 때만 해당 콘텐츠 테스트와 함께 최소 수정한다.
- 음성은 기본 꺼짐이며 텍스트만으로 모든 미션을 완료한다. 마이크, 녹음, 음성 인식, TTS, 발음·억양 점수, 로그인, 네트워크 저장, 외부 AI API를 추가하지 않는다.
- 현재 메모리 전용 세션과 새로고침 시 기록 소멸 정책을 유지한다. `localStorage`, `sessionStorage`, 쿠키, 분석 도구를 추가하지 않는다.
- 외부 이미지·폰트·아이콘 CDN을 추가하지 않는다. 현재 `public/favicon.svg`와 `public/audio/**`는 보존한다.

## 4. Architecture

현재 기능 경계를 유지하면서 화면 조립과 시각 토큰을 분리한다.

```text
App
├─ SignalCenter
│  ├─ LearningPromise
│  ├─ SetupPanel (grade + optional audio)
│  ├─ MissionGrid → MissionCard × 5
│  └─ StrategyLegend
└─ MissionFlow
   ├─ PhaseProgress
   ├─ MissionNavigation
   ├─ phase feature (observe/repair/response/confirm)
   └─ CommunicationRecord → LearnerTakeaway + TeacherSummary
```

상태 흐름은 기존 `missionSessionReducer`를 그대로 사용한다.

```text
center → observe → repair → response → confirm → record
             ↑         ↑          ↑
          phase.back로 직전 학습 단계 검토
```

새 컴포넌트는 화면 책임만 갖고, 선택 판정과 콘텐츠 파생은 기존 순수 모듈을 호출한다. 학습 단계가 바뀌면 `MissionFlow`가 단계 제목으로 포커스를 이동하고, `PhaseProgress`가 `aria-current="step"`를 갱신한다.

## 5. Design direction

### 5.1 시각 원칙

- “종이 위의 신호 지도”라는 현재 라이트 테마를 유지하되, 제목·현재 단계·주요 CTA의 대비를 강화한다.
- 화면마다 가장 중요한 한 행동만 채도 높은 `--color-signal`로 표현한다. 보조 버튼은 중립 표면으로 낮춘다.
- 미션 카드는 단순한 선 나열 대신 `추천 미션`, 상황, 학년·상황 맥락, 시작 CTA의 네 덩어리로 고정한다.
- 전략 카드는 색상만으로 구분하지 않고 이름·설명·테두리로 구분한다.
- 장식 그림을 추가해 학습 정보와 경쟁시키지 않는다. 시각 자산이 필요하다는 근거가 생길 때만 안전 문서와 사람이 검토한 후보를 먼저 만든다.

### 5.2 반응형 규칙

| viewport | 센터 | 학습 단계 | 검증 목표 |
|---|---|---|---|
| 320px | 한 열, 16px 안쪽 여백 | 대화와 선택지 한 열 | 가로 overflow 0, CTA 44px 이상 |
| 375px | 추천 CTA를 첫 viewport 안에 배치 | 단계 헤더·진행·CTA 순서 고정 | 첫 행동이 스크롤 없이 보임 |
| 768px | 설정 영역과 미션 카드를 균형 배치 | 대화·전략 콘텐츠 폭 제한 | 긴 영어 문장이 레이아웃을 밀지 않음 |
| 1280px | 읽기 폭 72rem 이하, 미션 2열 | 콘텐츠 max-width 56rem | 빈 공간과 정보 밀도 균형 |

### 5.3 모션·접근성

- `gi-pulse`는 추천 미션 CTA 또는 현재 단계 제출 CTA 중 하나에만 적용한다.
- `@media (prefers-reduced-motion: reduce)`에서 애니메이션·transition·scroll 이동을 제거하고 3px 고정 외곽선과 단계 색상으로 대체한다.
- `:focus-visible`, 44×44 CSS px 이상 터치 영역, `fieldset/legend`, 언어별 `lang` 속성, 라이브 상태 문구를 유지한다.
- 화면 낭독기 수동 승인을 주장하지 않으며 VoiceOver 구현·검증은 제외한다. 자동 semantic/ARIA 검사는 유지한다.

## 6. Tech Stack

- 기존 React 19, Vite 8, TypeScript strict mode
- 기존 CSS custom properties와 media query
- 기존 Vitest + React Testing Library + jest-axe
- 기존 Playwright Chromium E2E와 `tests/fixtures/accepted-paths.ts`
- 새 의존성·새 폰트·외부 이미지·아이콘 라이브러리 설치 없음

## 7. 초기 감사 계획과 감사 문서

지원 `impeccable` 스킬의 context/new-work/craft-floor 체크리스트를 읽고 적용하며, 실행 시각과 결과는 감사 문서에 남긴다.

파일: `work/education-webapp-redesign-audit.md`

감사 항목과 근거:

- 첫 시선: 1440×900에서 제목, 학습 약속, 학년/음성 설정, 추천 CTA가 한 흐름으로 읽히는지 캡처와 DOM 순서로 기록
- 학습 행동: 추천 미션 CTA, 단계별 제출 CTA, 오답 힌트, 완료 후 다음 행동의 위치와 라벨 기록
- 문구: 제목·버튼이 초등학생 행동 문장인지, 기술 용어가 보조 설명에 남는지, 실제 미션 내용과 맞는지 확인
- 레이아웃: 320/375/768/1280px에서 `scrollWidth`, CTA bounding box, 카드 열 수, 긴 영어 문장 줄바꿈 기록
- 접근성: `aria-current`, `aria-pressed`, `lang`, `:focus-visible`, heading 이동, 키보드 순서, dialog focus 복원 기록; VoiceOver는 제외
- 시각 체계: 토큰 중복, 선·반경·버튼·상태 색상 불일치 목록화
- 자산·안전: 이미지 import/CSS URL/srcset/preload와 외부 요청, 개인정보·저장·음성 기능 흔적 확인

P0/P1 수용 기준으로 옮길 초기 후보는 “첫 행동 식별”, “현재 단계 식별”, “오답/완료 다음 행동”, “모바일 가로 overflow”, “핵심 CTA 포커스”다. 관찰된 문제만 감사 문서에 기록하고 개선 효과를 미리 단정하지 않는다.

## 8. Design system deliverables

`design-system/MASTER.md`가 없으므로 아래 파일을 새로 만든다.

- `design-system/MASTER.md`: 색상, 서체, 간격, 반경, 표면, 상태, CTA 우선순위, focus, breakpoints, motion, content tone
- `design-system/pages/signal-center.md`: 센터의 설정 → 추천 미션 → 미션 목록 예외 규칙
- `design-system/pages/mission-flow.md`: 단계 진행, 피드백, 이전 단계, 완료 기록의 예외 규칙

정확한 토큰 계약:

- `--color-paper`, `--color-surface`, `--color-ink`, `--color-muted`, `--color-line`은 라이트 모드 대비를 유지한다.
- `--color-signal`은 핵심 CTA와 현재 단계에만 사용하고, 상태 색상을 추가하더라도 색상 외 텍스트를 함께 제공한다.
- `--space-1`부터 `--space-6`, `--radius`는 기존 값을 우선 재사용하며 새 값은 문서에 사용처를 명시한다.
- 버튼, 선택지, summary는 44px 이상; `:focus-visible`은 3px 외곽선; 320px에서 inline overflow 없음
- 새 페이지 전용 규칙은 `design-system/pages/*.md`에만 두고 `MASTER.md`와 충돌하지 않게 한다.

## 9. 예상 파일 구조와 책임

```text
work/
├── education-webapp-redesign-plan.md          # 이 실행 계획
├── education-webapp-redesign-audit.md        # 초기·최종 UX 감사
├── education-webapp-redesign-assets.md       # 자산 감사와 교체 판정
└── education-webapp-redesign-report.md       # 최종 변경·검증·pending 보고
design-system/
├── MASTER.md
└── pages/
    ├── signal-center.md
    └── mission-flow.md
src/
├── app/App.tsx                                # 전역 상태·업데이트 dialog 조립
├── app/MissionFlow.tsx                        # 단계 라우팅·포커스·navigation 조립
├── features/center/
│   ├── SignalCenter.tsx                       # 센터 정보 위계와 하위 컴포넌트 조립
│   ├── LearningPromise.tsx                    # 학생용 학습 약속과 첫 행동 안내
│   ├── SetupPanel.tsx                         # 학년 선택·음성 선택·상태 안내
│   ├── MissionCard.tsx                        # 추천/일반 카드와 시작 CTA
│   └── StrategyLegend.tsx                     # 접을 수 있는 전략 도움말
├── features/observation/DialogueObservation.tsx # 불명확한 부분 선택
├── features/repair/RepairTransmission.tsx      # 수리 전략·표현 선택
├── features/response/ResponseReception.tsx     # 상대 답과 의미 선택
├── features/confirmation/ConfirmationCall.tsx  # 확인 질문 선택
├── features/record/
│   ├── CommunicationRecord.tsx                # 결과 화면 구조
│   └── LearnerTakeaway.tsx                    # 학생용 배운 점·다음 행동
├── shared/
│   ├── CriticalActionButton.tsx               # 네 핵심 CTA와 pulse 계약
│   └── PhaseProgress.tsx                      # 단계 progress semantic list
├── styles/{tokens,base,layout,components,motion,index}.css
└── content/changelog.ts                       # ISO 날짜 업데이트 기록
tests/e2e/
├── learner-flow.spec.ts                       # 실제 학생 경로
├── center-layout.spec.ts                      # 반응형 센터 geometry
├── navigation-recovery.spec.ts                # 이전 단계/복귀/재시작
├── accessibility.spec.ts                      # semantic·ARIA·focus
├── audio-off-parity.spec.ts                   # 음성 off parity
└── zoom-geometry.spec.ts                      # 200% dialog·control geometry
```

새 컴포넌트와 기존 파일은 위 책임을 넘지 않으며 `src/`, `scripts/`, `tests/`의 모든 단일 `.ts`, `.tsx`, `.css`, `.mjs` 파일은 499줄 이하로 유지한다.

## 10. 작업별 인터페이스와 TDD 순서

### Task 1 — 초기 감사 문서와 baseline 고정

Files:

- 생성: `work/education-webapp-redesign-audit.md`
- 참고: `src/app/App.tsx`, `src/features/center/SignalCenter.tsx`, `src/app/MissionFlow.tsx`, `src/styles/*.css`, `tests/e2e/*.spec.ts`

Interfaces/contracts:

- `SignalCenterProps`, `MissionFlowProps`, `MissionCardProps`, `PhaseProgressProps`의 현재 public shape를 기록하고 불필요한 prop 확장을 금지한다.
- baseline viewport는 320/375/768/1280px, 학습 대표 미션은 `g34-classroom-box`, 음성 off를 기준으로 한다.

TDD order:

- RED: 감사 문서에 현재 DOM 순서, 첫 CTA 위치, CTA 수, overflow, 단계 상태를 관찰값으로 기록한다.
- Minimal implementation: 없음. 이 작업은 관찰과 문서화만 한다.
- GREEN: `npm run test:run`, `npm run lint`, `npm run typecheck`, `npm run build`가 기존 상태에서 통과함을 baseline으로 기록한다.

Acceptance: 구현 전 문제 목록과 영향도(P0/P1/P2), 관련 파일, 개선 후 측정 방법이 감사 문서에 모두 존재한다.

### Task 2 — 디자인 시스템과 페이지 규칙

Files:

- 생성: `design-system/MASTER.md`, `design-system/pages/signal-center.md`, `design-system/pages/mission-flow.md`
- 참고: `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/motion.css`

Interfaces/contracts:

- CSS token names remain `--color-*`, `--space-*`, `--radius`; component classes remain semantic (`.mission-grid`, `.phase-progress`, `.learner-takeaway`, `.update-history-*`).
- `gi-pulse`, reduced motion, 44px target, light mode, focus-visible, language markup, privacy constraints are mandatory design-system rules.

TDD order:

- RED: 스타일 계약 테스트에서 새 토큰·focus·pulse·breakpoint 기대치를 먼저 선언한다.
- Minimal implementation: `tokens.css`, `base.css`, `motion.css`에 필요한 최소 토큰과 media rules만 추가한다.
- GREEN: `npm run test:run`, `npm run lint`, `npm run typecheck`, `npm run check:size` 통과; 계산 스타일과 44px geometry는 브라우저 테스트에서 확인한다.

Acceptance: 디자인 결정이 교육 목표·초등 읽기 난이도·상태 구분과 연결되고, 신규 외부 폰트·의존성이 없다.

### Task 3 — 센터 첫 행동과 미션 목록 리디자인

Files:

- `src/features/center/SignalCenter.tsx`
- 생성: `src/features/center/LearningPromise.tsx`, `src/features/center/SetupPanel.tsx`
- `src/features/center/MissionCard.tsx`, `src/features/center/StrategyLegend.tsx`
- `src/styles/layout.css`, `src/styles/components.css`
- 테스트: `src/features/center/SignalCenter.test.tsx`, `tests/e2e/center-layout.spec.ts`

Interfaces:

```ts
export interface LearningPromiseProps {
  recommendedMissionTitle: string;
}

export interface SetupPanelProps {
  gradeBand: GradeBand;
  voiceEnabled: boolean;
  onGradeBandChange: (gradeBand: GradeBand) => void;
  onVoiceEnabledChange: (enabled: boolean) => void;
}
```

`SignalCenterProps`와 `MissionCardProps`는 기존 callback 의미를 유지하고, `isRecommended`는 첫 카드 하나에만 true가 된다.

TDD order:

- RED: 첫 viewport 추천 CTA, setup 순서, 정확히 하나의 `data-recommended="true"`, 학년 `aria-pressed`, mission-grid 열 수, 업데이트 버튼 비중을 검증하는 테스트를 먼저 실패시킨다.
- Minimal implementation: `LearningPromise`와 `SetupPanel`로 JSX 책임을 분리하고 CSS grid/spacing/token을 적용한다. 콘텐츠·상태 reducer는 건드리지 않는다.
- GREEN: 센터 unit/E2E, lint, typecheck, size 통과; 375×812에서 추천 CTA 전체가 viewport 안이고 320px에서 scrollWidth가 viewport 이하이며 1280px에서 두 열임을 확인한다.

Acceptance: 학생이 첫 시선에서 학습 약속과 첫 행동을 읽고, 학년·음성 설정 뒤 한 번의 클릭으로 첫 미션 관찰 단계에 들어간다.

### Task 4 — 학습 단계 위계와 복구 흐름 리디자인

Files:

- `src/app/MissionFlow.tsx`
- `src/shared/PhaseProgress.tsx`
- `src/features/observation/DialogueObservation.tsx`
- `src/features/repair/RepairTransmission.tsx`
- `src/features/response/ResponseReception.tsx`
- `src/features/confirmation/ConfirmationCall.tsx`
- `src/styles/layout.css`, `src/styles/components.css`, `src/styles/motion.css`
- 테스트: 각 phase unit, `src/domain/session.test.ts`, `src/shared/PhaseProgress.test.tsx`, `tests/e2e/navigation-recovery.spec.ts`

Interfaces/contracts:

- `LearningPhase = 'observe' | 'repair' | 'response' | 'confirm'`
- `PhaseProgressProps { phase: LearningPhase; onBack?: () => void }`
- `CriticalActionButtonProps { action: CriticalAction; disabled?: boolean; onClick: () => void }`
- `MissionSessionAction`과 `phase.back` 보존 계약은 기존 테스트를 기준으로 유지한다.

TDD order:

- RED: 단계 제목·현재 행동·`aria-current="step"`, 이전 단계 선택 보존, center 복귀, 다시 시작, phase별 단일 pulse CTA를 검증한다.
- Minimal implementation: 단계 header/진행/작업 navigation의 시각 계층을 통일하고 기존 phase 컴포넌트의 문구·spacing만 필요한 만큼 조정한다.
- GREEN: unit, axe, keyboard E2E, reduced-motion geometry 통과; 오답 시 현재 단계에 머물고 힌트가 보이며 정답 시 다음 단계로 이동한다.

Acceptance: 학생이 어떤 단계인지, 지금 어떤 행동을 해야 하는지, 잘못 선택했을 때 어떻게 다시 시도하는지 한 화면에서 알 수 있다.

### Task 5 — 완료 기록·업데이트 내역·콘텐츠 문구 정리

Files:

- `src/features/record/CommunicationRecord.tsx`
- `src/features/record/LearnerTakeaway.tsx`, `src/features/record/learnerTakeawayCopy.ts`
- `src/features/updates/UpdateHistoryButton.tsx`, `src/features/updates/UpdateHistoryDialog.tsx`
- `src/content/changelog.ts`
- 테스트: `src/features/record/CommunicationRecord.test.tsx`, `src/features/record/LearnerTakeaway.test.tsx`, `src/features/updates/UpdateHistoryDialog.test.tsx`, `src/content/changelog.test.ts`

Interfaces/contracts:

- `LearnerTakeawayProps { mission: Mission; evidence: MissionEvidence }`
- `LearnerTakeawayCopy { learnedKo: string; nextStepKo: string }` 기존 학생용 문구 계약을 보존한다.
- `ChangeRecord { date: YYYY-MM-DD; category: ChangeCategory; detailKo: string }` 기존 changelog 계약을 보존한다.
- `TeacherSummary`는 교사용 details 안에만 두고 학생용 takeaway는 닫힌 details 밖에 둔다.

TDD order:

- RED: 완료 화면에서 `오늘 배운 점`, `다음에 해 보기`, 다시 하기·센터 복귀, 업데이트 dialog focus/scroll/date를 먼저 실패시킨다.
- Minimal implementation: 학생용 두 문장과 업데이트 날짜 한 건을 추가하고, dialog header/닫기/내부 scroll을 토큰으로 정리한다.
- GREEN: record/update unit, keyboard Escape/focus restore, 200% geometry, privacy scan, build 통과.

Acceptance: 완료 후 학생이 배운 전략과 다음 대화에서 할 일을 읽고, 교사용 정보와 개인정보 경계가 섞이지 않는다.

### Task 6 — 이미지·정적 자산 안전 감사

Files:

- 생성: `work/education-webapp-redesign-assets.md`
- 검사 대상: `public/**`, `src/assets/**`, `src/**/*.tsx`, `src/styles/**`, `index.html`, `vite.config.ts`
- 현재 기준 추가 이미지 파일: 없음. 감사에서 일반 장식 이미지의 학습상 필요가 확인될 때는 생성·검토·경로 확정을 별도 기록한 뒤에만 `public/`의 버전 파일과 import/test fixture를 추가한다.

Rules:

- 먼저 `references/asset-safety.md`를 읽는다.
- 현재 확인된 자산은 `public/favicon.svg`와 `public/audio/**`이며, audio·favicon·스크린샷은 사실/정체성/증거 자산으로 분류해 자동 생성·교체하지 않는다.
- 일반 장식 이미지가 실제 학습 위계를 개선한다는 감사 근거가 있을 때만 `imagegen`을 호출하고, 대상 학년·화면 역할·구도·톤·비율을 명시한다.
- 생성 이미지에 사실처럼 보이는 글자·수치·상표·지도·인물·교육과정 라벨이 들어가면 폐기한다. 원본을 덮어쓰지 않고 alt 텍스트와 검토 상태를 기록한다.
- 현재 계획은 이미지 삽입을 기본적으로 하지 않는다. 따라서 imagegen은 `not run`으로 기록할 가능성이 높으며, 이미지가 없다는 판단 자체를 자산 문서에 남긴다.

TDD/verification:

- RED: 자산 목록에서 사용처·렌더 크기·외부 URL·누락 alt 후보를 실패 목록으로 기록한다.
- Minimal implementation: 안전한 경우에만 버전 파일과 import를 추가한다. 그렇지 않으면 코드 변경 없이 유지한다.
- GREEN: `npm run build`, `npm run check:privacy`, 브라우저 network 로그, 자산 파일 MIME/크기 검사를 통과한다.

Acceptance: 자동 생성 자산이 학습 사실을 대체하지 않고, 외부 요청·저작권·alt 결정이 문서로 추적된다.

### Task 7 — 최종 검수와 보고서

Files:

- 생성: `work/education-webapp-redesign-report.md`
- 갱신: `work/education-webapp-redesign-audit.md`, `work/education-webapp-redesign-assets.md`

검수 순서:

- 초기 P0/P1 각각에 해결 파일·테스트·브라우저 증거를 연결한다.
- 학생 대표 경로 `g34-classroom-box`를 음성 off로 시작해 완료·다시 하기·센터 복귀까지 수행한다.
- 375×812, 1280×900, CSS zoom 200%, reduced motion, 키보드 Tab/Enter/Space/Escape를 별도로 기록한다.
- 콘솔 error, 외부 요청, local/session storage, microphone 호출을 검사한다.
- VoiceOver와 실제 인간 아동·교사 승인은 `pending/not run`으로 남긴다.

Acceptance: 자동 테스트·브라우저 smoke·사람 검토 필요 항목이 서로 다른 증거 상태로 보고되고, 미해결 위험과 롤백 방법이 보고서에 있다.

## 11. 자동 검증 명령과 예상 결과

아래 명령은 계획 기록 이후 구현 단계에서 실행한다. 현재 계획 작성 단계에서는 실행하지 않는다.

```bash
npm run lint
# exit 0, ESLint 오류 없음
npm run typecheck
# exit 0, TypeScript 오류 없음
npm run test:run
# 23개 이상의 테스트 파일과 모든 테스트 통과
npm run check:size
# All source files are under 500 lines.
npm run check:privacy
# Privacy boundary verified: 0 forbidden capabilities.
npm run check:audio
# 20개 local audio files의 canonical parity 통과
npm run test:audio-verifier
# 6개 media verifier 테스트 통과
npm run test:privacy
# privacy boundary 테스트 5개 통과
npm run test:release-artifacts
# Playwright 산출물 격리 테스트 통과
npm run build
# Vite production build 성공
npm run test:e2e -- tests/e2e/learner-flow.spec.ts tests/e2e/center-layout.spec.ts tests/e2e/navigation-recovery.spec.ts tests/e2e/zoom-geometry.spec.ts
# 대표 학생 경로·반응형·복구·확대 geometry 통과
```

`npm run test:e2e`가 macOS Chromium의 `mach_port_rendezvous` 또는 `bootstrap_check_in Permission denied`로 제품 assertion 전에 종료되면 같은 시도를 세 번 반복하지 않는다. host 제한을 로그에 남기고, CI 또는 승인된 대체 headless shell 결과를 별도 증거로 기록한다.

## 12. 수동 확인 단계

1. 실제 Chrome에서 320/375/768/1280px로 센터와 대표 미션의 제목·CTA·카드 열·overflow를 확인한다.
2. 키보드만으로 skip link → 학년 → 음성 → 추천 미션 → 네 단계 → 기록 → 다시 하기/센터 복귀 → 업데이트 dialog 열기/닫기 흐름을 확인한다.
3. `prefers-reduced-motion: reduce`에서 pulse가 깜빡이지 않고 3px 외곽선으로 보이는지 확인한다.
4. 브라우저 확대 200%에서 업데이트 dialog 제목·닫기·내부 scroll과 phase CTA가 가려지지 않는지 확인한다.
5. 실제 MP3 20개는 음성 선택을 켰을 때 대본과 발화가 일치하는지 사람이 듣고 기록한다.
6. 초등학생·교사 수동 사용성, 사실성·콘텐츠 적합성은 자동 결과와 분리해 `pending`으로 둔다.
7. VoiceOver 구현·검증은 수행하지 않는다.

## 13. 실패·롤백 계획

- 구현 중 테스트가 실패하면 실패 테스트를 먼저 보존하고 해당 task의 최소 변경만 한다. 동일 실패를 세 번 반복하면 중단하고 원인 후보와 사용자 선택지를 보고한다.
- 콘텐츠 판정이나 세션 상태가 흔들리면 새 UI 컴포넌트에서 기존 `Mission`, `MissionEvidence`, `MissionSessionAction`을 그대로 소비하는 방향으로 되돌린다.
- CSS 리디자인이 학습 CTA를 가리거나 overflow를 만들면 page-specific CSS 변경부터 되돌리고, 기능별로 작게 만든 리디자인 커밋의 실제 SHA를 확인한 뒤 `git revert`로 되돌릴 수 있게 한다. 해당 명령은 이번 계획 단계에서 실행하지 않는다.
- 생성 이미지가 사실·문자·상표처럼 보이면 import하지 않고 파일을 폐기하며, 원본 자산은 유지한다.
- 배포·커밋·푸시·HVC 등록은 이 요청 범위 밖이므로 롤백 대상에 포함하지 않는다.

## 14. 향후 커밋·푸시·배포 단계

아래 단계는 별도 릴리스 승인을 받은 뒤에만 실행하며, 이번 리디자인 작업에서는 실행하지 않는다.

1. 작업 트리 확인: `git status --short` 결과에서 이 계획에 포함된 소스·테스트·문서만 검토하고, 기존 `.gstack/` 미추적 산출물은 add 대상에서 제외한다. 예상 결과는 의도한 변경 목록과 기존 사용자 산출물이 분리되어 보이는 것이다.
2. 검증 재실행: `npm run lint && npm run typecheck && npm run test:run && npm run check:size && npm run check:privacy && npm run check:audio && npm run build`를 실행한다. 예상 결과는 각 명령의 exit 0과 현재 보고서의 테스트·빌드 결과 재현이다.
3. 선택 파일 staging: `git add src/app/App.tsx src/content/changelog.test.ts src/content/changelog.ts src/features/center/LearningPromise.tsx src/features/center/SetupPanel.tsx src/features/center/MissionCard.tsx src/features/center/SignalCenter.tsx src/features/center/SignalCenter.test.tsx src/features/confirmation/ConfirmationCall.tsx src/features/observation/DialogueObservation.tsx src/features/record/CommunicationRecord.test.tsx src/features/record/CommunicationRecord.tsx src/features/record/LearnerTakeaway.tsx src/features/repair/RepairTransmission.tsx src/features/response/ResponseReception.tsx src/features/updates/UpdateHistoryDialog.test.tsx src/shared/FeedbackNotice.tsx src/shared/PhaseProgress.test.tsx src/shared/PhaseProgress.tsx src/styles/components.css src/styles/layout.css src/styles/tokens.css tests/e2e/center-layout.spec.ts design-system/MASTER.md design-system/pages/signal-center.md design-system/pages/mission-flow.md work/education-webapp-redesign-plan.md work/education-webapp-redesign-audit.md work/education-webapp-redesign-assets.md work/education-webapp-redesign-report.md`를 사용한다. 예상 결과는 `.gstack/`나 다른 사용자 변경이 staging되지 않는 것이다.
4. staged diff 확인: `git diff --cached --check`와 `git diff --cached --stat`을 실행한다. 예상 결과는 whitespace 오류 0건, 변경 파일·줄 수가 검토 문서와 일치하는 것이다.
5. 커밋 생성: `git commit -m "feat: redesign conversation repair signal center"`를 실행한다. 예상 결과는 리디자인 소스·테스트·문서만 포함한 새 커밋과 실제 커밋 SHA가 출력되는 것이다.
6. 원격 푸시: `git push origin HEAD`를 실행한다. 예상 결과는 현재 작업 브랜치가 원격에 업데이트되고 GitHub Actions Pages workflow가 새 실행을 받는 것이다.
7. 배포 확인: `gh run list --workflow pages.yml --limit 1`로 workflow 상태를 확인하고, 성공 후 `curl -I https://wbmaker2.github.io/conversation-repair-signal-center/`와 브라우저 learner-path smoke를 실행한다. 예상 결과는 HTTP 200, 제목·해시 자산·대표 미션 경로·모바일 overflow·콘솔/외부 요청 검증이다.
8. 외부 카탈로그/HVC 등록은 배포 검증 뒤 별도 승인과 관리자 자격 증명이 있을 때만 진행하며, 이 계획의 구현 완료 증거와 섞지 않는다.

## 15. 릴리스·외부 작업 경계

이번 full redesign은 코드·스타일·문서·테스트·허용된 브라우저 검증까지만 수행한다. 커밋, 푸시, GitHub Pages 배포, HVC 관리자 등록, HVC static gallery sync는 사용자가 별도로 요청할 때만 시작한다. 릴리스 요청이 오면 별도 release 계획과 공개 URL 검증을 추가한다.

## 16. 실행 상태

- [x] 기존 앱·학습 흐름·자산·검증 명령 조사
- [x] 계획 문서 작성
- [x] 초기 감사 문서 작성
- [x] 디자인 시스템 문서 작성
- [x] 센터 리디자인
- [x] 학습 단계 리디자인
- [x] 완료 기록·업데이트 내역 정리
- [x] 자산 안전 감사
- [x] 최종 검수·자동/수동 검증·보고서

## 17. 실행 중 추가로 확인한 안전 보완

첫 최종 브라우저 측정에서 320px 모바일의 고정 업데이트 버튼이 추천 CTA와 수평으로 겹치는 것을 발견했습니다. 계획의 normal-flow fallback 규칙을 적용해 `src/app/App.tsx`의 `update-history-anchor` 안으로 버튼을 이동하고, `src/styles/components.css`의 `max-width: 640px` 구간에서 normal flow로 전환했습니다. `tests/e2e/center-layout.spec.ts`에 320×812에서 업데이트 버튼이 `position: static`이고 추천 CTA 아래에 놓이는지 검증하는 실패 테스트를 먼저 추가한 뒤 최소 CSS/구조 변경으로 통과시켰습니다.

## 18. 2026-08-30 실행 재개 사전 점검

이번 실행은 사용자의 `education-webapp-redesign` 요청에 따라 기존 리디자인 결과를 다시 확인하고 남은 개선만 구현하는 full 모드입니다. 시작 시 작업 트리의 기존 수정·미추적 산출물을 보존했으며, 이 계획을 읽은 뒤에만 추가 작업을 시작합니다.

### 프로젝트 규칙과 근거

- 저장소 루트에 `AGENTS.md`와 `EDUCATION_DESIGN.md`는 없습니다. 없는 규칙을 추측하지 않고 설계 원문과 기존 디자인 시스템을 우선 근거로 사용합니다.
- `design-system/MASTER.md`, `design-system/pages/signal-center.md`, `design-system/pages/mission-flow.md`를 읽었으며, 현재 앱의 라이트 모드·44px 조작 영역·`gi-pulse`·reduced-motion·개인정보·음성 선택 사항 계약을 유지합니다.
- 제품 사실을 고정하기 위해 `PRODUCT.md`를 추가했습니다. 해당 문서는 2026-08-30 사전 점검에서 저장소 문서와 사용자의 리디자인 요청으로 확인한 사실만 기록합니다.
- 기존 구현 계획의 완료 체크와 기존 작업 트리 변경은 과거 실행 증거로 보존하며, 이번 실행의 신규 변경은 별도 diff와 검증 결과로 구분합니다.

### 지원 Skill 상태

| 역할 | 상태 | 실제 `SKILL.md` 경로 | 읽은 시점 (KST) | 실행 기록 |
|---|---|---|---|---|
| `$education-webapp-redesign` | available | `/Users/kimhongnyeon/.codex/skills/education-webapp-redesign/SKILL.md` | 2026-08-30 12:44 | 상위 오케스트레이션 지침으로 적용 |
| `$impeccable` | available | `/Users/kimhongnyeon/.agents/skills/impeccable/SKILL.md` | 2026-08-30 12:44 | context·new-work·craft-floor 읽기, 초기/최종 감사에 적용 |
| `$ui-ux-pro-max` | available | `/Users/kimhongnyeon/.codex/skills/ui-ux-pro-max/SKILL.md` 및 동일 내용 `/Users/kimhongnyeon/.agents/skills/ui-ux-pro-max/SKILL.md` | 2026-08-30 12:45 | design-system·UX·React 검색 실행; 기존 제품 제약을 우선 |
| `$redesign-existing-projects` | available | `/Users/kimhongnyeon/.agents/skills/redesign-existing-projects/SKILL.md` | 2026-08-30 12:44 | scan/diagnose/fix 체크리스트를 현재 코드 검토에 적용 |
| `$imagegen` | available | `/Users/kimhongnyeon/.codex/skills/.system/imagegen/SKILL.md` | 2026-08-30 12:44 | 자산 감사 후 학습상 필요가 없으면 호출하지 않음 |

`ui-ux-pro-max`의 검색 결과에서 제안한 외부 Google Fonts·장식 중심 패턴·테스트에 없는 증언 섹션은 개인정보·외부 의존성·문자 중심 MVP 계약과 충돌하므로 채택하지 않습니다. 검색으로 확인한 키 규칙은 의미 있는 semantic HTML, 44px 조작 영역, 보이는 focus, reduced-motion, 고정 요소가 focus를 가리지 않게 하는 것입니다.

### 이번 실행의 경계

- 코드·스타일·테스트·검증 문서만 계획의 범위 안에서 수정할 수 있으며, 새 의존성·외부 이미지·음성 기능·저장 기능은 추가하지 않습니다.
- `imagegen`은 `references/asset-safety.md` 확인 뒤 학습 위계를 실제로 개선하는 일반 장식 자산이 있을 때만 호출합니다. 현재까지 이미지 추가 근거가 없어 호출하지 않습니다.
- 커밋·푸시·릴리스·배포·HVC 등록은 현재 리디자인 단계에서 실행하지 않습니다. 별도 릴리스 지시가 있을 때 계획 14의 명령과 공개 URL 검증을 다시 검토합니다.

## 19. 2026-08-30 후속 구현 완료 기록

재감사에서 확인한 다섯 가지 보완을 실패 테스트 → 최소 구현 → 통과 테스트 순서로 완료했습니다.

| 작업 | 실패 기준 | 최소 구현 | 통과 기준 |
|---|---|---|---|
| 전략 목적 요약 | 닫힌 details만으로는 네 전략의 목적을 읽을 수 없음 | `src/features/center/StrategySummary.tsx`를 추가하고 `SignalCenter.tsx`의 미션 목록 뒤에 연결 | 센터 unit에서 네 전략 이름·목적이 보이고 기존 상세 details는 닫힌 상태 유지 |
| 빈 미션 복구 | `missions=[]`에서 빈 grid만 렌더링 | `src/features/center/EmptyMissionState.tsx`와 반대 학년 callback 연결 | 안내 alert와 `3~4학년/5~6학년 미션 보기` 버튼이 보이고 grid가 없음 |
| feedback 빈 공간 | 결과 전 status가 2rem 공간을 예약 | `src/styles/components.css`의 `[data-feedback-state="empty"]`에 `min-block-size: 0`, `margin-block: 0` 적용 | live region DOM은 유지하면서 초기 layout 여백을 제거 |
| 업데이트 dialog 높이 | 375×812에서 기록 viewport가 500px 미만 | dialog `max-block-size: min(70dvh, calc(100dvh - 2rem))`, 최소 16rem 및 내부 overflow 유지 | 375×812에서 500px 이상·viewport 이내·내부 스크롤 |
| 학생용 결과 라벨 | `슬롯`, `처음 이해`, `단계별 시도`가 기술적으로 들림 | `CommunicationRecord.tsx`의 표시 라벨·aria-label을 행동 중심 한국어로 교체 | `찾은 정보`, `처음 생각한 뜻`, `다시 해 본 횟수`가 보이고 validation/TeacherSummary 계약 유지 |

### 후속 변경 파일과 인터페이스

- `src/features/center/StrategySummary.tsx`: props 없음, `REPAIR_STRATEGIES`를 읽어 `StrategySummary`를 렌더링합니다.
- `src/features/center/EmptyMissionState.tsx`: `EmptyMissionStateProps { gradeBand: GradeBand; onGradeBandChange: (gradeBand: GradeBand) => void }`를 사용합니다.
- `src/features/center/SignalCenter.tsx`: `missions.length`에 따라 `mission-grid` 또는 복구 상태를 렌더링합니다.
- `src/features/record/CommunicationRecord.tsx`: 기존 `CommunicationRecordProps`, `MissionEvidence`, `TeacherSummary`를 유지하고 학생용 표시 문자열만 조정합니다.
- `src/styles/components.css`: 전략 요약·빈 상태·feedback 상태·dialog viewport 토큰을 추가·조정합니다.
- `src/content/changelog.ts`: `2026-08-30` ISO 날짜 기록을 최신 항목으로 추가합니다.

### 후속 검증 결과

- `npm run test:run`: 23개 파일, 231개 테스트 통과
- `npm run lint`: 통과
- `npm run typecheck`: 통과
- `npm run check:size`: 모든 source 파일 500줄 미만
- `npm run check:privacy`: 금지 capability 0건
- `npm run check:audio`: 로컬 음원 20개 canonical parity·metadata·loudness·duration·edge-silence 통과
- `npm run test:audio-verifier`: 6개 통과
- `npm run test:privacy`: 5개 통과
- `npm run test:release-artifacts`: 1개 통과
- `npm run build`: Vite production build 성공
- `impeccable detect`: 의도된 상태·단계 signal의 `border-inline-start` 경고만 출력되었으며, 기능·접근성 계약을 위해 유지했습니다.
- 관리형 macOS Chromium E2E: `mach_port_rendezvous`/`bootstrap_check_in Permission denied (1100)` SIGTRAP으로 제품 assertion 전에 종료되어 새 geometry 결과를 만들지 못했습니다. 동일 실패 반복은 중단했습니다.

VoiceOver 구현·검증과 실제 학생·교사 승인·물리 기기 터치/200% 확대는 프로젝트 규칙과 수동 검토 범위에 따라 실행하지 않았습니다. 재디자인 구현 단계에서는 커밋·푸시·배포·HVC 등록을 실행하지 않았으며, 별도 릴리스 요청의 실제 결과는 아래 20절에 기록합니다.

## 20. 2026-08-30 릴리스 결과

- `3e9f7d7 feat: redesign conversation repair signal center`를 기능 브랜치에 커밋하고 원격에 push했습니다.
- [PR #3](https://github.com/WBmaker2/conversation-repair-signal-center/pull/3)을 `main`에 병합했으며 merge commit은 `0b323a4949a49ab6b641e09766ec962d3d2b3948`입니다.
- [Pages workflow 33292337538](https://github.com/WBmaker2/conversation-repair-signal-center/actions/runs/33292337538)의 build quality checks·production build·deploy가 모두 성공했습니다.
- [공개 학습 경로](https://wbmaker2.github.io/conversation-repair-signal-center/)가 HTTP 200을 반환하고 제목·favicon·JS·CSS 자산이 모두 200 응답을 반환했습니다. 공개 JS 번들에서 후속 리디자인 문구와 `2026-08-30` changelog를 확인했습니다.
- 관리형 Chromium E2E·공개 상호작용은 `mach_port_rendezvous`/`bootstrap_check_in Permission denied (1100)` SIGTRAP으로 제품 assertion 전에 종료되어 실행하지 않았습니다. VoiceOver·실제 학생/교사 승인·물리 200% 확대는 계속 별도 게이트입니다.
