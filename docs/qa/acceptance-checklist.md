# Task 14 수용 체크리스트

검수 날짜: 2026-08-26
자동화 환경: macOS 26.5.2 (25F84), Apple Silicon, Node v24.13.1, npm 11.12.0, Playwright 1.62.1, Chromium for Testing 151.0.7922.34

이 문서는 실제 Chromium 자동화로 확인한 항목과 사람이 직접 감각적으로 확인해야 하는 항목을 분리합니다. `통과`는 아래에 적은 자동 명령 또는 브라우저 검사가 실제로 성공했다는 뜻이며, VoiceOver 음성 출력과 MP3의 발음·자연스러움 청취를 대신하지 않습니다.

## 자동 검증 결과

실행 명령:

```text
npm ci
npm run lint
npm run typecheck
npm run test:run
npm run check:size
npm run check:audio
npm run check:privacy
npm run test:release-artifacts
npm run build
npm run test:e2e
```

포트 4173이 다른 로컬 앱에서 사용 중인 최종 실행에서는 기본값(4173)을 유지한 채 `PLAYWRIGHT_PORT=4175 npm run verify`로 동일한 production preview gate를 실행했습니다. focused E2E는 `npm run test:e2e -- tests/e2e/learner-flow.spec.ts` (12/12), `npm run test:e2e -- tests/e2e/audio-off-parity.spec.ts` (11/11), `npm run test:e2e -- tests/e2e/accessibility.spec.ts` (9/9), `npm run test:e2e -- tests/e2e/privacy.spec.ts` (1/1)로 확인했습니다.

| 검증 범위 | 결과 | 실제 확인 근거 |
|---|---|---|
| 10개 음성 꺼짐 완료 경로 | 통과 | `tests/e2e/learner-flow.spec.ts`, 10개 테스트가 모두 `통신 기록`과 `의미 확인 완료`에 도달 |
| `g34-classroom-box` best-fit 별도 완료 | 통과 | `tests/e2e/learner-flow.spec.ts`, `Which box?` 경로 완료 |
| `g34-classroom-box` works 별도 완료 | 통과 | `tests/e2e/learner-flow.spec.ts`, `Do you mean the blue box?` 경로 완료 |
| 음성 꺼짐 문자/대본 parity | 통과 | `tests/e2e/audio-off-parity.spec.ts`, 10개 미션의 대화·추가 응답 텍스트와 audio player 부재 확인 |
| 음성 켜짐 20개 manifest parity | 통과 | `tests/e2e/audio-off-parity.spec.ts`, 20 cue의 local `currentSrc`, transcript, media response 확인 |
| 음성 컨트롤·3속도 | 통과 | 20개 각 cue에서 실제 사용자 click 재생·일시정지와 label/paused 상태, native control/autoplay 부재, `0.75×`·`1×`·`1.25×` playbackRate를 확인 |
| 375×812 모바일 전 phase | 통과 | Chromium에서 center/observe/repair/response/confirm/record/update dialog의 `scrollWidth <= clientWidth`, visible control 경계·44px, dialogue-turn containment/2개 이상 pairwise overlap 분기를 확인 |
| 200% 확대 전 phase | 통과 | Chromium에서 `html.style.zoom = 2`, 같은 전 phase geometry와 update dialog x/y 경계, 가로 overflow 0을 확인 |
| desktop 대표 viewport | 통과 | Chromium 1280×900에서 전체 learner path와 update dialog의 가로 overflow·control geometry를 확인 |
| 키보드 전체 학습·dialog | 통과 | `Tab`, `Enter`, `Space`, `Escape`만으로 g34-classroom-box 완료, 센터 복귀, 업데이트 dialog 열기·닫기 및 trigger focus 복원 |
| reduced motion | 통과 | `prefers-reduced-motion: reduce`에서 pulse `animationName: none`, `outlineWidth: 3px`, dialogue transform `none` 확인 |
| 6개 phase axe | 통과 | center/observe/repair/response/confirm/record 각각 `@axe-core/playwright` wcag2a·wcag2aa 실행, serious·critical 0개 |
| DOM 언어·ARIA·교사용 보기 | 통과 | 영어/한국어 `lang`, `main#main-content`, heading, 교육과정·네 성취 증거, score/rank/name 부재 확인 |
| privacy browser gate | 통과 | preview origin 밖 request 0, getUserMedia 호출 0, local/session storage 항목 0 |
| `--color-signal` 대비 회귀 | 통과 | Chromium 계산 luminance로 paper·white 각각 contrast ratio 4.5 이상 확인 |
| source size/privacy/audio/build | 통과 | `check:size`, `check:privacy`, `check:audio`, `build` 종료 코드 0 |
| Playwright 산출물 격리 | 통과 | `test:release-artifacts`와 `git check-ignore -v output/playwright/.last-run.json`에서 `.gitignore` 규칙 확인 |

