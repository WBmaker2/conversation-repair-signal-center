# Mission Flow Page Rules

상위 기준: `design-system/MASTER.md`

## Header and progress

- 미션 제목과 상황은 상단에 두고, 학생 행동 heading을 phase content의 첫 heading으로 둔다.
- `PhaseProgress`는 1/4~4/4 숫자와 짧은 행동 라벨을 함께 표시한다.
- 현재 단계 하나만 `aria-current="step"`과 signal 상태를 가진다.
- 이전 단계는 현재 선택·시도·evidence를 보존하는 `phase.back` 계약을 따른다.

## Phase content

| phase | 학생 heading | primary action |
|---|---|---|
| observe | 다시 물어볼 부분 찾기 | 모호한 부분 찾기 |
| repair | 어떻게 다시 물어볼까요? | 이 표현으로 다시 물어보기 |
| response | 상대의 대답 살펴보기 | 이해한 뜻 확인하기 |
| confirm | 내가 이해한 뜻 확인하기 | 확인 질문 보내기 |

한 화면에 primary action은 하나만 pulse하며, 선택 전에는 disabled 상태와 필요한 선택을 설명한다. 오답은 현재 phase에 머물고 한국어 힌트를 보여 준다.

## Audio

- `MissionAudioPlayer`는 동일-origin bundled MP3, 정확한 영문 대본, 재생/일시정지, 0.75×/1×/1.25×를 제공한다.
- 재생 실패는 조용히 무시하지 않고 대본을 읽으라는 `role=status` 문장을 보여 준다.
- voice off 화면은 오디오 컨트롤 없이도 동일한 선택·판정·기록에 도달한다.

## Completion

- `LearnerTakeaway`의 “오늘 배운 점”과 “다음에 해 보기”를 record 최상단에 둔다.
- `TeacherSummary`는 닫힌 `details` 안에 두고 학생용 문장과 섞지 않는다.
- `이 미션 다시 하기`와 `신호센터로 돌아가기`는 순서·스타일로 목적을 구분하며, 완료 후 다음 학습 행동이 먼저 보이게 한다.

## Update history and recovery

- center뿐 아니라 observe/repair/response/confirm/record에서 업데이트 dialog를 열 수 있다.
- dialog를 닫으면 호출한 trigger로 focus를 복원한다.
- 미션 오류·누락 evidence는 학생을 막다른 길에 두지 않고 다시 하기/center return을 제공한다.
