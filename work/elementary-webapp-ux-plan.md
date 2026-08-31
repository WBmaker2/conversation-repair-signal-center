# Elementary Web App UX Orchestrator Plan — Conversation Repair Signal Center

작성일: 2026-08-31
실행 모드: `full`
대상 프로젝트: `/Volumes/ External Drive 256G/Dev2/codex/conversation-repair-signal-center`
검토 기준: `/Volumes/ External Drive 256G/Dev2/codex/conversation-repair-signal-center/2026-08-26-conversation-repair-signal-center-design.md`

## Goal

초등학교 3~6학년 학생이 대화가 막힌 이유를 찾고, 알맞은 수리 표현을 고르고, 상대의 답과 자신의 이해를 확인하는 학습 흐름을 끝까지 따라가게 합니다. 기존 리디자인의 학습 목표·콘텐츠·판정·개인정보 계약은 보존하고, 학생 화면에 남은 기술 은어를 행동 중심 표현으로 바꿉니다.

학습 목표와 구현 연결은 다음과 같습니다.

| 설계 목표 | 현재 구현 계약 | 이번 점검 연결 |
| --- | --- | --- |
| 이해 | 다시 묻기와 확인하기가 자연스러운 전략임을 알기 | `LearningPromise`, 전략 요약, 단계별 행동 문장을 유지하고 완료 화면을 `학습 기록`으로 명확히 표시 |
| 적용 | 불명확한 정보 종류에 맞는 표현 고르기 | `REPAIR_STRATEGIES`, `CriticalActionButton`, `missionSessionReducer`와 네 전략 ID를 변경하지 않음 |
| 분석 | 빠졌거나 두 가지로 해석되는 정보 찾기 | observe/response/confirm의 선택지·힌트·오답 회복을 그대로 재검증 |
| 생성 | 수리 표현과 확인 응답으로 대화 완성하기 | record의 takeaway, 다시 하기, 센터 복귀를 유지하고 학생용 기록 이름만 쉬운 말로 통일 |
| 차별성 | 단어 퀴즈가 아닌 대화 회복 전략 연습 | 음성·점수·자유 입력을 추가하지 않고 전체 경로를 문자 중심으로 유지 |
| 안전·포용 | 음성 없이 완주, 개인정보 미수집, 실패 낙인 금지 | 로컬 MP3 선택 사항·메모리 전용 세션·오답 힌트·VoiceOver 범위 제외를 회귀 검증 |

## Architecture

기존 기능 경계와 reducer를 유지합니다.

```text
App
├─ updateLayer
│  ├─ SignalCenter
│  │  ├─ LearningPromise
│  │  ├─ SetupPanel
│  │  ├─ MissionCard × 5
│  │  └─ StrategySummary / StrategyLegend
│  └─ MissionFlow
│     ├─ PhaseProgress
│     ├─ observe → repair → response → confirm
│     └─ CommunicationRecord → LearnerTakeaway / TeacherSummary
└─ UpdateHistoryDialog
```

상태 전이는 `center → observe → repair → response → confirm → record`를 그대로 사용합니다. 이번 수정은 표시 문구만 다루므로 `Mission`, `MissionEvidence`, `MissionSessionAction`, `EvaluationResult`의 타입·판정 의미·정답 조건을 확장하지 않습니다.

## Tech Stack

- React 19 + Vite 8 + TypeScript strict mode
- 기존 CSS custom properties, semantic HTML, `prefers-reduced-motion`
- Vitest + React Testing Library + jest-axe
- 기존 `@playwright/test`와 Codex Playwright 브라우저 도구
- npm `package-lock.json`과 현재 `node_modules` 재사용
- 새 패키지, 외부 폰트, 외부 이미지, Canvas/WebGL, 서버 저장소 없음

## Spec

### 기준선 증거

