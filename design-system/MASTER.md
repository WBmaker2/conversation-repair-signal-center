# Conversation Repair Signal Center Design System

작성일: 2026-08-29
상태: 이번 교육용 앱 리디자인 기준
설계 역할: `ui-ux-pro-max` 검색 결과를 검토했으며, 제품 제약과 기존 학습 흐름을 우선한 라이트·텍스트 중심 시스템

## Purpose and audience

이 시스템은 초등 3~6학년이 영어 대화의 막힌 부분을 찾고, 다시 묻고, 의미를 확인하는 흐름을 화면만 보고 따라가도록 돕는다. 학생이 먼저 읽는 문장은 짧은 행동 문장으로, 교사가 확인하는 정보는 접을 수 있는 보조 영역으로 둔다.

## Non-negotiable learning and safety rules

- 네 전략의 의미는 `repeat`, `specify`, `confirm`, `rephrase` 콘텐츠 계약을 보존한다.
- 음성은 선택 사항이며 대본만으로 모든 미션을 완료할 수 있다.
- 발음·속도 점수, 마이크, 녹음, 음성 인식, 로그인, 서버 저장, 외부 AI API, 분석 도구를 추가하지 않는다.
- 학생 이름·자유 메모·순위·쿠키·localStorage·sessionStorage를 받거나 저장하지 않는다.
- 오답 피드백은 정답 문장을 바로 노출하지 않고 정보 종류를 생각하게 하는 힌트를 먼저 제공한다.
- 교육과정·사실성·대화 원문을 시각 장식으로 다시 만들지 않는다.

## Visual language

### Color tokens

현재 종이색 라이트 모드를 유지하고, 학생의 다음 행동과 상태에만 signal 색을 사용한다. 색상만으로 상태를 판별하지 않도록 텍스트·테두리·ARIA를 함께 사용한다.

| token | value | use |
|---|---|---|
| `--color-paper` | `#f7f3ea` | 전체 배경 |
| `--color-surface` | `#fffdf8` | 카드·fieldset·dialog 표면 |
| `--color-ink` | `#102a43` | 본문·제목 |
| `--color-muted` | `#52606d` | 보조 설명·이전 단계 |
| `--color-line` | `#b8c4cc` | 경계·비활성 진행선 |
| `--color-signal` | `#165a82` | 현재 단계·주요 CTA·추천 |
| `--color-signal-dark` | `#104866` | 버튼 경계·강한 텍스트 |
| `--color-signal-soft` | `#e3f1f6` | 선택됨·추천 표면 |
| `--color-success` | `#286548` | 정답 상태, 텍스트와 함께 |
| `--color-warning` | `#8a541d` | 도움·주의 상태, 텍스트와 함께 |

`--color-signal`과 `--color-signal-dark`는 `--color-paper`, `--color-surface`, 흰색 표면에서 본문/경계 대비 4.5:1 이상을 유지하는지 브라우저 계산으로 확인한다.

### Typography

- 외부 폰트를 로드하지 않고 system-ui stack을 사용한다.
- `h1`: 서비스명 또는 미션명을 가장 큰 행동 맥락으로, `clamp(1.75rem, 1.35rem + 2vw, 3rem)` 범위에서 유지한다.
- `h2`: 화면의 현재 행동, `h3`: 카드·결과 묶음의 이름으로 사용한다.
- 본문은 최소 1rem, line-height 1.55; 영어 표현은 `lang="en"`, 한국어 설명은 `lang="ko"`다.
- 한 문단에는 하나의 행동 또는 이유만 담고, 기술 용어는 `.phase-label` 같은 보조 층으로 낮춘다.

### Spacing and surfaces

- 기존 `--space-1`~`--space-6`과 `--radius`를 우선 사용한다.
- 새 spacing token은 CSS와 이 문서에 동시에 기록하고, 컴포넌트별 임의 숫자를 만들지 않는다.
- 카드 표면은 `--color-surface`, 경계는 `--color-line`, 현재 행동은 signal border 3px로 표현한다.
- 그림자와 장식은 CTA·현재 상태를 가리지 않는 낮은 대비로만 사용한다.

## Component contracts

