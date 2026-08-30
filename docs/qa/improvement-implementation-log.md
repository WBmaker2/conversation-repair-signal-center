# 개선 구현 로그

작성일: 2026-08-28
대상: `2026-08-28-conversation-repair-signal-center-improvement-plan.md`
기준 QA: `.gstack/qa-reports/qa-report-conversation-repair-signal-center-2026-08-28.md`

이번 작업은 계획의 Step 1부터 Step 7까지 RED → 최소 구현 → GREEN 순서로 진행했습니다. 기존 `.gstack` QA 산출물과 계획 문서는 보존했으며, 초기 구현 단계에서는 commit·push·Pages 배포를 실행하지 않았습니다. 후속 사용자 승인에 따른 릴리스 증거는 문서 마지막의 별도 릴리스 기록에 추가합니다.

## Step 1 — 센터의 첫 행동, 카드 그리드, 학년 상태

1. RED: `SignalCenter.test.tsx`와 `center-layout.spec.ts`에 실제 `mission-grid`, 추천 카드/첫 CTA, 학년 `aria-pressed`와 현재 선택 문구를 먼저 고정했습니다. 구현 전에는 해당 wrapper·추천 표시·선택 상태가 없어 실패했습니다.
2. 최소 구현: `SignalCenter.tsx`에서 서비스 약속 → 학년 선택 → 음성 설정 → 추천 미션 순서를 유지하고 목록에 실제 `mission-grid`를 연결했습니다. `MissionCard.tsx`에 첫 카드의 추천 보조 문구와 CTA `gi-pulse`, `components.css`·`layout.css`에 선택 상태 및 desktop 2열/mobile 1열을 추가했습니다. `StrategyLegend`는 닫힌 `details`로 두었습니다.
3. GREEN: unit 전체 23 files / 213 tests 통과, `check:size` 통과. 순서 수정 전 center-layout/navigation-recovery/zoom geometry subset은 4/4였고, 학년 → 음성 → 추천 순서로 복원한 뒤의 재실행은 Chromium host의 `bootstrap_check_in Permission denied` SIGTRAP으로 중단되었습니다.
4. 계획과 다른 점: 추천 미션을 학년·음성 설정보다 앞세우지 않고 사용성 피드백에 따라 계획의 시작 영역 순서를 지켰습니다. 새 스크린샷은 만들지 않았으며 기존 QA 스크린샷은 변경하지 않았습니다.

## Step 2 — 정답 누출 방지 콘텐츠 계약

1. RED: `contentIntegrity.test.ts`의 정규화 fixture가 accepted ambiguity label인 `the whole sentence`의 한국어 단서 `문장 전체`가 `g34-recess-time` 시나리오에 노출되는 기존 상태를 실패시켰습니다.
2. 최소 구현: `grade34-recess.ts`와 contract fixture에서 `g34-recess-time`의 시나리오·보조 문구를 종소리 때문에 내용을 놓친 상황으로 바꾸고, `g34-recess-rephrase` 시나리오를 장소 표현을 이해하지 못한 상황으로 바꿨습니다. `contentIntegrity.ts`는 직접 label과 등록된 번역만 정규화 비교합니다.
3. GREEN: content integrity, missions, audio/dialogue 관련 focused tests 11개 통과; 전체 unit 213개 통과. 영어 대화·음원 transcript는 수정하지 않았고 `check:audio`에서 20개 local asset canonical parity가 통과했습니다.
4. 계획과 다른 점: 새 스크린샷 경로는 생성하지 않았습니다. 시각 증거를 발명하지 않고 source/unit/audio parity 결과만 기록했습니다.

## Step 3 — 진행 표시와 단계 복구

1. RED: `session.test.ts`에서 `phase.back`이 없고 `PhaseProgress.test.tsx`에서 네 단계/`aria-current="step"`가 없던 상태를 실패시켰습니다.
2. 최소 구현: `session.ts`에 `phase.back`을 추가해 repair→observe, response→repair, confirm→response로 이동하고 `selectedOptionIds`, `attempts`, evidence 계약을 보존하면서 `latestResult`만 초기화했습니다. `PhaseProgress.tsx`와 `MissionFlow.tsx`에 1/4~4/4 표시, 이전 단계, 센터 복귀, 미션 다시 시작을 추가했습니다.
3. GREEN: session, progress, accessibility 관련 unit 포함 전체 213개 통과. navigation-recovery subset은 순서 수정 전 1/1 통과했으며 현재 host 재실행은 동일한 Chromium SIGTRAP 제한으로 확인하지 못했습니다.
4. 계획과 다른 점: 기록 화면의 evidence 검증과 기존 attempts/privacy 필드는 변경하지 않았습니다. 이전 단계로 돌아가도 선택은 보존되고 다시 제출할 때 기존 reducer 계약을 사용합니다.

