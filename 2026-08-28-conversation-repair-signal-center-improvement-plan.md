# Conversation Repair Signal Center Improvement Plan

작성일: 2026-08-28
대상 릴리스: main / c0ac7ec
기준 QA: .gstack/qa-reports/qa-report-conversation-repair-signal-center-2026-08-28.md
실행 상태: Step 1~7 구현과 로컬 자동 검증을 완료했다. 관리형 Chromium E2E의 호스트 권한 오류와 실제 아동·교사 수동 검증은 별도 게이트로 남아 있다. 초기 구현 범위에서는 GitHub push·Pages 배포를 보류했으며, 후속 사용자 승인에 따라 릴리스 절차를 별도로 진행한다.

## Goal

초등 3~6학년 학생이 처음 방문했을 때 첫 학습 행동을 빠르게 찾고, 대화가 막힌 이유를 스스로 분석하고, 네 단계의 현재 위치를 이해하며, 완료 후 오늘 배운 전략과 다음 행동을 읽을 수 있게 한다. 기존의 음성 없는 학습 경로, 복수의 자연스러운 정답, 메모리 전용 개인정보 경계를 유지한다.

완료 기준:

- 375×812 첫 viewport 안에 추천 미션의 시작 행동이 노출되고, 한 번의 클릭으로 대화 관찰 단계에 도달한다.
- 미션 목록 wrapper가 실제로 mission-grid CSS를 사용하고, 데스크톱 2열·640px 이하 1열과 카드 경계가 동작한다.
- 선택한 학년이 aria-pressed와 눈에 보이는 상태로 동시에 표시된다.
- g34-recess-time과 g34-recess-rephrase에서 시나리오·보조 문장이 accepted option의 직접 정답 또는 번역을 노출하지 않는다.
- 관찰·수리·응답·확인의 현재 단계가 aria-current=step으로 표시되고, 진행 중 이전 단계 검토·센터 복귀·미션 다시 시작이 가능하다.
- 각 단계의 현재 핵심 제출 버튼과 추천 미션 CTA에 gi-pulse가 적용되며, prefers-reduced-motion에서는 깜빡임 대신 정적 3px 외곽선이 보인다.
- 학생용 제목과 버튼이 행동 중심 문장으로 읽히고, 기술 용어는 설명 또는 교사용 영역으로 내려간다.
- 완료 화면에 학생용 오늘의 배운 점과 다음에 해 볼 일이 교사용 보기 밖에서 노출된다.
- 오디오 재생 거부 시 조용히 끝나지 않고 대본으로 이어지는 한국어 상태 안내가 나타난다.
- 실제 브라우저 200% 확대에서 업데이트 대화상자의 제목·닫기 버튼·내부 스크롤을 수동 확인할 수 있는 구조를 갖춘다.
- 모든 소스 파일은 500줄 미만이고 기존 개인정보·오디오·10개 미션·접근성 계약을 유지한다.

## Architecture

현재 React/Vite 정적 SPA 구조를 유지한다. 콘텐츠, 순수 도메인 판정, 세션 리듀서, 단계별 화면, 공통 버튼·진행 표시를 분리한다.

학습 경로는 다음 상태를 유지한다.

센터 → 관찰 → 수리 → 응답 → 확인 → 기록

세션 리듀서는 phase.back으로 직전 학습 단계를 다시 보여 주고, center.returned로 센터에 복귀한다. phase.back은 기존 선택과 시도 기록을 보존하고 최신 피드백만 지운다. 사용자가 이전 단계에서 다시 제출하면 현재 선택·판정이 새 시도로 기록된다. 기록 화면의 MissionEvidence 검증과 메모리 전용 상태 계약은 변경하지 않는다.

학생 화면의 각 단계는 다음 두 층으로 구성한다.

- PhaseProgress: 현재 단계, 전체 4단계, 이전 단계 가능 여부를 semantic list와 aria-current로 표시한다.
- Phase content: 한 문장 행동 안내, 대화·선택지, 현재 단계의 핵심 버튼 하나를 제공한다.

콘텐츠 정답 누출 검사는 데이터 단위 테스트로 고정한다. accepted ambiguity option의 labelEn과 한국어 번역이 scenarioKo·supportKo·obscuredLabelKo에 그대로 나타나지 않도록 정규화 비교를 사용한다.

