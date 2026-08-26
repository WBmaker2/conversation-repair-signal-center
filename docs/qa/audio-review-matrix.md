# 번들 오디오 검수 매트릭스

검수일: 2026-08-26

이 Task에서는 교사·사람 녹음 대신 로컬 macOS `say`의 Samantha 음성으로 exact transcript reference audio를 합성했습니다. 아래 표의 대본·경로·안전·MP3 디코드·44.1 kHz mono 기술 검수는 완료했습니다. 이는 교사·사람의 녹음이나 발음 평가가 아니며, 사람의 명료성·발음·청취 평가는 Task 14에서 수행합니다.

| 미션 | cue | 경로·ID·대본 parity | local safety | media / human review |
|---|---|---|---|---|
| g34-classroom-box | dialogue | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g34-classroom-box | response | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g34-classroom-pencil | dialogue | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g34-classroom-pencil | response | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g34-recess-place | dialogue | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g34-recess-place | response | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g34-recess-time | dialogue | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g34-recess-time | response | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g34-recess-rephrase | dialogue | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g34-recess-rephrase | response | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g56-materials-quantity | dialogue | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g56-materials-quantity | response | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g56-materials-person | dialogue | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g56-materials-person | response | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g56-directions-place | dialogue | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g56-directions-place | response | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g56-directions-sequence | dialogue | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g56-directions-sequence | response | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g56-event-decision | dialogue | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |
| g56-event-decision | response | 검수 완료 | 검수 완료 | 기술 검수 완료 / 사람 청취 Task 14 유보 |

## 합성 도구 사전 점검

`/usr/bin/say`, `/opt/homebrew/bin/ffmpeg`, `/usr/bin/afconvert`, `/usr/bin/file`, `/usr/bin/afinfo`, `/opt/homebrew/bin/ffprobe`가 설치되어 있음을 확인했습니다. 샌드박스에서는 빈 AIFF가 반환되었으나, 비샌드박스 로컬 진단에서 `/usr/bin/say -v Samantha`가 정상적인 AIFF-C PCM을 생성했습니다. 각 transcript를 Samantha로 합성하고, `ffmpeg`의 44.1 kHz mono resample·양방향 앞뒤 silence trim·`loudnorm=I=-16:TP=-1.5:LRA=11`·libmp3lame 128 kbps pipeline으로 변환했습니다.

20개 모두 `file`/`ffprobe`에서 MPEG Layer III, 44.1 kHz, mono, 양수 duration 및 >1KB를 확인했습니다. 자동 silence 진단은 문장 내부 pause를 기록했으며, 앞·뒤 50ms 이상 silence는 남아 있지 않음을 확인했습니다. 자동 지표는 기술 검수일 뿐, 사람의 청취 명료성·발음·자연스러움을 주장하지 않습니다.
