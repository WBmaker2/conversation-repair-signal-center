# Conversation Repair Signal Center — Asset Safety Audit

작성일: 2026-08-29
재감사 갱신: 2026-08-30
대상 브랜치 상태: 리디자인 작업 트리(커밋·푸시·배포 전)
참조 규칙: `/Users/kimhongnyeon/.codex/skills/education-webapp-redesign/references/asset-safety.md`

## 판정 요약

- 새 이미지 자산은 추가하지 않았습니다. 이 앱의 학습 목표는 영어 대화의 모호한 부분을 읽고 수리 전략을 고르는 것이며, 현재 종이색 표면·신호선·텍스트 대화만으로 필요한 정보를 전달합니다.
- `imagegen`은 호출하지 않았습니다(`not run`). 장식 이미지를 넣으면 첫 CTA와 대화 텍스트의 시선을 분산시키므로, 학습상 이득이 확인되기 전에는 추가하지 않습니다.
- 기존 favicon은 브랜드 식별 자산으로 유지합니다. MP3는 학생이 대화와 응답을 듣는 학습 콘텐츠이며 대본·manifest·계약 테스트의 기준이므로 자동 생성·교체하지 않습니다.
- 외부 이미지 URL, raster import, `srcset`, CSS `url()`은 발견되지 않았습니다. 오디오도 `public/audio/**`의 로컬 경로만 사용합니다.

## 자산별 기록

| 원본 | 사용 화면·역할 | 판정 | 새 파일 | 이유 | 접근성 | 상태 | 롤백 |
|---|---|---|---|---|---|---|---|
| `public/favicon.svg` | `index.html` 탭 아이콘·브랜드 식별 | 자동 교체 금지·유지 | 없음 | 로고/브랜드 자산이며 학습 사실을 장식 그림으로 대체하지 않음 | 페이지 콘텐츠를 대신하지 않는 favicon | 확인 완료 | `index.html`의 `./favicon.svg` 참조 유지 |
| `public/audio/g34-classroom-box/dialogue.mp3` | `g34-classroom-box` 관찰 단계 대화 | 자동 교체 금지·유지 | 없음 | 대본과 실제 음원의 정합성이 학습 콘텐츠 기준임 | 음성 off에서 동일 영어 텍스트와 대본 제공 | 확인 완료 | `audio/g34-classroom-box/dialogue.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g34-classroom-box/response.mp3` | `g34-classroom-box` 응답 단계 대화 | 자동 교체 금지·유지 | 없음 | 정답 판정과 연결된 응답 콘텐츠 | 음성 off에서 응답 텍스트 제공 | 확인 완료 | `audio/g34-classroom-box/response.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g34-classroom-pencil/dialogue.mp3` | `g34-classroom-pencil` 관찰 단계 대화 | 자동 교체 금지·유지 | 없음 | 대본·manifest·오디오 계약의 기준 | 음성 off에서 영어 대화 텍스트 제공 | 확인 완료 | `audio/g34-classroom-pencil/dialogue.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g34-classroom-pencil/response.mp3` | `g34-classroom-pencil` 응답 단계 대화 | 자동 교체 금지·유지 | 없음 | 대본과 응답 의미 연결을 보존해야 함 | 음성 off에서 응답 텍스트 제공 | 확인 완료 | `audio/g34-classroom-pencil/response.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g34-recess-place/dialogue.mp3` | `g34-recess-place` 관찰 단계 대화 | 자동 교체 금지·유지 | 없음 | 실제 학습 발화와 대본 일치가 중요함 | 음성 off에서 동일 텍스트 제공 | 확인 완료 | `audio/g34-recess-place/dialogue.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g34-recess-place/response.mp3` | `g34-recess-place` 응답 단계 대화 | 자동 교체 금지·유지 | 없음 | 장소 의미를 전달하는 학습 콘텐츠 | 음성 off에서 응답 텍스트 제공 | 확인 완료 | `audio/g34-recess-place/response.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g34-recess-rephrase/dialogue.mp3` | `g34-recess-rephrase` 관찰 단계 대화 | 자동 교체 금지·유지 | 없음 | 두 화자 발화와 대본의 정확성이 필요함 | 음성 off에서 화자별 텍스트 제공 | 확인 완료 | `audio/g34-recess-rephrase/dialogue.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g34-recess-rephrase/response.mp3` | `g34-recess-rephrase` 응답 단계 대화 | 자동 교체 금지·유지 | 없음 | 전략의 효과를 보여 주는 응답 콘텐츠 | 음성 off에서 응답 텍스트 제공 | 확인 완료 | `audio/g34-recess-rephrase/response.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g34-recess-time/dialogue.mp3` | `g34-recess-time` 관찰 단계 대화 | 자동 교체 금지·유지 | 없음 | 시간 표현을 포함한 학습 발화 | 음성 off에서 영어 텍스트 제공 | 확인 완료 | `audio/g34-recess-time/dialogue.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g34-recess-time/response.mp3` | `g34-recess-time` 응답 단계 대화 | 자동 교체 금지·유지 | 없음 | 시간 의미와 판정을 연결함 | 음성 off에서 응답 텍스트 제공 | 확인 완료 | `audio/g34-recess-time/response.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g56-directions-place/dialogue.mp3` | `g56-directions-place` 관찰 단계 대화 | 자동 교체 금지·유지 | 없음 | 방향·장소 의미를 담은 교육 콘텐츠 | 음성 off에서 영어 텍스트 제공 | 확인 완료 | `audio/g56-directions-place/dialogue.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g56-directions-place/response.mp3` | `g56-directions-place` 응답 단계 대화 | 자동 교체 금지·유지 | 없음 | 장소 설명 응답의 의미 기준 | 음성 off에서 응답 텍스트 제공 | 확인 완료 | `audio/g56-directions-place/response.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g56-directions-sequence/dialogue.mp3` | `g56-directions-sequence` 관찰 단계 대화 | 자동 교체 금지·유지 | 없음 | 순서 표현의 실제 발화와 대본을 보존함 | 음성 off에서 긴 대화 텍스트 제공 | 확인 완료 | `audio/g56-directions-sequence/dialogue.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g56-directions-sequence/response.mp3` | `g56-directions-sequence` 응답 단계 대화 | 자동 교체 금지·유지 | 없음 | 순서 의미 판정의 근거 콘텐츠 | 음성 off에서 응답 텍스트 제공 | 확인 완료 | `audio/g56-directions-sequence/response.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g56-event-decision/dialogue.mp3` | `g56-event-decision` 관찰 단계 대화 | 자동 교체 금지·유지 | 없음 | 여러 선택지와 최종 계획을 담은 교육 콘텐츠 | 음성 off에서 화자·텍스트 제공 | 확인 완료 | `audio/g56-event-decision/dialogue.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g56-event-decision/response.mp3` | `g56-event-decision` 응답 단계 대화 | 자동 교체 금지·유지 | 없음 | 최종 계획 확인 응답의 의미 기준 | 음성 off에서 응답 텍스트 제공 | 확인 완료 | `audio/g56-event-decision/response.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g56-materials-person/dialogue.mp3` | `g56-materials-person` 관찰 단계 대화 | 자동 교체 금지·유지 | 없음 | 사람·물품 관계를 포함한 학습 발화 | 음성 off에서 영어 텍스트 제공 | 확인 완료 | `audio/g56-materials-person/dialogue.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g56-materials-person/response.mp3` | `g56-materials-person` 응답 단계 대화 | 자동 교체 금지·유지 | 없음 | 협력 대화의 추가 응답 콘텐츠 | 음성 off에서 응답 텍스트 제공 | 확인 완료 | `audio/g56-materials-person/response.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g56-materials-quantity/dialogue.mp3` | `g56-materials-quantity` 관찰 단계 대화 | 자동 교체 금지·유지 | 없음 | 수량 표현의 교육 콘텐츠 | 음성 off에서 영어 텍스트 제공 | 확인 완료 | `audio/g56-materials-quantity/dialogue.mp3`로 원래 manifest 참조 복구 |
| `public/audio/g56-materials-quantity/response.mp3` | `g56-materials-quantity` 응답 단계 대화 | 자동 교체 금지·유지 | 없음 | 수량 의미 판정과 연결된 응답 | 음성 off에서 응답 텍스트 제공 | 확인 완료 | `audio/g56-materials-quantity/response.mp3`로 원래 manifest 참조 복구 |

