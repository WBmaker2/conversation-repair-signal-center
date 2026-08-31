# Elementary Web App Learner Language Audit

검토일: 2026-08-31
후보 수집 결과: `/Volumes/ External Drive 256G/Dev2/codex/conversation-repair-signal-center/work/elementary-webapp-ux-language-candidates.md`
수집기는 99개 파일의 2,434개 후보를 triage용으로 수집했으며, 아래 장부만 학생 화면의 실제 문맥을 직접 확인해 판정했습니다. 후보 전체 개수는 학년 수준 인증으로 사용하지 않습니다.

## EDU-LANG-001

문제 유형: `technical-or-internal`, 일부 `ambiguous-reference`, 심각도 `P2`

| 표면·상태 | 이전 문구 | 바꾼 문구 | 파일·라인 | 의미와 사실 보존 | 확인 방법 | 상태 |
| --- | --- | --- | --- | --- | --- | --- |
| 완료 heading | `통신 기록` | `학습 기록` | `src/features/record/CommunicationRecord.tsx:145`, `src/app/App.tsx:98` | 학생이 한 활동의 결과라는 뜻만 쉬운 이름으로 변경 | 완료 상태에서 h2 이름 확인, 이전 이름 부재 확인 | confirmed |
| 센터 개인정보 | `새로고침하면 현재 통신 기록이 사라져요.` | `새로고침하면 지금까지의 학습 기록이 사라져요.` | `src/features/center/SignalCenter.tsx:51` | 이름을 묻지 않음·메모리 전용·새로고침 소실 사실 유지 | 센터에서 문장 전체와 저장소 길이 확인 | confirmed |
| null evidence recovery | `통신 기록` / `학습 증거를 찾을 수 없습니다.` | `학습 기록` / `학습 기록이 없어요.` | `src/app/MissionFlow.tsx:138-139` | 학습 증거가 없을 때 다시 시작해야 한다는 행동 유지 | record 단계에서 null evidence 주입 테스트·alert 확인 | confirmed |
| malformed evidence alert | `통신 기록의 학습 증거를 읽을 수 없습니다.` | `학습 기록을 읽을 수 없어요.` | `src/features/record/CommunicationRecord.tsx:72` | 검증 실패를 숨기지 않고 재시작 행동 유지 | malformed evidence 테스트·alert 확인 | confirmed |
| mission mismatch | `이 미션의 통신 기록을 확인할 수 없습니다.` | `이 미션 기록을 확인할 수 없어요.` | `src/features/record/CommunicationRecord.tsx:75` | 미션 ID 불일치와 센터 복귀 행동 유지 | mismatch fixture 테스트 | confirmed |
| attempts/options | `통신 기록의 시도 정보…` / `통신 기록의 선택 근거…` | `시도 기록…` / `이 미션에서 고른 내용…` | `src/features/record/CommunicationRecord.tsx:78,85,89` | 시도·선택 판정과 accepted 조건 유지 | malformed option 테스트 | confirmed |
| missing/meaning/strategy | `통신 기록에 필요한…`, `통신 기록의 불명확한 정보…`, `통신 기록의 수리 전략…` | `필요한 학습 단계…`, `찾은 정보…`, `고른 수리 전략…` | `src/features/record/CommunicationRecord.tsx:96,101,105` | 단계·slot·strategy 검증 의미 유지 | 전체 Vitest validation 경로 | confirmed |
| meaning/feedback/fallback | `통신 기록의 처음 이해…`, `확인된 이해…`, `협력 피드백…`, `통신 기록을 표시…` | `처음 생각한 뜻…`, `확인한 뜻…`, `대화 태도 기록…`, `학습 기록을 표시…` | `src/features/record/CommunicationRecord.tsx:108,112,115,135` | 학습 증거 필드와 복구 버튼 유지 | 전체 Vitest 및 브라우저 완료 상태 | confirmed |

## 문맥 판정

- `대화 관측`, `수리 송신`, `응답 수신`, `확인 통화`는 phase label로서 화면 위치를 알려 주는 보조 라벨입니다. design-system 규칙에 따라 이번 변경 대상인 학생 결과·오류 문장과 구분하여 유지했습니다.
- `교사용 보기`, 교육과정 코드, 활동 증거는 학생에게 기본 노출되지 않고 교사 상세 영역에 있으므로 학습 기록의 사실성과 수업 연결을 위해 유지했습니다.
- 영어 대화 원문과 선택지, 네 전략 ID, accepted 판정은 문구 단순화로 왜곡하지 않았습니다.

## 회귀 테스트 연결

- `src/features/record/CommunicationRecord.test.tsx`: 완료 heading, null evidence recovery, malformed evidence alert.
- `src/app/accessibility.test.tsx`: record heading과 invalid mission fallback heading.
- `src/features/center/SignalCenter.test.tsx`: privacy note.
- `src/features/confirmation/ConfirmationCall.test.tsx`: 완료 전 기술 heading 부재와 완료 후 `학습 기록` 표시.
- `src/content/changelog.test.ts`: 2026-08-31 날짜와 상세 문구.
