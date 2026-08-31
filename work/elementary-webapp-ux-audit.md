# Elementary Web App UX Audit — Conversation Repair Signal Center

검토일: 2026-08-31
실행 모드: `full`
대상: `/Volumes/ External Drive 256G/Dev2/codex/conversation-repair-signal-center`
주 기준: `/Volumes/ External Drive 256G/Dev2/codex/conversation-repair-signal-center/2026-08-26-conversation-repair-signal-center-design.md`
오케스트레이터: `elementary-webapp-ux-orchestrator`

## 검토 범위와 학습 계약

- 주 페르소나: 초등 3~4학년 준호. 보조 페르소나: 초등 5~6학년 서윤.
- 학습 목표: 불명확한 정보 찾기, 네 가지 수리 전략 중 알맞은 표현 고르기, 상대 답의 뜻 찾기, 내 이해를 확인하는 문장 고르기.
- 핵심 흐름: `center → observe → repair → response → confirm → record`.
- 기존 앱과의 차별성: 점수 경쟁·자유 입력·AI 판정이 아니라 결정적인 대화 상황에서 다시 묻기와 확인하기의 근거를 단계적으로 고르게 합니다.
- 보존한 계약: 10개 미션, 네 전략 ID(`repeat`, `specify`, `confirm`, `rephrase`), `Mission`·`MissionEvidence`·`MissionSessionAction`·`EvaluationResult` 타입, accepted 판정, 메모리 전용 세션, 선택형 로컬 MP3.
- 범위 제외: 마이크, 녹음, 음성 인식, TTS, 로그인, 외부 API, 분석 쿠키, `localStorage`, `sessionStorage`, VoiceOver 구현·검증.

## Stage 0와 기존 규칙

`work/elementary-webapp-ux-bootstrap.md`의 preflight 결과는 `Overall status: ready`입니다. Python 3, Node.js, npm, npx, 기존 `node_modules`, Playwright 브라우저 도구, Impeccable, frontend/implementation 도구, imagegen이 확인되었습니다. 선택형 시뮬레이션 전문가는 missing-optional이지만 이 앱은 시뮬레이션이 아니므로 차단 사유가 아닙니다.

프로젝트에 `AGENTS.md`와 `EDUCATION_DESIGN.md`는 없었습니다. 대신 `PRODUCT.md`, `design-system/MASTER.md`, 기존 설계 문서와 구현 계획을 적용했습니다. `design-system/MASTER.md`의 학생 본문 용어 규칙에 따라 `통신`은 보조 phase label에만 남기고 학생 결과·오류·개인정보 문장에서는 제거했습니다.

## 기준선 관찰

| 관찰 | 근거 | 상태 |
| --- | --- | --- |
| 앱 진입 | `http://127.0.0.1:5173/`, 제목 `대화 수리 신호센터` | 확인 |
| 375px 전체 흐름 | `g34-classroom-box`: ambiguity 오답→정답, repair 정답, response 오답→정답, confirmation 오답→정답, 완료 | 확인 |
| 기준선 이슈 | 완료 제목·개인정보·복구 화면에 `통신 기록`이 노출됨 | `EDU-LANG-001` P2 |
| 320/375/768/1280px | 문서 가로 넘침 없음. 추천/다시 하기 버튼 높이 44px 이상 | 확인 |
| 업데이트 내역 | 375px dialog가 열리고 날짜 목록이 스크롤되며 Escape 뒤 `업데이트 내역` 버튼으로 focus 복원 | 확인 |
| 키보드 | 첫 Tab이 `본문으로 건너뛰기` 링크에 보이는 focus를 둠 | 확인 |
| 모션 대체 | 기본 `.gi-pulse`는 `gi-pulse` 1.6s, reduced motion은 `animationName: none`, 버튼 높이 44px 이상 | 확인 |
| 콘솔/요청/저장소 | 콘솔 error 0·warning 0, 정적 요청 54건 모두 로컬 200, local/session storage 길이 0 | 확인 |
| CLI Playwright | macOS Chrome daemon의 `SIGABRT`/`bootstrap_check_in Permission denied (1100)` | blocked; Codex Playwright로 대체 확인 |

## 학생 패널 관찰 프로브

패널 형식의 실제 아동 인터뷰는 실행하지 않았습니다. 대신 준호 관점으로 다음 행동을 브라우저에서 관찰했습니다.

| 프로브 | 관찰 결과 | 상태 |
| --- | --- | --- |
| 첫 화면에서 무엇을 배우는지 | `못 알아들은 순간은 대화를 이어 가는 신호예요.`와 `오늘의 첫 행동`이 먼저 보임 | 확인 |
| 다음 버튼 결과 예측 | 추천 미션 시작→1/4 `다시 물어볼 부분 찾기`, 각 선택 후 다음 단계로 이동 | 확인 |
| 오답 뒤 회복 | 세 오답에서 역할에 맞는 안내가 나타나고 같은 단계에서 정답을 다시 고를 수 있음 | 확인 |
| 완료 기록 의미 | 제목이 `학습 기록`, `찾은 정보·고른 방법·처음 생각한 뜻·확인한 뜻`으로 표시됨 | 확인 |
| 개인정보 문장 이해 | `지금까지의 학습 기록`이 새로고침 때 사라진다고 직접 표시됨 | 확인 |
| 교사용 세부 | `교사용 보기` 안의 교육과정·활동 증거는 보존됨 | 확인 |

## P0–P3 장부

| ID | 심각도 | 문제 | 조치 | 상태 |
| --- | --- | --- | --- | --- |
| EDU-LANG-001 | P2 | 학생 화면에서 내부 기술어 `통신 기록`이 결과·개인정보·복구 안내에 노출 | `학습 기록`, `이 미션 기록`, `시도 기록`, `고른 내용`으로 문구 교체 및 회귀 테스트 추가 | 해결 |
| EDU-UX-002 | P3 | 실제 학생·교사 이해도와 물리 기기 입력 감각은 브라우저 자동 검증만으로 확정할 수 없음 | 교실에서 준호/서윤 프로브와 터치·Safari 검토를 별도 수행 | 사람 검토 대기 |

P0 0개, 해결되지 않은 P1 0개입니다. P2 `EDU-LANG-001`은 이번 사이클에서 해결되었고, P3는 실제 사용성 승인 범위의 후속 검토입니다.

## 이번 사이클 결과

- 학생 결과 제목과 invalid/null evidence fallback 제목을 `학습 기록`으로 통일했습니다.
- 오류 문장을 학생이 바로 행동으로 옮길 수 있게 바꿨습니다. 재시작·센터 복귀 버튼과 evidence 판정은 그대로입니다.
- 센터 개인정보 안내를 `지금까지의 학습 기록`으로 구체화했습니다.
- 2026-08-31 업데이트 내역을 추가했습니다.
- 변경 파일은 500줄 제한을 지켰고, Impeccable detector 결과는 `[]`입니다.

## 수용 상태

자동·브라우저 증거 기준 점수는 84/100입니다. 학습 목표 12/15, 언어 14/20(정적 문구 검토는 완료했지만 실제 아동 재진술은 미실행), 구조 11/12, 피드백 11/13, 시각 10/10, 키보드 9/10, 반응형 8/10, 런타임 5/5, 자산 안전 4/5로 계산했습니다. 실제 아동·교사 재진술과 Safari/물리 터치 확인은 실행하지 않았으므로 전체 acceptance gate는 `conditional`이며 릴리스 통과로 보고하지 않습니다.