## 검증 결과

- `npm run check:audio`: 20개 로컬 음원이 canonical transcript, MP3/44.1kHz/mono metadata, loudness, duration, edge-silence 기준을 통과했습니다.
- `npm run test:audio-verifier`: 6개 verifier 테스트가 통과했습니다.
- `npm run check:privacy`: 금지 capability 0건이며 외부 URL 오디오가 없습니다.
- production preview 브라우저 로그: 외부 요청 0건, 콘솔 오류 0건.
- 자산 파일은 원본을 덮어쓰지 않았고, 새 이미지·새 import·새 `srcset` 참조가 없습니다.

## 롤백 메모

이번 리디자인에는 자산 파일 변경이 없으므로 자산 롤백은 필요하지 않습니다. UI 변경을 되돌릴 때에도 `public/favicon.svg`와 `public/audio/**`를 보존하고, `src/content/missions/audio-manifest.json` 및 해당 미션의 `audioCues.src`를 현재 로컬 경로로 유지합니다.

## 2026-08-30 지원 Skill 재확인

자산 안전 규칙과 이미지 생성 경계를 다시 확인했습니다.

| 역할 | 상태 | 실제 경로 | 적용 결과 |
|---|---|---|---|
| `$imagegen` | available | `/Users/kimhongnyeon/.codex/skills/.system/imagegen/SKILL.md` | 일반 장식 이미지가 문자 중심 학습 위계를 개선한다는 근거가 없어 호출하지 않음 |
| `$impeccable` | available | `/Users/kimhongnyeon/.agents/skills/impeccable/SKILL.md` | 기존 표면·상태·접근성 변경을 점검하고 새 이미지 필요성을 검토 |
| `$ui-ux-pro-max` | available | `/Users/kimhongnyeon/.codex/skills/ui-ux-pro-max/SKILL.md` | 이미지·외부 폰트보다 semantic HTML·focus·44px·reduced-motion 규칙을 우선 |

이번 후속 보완에서도 새 이미지, 외부 URL, raster import, `srcset`, CSS `url()`은 추가하지 않았습니다. `public/favicon.svg`와 20개 MP3의 원본·경로·대본 계약은 변경하지 않았습니다.