## Tech Stack

- React 19, TypeScript strict mode, Vite 8
- CSS media query와 prefers-reduced-motion
- Vitest, React Testing Library, jest-axe
- Playwright Chromium 설정과 기존 acceptance fixture
- 기존 번들 MP3와 동일 origin asset

VoiceOver 기능 구현과 VoiceOver 검증은 이 개선 범위에서 제외한다. 화면의 semantic HTML·lang·keyboard focus 계약만 기존 테스트로 유지한다.

## Visual thesis

차분한 종이색 신호센터 위에 한 번에 하나의 다음 행동만 또렷하게 올려, 긴 설명서가 아니라 학생이 바로 시작할 수 있는 학습 도구처럼 보이게 한다.

## Content plan

- 시작 영역: 서비스 약속, 학년 선택, 음성 선택, 추천 미션 CTA
- 작업 영역: 단계 표시, 한 문장 행동 안내, 대화와 선택지
- 도움말 영역: 접을 수 있는 네 가지 전략 설명
- 완료 영역: 학생용 배운 점·다음 행동, 그 아래 교사용 교육과정 보기

## Interaction thesis

- 새 단계로 넘어갈 때 단계 표시와 heading이 함께 갱신되어 현재 위치를 알려 준다.
- 현재 단계에서 반드시 눌러야 하는 제출 버튼 하나만 gi-pulse로 강조하고, reduced motion에서는 정적 외곽선으로 대체한다.
- 추천 미션은 첫 CTA만 강조하고, 다른 미션은 동일한 구조로 비교할 수 있게 한다.

## Global Constraints

- 3~4학년과 5~6학년 각각 5개, 총 10개 미션과 기존 ID·전략·교육과정 연결을 유지한다.
- 음성 없이 모든 미션을 완료할 수 있어야 하며 음성은 기본 꺼짐으로 유지한다.
- 마이크, 녹음, 음성 인식, 발음·억양 점수, 로그인, 서버 저장, 분석 도구, 외부 AI API를 추가하지 않는다.
- 이름, 자유 메모, 점수, 순위, 쿠키, localStorage, sessionStorage를 추가하지 않는다.
- 오답 피드백은 accepted 표현을 직접 공개하지 않는다.
- 모든 영문은 lang=en, 한국어 설명은 lang=ko를 유지한다.
- 학습 핵심 버튼은 최소 44×44 CSS px이며 375px에서 가로 overflow가 없어야 한다.
- gi-pulse는 동시에 여러 개를 무한히 깜빡이지 않고 현재 단계의 다음 행동 또는 추천 CTA에만 적용한다.
- prefers-reduced-motion에서는 애니메이션·이동을 제거하고 정적 3px 외곽선으로 대체한다.
- 오른쪽 아래 업데이트 내역 버튼과 ISO 날짜 changelog를 유지하고 이번 개선 기록을 추가한다.
- src, scripts, tests 아래 모든 단일 ts·tsx·css·mjs 파일은 499줄 이하로 유지한다.
- 초기 구현 범위에서는 코드·콘텐츠·테스트·문서 개선까지만 수행하고 GitHub 레포지토리 생성, commit, push, Pages 배포를 실행하지 않았다. 후속 사용자 지시가 있으면 기능 브랜치 검토, 커밋, 푸시, Pages 배포와 공개 경로 확인을 별도 릴리스 게이트로 수행한다.

## Findings mapped to implementation tasks

| QA finding | Implementation task | Priority |
|---|---|---|
| ISSUE-001 첫 CTA가 첫 화면 아래 | 추천 미션 영역, 시작 순서 압축, 전략 도움말 접기 | P1 |
| ISSUE-002 정답 슬롯 누출 | g34-recess 콘텐츠 수정과 누출 방지 계약 테스트 | P1 |
| ISSUE-003 한 방향 흐름·진행 표시 없음 | PhaseProgress, phase.back, 중간 센터 복귀와 다시 시작 | P1 |
| ISSUE-004 mission-grid 미적용 | SignalCenter 실제 wrapper class 연결과 layout test | P1 |
| ISSUE-005 학년 선택 시각 상태 없음 | aria-pressed 선택 스타일과 현재 선택 문구 | P1 |
| ISSUE-006 핵심 버튼 강조 불일치 | CriticalActionButton action 확장과 단계별 단일 pulse | P1 |
| ISSUE-007 기술 은유 중심 문구 | 학생용 행동 제목·버튼·음성 안내 정리 | P1 |
| ISSUE-008 완료 화면 배운 점·다음 행동 없음 | LearnerTakeaway 컴포넌트와 순수 문구 함수 | P2 |
| ISSUE-009 오디오 거부가 조용함 | audio playback error 상태와 대본 안내 | P2 |
| ISSUE-010 데스크톱 200% dialog 경계 | dialog 시작 정렬·높이·내부 스크롤 보완 | P2 |

