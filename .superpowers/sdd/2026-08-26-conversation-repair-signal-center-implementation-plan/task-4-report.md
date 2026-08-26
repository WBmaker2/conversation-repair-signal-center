# Task 4 보고서: Ten-Mission Content Pack and Review Matrix

## 1. 범위와 기준 커밋

- 작업 기준(base) SHA: `07bbfc2729f36108ca24809522860ac92908d11a`
- 작업 결과(head) SHA: `64159f60400b2aab84e517ef166a12eeae277bbb`
- 커밋: `feat: add ten reviewed conversation repair missions`
- 커밋에는 Task 4 예정 파일 9개만 포함되었습니다.
- 보고서 작성 직전 저장소 상태는 `## feat/conversation-repair-signal-center`로 clean이었으며, 이 보고서 자체는 요청에 따라 커밋하지 않습니다.

## 2. RED 증거

콘텐츠와 저장소 파일을 만들기 전에 아래 명령을 실행했습니다.

```bash
npm run test:run -- src/content/missions/missions.test.ts
```

실패 결과:

```text
Error: Failed to resolve import "../missionRepository" from "src/content/missions/missions.test.ts"
Test Files  0 passed
```

즉, Task 4의 저장소/미션 데이터 부재로 테스트가 시작 단계에서 실패하는 RED 상태를 확인했습니다.

## 3. 생성 파일과 미션 매핑

| 파일 | 내용 |
|---|---|
| `src/content/missions/grade34-classroom.ts` | `g34-classroom-box`, `g34-classroom-pencil` |
| `src/content/missions/grade34-recess.ts` | `g34-recess-place`, `g34-recess-time`, `g34-recess-rephrase` |
| `src/content/missions/grade56-materials.ts` | `g56-materials-quantity`, `g56-materials-person` |
| `src/content/missions/grade56-directions.ts` | `g56-directions-place`, `g56-directions-sequence` |
| `src/content/missions/grade56-events.ts` | `g56-event-decision` |
| `src/content/missions/index.ts` | 위 10개를 계약 순서로 합친 `MISSIONS`, `MISSION_IDS` |
| `src/content/missionRepository.ts` | `getMissionById`, `getMissionsByGradeBand`, 콘텐츠 export |
| `src/content/missions/missions.test.ts` | 팩·원문·선택지·저장소 계약 테스트 |
| `docs/qa/content-review-matrix.md` | 10개 미션의 9개 차원 검수 매트릭스 |

미션 ID 순서는 다음과 같이 고정했습니다.

```text
g34-classroom-box
g34-classroom-pencil
g34-recess-place
g34-recess-time
g34-recess-rephrase
g56-materials-quantity
g56-materials-person
g56-directions-place
g56-directions-sequence
g56-event-decision
```

## 4. 콘텐츠 계약과 테스트 범위

- `validateMissionPack(MISSIONS)`가 valid이며 issues가 빈 배열입니다.
- 학년군은 `3-4: 5`, `5-6: 5`입니다.
- 네 전략 `repeat`, `specify`, `confirm`, `rephrase`가 모두 사용됩니다.
- 10개 미션 모두 수락 수리 표현이 2개이며 첫 표현은 `best-fit`, 두 번째는 `works`입니다.
- 각 미션은 ambiguity 3개, repair 3개, meaning 3개, confirmation 3개로 총 12개 선택지를 가집니다.
- 각 단계의 수락 수는 ambiguity 1개, repair 2개, meaning 1개, confirmation 1개입니다.
- 선택지 ID 120개는 모두 `<mission-id>--...` 규칙을 따르고 전역 중복이 없습니다.
- 모든 `audioCues`는 Task 4 계약대로 빈 배열입니다.
- `g34-recess-time`에는 화면용 문장 `You could not catch this sentence because the bell rang.`와 `종소리 때문에 이 문장 전체를 놓쳤습니다.`를 그대로 저장했습니다.
- `g34-recess-rephrase`의 confirmation 세 선택지는 `rephrase`, 나머지 9개 미션의 confirmation 세 선택지는 `confirm`입니다.
- 테스트는 10개 대화 원문·추가 응답·확인 문장·불명확 조각·의미 라벨·재시도 표현을 계약 표와 순서대로 대조하고, 수락 플래그·전략 ID·자연스러움도 대조합니다. 수락 수리 피드백은 각 미션 리터럴에 계약 문장으로 저장되며 validator가 두 수락 표현의 피드백 중복을 거부합니다.