| 증거 | 관찰 결과 | 상태 |
| --- | --- | --- |
| Stage 0 | `work/elementary-webapp-ux-bootstrap.md`에서 full 모드 필수 역량과 Python/Node/npm이 `ready` | 확인됨 |
| 프로젝트 규칙 | `AGENTS.md`, `EDUCATION_DESIGN.md` 없음; `PRODUCT.md`, `design-system/MASTER.md`와 설계·기존 계획을 적용 | 확인됨 |
| 브라우저 진입 | `http://127.0.0.1:5173/`, 제목 `대화 수리 신호센터`, 정적 요청 54건 모두 로컬 200 | 확인됨 |
| 대표 흐름 | 375px에서 `g34-classroom-box`를 시작해 오답→재선택→오답→재선택→완료까지 수행 | 확인됨 |
| 반응형 | 320/375/768/1280px에서 1열·1열·2열·2열; 추천 CTA 높이 44px 이상 | 확인됨 |
| 업데이트 내역 | 완료 화면에서도 dialog를 열고 날짜 목록·내부 스크롤·Escape 후 트리거 focus 복원 확인 | 확인됨 |
| 런타임 안전 | 콘솔 error/warning 0, localStorage/sessionStorage 길이 0, 외부 요청 0 | 확인됨 |
| 브라우저 CLI | macOS Chrome daemon이 `SIGABRT`/`bootstrap_check_in`으로 중단; Codex Playwright 브라우저로 대체 증거 확보 | CLI blocked, 대체 확인됨 |

### 신규 이슈 장부

#### EDU-LANG-001 — 학생 기록 화면의 기술 은어

- Severity: `P2`
- Path/state: 센터 개인정보 안내, 완료 `record`, null/malformed evidence recovery, invalid mission fallback
- Persona/viewport: 초3–4 준호, 초5–6 서윤 / 375×812 및 전체 화면
- Observed action/result: 완료 화면의 두 번째 제목이 `통신 기록`으로 표시되고, 센터 안내도 `현재 통신 기록`이라고 읽힘. `통신`은 설계상 학생용 본문이 아니라 보조 기술 은어로 낮춰야 합니다.
- Evidence: Codex Playwright snapshot `f1e190`, `f2e58`; source `src/app/MissionFlow.tsx`, `src/app/App.tsx`, `src/features/record/CommunicationRecord.tsx`, `src/features/center/SignalCenter.tsx`
- Learner impact: 학생이 완료한 학습 결과가 무엇인지보다 시스템 내부 기록처럼 느낄 수 있고, 개인정보 안내를 읽을 때 실제로 사라지는 것이 무엇인지 다시 해석해야 합니다.
- Root-cause hypothesis: 이전 리디자인에서 결과 필드 라벨은 행동 중심으로 바꿨지만, 공통 제목·복구 오류·개인정보 문장에 기존 기술 표현이 남았습니다.
- Proposed change: 학생에게 보이는 제목과 복구 문장을 `학습 기록`, `이 미션 기록`, `시도 기록`, `고른 내용`처럼 바꾸고, 센터 안내를 `지금까지의 학습 기록`으로 바꿉니다. 내부 타입·검증 함수·교사용 세부 근거는 변경하지 않습니다.
- Verification: 같은 `g34-classroom-box` 흐름에서 완료·null evidence recovery·센터 안내를 확인하고, 기술 표현이 학생 heading/status에 남지 않는지 확인합니다.
- Status: planned

### 문구 변환 장부 초안