## Expected file structure and responsibilities

기존 파일은 책임을 유지하고, 새 파일은 한 기능만 담당한다.

    2026-08-28-conversation-repair-signal-center-improvement-plan.md
    docs/qa/improvement-implementation-log.md
    src/app/MissionFlow.tsx
    src/content/changelog.ts
    src/content/missions/grade34-recess.ts
    src/content/missions/contentIntegrity.ts
    src/content/missions/contentIntegrity.test.ts
    src/domain/session.ts
    src/domain/session.test.ts
    src/features/center/SignalCenter.tsx
    src/features/center/MissionCard.tsx
    src/features/center/SignalCenter.test.tsx
    src/features/observation/DialogueObservation.tsx
    src/features/repair/RepairTransmission.tsx
    src/features/response/ResponseReception.tsx
    src/features/confirmation/ConfirmationCall.tsx
    src/features/record/CommunicationRecord.tsx
    src/features/record/LearnerTakeaway.tsx
    src/features/record/LearnerTakeaway.test.tsx
    src/features/audio/AudioPreferenceToggle.tsx
    src/features/audio/MissionAudioPlayer.tsx
    src/features/audio/useAudioPlayer.ts
    src/features/audio/MissionAudioPlayer.test.tsx
    src/shared/CriticalActionButton.tsx
    src/shared/CriticalActionButton.test.tsx
    src/shared/PhaseProgress.tsx
    src/shared/PhaseProgress.test.tsx
    src/styles/base.css
    src/styles/layout.css
    src/styles/components.css
    src/styles/motion.css
    tests/e2e/learner-flow.spec.ts
    tests/e2e/accessibility.spec.ts
    tests/e2e/center-layout.spec.ts
    tests/e2e/navigation-recovery.spec.ts

## Core interfaces

PhaseProgress는 도메인 phase를 UI 단계로 좁힌다.

    export type LearningPhase = 'observe' | 'repair' | 'response' | 'confirm';

    export interface PhaseProgressProps {
      phase: LearningPhase;
      onBack: (() => void) | undefined;
    }

CriticalActionButton은 단계별 제출 문구를 중앙에서 관리한다.

    export type CriticalAction =
      | 'find-ambiguity'
      | 'send-repair'
      | 'confirm-meaning'
      | 'send-confirmation';

    export interface CriticalActionButtonProps
      extends ButtonHTMLAttributes<HTMLButtonElement> {
      action: CriticalAction;
    }

LearnerTakeaway는 완료 기록과 학생용 두 문장을 분리한다.

    export interface LearnerTakeawayProps {
      mission: Mission;
      evidence: MissionEvidence;
    }

    export interface LearnerTakeawayCopy {
      learnedKo: string;
      nextStepKo: string;
    }

오디오 player hook은 기존 반환값에 재생 오류 상태를 추가한다.

    export interface AudioPlaybackState {
      isPlaying: boolean;
      playbackRate: PlaybackRate;
      playbackError: string | null;
      togglePlayback: () => Promise<void>;
      setPlaybackRate: (rate: PlaybackRate) => void;
      stop: () => void;
    }

## Implementation sequence

각 작업은 실패 테스트 작성 → 가장 작은 구현 → 관련 테스트 통과 순서로 진행한다. 한 작업이 통과한 뒤 다음 작업으로 넘어간다.

### Step 1 — 센터의 첫 행동, 카드 그리드, 학년 상태