### Buttons and actions

- 모든 button/select/summary/choice-label은 44×44 CSS px 이상이다.
- `CriticalActionButton`의 네 action 이름과 `aria-label`은 변경하지 않는다.
- 한 화면에는 primary action 하나만 signal surface 또는 `gi-pulse`를 갖는다.
- 보조 navigation은 pulse가 없고, 문장으로 목적을 설명한다.
- `:focus-visible`은 signal 3px outline과 3px offset을 사용한다.
- disabled 상태는 opacity만 낮추지 않고 텍스트·선택 불가 상태를 함께 보여 준다.

### Cards and choice states

- Mission card order: recommendation (optional) → title → scenario → grade/context → start CTA.
- Strategy card order: Korean name → purpose → context → English examples.
- 선택됨/오답/정답은 background, border, feedback text를 함께 사용하며 색상만 사용하지 않는다.
- 긴 영어 문장은 `overflow-wrap:anywhere`와 한 열 mobile layout으로 안전하게 감싼다.

### Progress and feedback

- `PhaseProgress`는 semantic `nav` + `ol` + 하나의 `aria-current="step"`를 사용한다.
- 단계 라벨은 학생 행동 문장, 기술 단계명은 보조 `.phase-label`로 분리한다.
- `FeedbackNotice`는 `role="status"`와 `aria-live="polite"`를 유지한다.
- 완료 화면은 학생용 `LearnerTakeaway`를 먼저, 교사용 `details`를 나중에 렌더링한다.

### Update history

- `업데이트 내역`은 center와 모든 mission phase에서 같은 trigger로 열 수 있다.
- dialog는 `role="dialog"`, `aria-modal="true"`, 제목 focus, Escape, trigger focus 복원을 제공한다.
- changelog 날짜는 `YYYY-MM-DD` ISO 문자열이며 개발·콘텐츠·접근성 변경을 짧게 기록한다.

## Responsive layout

| width | rule |
|---|---|
| 320–640px | single column, app inline padding 16px, no horizontal scroll, strategy/details content full width |
| 641–767px | readable single content column; no CTA forced below a fixed footer |
| 768–1279px | mission grid two columns, content max width 56rem, phase controls wrap safely |
| 1280px+ | app shell max width 72rem, readable content column, generous but purposeful whitespace |

첫 추천 CTA는 320×812와 375×812에서 viewport 안에 들어오도록 setup 보조 설명과 카드 간격을 압축한다. 고정 업데이트 trigger는 safe-area inset을 존중하고 학습 CTA와 겹치지 않는다.

## Motion and reduced motion

- `gi-pulse`는 `@keyframes`로 현재 primary action 하나에만 적용한다.
- `prefers-reduced-motion: reduce`에서는 animation/transition/scroll-behavior를 제거하고 signal 3px static outline을 사용한다.
- 단계 전환에서 자동 스크롤은 줄이기 설정에 따라 제거되며, heading focus와 텍스트 상태가 대체 신호다.

## Content tone

- 학생에게는 “무엇을 찾고/고르고/확인할지”를 직접 말한다.
- “전송”, “수신”, “통신” 같은 기술 은유는 보조 label 또는 교사용 문서에만 둔다.
- 오답도 실패 낙인 대신 “어떤 정보가 아직 없나요?”처럼 재시도 가능한 질문으로 표현한다.
- 음성 안내에는 “선택 사항”, “대본으로 가능”, “발음 점수 없음”을 명시한다.

## Verification contract

- 정적: lint, typecheck, Vitest, source-size, privacy, audio, build
- 브라우저: 320/375/768/1280px, learner flow, navigation recovery, update dialog, 200% zoom, reduced motion, console/network
- 키보드: skip link, grade, audio, recommended mission, phase CTA, back, center/restart, update dialog
- 사람 검토: 실제 학생·교사 문구와 터치 체감, 물리 확대, 음원 명료성; VoiceOver는 프로젝트 범위에서 제외
- 자산: 이미지가 추가되지 않으면 `work/education-webapp-redesign-assets.md`에 그렇게 기록하며, 생성 이미지는 사실·텍스트·브랜드를 포함하지 않는다.