| issue-id | surface | before | after | difficulty signals | 의미·교과 보존 | 이해 probe | 검증 상태 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EDU-LANG-001 | completion heading | 통신 기록 | 학습 기록 | technical-or-internal, ambiguous-reference | yes; 학습 결과의 이름만 변경 | 지시 재진술: “내가 한 활동을 보여 주는 기록”이라고 말하기 | planned |
| EDU-LANG-001 | privacy note | 새로고침하면 현재 통신 기록이 사라져요. | 새로고침하면 지금까지의 학습 기록이 사라져요. | technical-or-internal | yes; 메모리 전용 세션 사실 유지 | 핵심 용어 설명: 새로고침 시 사라지는 대상을 말하기 | planned |
| EDU-LANG-001 | recovery status | 통신 기록의 학습 증거를 읽을 수 없습니다. | 학습 기록을 읽을 수 없어요. | technical-or-internal, long-or-dense | yes; 오류 원인과 재시작 행동 유지 | 회복 행동: 미션 다시 시작 버튼 누르기 | planned |
| EDU-LANG-001 | invalid mission | 통신 기록 | 학습 기록 | technical-or-internal | yes; 잘못된 미션의 복구 화면 의미 유지 | 결과 예측: 센터 복귀 버튼이 목록으로 돌아감을 말하기 | planned |

### 시뮬레이션 결정

판정: `not-needed`

이 앱의 핵심은 시간·수치·공간 변수를 조작하는 것이 아니라 대화 속 불명확한 정보와 수리 표현을 읽고 고르는 것입니다. 정적 대화·선택지·결정적 reducer가 예측→선택→피드백→재시도→완료 학습을 직접 보여 주며, 시뮬레이션을 추가하면 영어 표현과 정보 슬롯에서 시선이 분산됩니다. 변수·단위·seed·clock·pause·step이 없는 콘텐츠이므로 `pause`와 `step`은 적용 대상이 아니며 N/A로 기록합니다. `game-studio:game-studio`, `build-web-data-visualization:data-visualization`, `game-studio:game-playtest`는 Stage 0에서 선택 역량이 missing-optional이고 호출하지 않습니다.

### 시각자료 결정

판정: `no-image-needed`

짧은 대화, 영어 선택 표현, 한국어 전략 설명이 학습 정보 자체입니다. 이미지는 정보·공간·분류를 추가하지 않고 첫 행동을 늦출 가능성이 있어 생성·삽입하지 않습니다. 기존 `public/favicon.svg`와 `public/audio/**`는 검증된 정체성·학습 자산으로 보존합니다.

## Global Constraints

- `repeat`, `specify`, `confirm`, `rephrase` 전략 ID와 판정 reducer 계약을 유지합니다.
- 10개 미션 ID, 영어 원문, 선택지의 accepted 조건, 로컬 MP3와 대본을 변경하지 않습니다.
- 음성은 선택 사항이며 마이크, 녹음, 음성 인식, TTS, 발음·속도 점수, 로그인, 외부 API, 분석 도구, 쿠키, localStorage, sessionStorage를 추가하지 않습니다.
- 모든 핵심 조작은 44×44 CSS px 이상, `:focus-visible`, semantic HTML, 텍스트·ARIA·테두리 기반 상태 표현을 유지합니다.
- 교육용 핵심 CTA 하나만 `gi-pulse`를 사용하고 `prefers-reduced-motion: reduce`에서 정적 3px signal 외곽선으로 대체합니다.
- 라이트 모드와 종이색 표면을 유지합니다. 외부 폰트·이미지·아이콘 CDN을 추가하지 않습니다.
- 소스·테스트·스타일 단일 파일은 500줄 미만으로 유지합니다.
- VoiceOver 구현·검증, 실제 학생·교사 승인, 실제 음원 청취 승인을 주장하지 않습니다.
- 관련 없는 `.gstack/` 미추적 자료와 기존 커밋 상태를 보존합니다.
- 사용자 승인 후 커밋·푸시·배포를 실행했으며, HVC 등록과 패키지 설치는 실행하지 않았습니다. 릴리스 증거는 `work/elementary-webapp-ux-report.md`에 기록합니다.

## 예상 파일 구조와 책임