초기 RED 기록: Task 14 테스트를 만들기 전 `npm run test:e2e`는 Playwright 설정과 testDir가 없어 `Error: No tests found`로 실패했습니다. 첫 fixture를 추가한 뒤에는 production preview/baseURL 설정 전이라 실제 경로를 수집하지 못했고, Node ESM JSON import attribute 오류도 드러났습니다. 이후 `playwright.config.ts`, 표준 JSON import attribute, Vitest의 `tests/e2e/**` 제외를 최소 보완했습니다. 첫 접근성 실행은 200% zoom에서 `scrollWidth = 640`이고 keyboard helper가 화면 전환 전 포커스를 놓쳐 2건이 실패했으며, 모바일 min-inline-size 예외와 실제 phase 포커스 대기를 추가한 뒤 GREEN이 되었습니다.

Fix Round 1 RED 기록: 강화한 geometry E2E 첫 실행은 20개 중 17개 통과·3개 실패였습니다. 대상은 375px/desktop의 화면 밖 skip link를 visible control로 세던 테스트 조건과, 실제 200% CSS zoom에서 update dialog가 `y = -324.8px`로 잘리던 모바일 dialog CSS였습니다. dialog max-height를 보완하고 viewport 교차 control만 검사한 뒤 rebuilt preview에서 accessibility 9/9, audio 11/11이 통과했습니다. duplicate date/category React key 회귀 unit은 수정 전 4개 중 3개 통과·1개 실패로 재현했고 key 안정화 후 4/4가 통과했습니다.

## 사람이 직접 확인해야 하는 항목

아래 항목은 자동화가 대신 통과했다고 기록하지 않습니다. 실제 확인 후 날짜·기기·결과를 이 표의 상태와 확인 메모에 갱신해 주세요.

| 항목 | 상태 | 정확한 확인 절차 |
|---|---|---|
| macOS VoiceOver 읽기 순서·언어 전환 | 사용자 수동 확인 필요 | Chrome preview를 열고 VoiceOver를 켠 뒤 `Tab`으로 서비스명 → 오늘의 전략 → 수준 → 음성 → 미션 순서를 확인합니다. 영어 표현에서 영어 음성 규칙, 한국어 설명에서 한국어 음성 규칙으로 전환되는지 듣고, 미션 네 단계와 업데이트 dialog 제목·닫기 이름도 확인합니다. |
| 20 MP3 발음·명료성·자연스러움 | 사용자 수동 확인 필요 | 음성을 켜고 10개 미션 각각에서 대화/응답 2개씩 총 20개를 1×로 재생합니다. 대본과 실제 발화, 단어·문장 경계, 발음 명료성, 부자연스러운 멈춤을 사람 귀로 기록합니다. 같은 cue에서 일시정지·재생과 `0.75×`·`1×`·`1.25×`를 눌러 듣습니다. 자동 transcript/metadata/playbackRate 검증은 위 자동 결과에 별도로 통과로 기록되어 있습니다. |
| 실제 Chrome 375px 시각·터치 감각 | 사용자 수동 확인 필요 | Chrome 창을 375×812로 맞추고 대화 말풍선이 한 열로 자연스럽게 보이는지, 글자·선택지·버튼이 잘리지 않는지, 손가락으로 모든 조작면을 누르기 쉬운지 확인합니다. 자동 overflow·bounding-box·44px 검사는 위 자동 결과에 별도로 통과로 기록되어 있습니다. |
| 실제 브라우저 200% 시각 확인 | 사용자 수동 확인 필요 | Chrome 페이지 확대를 200%로 설정하고 본문·선택지·업데이트 dialog를 직접 훑어 잘린 글자나 가려진 닫기 버튼이 없는지 확인합니다. 자동 viewport geometry 검사는 위 자동 결과에 별도로 통과로 기록되어 있습니다. |
| macOS 시스템 모션 감소 체감 | 사용자 수동 확인 필요 | 시스템 설정에서 동작 줄이기를 켜고 preview를 새로 연 뒤 중요한 단계 버튼의 고정 3px 테두리와 대화 순서 표식이 보이는지, 깜빡임·이동이 없는지 확인합니다. 자동 `emulateMedia` computed-style 검사는 위 자동 결과에 별도로 통과로 기록되어 있습니다. |

교사용 보기의 교육과정 연결과 네 성취 증거, 학생 식별자·점수·순위 부재는 Chromium 자동 테스트에서 확인했습니다. 실제 수업 맥락에서 문구가 적절한지에 대한 교사 검토가 필요하면 별도 콘텐츠 검수로 남겨 주세요.