## Step 4 — 학생용 문구와 핵심 버튼 강조

1. RED: 기존 두 action만 있던 `CriticalActionButton.test.tsx`에 네 action 이름을 추가해 실패시켰고, repair/response 제출 버튼이 공통 버튼을 쓰지 않는 상태를 실패시켰습니다.
2. 최소 구현: `CriticalActionButton.tsx`를 네 단계로 확장했습니다. 의미 기준 label은 `모호한 부분 찾기`, `이 표현으로 다시 물어보기`, `이해한 뜻 확인하기`, `확인 질문 보내기`입니다. 관찰·수리·응답·확인 제목을 학생 행동 중심으로 바꾸고, 현재 제출 CTA와 추천 CTA에만 `gi-pulse`를 유지했습니다. 음성 설명은 컴퓨터 참고 소리·발음 점수 없음·대본 사용 가능으로 정리했습니다.
3. GREEN: 전체 unit 23 files / 213 tests, lint, typecheck 통과. reduced-motion 계약은 기존 static 3px outline/animation none 규칙을 유지합니다.
4. 계획과 다른 점: parent review에 따라 action label의 의미를 재정렬하고 관련 unit/E2E selector를 함께 갱신했습니다. VoiceOver 구현·검증은 추가하지 않았습니다.

## Step 5 — 완료 화면의 학생용 학습 마무리

1. RED: `LearnerTakeaway.test.tsx`에서 슬롯·전략별 두 문장과 `CommunicationRecord.test.tsx`에서 교사용 details 밖의 위치를 먼저 고정했습니다.
2. 최소 구현: `LearnerTakeaway.tsx`와 순수 `learnerTakeawayCopy.ts`를 추가하고 `CommunicationRecord.tsx`에서 TeacherSummary 바깥, 기록 필드 위에 `오늘 배운 점`과 `다음에 해 보기`를 렌더링했습니다.
3. GREEN: learner takeaway 및 communication record 테스트 포함 전체 unit 213개 통과, typecheck/build 통과.
4. 계획과 다른 점: lint의 단일 책임 경고를 피하기 위해 copy builder를 별도 순수 파일로 분리했습니다. 이름·점수·순위·자유 메모는 추가하지 않았습니다.

## Step 6 — 오디오 실패 안내와 200% 대화상자

1. RED: `MissionAudioPlayer.test.tsx`에 `HTMLMediaElement.play()` reject 시 status가 나타나야 한다는 테스트를 추가해 기존 조용한 catch를 실패시켰습니다.
2. 최소 구현: `useAudioPlayer.ts`에 `playbackError`를 추가하고 stop/cue 변경/재시작 시 초기화했습니다. `MissionAudioPlayer.tsx`는 `음성을 재생할 수 없어요. 아래 대본을 읽어 주세요.`를 polite status로 표시합니다. update dialog backdrop은 시작 정렬·overflow auto, dialog는 viewport 여백을 뺀 max block size와 sticky header를 사용합니다.
3. GREEN: audio unit, update-dialog 관련 테스트 및 전체 unit 213개 통과. `check:audio` 20개, audio verifier 6개, build 통과. 200% geometry E2E는 순서 수정 전 1/1이었으나 현재 순서의 재실행은 host Chromium SIGTRAP으로 막혔습니다.
4. 계획과 다른 점: 실제 200% 브라우저/물리 확대 수동 확인은 남은 위험으로 분리했습니다. VoiceOver 검증이나 음성 기능 구현은 하지 않았습니다.

## Step 7 — 업데이트 기록과 회귀 검증

1. RED: `changelog.test.ts`에서 최신 ISO 날짜 `2026-08-28` 개발 기록을 요구하도록 먼저 실패시켰습니다.
2. 최소 구현: `src/content/changelog.ts`에 추천 미션·진행 표시·학생용 문구·정답 단서·오디오 오류·확대 dialog 개선 기록을 추가했습니다.
3. GREEN 결과:

   - `npm run test:run`: 23 files / 213 tests passed
   - `npm run lint`: passed
   - `npm run typecheck`: passed
   - `npm run check:size`: all source files under 500 lines
   - `npm run check:privacy`: 0 forbidden capabilities
   - `npm run check:audio`: 20 local audio files verified
   - `npm run test:audio-verifier`: 6 passed
   - `npm run test:privacy`: 5 passed
   - `npm run test:release-artifacts`: 1 passed
   - `npm run build`: Vite production build passed

   `PLAYWRIGHT_PORT=4175 npm run test:e2e -- tests/e2e/center-layout.spec.ts`는 제품 assertion 전에 macOS Chromium `mach_port_rendezvous`/`bootstrap_check_in Permission denied (1100)` SIGTRAP으로 종료되어 host 제한으로 기록했습니다. 이전 subset 성공 결과와 현재 소스 자동 게이트를 구분했으며, 반복 실행은 중단했습니다.