```text
work/
├─ elementary-webapp-ux-plan.md                 # 이번 점검 실행 계획
├─ elementary-webapp-ux-bootstrap.md            # Stage 0 결과
├─ elementary-webapp-ux-language-candidates.md  # 후보 수집기 결과
├─ elementary-webapp-ux-audit.md                # P0–P3·브라우저·패널 감사
├─ elementary-webapp-ux-language-audit.md       # 문구 before/after 장부
├─ elementary-webapp-ux-simulation-decision.md  # not-needed 판정
├─ elementary-webapp-ux-simulation-test.md      # N/A 검증 기록
└─ elementary-webapp-ux-report.md                # 최종 수용 게이트 보고
src/
├─ app/App.tsx                                  # 전역 updateLayer·invalid fallback
├─ app/MissionFlow.tsx                          # 단계 라우팅·record recovery heading
├─ features/center/SignalCenter.tsx             # 개인정보·센터 상태 문장
├─ features/record/CommunicationRecord.tsx     # record heading·controlled error 문구
├─ content/changelog.ts                          # 날짜별 개선 기록
└─ **/*.test.tsx                                 # 학생용 문구·복구·접근성 회귀 테스트
```

## 작업별 Files·Interfaces와 TDD 순서

### Task 0 — 기준선 문서 고정

- [x] Files: `work/elementary-webapp-ux-bootstrap.md`, `work/elementary-webapp-ux-language-candidates.md`
- Interfaces: 기존 `MissionFlowProps`, `CommunicationRecordProps`, `InvalidMissionFallbackProps` public shape 보존
- RED: 없음. 읽기 전용 preflight와 후보 수집 결과를 기록합니다.
- Minimal implementation: 없음.
- GREEN: Stage 0 `ready`, 후보 수집 완료, Task 1 RED 시작 전 기존 source/test 파일 미수정.

### Task 1 — 학생용 문구 회귀 테스트를 먼저 실패시키기

- [x] Files: `src/features/record/CommunicationRecord.test.tsx`, `src/app/accessibility.test.tsx`, `src/features/center/SignalCenter.test.tsx`, `src/features/confirmation/ConfirmationCall.test.tsx`
- Interfaces: `CommunicationRecordProps`, `MissionFlowProps`, `SignalCenterProps`를 확장하지 않습니다.
- RED assertions:
  - 완료 기록 heading 이름이 `학습 기록`이고 `통신 기록` heading이 존재하지 않습니다.
  - 센터 privacy note가 `지금까지의 학습 기록`을 포함하고 `현재 통신 기록`을 포함하지 않습니다.
  - malformed evidence의 alert가 `학습 기록`과 재시작 행동을 포함합니다.
  - 교사용 details의 교육과정·활동 증거 텍스트는 계속 존재합니다.
- Minimal implementation: 테스트만 추가·변경하여 위 기대가 현재 코드에서 실패하도록 합니다.
- GREEN: Task 2 구현 뒤 이 세 파일의 문구·접근성 테스트가 통과합니다.
- 실행 결과: 의도적으로 기존 문구에서 4개 테스트가 RED가 된 뒤, 최소 구현 후 관련 4개 파일 40개 테스트가 GREEN이 되었습니다.

### Task 2 — 최소 문구 구현

- [x] Files: `src/app/App.tsx`, `src/app/MissionFlow.tsx`, `src/features/center/SignalCenter.tsx`, `src/features/record/CommunicationRecord.tsx`, `src/content/changelog.ts`, `src/content/changelog.test.ts`
- Interfaces: 기존 `InvalidMissionFallbackProps`, `MissionFlowProps`, `CommunicationRecordProps`, `SignalCenterProps`를 그대로 사용합니다.
- 변경:
  - 학생용 record heading과 invalid fallback heading을 `학습 기록`으로 변경합니다.
  - controlled validation 메시지의 첫 문장을 학생이 이해하는 `학습 기록`, `이 미션 기록`, `시도 기록`, `고른 내용`으로 바꿉니다. 각 메시지는 재시작 또는 센터 복귀 행동을 유지합니다.
  - 센터 개인정보 안내를 `새로고침하면 지금까지의 학습 기록이 사라져요.`로 바꿉니다.
  - `CHANGELOG` 최신 항목에 `2026-08-31`과 이번 학생용 문구 개선을 기록합니다.
