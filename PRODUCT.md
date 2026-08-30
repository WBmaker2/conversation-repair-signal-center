# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

초등학교 3~6학년 영어 학습자입니다. 교실 또는 가정에서 20~30분 동안 짧은 영어 대화를 읽고, 이해되지 않는 부분을 찾아 다시 묻는 연습을 합니다. 교사는 학생의 활동을 옆에서 안내하고 완료 기록을 확인할 수 있습니다.

## Product Purpose

대화가 막힌 순간을 실패가 아니라 대화를 이어 가는 신호로 바꾸는 정적 학습 웹앱입니다. 학생은 불명확한 정보의 종류를 찾고, 네 가지 수리 전략 중 알맞은 표현을 고른 뒤 상대의 추가 답과 자신의 이해를 확인합니다. 음성을 끄고도 같은 학습 목표와 결과에 도달하는 것이 성공 기준입니다.

## Positioning

단어 뜻이나 철자를 외우는 대신 실시간 대화의 불명확함을 다시 묻기·구체적으로 묻기·뜻 확인하기·다르게 말하기로 수리하고, 상대의 응답을 다시 연결하는 상호작용을 연습한다는 점이 핵심입니다.

## Operating Context

학생은 신호센터에서 수준과 선택적 음성을 정한 뒤 미션을 고릅니다. 대표 흐름은 대화 관측 → 수리 표현 선택 → 상대 응답 확인 → 의미 확인 → 통신 기록입니다. 학습은 문자 중심이며 번들 MP3는 선택 보조 자료로만 사용합니다.

## Capabilities and Constraints

- React 19 + Vite + TypeScript 정적 SPA로 동작합니다.
- 3~4학년과 5~6학년 두 수준, 총 10개 미션, 네 가지 수리 전략을 제공합니다.
- 미션에는 대화 원문, 불명확한 슬롯, 허용 전략, 추가 응답, 확인 의미가 연결됩니다.
- 음성 없이 모든 미션을 완료할 수 있으며, 번들 MP3와 정확한 대본을 선택적으로 제공합니다.
- 마이크 녹음, 음성 인식, TTS, 발음·속도 점수, 자유 대화형 AI, 로그인, 서버·클라우드 저장, 광고, 외부 API를 사용하지 않습니다.
- 학생 이름, 자유 메모, 순위, 쿠키, localStorage, sessionStorage를 수집하거나 저장하지 않습니다.
- 네 전략 ID `repeat`, `specify`, `confirm`, `rephrase`와 기존 판정 의미를 보존합니다.

## Brand Commitments

- 서비스명은 `대화 수리 신호센터`입니다.
- 학생에게는 짧고 직접적인 한국어 행동 문장을 사용하고, 실제 선택 표현은 영어로 제공합니다.
- 오답은 실패 낙인 대신 아직 없는 정보와 다시 시도 방법을 안내합니다.
- 라이트 모드와 종이색 표면을 유지하며, 현재 행동에만 signal 색과 `gi-pulse`를 사용합니다.

## Evidence on Hand

- 제품·학습 목표·콘텐츠 범위는 `/Volumes/ External Drive 256G/Dev2/codex/conversation-repair-signal-center/2026-08-26-conversation-repair-signal-center-design.md`에 기록되어 있습니다.
- 구현 범위와 수용 기준은 `/Volumes/ External Drive 256G/Dev2/codex/conversation-repair-signal-center/work/education-webapp-redesign-plan.md`에 기록되어 있습니다.
- 현재 화면 규칙은 `/Volumes/ External Drive 256G/Dev2/codex/conversation-repair-signal-center/design-system/MASTER.md`와 해당 페이지 규칙에 기록되어 있습니다.
- 실제 학생·교사 사용성 승인, 음원 청취 승인, VoiceOver 검증은 이 기록만으로 확인되지 않았습니다.

## Product Principles

1. 모호함을 발견하는 행동을 학습의 시작으로 보여 줍니다.
2. 여러 자연스러운 수리 표현을 상황에 맞게 인정합니다.
3. 음성이나 개인정보 없이도 완전한 학습 경로를 제공합니다.
4. 학생용 행동 안내를 먼저, 교사용 설명을 나중에 보여 줍니다.

## Accessibility & Inclusion

키보드로 전체 흐름을 완료할 수 있어야 하며, 모든 주요 조작은 44px 이상의 터치 영역과 `:focus-visible` 표시를 제공합니다. 단계 상태와 피드백은 텍스트·ARIA·테두리를 함께 사용하고, `prefers-reduced-motion: reduce`에서는 애니메이션 대신 정적 강조를 사용합니다. VoiceOver 구현·검증은 프로젝트 범위에서 제외합니다.