4. 계획과 다른 점: package script, 외부 저장소, 네트워크, 마이크, 저장소, VoiceOver, 배포는 건드리지 않았습니다. HVC 확인용 기존 공개 경로는 `https://wbmaker2.github.io/conversation-repair-signal-center/`이며 이번 작업에서 새 공개 버전은 만들지 않았습니다.

## Step 1 보완 — 375×812 첫 CTA geometry

부모 검증에서 기존 최종 순서의 추천 CTA가 `y=845.6875`로 viewport 아래에 놓인 것을 확인해 Step 1 geometry 조건을 다시 RED로 처리했습니다. `center-layout.spec.ts`의 조건을 CTA의 `y + height <= 812`로 강화했습니다.

- 최소 구현: 음성 보조 설명을 닫힌 `details`로 바꾸고, 닫힌 상태의 한 줄 summary에 선택 사항·발음 점수 없음을 남겼습니다. 센터 live 안내를 짧은 `학년·음성을 고른 뒤 시작하세요.`로 줄였으며, 모바일 추천 카드의 제목·설명 간격을 compact하게 조정했습니다. 학년 버튼, 음성 checkbox, 개인정보 안내, 추천 미션 순서는 유지했습니다.
- GREEN: `SignalCenter.test.tsx` 7/7, lint, typecheck, source-size 통과. 최종 headless Chromium 재측정은 이 환경에서 `mach_port_rendezvous` SIGTRAP이 재현되어 실행하지 못했으므로, 대체 headless 환경에서 `center-layout.spec.ts`를 다시 실행해 `y + height <= 812`를 확인해야 합니다.

## 남은 수동 확인과 위험

- host Chromium SIGTRAP이 없는 환경에서 375×812 첫 추천 CTA, desktop 2열/mobile 1열, navigation recovery, privacy/accessibility E2E를 재실행해야 합니다.
- 실제 브라우저 200% 확대에서 업데이트 dialog 제목·닫기 버튼·내부 스크롤을 사람이 확인해야 합니다.
- 학생/교사 대상 실제 사용성, 키보드·터치 체감, 화면 낭독기 검증은 자동 테스트 결과와 별도의 수동 게이트입니다. VoiceOver 구현·검증은 이번 범위에서 제외했습니다.

## 후속 보완 — geometry·문구·selector 재검증

- RED: 부모 headless 측정에서 기존 추천 CTA가 mobile `y=845.6875`였고, learner flow에서 `수리 표현 보내기` selector 및 `더 구체적으로 전략으로...` 문법이 남아 있었습니다. center geometry 테스트는 mobile/desktop 모두 CTA 전체가 viewport 안에 있어야 하도록 강화했습니다.
- 최소 구현: 음성 details/짧은 setup 안내/추천 카드 compact 스타일을 적용했고, desktop audio 여백도 줄였습니다. `tests/fixtures/accepted-paths.ts` selector를 `이 표현으로 다시 물어보기`로 갱신했습니다. `learnerTakeawayCopy.ts`에 슬롯별 질문 표현과 repeat/specify/confirm/rephrase별 자연스러운 학습·다음 행동 템플릿을 추가하고 기록 단계 라벨도 학생 행동 문구로 정리했습니다.
- GREEN: 최종 `npm run test:run`은 23 files / 224 tests, lint, typecheck, check:size, build를 통과했습니다. 대체 Playwright Chromium headless shell 측정은 mobile CTA `{y:757.703125,height:44.796875,bottom:802.5}`, desktop CTA `{y:850.421875,height:47.265625,bottom:897.6875}`로 mobile 812 및 desktop 900 조건을 모두 통과했습니다. desktop grid는 `display:grid`, 2 tracks이며 setup 순서와 모든 details 닫힘도 확인했습니다.
- 계획과 다른 점: 관리형 Playwright Chromium은 계속 macOS `mach_port_rendezvous` SIGTRAP으로 실행되지 않아 설치된 Playwright Chromium headless shell을 대체 측정에 사용했습니다. 공통 learner-flow가 사용하는 `tests/fixtures/accepted-paths.ts`도 새 학생용 수리 버튼 이름을 가리키도록 갱신했습니다. 네트워크·저장소·마이크·VoiceOver·배포는 추가하지 않았습니다.