- RED→minimal: 판정 함수·evidence 구조를 손대지 않고 표시 문자열만 교체합니다.
- GREEN: Task 1 테스트와 기존 mission/evaluation/session/privacy 계약이 모두 통과합니다.
- 실행 결과: 판정 함수·evidence 타입은 변경하지 않았고, 학생 제목·복구 문장·개인정보 문장·2026-08-31 changelog만 반영했습니다. 전체 Vitest 23 files/231 tests가 통과했습니다.

### Task 3 — 문서·학생 패널·시뮬레이션 기록

- [x] Files: `work/elementary-webapp-ux-audit.md`, `work/elementary-webapp-ux-language-audit.md`, `work/elementary-webapp-ux-simulation-decision.md`, `work/elementary-webapp-ux-simulation-test.md`
- Interfaces: `EDU-LANG-001` 장부 필드와 `not-needed` 결정 필드를 고정합니다.
- RED: 기준선의 기술 은어와 패널의 “무엇을 보여 주는 기록인가?” probe를 문서에 기록합니다.
- Minimal implementation: 실제 코드 변경은 Task 2의 문구 범위에만 두고, 문서에는 before/after·의미 보존·상태를 추가합니다.
- GREEN: 동일 상태 재검증 결과를 `confirmed`, 미실행·환경 제한을 `not run` 또는 `blocked`로 분리합니다.
- 실행 결과: `EDU-LANG-001` before/after 장부, 패널 프로브, P0–P3 상태, 시뮬레이션 `not-needed`와 N/A 근거를 문서화했습니다.

### Task 4 — 자동 회귀 게이트

- [x] Files: 기존 source/test 전부, 새 작업 문서
- Commands and expected results:
  - `npm run test:run` → 모든 Vitest 파일과 테스트 통과
  - `npm run lint` → ESLint 오류 0
  - `npm run typecheck` → TypeScript 오류 0
  - `npm run check:size` → 모든 source 파일 500줄 미만
  - `npm run check:privacy` → 금지 capability 0건
  - `npm run check:audio` → 20개 로컬 MP3 canonical parity 통과
  - `npm run test:audio-verifier` → 6개 media verifier 테스트 통과
  - `npm run test:privacy` → privacy 경계 테스트 통과
  - `npm run test:release-artifacts` → 산출물 격리 테스트 통과
  - `npm run build` → Vite production build 성공
  - `node /Users/kimhongnyeon/.agents/skills/impeccable/scripts/detect.mjs --json src/app/App.tsx src/app/MissionFlow.tsx src/features/center/SignalCenter.tsx src/features/record/CommunicationRecord.tsx` → 기존 의도적 `border-inline-start` 경고 외 새 위반 없음
- 실행 결과: 위 명령을 모두 실행했고 각 exit 0입니다. detector 결과는 `[]`로 새 위반이 없었습니다.

### Task 5 — 동일 브라우저 시나리오 재검증

- [x] Files: `work/elementary-webapp-ux-audit.md`, `work/elementary-webapp-ux-report.md`
- Start state: `http://127.0.0.1:5173/`, 3~4학년, voice off, `g34-classroom-box`
- Scenario: 센터 안내 읽기 → 추천 미션 시작 → ambiguity 오답/정답 → repair 정답 → meaning 오답/정답 → confirmation 오답/정답 → `학습 기록` 확인 → 업데이트 내역 열기/닫기 → 센터 복귀
- Viewports: 320×812, 375×812, 768×900, 1280×900
- Probes: 지시 재진술, 버튼 결과 예측, `학습 기록` 용어 설명, 오답 뒤 재시도
- GREEN: heading/status에서 기술 은어가 사라지고 CTA·progress·feedback·dialog·focus 복원이 기존과 같은 동작을 유지합니다.
- Browser evidence: Codex Playwright 도구를 우선 사용합니다. CLI Playwright가 동일한 macOS `SIGABRT`/`bootstrap_check_in`으로 종료되면 반복하지 않고 `blocked`로 남깁니다.
- 실행 결과: 375px에서 동일 오답→회복→완료 경로, 320/375/768/1280px 반응형, 업데이트 dialog focus 복원, keyboard skip link, 기본/reduced-motion을 확인했습니다. CLI Playwright 환경 오류는 `blocked`로 기록했습니다.