- [ ] RED: SignalCenter.test.tsx에서 mission-grid wrapper 존재, 추천 미션 표시, 추천 시작 버튼의 gi-pulse, 선택 학년의 aria-pressed와 시각 상태 hook을 실패하게 작성한다.
- [ ] RED: 새 center-layout.spec.ts에서 1280px은 2열, 375px은 1열, 첫 추천 CTA가 375×812 viewport에 교차하는 geometry assertion을 작성한다.
- [ ] 최소 구현: SignalCenter의 실제 목록 wrapper에 mission-grid를 연결하고 추천 미션을 목록 첫 항목으로 표시한다.
- [ ] 최소 구현: MissionCardProps에 isRecommended를 추가하고 추천 button에 gi-pulse와 추천 보조 문구를 적용한다.
- [ ] 최소 구현: 학년 버튼에 aria-pressed=true 스타일, 현재 선택 텍스트, 색에 의존하지 않는 굵은 테두리 또는 체크 표시를 추가한다.
- [ ] 최소 구현: 미션 선택 전후 순서를 조정하고 전략 도움말을 접을 수 있는 details로 내려 첫 CTA를 위로 올린다.
- [ ] GREEN: SignalCenter.test.tsx, center-layout.spec.ts와 기존 미션 수·등급 필터 테스트를 통과시킨다.
- [ ] 기록: docs/qa/improvement-implementation-log.md에 변경 파일, 첫 CTA geometry, 미션 grid 결과를 기록한다.

Files:

- src/features/center/SignalCenter.tsx
- src/features/center/MissionCard.tsx
- src/features/center/SignalCenter.test.tsx
- tests/e2e/center-layout.spec.ts
- src/styles/layout.css
- src/styles/components.css
- src/styles/motion.css

합격 조건: 375×812에서 추천 CTA의 getBoundingClientRect가 viewport와 교차하고, 1280px에서 mission-grid computed display가 grid이며, 학년 버튼 하나만 aria-pressed=true와 selected visual state를 가진다.

### Step 2 — 정답 누출 방지 콘텐츠 계약

- [ ] RED: contentIntegrity.test.ts에서 accepted ambiguity label과 그 한국어 번역이 scenarioKo·supportKo·obscuredLabelKo에 나타나는 fixture를 실패시킨다.
- [ ] 최소 구현: g34-recess-time의 scenarioKo를 "종이 울려 친구의 말을 잘 듣지 못했습니다."로, obscuredLabelKo를 "종소리 때문에 친구가 말한 내용을 놓쳤습니다."로 바꾼다.
- [ ] 최소 구현: g34-recess-rephrase의 scenarioKo를 "친구가 내가 말한 장소를 이해하지 못했습니다."로 바꾼다.
- [ ] 최소 구현: 테스트 정규화 함수가 대소문자·공백·문장부호를 무시하되 accepted 표현의 의미가 다른 일반 단어까지 과도하게 차단하지 않도록 직접 표현과 등록된 번역만 비교한다.
- [ ] GREEN: contentIntegrity.test.ts, missions.test.ts, audioDialogueParity.test.ts와 3~4학년 관찰 E2E를 통과시킨다.
- [ ] 기록: 정답 단서 제거 전후 문구와 직접 확인한 두 스크린샷 경로를 implementation log에 기록한다.

Files:

- src/content/missions/grade34-recess.ts
- src/content/missions/contentIntegrity.ts
- src/content/missions/contentIntegrity.test.ts
- src/content/missions/missions.test.ts
- tests/e2e/audio-off-parity.spec.ts

합격 조건: 두 미션에서 시나리오만 읽어 accepted option을 확정할 수 없고, 기존 영어 대화·음원 transcript parity는 유지된다.

### Step 3 — 진행 표시와 단계 복구