## 릴리스 전환 기록

후속 사용자 지시에 따라 구현 결과를 기능 브랜치에 커밋하고 GitHub 원격에 푸시한 뒤, `main` 병합과 GitHub Pages 배포를 별도 릴리스 게이트로 진행했다. 커밋 SHA, PR, workflow 실행, 공개 URL의 HTTP·HTML·자산·학생 경로 결과는 아래에 기록했으며, 로컬 자동 검증·관리형 Chromium 호스트 제한·실제 아동·교사 수동 사용성 검증과 섞지 않았다.

## 릴리스 결과 — 2026-08-28

- 기능 브랜치 커밋: `ff7fc3b` (`feat: improve learner repair flow`), `878e3e1` (`test: cover learner flow regressions`), `ed7daba` (`docs: record learner improvement plan`)
- GitHub PR: [#1](https://github.com/WBmaker2/conversation-repair-signal-center/pull/1), `main` 병합 커밋 `2de588c3abbfd508d225df77e4802b704138b82b`
- Pages workflow: [Deploy to GitHub Pages run 33146560286](https://github.com/WBmaker2/conversation-repair-signal-center/actions/runs/33146560286) 성공. `build`의 quality checks·production build·artifact upload와 `deploy`가 모두 성공했습니다.
- Pages 설정: `build_type=workflow`, `public=true`, `https_enforced=true`
- 공개 학습 경로: [https://wbmaker2.github.io/conversation-repair-signal-center/](https://wbmaker2.github.io/conversation-repair-signal-center/)에서 HTTP 200, 앱 제목, CSS·JS 자산을 확인했습니다. 공개 JS 번들에서 `먼저 해 보기`, `이 표현으로 다시 물어보기`, `오늘 배운 점`, `음성을 재생할 수 없어요` 문구도 확인했습니다.
- 공개 인터랙션: 이 macOS 호스트의 Chromium이 `bootstrap_check_in Permission denied (1100)` SIGTRAP으로 시작 전에 종료되어 자동 공개 클릭 경로는 실행하지 않았습니다. 로컬 대체 headless smoke에서 mobile·desktop CTA geometry, 단계 진행·복구, 완료 takeaway, reduced-motion, audio fallback을 확인한 결과와 구분해 기록합니다.
- 남은 게이트: 실제 브라우저 200% 확대·키보드/터치 체감과 학생·교사 수동 사용성 확인이 남아 있습니다. VoiceOver 구현·검증은 프로젝트 범위에서 제외했습니다.

## 2026-08-30 재감사 후속 보완

이번 실행은 `education-webapp-redesign` 규칙과 `work/education-webapp-redesign-plan.md`의 18절을 먼저 확인한 뒤, 기존 작업 트리의 리디자인을 보존하면서 남은 P1/P2만 TDD 순서로 보완했습니다.

1. RED: `SignalCenter.test.tsx`에 전략 목적 요약과 빈 미션 복구 기준, `accessibility.test.tsx`에 빈 feedback selector 기준, `zoom-geometry.spec.ts`에 375×812 dialog 높이 기준을 추가했습니다. 최소 구현 전 새 전략 요약·복구·selector는 실패했습니다.
2. 최소 구현: `StrategySummary.tsx`, `EmptyMissionState.tsx`를 추가하고 `SignalCenter.tsx`에 연결했습니다. `components.css`의 dialog를 `70dvh`까지 확장하고 `[data-feedback-state="empty"]` 공간을 제거했습니다. `CommunicationRecord.tsx`의 학생용 라벨과 `changelog.ts`의 2026-08-30 기록을 갱신했습니다.
3. GREEN: 센터·접근성·기록 focused unit 36개가 통과했습니다. 이후 전체 자동 게이트를 다시 실행해 `npm run test:run` 23개 파일·231개 테스트, lint, typecheck, source-size, privacy, audio 20개, audio verifier 6개, privacy test 5개, release-artifacts 1개, build를 모두 통과했습니다.

관리형 macOS Chromium은 제품 assertion 전에 `mach_port_rendezvous`/`bootstrap_check_in Permission denied (1100)` SIGTRAP으로 종료되어 새 E2E geometry 결과를 만들지 못했습니다. 같은 host에서 반복하지 않았으며, VoiceOver·실제 학생/교사·물리 200% 확대는 프로젝트 규칙과 수동 게이트에 따라 실행하지 않았습니다.