### Task 6 — 최종 수용 게이트 보고

- [x] Files: `work/elementary-webapp-ux-report.md`, `work/elementary-webapp-ux-audit.md`, `work/elementary-webapp-ux-language-audit.md`, `work/elementary-webapp-ux-simulation-test.md`
- 100-point gate: 언어·시각 가독성을 별도 점수로 기록하고, P0/P1 0개·핵심 경로·모바일·키보드·자산 안전·문구 재검증의 상태를 `confirmed/partial/not run/blocked`로 구분합니다.
- 최종 상태: 시뮬레이션 게이트 N/A, 이미지 `no-image-needed`, VoiceOver·실제 학생/교사 승인은 범위 제외 또는 사람 검토 pending.
- 사용자에게 보고할 내용: 변경 파일, 테스트 명령·결과, 브라우저 증거, 남은 사람 검토, 커밋·푸시·배포 결과.
- 실행 결과: 자동·브라우저 증거 점수 84/100(학습 목표 12/15, 언어 14/20, 구조 11/12, 피드백 11/13, 시각 10/10, 키보드 9/10, 반응형 8/10, 런타임 5/5, 자산 안전 4/5), 전체 판정 `conditional`입니다. 실제 학생·교사·Safari·물리 터치 검토가 남아 있어 사람 승인 게이트는 계속 pending이며, 공개 Pages 배포 자체는 성공했습니다.

## 릴리스 명령과 실행 결과

아래 순서는 2026-08-31 사용자 승인 후 실제로 실행했으며, 다음 결과를 남겼습니다.

1. `git status --short --branch` → `.gstack/`·`.playwright-mcp/`를 제외하고 관련 source/test/work 문서만 분리
2. Task 4 품질 명령 → 각 명령 exit 0
3. `git diff --check` → whitespace 오류 0
4. 선택 파일 `git add` → 관련 18개 파일만 staging
5. `git commit -m "fix: clarify learner record language"` → `4dbd4d7` 생성
6. `git push origin HEAD` → feature 브랜치 원격 push 성공
7. PR #5 merge → main commit `23cb358a1cfec8b2a9969acc77ad041bb6d02fcd`
8. Pages workflow `33344734533` → build/quality checks/deploy 성공
9. `curl -I -L https://wbmaker2.github.io/conversation-repair-signal-center/` → HTTP 200
10. 공개 learner path → 제목·학습 기록 문구·오답 회복·업데이트 날짜·focus·모바일·콘솔·정적 요청 확인

## 실행 체크리스트

- [x] Stage 0 preflight와 필수 참조 문서 읽기
- [x] 기존 프로젝트 규칙·제품·설계·리디자인 계획 확인
- [x] 기준선 브라우저·오답 회복·완료·업데이트 dialog 증거 확보
- [x] 텍스트 후보 수집 및 `EDU-LANG-001` 범위 확정
- [x] 시뮬레이션 `not-needed`, 시각자료 `no-image-needed` 판정
- [x] RED 테스트 작성
- [x] 최소 문구 구현
- [x] 자동 게이트 실행
- [x] 동일 시나리오 브라우저 재검증
- [x] 최종 감사·보고서 작성
- [x] 커밋·푸시·배포 실행 및 공개 Pages 결과 확인 완료