- [ ] RED: session.test.ts에 repair→observe, response→repair, confirm→response의 phase.back과 observe에서 back 무시를 작성한다.
- [ ] RED: PhaseProgress.test.tsx에 네 단계, 현재 단계 aria-current=step, 이전 버튼 disabled/부재 규칙을 작성한다.
- [ ] RED: navigation-recovery.spec.ts에 각 단계의 진행 표시, 이전 단계 이동, 미션 다시 시작, 센터 복귀를 작성한다.
- [ ] 최소 구현: domain/session.ts의 MissionSessionAction에 phase.back을 추가하고 이전 phase map으로 phase를 되돌린다. 기존 attempts와 selectedOptionIds를 보존하고 latestResult만 null로 만든다.
- [ ] 최소 구현: src/shared/PhaseProgress.tsx를 추가하여 4단계 ol과 현재 단계, "이전 단계 보기" 조작을 semantic HTML로 렌더링한다.
- [ ] 최소 구현: MissionFlow에 progress를 삽입하고 phase가 observe가 아니면 이전 버튼을, 모든 학습 phase에는 "신호센터로 돌아가기"와 "이 미션 다시 하기"를 제공한다.
- [ ] 최소 구현: phase 변경 시 기존 heading focus와 progress live status가 중복 발화되지 않도록 한 개의 짧은 status 문장만 둔다.
- [ ] GREEN: session.test.ts, PhaseProgress.test.tsx, accessibility.test.tsx, navigation-recovery.spec.ts와 기존 accepted path를 통과시킨다.
- [ ] 기록: 어떤 phase에서 선택이 보존되는지와 기록 화면 evidence 검증이 변하지 않았는지 기록한다.

Files:

- src/domain/session.ts
- src/domain/session.test.ts
- src/shared/PhaseProgress.tsx
- src/shared/PhaseProgress.test.tsx
- src/app/MissionFlow.tsx
- tests/e2e/navigation-recovery.spec.ts
- tests/e2e/accessibility.spec.ts

합격 조건: 학생이 현재 1/4·2/4·3/4·4/4를 의미적으로 확인할 수 있고, 중간 phase에서 이전 단계와 센터 복귀가 가능하며, 기존 완료 evidence가 위조되거나 손실되지 않는다.

### Step 4 — 학생용 문구와 핵심 버튼 강조

- [ ] RED: CriticalActionButton.test.tsx에서 네 action의 정확한 accessible name, gi-pulse, disabled 상태를 작성한다.
- [ ] RED: RepairTransmission.test.tsx와 ResponseReception.test.tsx에서 핵심 제출 버튼이 공통 CriticalActionButton을 사용하고 reduced-motion 정적 상태 hook을 작성한다.
- [ ] RED: 기존 phase heading assertion을 행동 중심 학생 문구로 갱신하고 영어·한국어 lang assertion을 유지한다.
- [ ] 최소 구현: CriticalActionButton action union을 네 단계로 확장한다.
- [ ] 최소 구현: 수리·응답·확인 단계의 submit button을 공통 컴포넌트로 교체하고, 현재 단계의 핵심 버튼에만 gi-pulse를 둔다.
- [ ] 최소 구현: observe 제목을 "다시 물어볼 부분 찾기", repair 제목을 "어떻게 다시 물어볼까요?", response 제목을 "상대의 대답 살펴보기", confirm 제목을 "내가 이해한 뜻 확인하기"로 바꾸며 기술 단계명은 작은 phase label로 제공한다.
- [ ] 최소 구현: AudioPreferenceToggle과 MissionAudioPlayer의 설명을 "컴퓨터가 만든 참고 소리이며 발음 점수는 없어요" 중심의 짧은 문장으로 정리한다.
- [ ] 최소 구현: strategy legend는 "전략 도움말" summary로 접을 수 있게 하고 미션 CTA 뒤에 둔다.
- [ ] GREEN: 모든 기존 phase unit/E2E, reduced-motion computed-style, axe serious·critical 검사를 통과시킨다.
- [ ] 기록: 변경된 학생용 제목과 버튼 목록, pulse 적용 범위를 implementation log에 기록한다.

Files:

- src/shared/CriticalActionButton.tsx
- src/shared/CriticalActionButton.test.tsx
- src/features/observation/DialogueObservation.tsx
- src/features/repair/RepairTransmission.tsx
- src/features/repair/RepairTransmission.test.tsx
- src/features/response/ResponseReception.tsx
- src/features/response/ResponseReception.test.tsx
- src/features/confirmation/ConfirmationCall.tsx
- src/features/confirmation/ConfirmationCall.test.tsx
- src/features/audio/AudioPreferenceToggle.tsx
- src/features/audio/MissionAudioPlayer.tsx
- src/features/center/StrategyLegend.tsx
- src/styles/motion.css

합격 조건: 학생이 제목만 읽어도 현재 해야 할 일을 알 수 있고, 현재 단계의 제출 버튼과 추천 CTA만 gi-pulse를 가지며, reduced-motion에서 animationName=none과 고정 outline이 확인된다.

### Step 5 — 완료 화면의 학생용 학습 마무리