## 5. 저장소 계약

`src/content/missionRepository.ts`에서 다음을 제공합니다.

```ts
getMissionById(id: string): Mission
getMissionsByGradeBand(gradeBand: GradeBand): readonly Mission[]
MISSIONS
MISSION_IDS
```

존재하지 않는 ID는 `Unknown mission id: <id>` 오류를 던지며, 학년군 조회는 각 5개를 반환합니다.

## 6. 검수일과 10×9 매트릭스 증거

검수표 작성 직전에 실행한 명령과 실제 출력은 다음과 같습니다.

```bash
date +%F
```

```text
2026-08-26
```

`docs/qa/content-review-matrix.md`의 10개 행에는 모두 이 날짜를 기록했습니다. 9개 검수 차원은 다음과 같습니다.

1. 원문 독창성
2. 학년 어휘 난이도
3. 정중함 맥락
4. 슬롯-전략 일치
5. 복수 표현 피드백 차이
6. 정답 비공개 힌트
7. 문화적 고정관념 부재
8. 억양 희화화 부재
9. 오해한 인물 비난 부재

실제 파일을 대상으로 실행한 검사:

```bash
printf 'rows=' && rg -c '^\\| `g(34|56)-' docs/qa/content-review-matrix.md
printf 'statuses=' && rg -o '검수 완료' docs/qa/content-review-matrix.md | wc -l
```

실제 결과:

```text
rows=10
statuses=      90
```

따라서 10×9=90개 상태가 모두 `검수 완료`이며 placeholder는 없습니다.

## 7. 데이터/read-aloud 검수

콘텐츠 UI가 아직 구현되지 않은 Task 4 범위이므로 개발 서버를 실행하지 않았습니다. 대신 `missions.test.ts`의 ordered exact-content assertion에서 `MISSIONS` 순서대로 10개 미션의 영어 대화 원문, 추가 응답, 확인 문장, 한국어 의미 라벨과 재시도 표현을 대조했습니다. 이어서 이 ordered test 범위와 검수표의 10행을 순서대로 읽어 데이터/read-aloud 검수를 수행한 사실을 검수표에 기록했습니다.

개발 서버 미실행은 의도된 범위 판단이며, 음성 파일·콘텐츠 UI 검수는 후속 Task에서 수행합니다.

## 8. 실행 명령과 결과

구현 후 targeted 명령:

```bash
npm run test:run -- src/content/missions/missions.test.ts
```

결과: `Test Files 1 passed`, `Tests 6 passed` (Fix Round 1 전 실제 결과).

추가 targeted/품질 명령:

```bash
npm run typecheck
npm run lint
npm run check:size
git diff --check
```

결과: 모두 exit code 0. `check:size` 결과는 `All source files are under 500 lines.`입니다.

전체 검증 명령:

```bash
npm run verify
```

결과: lint, typecheck, 전체 테스트(`Test Files 4 passed`, `Tests 40 passed`), size, build 모두 통과했습니다. Vite production build도 exit code 0으로 완료되었습니다.

## 9. 파일 줄 수

검증 시점의 실제 줄 수입니다.

```text
75  src/content/missions/grade34-classroom.ts
110 src/content/missions/grade34-recess.ts
75  src/content/missions/grade56-directions.ts
40  src/content/missions/grade56-events.ts
75  src/content/missions/grade56-materials.ts
27  src/content/missions/index.ts
174 src/content/missions/missions.test.ts
14  src/content/missionRepository.ts
20  docs/qa/content-review-matrix.md
```

총 610줄이며 9개 파일 모두 500줄 미만입니다.

## 10. Task 4 체크박스 자체 검토

- [x] Step 1: 정확한 팩 계약을 요구하는 실패 테스트 작성 — ID 순서, validator, 학년군, 전략, 다중 수락 표현 assertion을 작성했습니다.
- [x] Step 2: 콘텐츠 부재 RED 확인 — `missionRepository` import 부재 오류를 실제 확인했습니다.
- [x] Step 3: 3~4학년 5개 구현 — 교실 2개와 놀이 약속 3개를 리터럴로 구현했습니다.
- [x] Step 4: 5~6학년 5개 구현 — 준비물 2개, 길 안내 2개, 행사 1개를 리터럴로 구현했습니다.
- [x] Step 5: 저장소 조회 함수와 검수표 구현 — 두 조회 함수, 명시적 ID export, 10×9 매트릭스를 구현했습니다.
- [x] Step 6: 콘텐츠 자동 검증 — Fix Round 1 전 targeted 6 tests, 이후 canonical fixture 추가 후 targeted 7 tests, typecheck, lint, size, full verify를 통과했습니다.
- [x] Step 7: 데이터/read-aloud 검수 — UI 부재를 명시하고 ordered test/report output으로 검수했으며 개발 서버는 실행하지 않았습니다.
- [x] Step 8: 콘텐츠 팩 커밋 — 지정된 9개 파일만 exact commit message로 커밋했습니다.

## 11. 커밋과 concerns

최종 커밋 SHA는 `64159f60400b2aab84e517ef166a12eeae277bbb`입니다. 커밋 후 `git status --short --branch`는 clean이었습니다.

현재 concerns는 Task 4 범위의 의도된 경계뿐입니다. 콘텐츠 UI와 실제 음원은 아직 없으므로 브라우저 화면·실제 음성 재생 검수는 수행하지 않았고, `audioCues: []`는 후속 오디오 Task를 위해 유지했습니다. 외부 서비스, 패키지 설치, push, deploy, subagent 호출은 하지 않았습니다.

## 12. Fix Round 1 (canonical exact contract and truthful review evidence)

### 변경 사항

- 독립 literal fixture를 추가했습니다.
  - `src/content/missions/contract-fixtures/grade34-classroom.ts`
  - `src/content/missions/contract-fixtures/grade34-recess.ts`
  - `src/content/missions/contract-fixtures/grade56-materials.ts`
  - `src/content/missions/contract-fixtures/grade56-directions.ts`
  - `src/content/missions/contract-fixtures/grade56-events.ts`
- `missions.test.ts`가 위 fixture를 production object와 `toEqual`로 deep-equal 비교합니다. fixture는 production export를 import/re-export하지 않으며, 10개 미션의 모든 헤더 필드, dialogue/clarifyingResponse, 120개 옵션의 exact ID·문구·label·accepted·slotKind·turnId·feedback·strategy·naturalness·mode, curriculum·learningTargets·politenessContext·audioCues를 독립 리터럴로 보유합니다.
- 검수표는 콘텐츠 데이터 검수만 완료로 남기고, UI 렌더링·번들 음원 재생/발음·사람의 소리 내어 읽기/청각 검수를 각각 Task 11/11/14로 이월했습니다. 기존 10×9=90개 `검수 완료` 상태와 `2026-08-26` 검수일은 유지했습니다.

### 실제 재검증 결과

Fix Round 1 전 원 보고서의 `targeted 7 tests` 표기는 부정확했습니다. 당시 실제 테스트 파일은 6개 테스트였고, 이를 이 보고서에서 명시적으로 정정합니다. 독립 canonical fixture 테스트를 추가한 현재 targeted 결과는 다음과 같습니다.

```bash
npm run test:run -- src/content/missions/missions.test.ts
```

결과: `Test Files 1 passed`, `Tests 7 passed`.

추가로 다음을 실행했고 모두 exit code 0입니다.

```bash
npm run typecheck
npm run lint
npm run check:size
npm run verify
git diff --check
```

현재 full verify 결과는 `Test Files 4 passed`, `Tests 41 passed`입니다. `check:size`는 fixture 5개를 포함해 모든 소스/테스트 파일이 500줄 미만임을 보고했습니다. 현재 matrix 직접 검사는 `rows=10`, `statuses=90`입니다.

### Fix Round 1 커밋

Fix Round 1 구현 변경을 담은 새 task-scoped 커밋 SHA는 커밋 후 이 절에 기록합니다. 보고서 evidence 후속 기록 커밋은 구현 커밋을 변경하지 않습니다.