- [ ] RED: LearnerTakeaway.test.tsx에서 슬롯 종류와 전략에 따른 learnedKo·nextStepKo 문장을 작성한다.
- [ ] RED: CommunicationRecord.test.tsx에서 "오늘 배운 것"과 "다음에 해 보기"가 교사용 details 밖에 있는지 검사한다.
- [ ] 최소 구현: src/features/record/LearnerTakeaway.tsx와 순수 copy builder를 추가한다.
- [ ] 최소 구현: CommunicationRecord의 기록 필드 위에 학생용 takeaway를 렌더링하고 TeacherSummary는 접힌 영역에 유지한다.
- [ ] GREEN: record unit, accessibility, accepted learner flow와 375px geometry를 통과시킨다.
- [ ] 기록: 완료 화면의 학생용 두 문장과 교사용 정보 분리를 기록한다.

Files:

- src/features/record/LearnerTakeaway.tsx
- src/features/record/LearnerTakeaway.test.tsx
- src/features/record/CommunicationRecord.tsx
- src/features/record/CommunicationRecord.test.tsx

합격 조건: 완료 직후 학생이 자신의 슬롯·전략에 맞는 배운 점과 다음 행동을 읽고, 점수·이름·순위 없이 기존 기록과 교사용 보기를 이용할 수 있다.

### Step 6 — 오디오 실패 안내와 200% 대화상자

- [ ] RED: MissionAudioPlayer.test.tsx에서 HTMLMediaElement.play reject 시 role=status 오류와 transcript 대체 안내를 검사한다.
- [ ] RED: zoom-geometry.spec.ts에서 1280×900 CSS zoom 2와 375×812 확대의 dialog 제목·닫기 버튼 경계를 검사한다.
- [ ] 최소 구현: useAudioPlayer에 playbackError 상태를 추가하고 cue 변경·stop·재시작 시 오류를 초기화한다.
- [ ] 최소 구현: MissionAudioPlayer에 "음성을 재생할 수 없어요. 아래 대본을 읽어 주세요."를 polite status로 표시한다.
- [ ] 최소 구현: update-history-backdrop를 세로 시작 정렬과 overflow auto로 바꾸고 dialog의 max-height를 viewport에서 안전한 여백을 뺀 값으로 제한한다. header와 닫기 버튼은 내부 스크롤 중에도 접근 가능하게 한다.
- [ ] GREEN: audio unit/integration, zoom geometry, update dialog keyboard 테스트를 통과시킨다.
- [ ] 기록: 실제 브라우저 200% 수동 확인이 필요한 조건을 implementation log에 남기되 VoiceOver 검증은 기록하지 않는다.

Files:

- src/features/audio/useAudioPlayer.ts
- src/features/audio/MissionAudioPlayer.tsx
- src/features/audio/MissionAudioPlayer.test.tsx
- src/features/updates/UpdateHistoryDialog.tsx
- src/styles/components.css
- tests/e2e/zoom-geometry.spec.ts

합격 조건: play 거부가 화면 상태로 설명되고, CSS 확대에서 dialog 제목·닫기 버튼·내부 스크롤이 viewport 안에서 조작 가능하다.

### Step 7 — 업데이트 기록과 회귀 검증

- [ ] RED: changelog.test.ts에서 새 2026-08-28 개발·콘텐츠·접근성 기록을 날짜 순서로 검사한다.
- [ ] 최소 구현: src/content/changelog.ts에 첫 CTA·진행 표시·학생용 문구·정답 단서·오디오 오류·확대 dialog 개선을 한두 문장으로 기록한다.
- [ ] 최소 구현: docs/qa/improvement-implementation-log.md에 각 단계의 RED·GREEN 결과와 미완료 수동 항목을 기록한다.
- [ ] GREEN: lint, typecheck, unit, source-size, privacy, audio, release-artifacts, build를 순서대로 통과시킨다.
- [ ] GREEN: 가능한 환경에서 Playwright learner-flow, center-layout, navigation-recovery, accessibility, privacy를 통과시킨다.
- [ ] 검토: git diff를 계획의 파일 목록과 대조하고, unrelated 변경이 없는지 확인한다.

Files:

- src/content/changelog.ts
- src/content/changelog.test.ts
- docs/qa/improvement-implementation-log.md
- package scripts는 변경하지 않고 기존 명령을 사용한다.

합격 조건: 새 업데이트 내역이 앱에 보이고, 모든 자동 게이트 결과와 브라우저 제한이 기록되며, 사용자에게 현재 공개 Pages 링크와 로컬 검증 결과를 제공할 수 있다.

## Verification commands and expected results

아래 명령은 계획 이후 구현 단계에서 실행한다.

    npm run lint
    npm run typecheck
    npm run test:run
    npm run check:size
    npm run check:privacy
    npm run check:audio
    npm run test:audio-verifier
    npm run test:privacy
    npm run test:release-artifacts
    npm run build
    npm run test:e2e -- tests/e2e/learner-flow.spec.ts tests/e2e/center-layout.spec.ts tests/e2e/navigation-recovery.spec.ts
    npm run test:e2e -- tests/e2e/accessibility.spec.ts tests/e2e/privacy.spec.ts

예상 결과:

- lint·typecheck·build 종료 코드 0
- unit test 전체가 기존 197개보다 새 계약 테스트 수만큼 증가하고 모두 통과
- source-size가 499줄 초과 파일 0개를 보고
- privacy 금지 capability 0개
- audio manifest 20개와 기존 transcript parity 통과
- learner-flow에서 10개 미션 음성 꺼짐 완료와 추천 CTA 경로 통과
- center-layout에서 desktop 2열·mobile 1열·첫 CTA viewport 교차 통과
- navigation-recovery에서 progress·back·restart·center return 통과
- reduced-motion에서 pulse animation none, static outline 3px 통과

호스트 Chromium이 SIGTRAP 또는 bootstrap_check_in 권한 오류로 실행되지 않으면 제품 결함으로 단정하지 않고 실패 로그와 대체 가능한 로컬 정적·unit 결과를 기록한다. 배포·공개 브라우저 검증은 이 요청의 구현 단계에 포함하지 않는다.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| phase.back이 기존 evidence와 어긋남 | 이전 단계로 이동해도 evidence를 지우지 않고, 재제출 시 새 attempt를 추가하며 최종 record 검증은 accepted 결과를 다시 확인 |
| 첫 CTA를 강조하면서 학생이 다른 미션을 놓침 | 추천 미션을 "먼저 해 보세요"로 명시하고 나머지 4개는 같은 mission-grid에 유지 |
| pulse가 산만하거나 접근성에 부담 | 동시에 하나만 pulse, reduced-motion에서는 정적 외곽선, keyboard focus는 별도 유지 |
| 정답 누출 검사 false positive | accepted 표현·등록 번역만 비교하고 일반적인 맥락 단어는 차단하지 않음 |
| 긴 완료 문구로 모바일 높이 증가 | takeaway는 두 짧은 문장으로 제한하고 교사용 details는 접은 상태 유지 |
| 200% dialog 수정이 모바일 geometry를 깨뜨림 | 375×812와 1280×900을 모두 검사하고 내부 scrollHeight·고정 버튼 경계를 별도로 확인 |

## Plan-vs-implementation record

구현 에이전트는 각 단계가 끝날 때 docs/qa/improvement-implementation-log.md에 다음 네 항목만 기록한다.

1. RED에서 확인한 테스트와 실패 이유
2. 최소 구현 파일과 핵심 인터페이스
3. GREEN 명령과 결과 수
4. 계획과 달라진 점 및 다음 단계

계획과 다른 파일을 만져야 하면 같은 로그에 이유와 회귀 위험을 적고, 사용자에게 최종 보고할 때 차이를 명시한다.

## Release boundary

초기 개선 요청에서 수행한 것은 개선안 문서 작성, 소스·테스트·문구·스타일 구현, 로컬/허용된 브라우저 검증까지였다. 그 시점에는 GitHub repository 변경, commit, push, GitHub Pages 배포를 실행하지 않았다. 후속 사용자 승인에 따라 릴리스 단계에서는 기능 브랜치 커밋·푸시와 main 병합, Pages workflow 완료, HVC에서 확인할 공개 학습 경로의 HTTP·HTML·자산·학생 경로 검증을 별도 증거로 기록한다. 실제 아동·교사 수동 사용성 및 VoiceOver 검증은 여전히 별도 게이트이며, VoiceOver 구현·검증은 이 범위에 포함하지 않는다.
