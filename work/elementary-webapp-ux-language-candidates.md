# Learner Text Inventory

- Root: `/Volumes/ External Drive 256G/Dev2/codex/conversation-repair-signal-center`
- Files scanned: `99`
- Candidates: `2434`
- Status: `triage only`; not a grade-level certification or automatic rewrite.

## Candidate strings

| Source | Surface | Text | Role hints | Review signals |
| --- | --- | --- | --- | --- |
| index.html:9:12 | text | 대화 수리 신호센터 | learner-text-candidate | repeated-text |
| scripts/check-source-lines.mjs:33:26 | text | ENOENT | feedback-or-error | technical-or-internal |
| scripts/check-source-lines.mjs:41:20 | text | ${file.path}: ${file.lines} lines | feedback-or-error | — |
| scripts/verify-audio-assets.mjs:19:20 | text | ${name} is required; set ${envName} to an executable absolute path or install ${name} | feedback-or-error | long-or-dense |
| scripts/verify-audio-assets.mjs:29:45 | text | ${cueId}: ffmpeg ebur128 failed | feedback-or-error | technical-or-internal |
| scripts/verify-audio-assets.mjs:32:54 | text | ${cueId}: missing finite integrated loudness | feedback-or-error | technical-or-internal |
| scripts/verify-audio-assets.mjs:33:66 | text | ${cueId}: integrated loudness ${integrated} LUFS outside -18.5..-14.5 LUFS | feedback-or-error | long-or-dense, technical-or-internal |
| scripts/verify-audio-assets.mjs:39:45 | text | ${cueId}: ffmpeg silencedetect failed | feedback-or-error | technical-or-internal |
| scripts/verify-audio-assets.mjs:41:95 | text | Number(match[1])); if (starts[0] !== undefined && starts[0] | feedback-or-error | long-or-dense, technical-or-internal |
| scripts/verify-audio-assets.mjs:42:94 | text | ${cueId}: leading silence ${(ends[0] ?? 0).toFixed(3)}s exceeds 0.3s | feedback-or-error | long-or-dense, technical-or-internal |
| scripts/verify-audio-assets.mjs:45:113 | text | 0.3) throw new Error(`${cueId}: trailing silence ${(duration - lastStart).toFixed(3)}s exceeds 0.3s`); } export async function runVerification({ manifestPath = process.env.AUDIO_MANIFEST_PATH ?? defaultManifestPath, contractPath = process.env.AUDIO_CONTRACT_PATH ?? defaultContractPath, publicRoot = process.env.AUDIO_PUBLIC_ROOT ?? defaultPublicRoot, ffprobe = resolveTool('ffprobe', 'AUDIO_FFPROBE', ['/opt/homebrew/bin/ffprobe', '/usr/local/bin/ffprobe', 'ffprobe']), ffmpeg = resolveTool('ffmpeg', 'AUDIO_FFMPEG', ['/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg', 'ffmpeg']), } = {}) { const issues = []; let manifest; let contract; try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); contract = JSON.parse(await readFile(contractPath, 'utf8')); } catch (error) { throw new Error(`Cannot read manifest/independent contract: ${error.message}`, { cause: error }); } const missionIds = Object.keys(manifest); if (JSON.stringify(missionIds) !== JSON.stringify(expectedMissionIds)) issues.push(`mission order must be ${expectedMissionIds.join(', ')}`); if (JSON.stringify(manifest) !== JSON.stringify(contract)) issues.push('production manifest differs from independent canonical audio contract'); const allCues = []; const ids = new Set(); const srcs = new Set(); for (const missionId of expectedMissionIds) { const cues = manifest[missionId]; if (!Array.isArray(cues) \|\| cues.length !== 2) { issues.push(`${missionId}: exactly dialogue and response cues are required`); continue; } for (const [index, cue] of cues.entries()) { const role = index === 0 ? 'dialogue' : 'response'; const expectedId = `${missionId}-${role}`; const expectedSrc = `audio/${missionId}/${role}.mp3`; if (cue.id !== expectedId) issues.push(`${missionId}: expected cue id ${expectedId}, got ${String(cue.id)}`); if (cue.src !== expectedSrc) issues.push(`${missionId}: expected cue src ${expectedSrc}, got ${String(cue.src)}`); if (cue.mimeType !== 'audio/mpeg') issues.push(`${cue.id}: mimeType must be audio/mpeg`); if (typeof cue.transcriptEn !== 'string' \|\| cue.transcriptEn.trim() === '') issues.push(`${cue.id}: transcriptEn must be nonblank`); if (typeof cue.src !== 'string' \|\| !cue.src.startsWith('audio/') \|\| cue.src.includes('\\') \|\| cue.src.includes('..') \|\| /^[a-z][a-z\d+.-]*:/i.test(cue.src)) issues.push(`${cue.id}: unsafe local source ${String(cue.src)}`); if (ids.has(cue.id)) issues.push(`${cue.id}: duplicate cue id`); if (srcs.has(cue.src)) issues.push(`${cue.id}: duplicate cue src`); ids.add(cue.id); srcs.add(cue.src); allCues.push(cue); } } if (allCues.length !== 20) issues.push(`expected 20 cues, got ${allCues.length}`); if (issues.length) throw new Error(issues.join(' ')); const audioRoot = path.resolve(publicRoot, 'audio'); const measurements = []; for (const cue of allCues) { const filePath = path.resolve(publicRoot, cue.src); if (!filePath.startsWith(`${audioRoot}${path.sep}`)) { issues.push(`${cue.id}: path escapes public/audio`); continue; } try { await access(filePath); const bytes = await readFile(filePath); const isId3 = bytes.subarray(0, 3).toString('ascii') === 'ID3'; const isMpeg = bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0; if (bytes.length | feedback-or-error | long-or-dense, technical-or-internal |
| scripts/verify-audio-assets.mjs:45:136 | text | ${cueId}: trailing silence ${(duration - lastStart).toFixed(3)}s exceeds 0.3s | feedback-or-error | long-or-dense, technical-or-internal |
| scripts/verify-audio-assets.mjs:62:22 | text | Cannot read manifest/independent contract: ${error.message} | feedback-or-error | long-or-dense |
| scripts/verify-audio-assets.mjs:107:87 | text | 1KB`); if (!isId3 && !isMpeg) issues.push(`${cue.id}: missing ID3/MPEG magic`); const probe = run(ffprobe, ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_name,sample_rate,channels:format=duration', '-of', 'json', filePath]); if (probe.status !== 0) { issues.push(`${cue.id}: ffprobe decode failed`); continue; } const parsed = JSON.parse(probe.stdout); const stream = parsed.streams?.[0]; const duration = Number(parsed.format?.duration); if (stream?.codec_name !== 'mp3' \|\| Number(stream?.sample_rate) !== 44100 \|\| Number(stream?.channels) !== 1) issues.push(`${cue.id}: metadata must be mp3/44100Hz/mono, got ${JSON.stringify(stream)}`); if (!Number.isFinite(duration) \|\| duration | feedback-or-error | long-or-dense, technical-or-internal |
| scripts/verify-audio-assets.mjs:109:36 | text | -v | feedback-or-error | — |
| scripts/verify-audio-assets.mjs:109:42 | text | error | feedback-or-error | repeated-text |
| scripts/verify-audio-assets.mjs:109:51 | text | -select_streams | feedback-or-error | — |
| scripts/verify-audio-assets.mjs:109:70 | text | a:0 | feedback-or-error | — |
| scripts/verify-audio-assets.mjs:109:77 | text | -show_entries | feedback-or-error | — |
| scripts/verify-audio-assets.mjs:109:94 | text | stream=codec_name,sample_rate,channels:format=duration | feedback-or-error | long-or-dense |
| scripts/verify-audio-assets.mjs:109:152 | text | -of | feedback-or-error | — |
| scripts/verify-audio-assets.mjs:109:159 | text | json | feedback-or-error | missing-term-explanation, technical-or-internal |
| scripts/verify-audio-assets.mjs:123:20 | text | ${cue.id}: ${error.message} | feedback-or-error | technical-or-internal |
| scripts/verify-audio-assets.test.mjs:25:46 | text | ${error.stdout ?? ''} ${error.stderr ?? ''} | feedback-or-error | — |
| scripts/verify-audio-assets.test.mjs:95:35 | text | -y | feedback-or-error | — |
| scripts/verify-audio-assets.test.mjs:95:41 | text | -hide_banner | feedback-or-error | missing-term-explanation, technical-or-internal |
| scripts/verify-audio-assets.test.mjs:95:57 | text | -loglevel | feedback-or-error | — |
| scripts/verify-audio-assets.test.mjs:95:70 | text | error | feedback-or-error | repeated-text |
| scripts/verify-audio-assets.test.mjs:95:79 | text | -i | feedback-or-error | — |
| scripts/verify-audio-assets.test.mjs:95:95 | text | -ar | feedback-or-error | — |
| scripts/verify-audio-assets.test.mjs:95:111 | text | -ac | feedback-or-error | — |
| scripts/verify-audio-assets.test.mjs:95:123 | text | -codec:a | feedback-or-error | — |
| scripts/verify-audio-assets.test.mjs:95:135 | text | libmp3lame | feedback-or-error | — |
| scripts/verify-audio-assets.test.mjs:95:149 | text | -b:a | feedback-or-error | — |
| scripts/verify-audio-assets.test.mjs:95:157 | text | 128k | feedback-or-error | — |
| src/app/App.smoke.test.tsx:6:28 | text | heading | heading | repeated-text |
| src/app/App.smoke.test.tsx:6:47 | text | 대화 수리 신호센터 | heading | repeated-text |
| src/app/App.smoke.test.tsx:7:28 | text | 못 알아들은 순간은 대화를 이어 가는 신호예요. | learner-text-candidate | repeated-text |
| src/app/App.tsx:12:56 | text | ('3-4'); const [voiceEnabled, setVoiceEnabled] = useState(false); const [updatesOpen, setUpdatesOpen] = useState(false); const updateTriggerRef = useRef | learner-text-candidate | long-or-dense, technical-or-internal |
| src/app/App.tsx:26:32 | text | service-heading | heading | — |
| src/app/App.tsx:69:53 | text | 본문으로 건너뛰기 | learner-text-candidate | repeated-text |
| src/app/App.tsx:89:18 | text | { document.getElementById('invalid-mission-heading')?.focus(); }, []); return ( | heading | long-or-dense, technical-or-internal |
| src/app/App.tsx:90:30 | text | invalid-mission-heading | heading | missing-term-explanation, technical-or-internal |
| src/app/App.tsx:95:53 | text | 본문으로 건너뛰기 | learner-text-candidate | repeated-text |
| src/app/App.tsx:97:56 | text | 대화 수리 신호센터 | heading | repeated-text |
| src/app/App.tsx:98:47 | text | 통신 기록 | heading | repeated-text |
| src/app/App.tsx:99:12 | text | 이 미션을 찾을 수 없어요. 신호센터에서 다른 미션을 골라 주세요. | learner-text-candidate | — |
| src/app/App.tsx:100:56 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| src/app/MissionFlow.tsx:25:30 | text | ${session.phase}-heading | heading | — |
| src/app/MissionFlow.tsx:75:53 | text | 본문으로 건너뛰기 | learner-text-candidate | repeated-text |
| src/app/MissionFlow.tsx:79:32 | text | 대화 수리 미션 | learner-text-candidate | — |
| src/app/MissionFlow.tsx:89:59 | aria-label | 미션 조작 | aria-label | — |
| src/app/MissionFlow.tsx:90:68 | text | center.returned | button-or-action | repeated-text |
| src/app/MissionFlow.tsx:90:89 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| src/app/MissionFlow.tsx:91:68 | text | mission.restarted | button-or-action | repeated-text |
| src/app/MissionFlow.tsx:91:91 | text | 이 미션 다시 하기 | button-or-action | repeated-text |
| src/app/MissionFlow.tsx:137:35 | text | record-heading | heading | repeated-text |
| src/app/MissionFlow.tsx:138:49 | text | 통신 기록 | heading | repeated-text |
| src/app/MissionFlow.tsx:139:27 | text | 학습 증거를 찾을 수 없습니다. 이 미션을 다시 시작해 주세요. | learner-text-candidate | — |
| src/app/MissionFlow.tsx:141:68 | text | mission.restarted | button-or-action | repeated-text |
| src/app/MissionFlow.tsx:141:91 | text | 이 미션 다시 하기 | button-or-action | repeated-text |
| src/app/MissionFlow.tsx:142:68 | text | center.returned | button-or-action | repeated-text |
| src/app/MissionFlow.tsx:142:89 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:18:43 | text | = { center: '오늘의 전략', observe: '다시 물어볼 부분 찾기', repair: '어떻게 다시 물어볼까요?', response: '상대의 대답 살펴보기', confirm: '내가 이해한 뜻 확인하기', record: '통신 기록', }; function renderAppAtPhase(phase: Phase) { if (phase === 'center') return render( | heading | long-or-dense, multiple-actions |
| src/app/accessibility.test.tsx:19:12 | text | 오늘의 전략 | learner-text-candidate | repeated-text |
| src/app/accessibility.test.tsx:20:13 | text | 다시 물어볼 부분 찾기 | learner-text-candidate | repeated-text |
| src/app/accessibility.test.tsx:21:12 | text | 어떻게 다시 물어볼까요? | learner-text-candidate | repeated-text |
| src/app/accessibility.test.tsx:22:14 | text | 상대의 대답 살펴보기 | learner-text-candidate | repeated-text |
| src/app/accessibility.test.tsx:23:13 | text | 내가 이해한 뜻 확인하기 | learner-text-candidate | repeated-text |
| src/app/accessibility.test.tsx:24:12 | text | 통신 기록 | learner-text-candidate | repeated-text |
| src/app/accessibility.test.tsx:36:28 | text | heading | heading | repeated-text |
| src/app/accessibility.test.tsx:37:68 | text | node.id); expect(new Set(ids).size).toBe(ids.length); for (const labelled of container.querySelectorAll | learner-text-candidate | long-or-dense, technical-or-internal |
| src/app/accessibility.test.tsx:39:67 | text | [aria-labelledby] | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/app/accessibility.test.tsx:40:45 | text | aria-labelledby | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| src/app/accessibility.test.tsx:58:63 | text | heading | heading | repeated-text |
| src/app/accessibility.test.tsx:58:82 | text | 대화 수리 신호센터 | heading | repeated-text |
| src/app/accessibility.test.tsx:60:46 | text | 본문으로 건너뛰기 | learner-text-candidate | repeated-text |
| src/app/accessibility.test.tsx:67:62 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:67:80 | text | 5~6학년 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:69:45 | text | heading | heading | repeated-text |
| src/app/accessibility.test.tsx:69:64 | text | 미션 선택 | heading | repeated-text |
| src/app/accessibility.test.tsx:69:83 | text | section | heading | — |
| src/app/accessibility.test.tsx:70:49 | text | h3 | heading | — |
| src/app/accessibility.test.tsx:71:62 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:71:80 | text | 5~6학년 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:75:7 | text | uses all choice groups, labels, live status, details, and language metadata | learner-text-candidate | long-or-dense |
| src/app/accessibility.test.tsx:80:41 | text | .choice-label | learner-text-candidate | — |
| src/app/accessibility.test.tsx:89:7 | text | focuses headings only on phase changes and retains same-phase control focus | heading | long-or-dense |
| src/app/accessibility.test.tsx:89:96 | text | { const user = userEvent.setup(); render( | heading | repeated-text |
| src/app/accessibility.test.tsx:93:40 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:93:58 | text | ${mission.titleKo} 미션 시작 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:94:30 | text | heading | heading | repeated-text |
| src/app/accessibility.test.tsx:94:49 | text | 다시 물어볼 부분 찾기 | heading | repeated-text |
| src/app/accessibility.test.tsx:98:40 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:98:58 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:99:30 | text | heading | heading | repeated-text |
| src/app/accessibility.test.tsx:99:49 | text | 다시 물어볼 부분 찾기 | heading | repeated-text |
| src/app/accessibility.test.tsx:100:30 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:100:48 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:102:40 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:102:58 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:103:30 | text | heading | heading | repeated-text |
| src/app/accessibility.test.tsx:103:49 | text | 어떻게 다시 물어볼까요? | heading | repeated-text |
| src/app/accessibility.test.tsx:106:7 | text | completes a canonical mission and focuses service heading after center return | heading | long-or-dense |
| src/app/accessibility.test.tsx:106:98 | text | { const user = userEvent.setup(); render( | heading | repeated-text |
| src/app/accessibility.test.tsx:110:40 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:110:58 | text | ${mission.titleKo} 미션 시작 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:112:40 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:112:58 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:114:40 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:114:58 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:115:57 | text | 창가에 있는 파란 상자 | learner-text-candidate | repeated-text |
| src/app/accessibility.test.tsx:116:40 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:116:58 | text | 이해한 뜻 확인하기 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:119:40 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:119:58 | text | 확인 질문 보내기 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:120:40 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:120:58 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:121:30 | text | heading | heading | repeated-text |
| src/app/accessibility.test.tsx:121:49 | text | 대화 수리 신호센터 | heading | repeated-text |
| src/app/accessibility.test.tsx:122:32 | text | heading | heading | repeated-text |
| src/app/accessibility.test.tsx:122:51 | text | 통신 기록 | heading | repeated-text |
| src/app/accessibility.test.tsx:127:30 | text | heading | heading | repeated-text |
| src/app/accessibility.test.tsx:127:49 | text | 대화 수리 신호센터 | heading | repeated-text |
| src/app/accessibility.test.tsx:128:49 | text | 본문으로 건너뛰기 | learner-text-candidate | repeated-text |
| src/app/accessibility.test.tsx:130:30 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:130:48 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:133:71 | text | { expect(layoutCss).toContain('@media (max-width: 640px)'); expect(layoutCss).toContain('grid-template-columns: 1fr'); expect(baseCss).toContain('min-block-size: 44px'); expect(baseCss).not.toMatch(/(?:^\|\s)(?:min-)?height\s*:/m); expect(baseCss).toContain('outline: 3px solid'); expect(motionCss).toContain('.gi-pulse:not(:disabled)'); expect(motionCss).toContain('animation: none'); expect(motionCss).toContain('transition-duration: 0.01ms'); expect(motionCss).toContain('scroll-behavior: auto'); expect(motionCss).toContain('outline: 3px solid var(--color-signal)'); expect(motionCss).toContain('border-inline-start: 4px solid var(--color-signal)'); expect(componentsCss).toContain('[data-feedback-state="empty"]'); expect(componentsCss).toContain('max-block-size: min(70dvh, calc(100dvh - 2rem))'); expect(componentsCss).toContain('.update-history-dialog'); expect(componentsCss).toContain('overflow: auto'); render( | feedback-or-error | long-or-dense, technical-or-internal |
| src/app/accessibility.test.tsx:145:38 | text | [data-feedback-state="empty"] | feedback-or-error | technical-or-internal |
| src/app/accessibility.test.tsx:150:61 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:150:79 | text | 3~4학년 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:157:45 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:157:63 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:163:30 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:163:48 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:163:76 | text | gi-pulse | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:165:40 | text | button | button-or-action | repeated-text |
| src/app/accessibility.test.tsx:165:58 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/content/changelog.test.ts:14:20 | text | 접근성 | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:15:20 | text | 업데이트 기록 영역을 넓히고, 빈 미션·전략 요약·학생용 결과 문구를 보완했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:19:20 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:20:20 | text | 첫 추천 미션과 단계별 학습 행동을 앞세우고, 완료 화면의 다음 행동을 분명하게 정리했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:24:20 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:25:20 | text | 추천 미션과 단계 진행 표시를 앞세우고, 학생용 문구·오디오 오류 안내·확대 대화상자를 개선했습니다. | feedback-or-error, instruction | long-or-dense, repeated-text |
| src/content/changelog.test.ts:27:40 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:27:56 | text | 공개 Pages 배포와 브라우저 탭 아이콘을 추가했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:28:40 | text | 접근성 | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:28:57 | text | 화면과 음성 대본을 일치시키고 음성 선택 영역을 44px 이상으로 넓혔습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:29:40 | text | 접근성 | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:29:57 | text | 375px 모바일과 200% 확대에서 본문·업데이트 대화상자의 가로·세로 잘림을 막았습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:30:40 | text | 접근성 | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:30:57 | text | 업데이트 대화상자 키보드 초점 범위와 개인정보 안전 검사를 강화했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:31:40 | text | 접근성 | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:31:57 | text | 키보드, 375px 모바일, 200% 확대, 스크린 리더용 언어 표기와 모션 감소 대체 규칙을 점검했습니다. | learner-text-candidate | long-or-dense, repeated-text |
| src/content/changelog.test.ts:32:40 | text | 교육과정 | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:32:58 | text | 4영02-10과 6영02-07·09·10을 미션별 성취 증거에 연결했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:33:40 | text | 콘텐츠 | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:33:57 | text | 대화 문구 10개와 번들 음원 대본 20개를 학년 수준과 포용성 기준으로 검수했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:34:40 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:34:56 | text | 수준 2단계, 미션 10개, 네 가지 수리 전략, 문자·번들 음원 학습 흐름을 구현했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:35:40 | text | 설계 | learner-text-candidate | repeated-text |
| src/content/changelog.test.ts:35:56 | text | 최초 설계 문서를 작성했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.ts:1:31 | text | 설계 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:1:38 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:1:45 | text | 콘텐츠 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:1:53 | text | 교육과정 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:1:62 | text | 접근성 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:12:16 | text | 접근성 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:13:16 | text | 업데이트 기록 영역을 넓히고, 빈 미션·전략 요약·학생용 결과 문구를 보완했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.ts:17:16 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:18:16 | text | 첫 추천 미션과 단계별 학습 행동을 앞세우고, 완료 화면의 다음 행동을 분명하게 정리했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.ts:22:16 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:23:16 | text | 추천 미션과 단계 진행 표시를 앞세우고, 학생용 문구·오디오 오류 안내·확대 대화상자를 개선했습니다. | feedback-or-error, instruction | long-or-dense, repeated-text |
| src/content/changelog.ts:25:36 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:25:52 | text | 공개 Pages 배포와 브라우저 탭 아이콘을 추가했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.ts:28:16 | text | 접근성 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:29:16 | text | 화면과 음성 대본을 일치시키고 음성 선택 영역을 44px 이상으로 넓혔습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.ts:33:16 | text | 접근성 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:34:16 | text | 375px 모바일과 200% 확대에서 본문·업데이트 대화상자의 가로·세로 잘림을 막았습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.ts:38:16 | text | 접근성 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:39:16 | text | 업데이트 대화상자 키보드 초점 범위와 개인정보 안전 검사를 강화했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.ts:43:16 | text | 접근성 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:44:16 | text | 키보드, 375px 모바일, 200% 확대, 스크린 리더용 언어 표기와 모션 감소 대체 규칙을 점검했습니다. | learner-text-candidate | long-or-dense, repeated-text |
| src/content/changelog.ts:48:16 | text | 교육과정 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:49:16 | text | 4영02-10과 6영02-07·09·10을 미션별 성취 증거에 연결했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.ts:53:16 | text | 콘텐츠 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:54:16 | text | 대화 문구 10개와 번들 음원 대본 20개를 학년 수준과 포용성 기준으로 검수했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.ts:58:16 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:59:16 | text | 수준 2단계, 미션 10개, 네 가지 수리 전략, 문자·번들 음원 학습 흐름을 구현했습니다. | learner-text-candidate | repeated-text |
| src/content/changelog.ts:61:36 | text | 설계 | learner-text-candidate | repeated-text |
| src/content/changelog.ts:61:52 | text | 최초 설계 문서를 작성했습니다. | learner-text-candidate | repeated-text |
| src/content/curriculum.ts:11:12 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/curriculum.ts:12:21 | text | 대화 예절을 지키며 의사소통에 참여하기 | learner-text-candidate | repeated-text |
| src/content/curriculum.ts:16:12 | text | [6영02-07] | learner-text-candidate | repeated-text |
| src/content/curriculum.ts:17:21 | text | 일상생활의 담화나 글에서 세부 정보를 묻고 답하기 | learner-text-candidate | repeated-text |
| src/content/curriculum.ts:21:12 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/content/curriculum.ts:22:21 | text | 적절한 매체와 전략을 활용하여 의미를 생성하고 표현하기 | learner-text-candidate | abstract-or-formal, repeated-text |
| src/content/curriculum.ts:26:12 | text | [6영02-10] | learner-text-candidate | repeated-text |
| src/content/curriculum.ts:27:21 | text | 자신감을 가지고 협력적으로 의사소통 활동에 참여하기 | learner-text-candidate | repeated-text |
| src/content/feedback.ts:4:23 | text | 문장 전체 | learner-text-candidate | repeated-text |
| src/content/feedback.ts:5:12 | text | 대상 | learner-text-candidate | — |
| src/content/feedback.ts:6:10 | text | 시간 | learner-text-candidate | — |
| src/content/feedback.ts:7:11 | text | 장소 | learner-text-candidate | repeated-text |
| src/content/feedback.ts:8:14 | text | 수량 | learner-text-candidate | — |
| src/content/feedback.ts:9:12 | text | 담당자 | learner-text-candidate | repeated-text |
| src/content/feedback.ts:10:14 | text | 순서 | learner-text-candidate | — |
| src/content/feedback.ts:11:14 | text | 최종 결정 | learner-text-candidate | — |
| src/content/feedback.ts:15:4 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | learner-text-candidate | repeated-text |
| src/content/feedback.ts:18:11 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 ${SLOT_LABELS_KO[slotKind]} 정보를 다시 찾아보세요. | learner-text-candidate | long-or-dense, multiple-actions |
| src/content/feedback.ts:22:11 | text | 어떤 정보가 아직 없나요? 확인 문장에서 ${SLOT_LABELS_KO[slotKind]} 정보가 바뀌거나 빠졌어요. | learner-text-candidate | long-or-dense |
| src/content/missionRepository.ts:8:34 | text | Unknown mission id: ${id} | feedback-or-error | technical-or-internal |
| src/content/missionValidation.test.ts:35:15 | text | that item | learner-text-candidate | — |
| src/content/missionValidation.test.ts:38:18 | text | 모호한 정보를 찾았어요. | feedback-or-error | — |
| src/content/missionValidation.test.ts:42:57 | text | = {}): RepairOption { return { id: `${BASE_ID}--repair-best`, strategyId: 'specify', textEn: 'Which item?', naturalness: 'best-fit', accepted: true, feedbackKo: '필요한 정보를 직접 물었어요.', ...overrides, }; } function acceptedMeaning(): MeaningOption { return { id: `${BASE_ID}--meaning-correct`, labelKo: '파란 물건', accepted: true, feedbackKo: '추가 답과 의미가 맞아요.', }; } function acceptedConfirmation(): ConfirmationOption { return { id: `${BASE_ID}--confirmation-correct`, mode: 'confirm', textEn: 'So, I will bring the blue item.', accepted: true, feedbackKo: '이해한 뜻을 확인했어요.', }; } function makeValidMission(overrides: Partial | feedback-or-error | long-or-dense, technical-or-internal |
| src/content/missionValidation.test.ts:49:18 | text | 필요한 정보를 직접 물었어요. | feedback-or-error | — |
| src/content/missionValidation.test.ts:57:15 | text | 파란 물건 | learner-text-candidate | — |
| src/content/missionValidation.test.ts:59:18 | text | 추가 답과 의미가 맞아요. | feedback-or-error | — |
| src/content/missionValidation.test.ts:69:18 | text | 이해한 뜻을 확인했어요. | feedback-or-error | — |
| src/content/missionValidation.test.ts:79:15 | text | 어떤 물건 | learner-text-candidate | — |
| src/content/missionValidation.test.ts:80:18 | text | 교실에서 물건을 확인합니다. | learner-text-candidate | — |
| src/content/missionValidation.test.ts:82:24 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:94:19 | text | Please | learner-text-candidate | — |
| src/content/missionValidation.test.ts:102:19 | text | bring | learner-text-candidate | — |
| src/content/missionValidation.test.ts:115:22 | text | 가능한 대상을 확인했어요. | feedback-or-error | — |
| src/content/missionValidation.test.ts:122:22 | text | 어떤 정보가 아직 없나요? | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:134:19 | text | 빨간 물건 | learner-text-candidate | — |
| src/content/missionValidation.test.ts:136:49 | text | object | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:140:19 | text | 창문 | learner-text-candidate | — |
| src/content/missionValidation.test.ts:142:49 | text | object | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:152:54 | text | object | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:159:54 | text | object | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:211:14 | text | repeat | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:211:33 | text | 다시 말해 주세요 | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:211:57 | text | 전체 발화를 놓쳤을 때 | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:211:86 | text | Could you say that again? | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:212:14 | text | specify | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:212:34 | text | 더 구체적으로 | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:212:56 | text | 대상·시간·장소·수량·담당·순서가 불분명할 때 | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:212:98 | text | Which one? | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:212:112 | text | What time? | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:213:14 | text | confirm | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:213:34 | text | 뜻 확인 | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:213:53 | text | 내가 이해한 내용이 맞는지 확인할 때 | learner-text-candidate | multiple-conditions, repeated-text |
| src/content/missionValidation.test.ts:213:90 | text | Do you mean the blue box? | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:214:14 | text | rephrase | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:214:35 | text | 다르게 말하기 | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:214:57 | text | 상대가 내 말을 이해하지 못했을 때 | learner-text-candidate | repeated-text, shaming-tone |
| src/content/missionValidation.test.ts:214:93 | text | Let me say it another way. | learner-text-candidate | — |
| src/content/missionValidation.test.ts:220:16 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:220:44 | text | 대화 예절을 지키며 의사소통에 참여하기 | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:221:16 | text | [6영02-07] | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:221:44 | text | 일상생활의 담화나 글에서 세부 정보를 묻고 답하기 | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:222:16 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:222:44 | text | 적절한 매체와 전략을 활용하여 의미를 생성하고 표현하기 | learner-text-candidate | abstract-or-formal, repeated-text |
| src/content/missionValidation.test.ts:223:16 | text | [6영02-10] | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:223:44 | text | 자신감을 가지고 협력적으로 의사소통 활동에 참여하기 | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:227:7 | text | builds complete Korean hints from every exact slot label | hint | long-or-dense |
| src/content/missionValidation.test.ts:233:40 | text | quantity | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:234:8 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 수량 정보를 다시 찾아보세요. | learner-text-candidate | multiple-actions, repeated-text |
| src/content/missionValidation.test.ts:236:45 | text | decision | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:237:8 | text | 어떤 정보가 아직 없나요? 확인 문장에서 최종 결정 정보가 바뀌거나 빠졌어요. | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:280:44 | text | fixture pack is incomplete | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:313:7 | text | requires multiple accepted repairs with distinct naturalness feedback | feedback-or-error | long-or-dense |
| src/content/missionValidation.test.ts:317:39 | text | 같은 피드백 | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:318:31 | text | other | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:318:52 | text | 같은 피드백 | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:318:75 | text | works | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:324:19 | text | DUPLICATE_FEEDBACK | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:329:26 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:329:39 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missionValidation.test.ts:358:49 | text | fixture pack is incomplete | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:369:38 | text | fixture pack is incomplete | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:404:33 | text | second-contract | feedback-or-error | — |
| src/content/missionValidation.test.ts:404:64 | text | specify | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:404:88 | text | works | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:404:109 | text | 두 번째 표현도 자연스러워요. | feedback-or-error | — |
| src/content/missionValidation.test.ts:415:14 | text | duplicate accepted feedback | feedback-or-error | — |
| src/content/missionValidation.test.ts:418:41 | text | 같은 피드백 | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:419:33 | text | other | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:419:54 | text | 같은 피드백 | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:419:77 | text | works | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:422:27 | text | DUPLICATE_FEEDBACK | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:422:60 | text | fixture-mission | feedback-or-error | — |
| src/content/missionValidation.test.ts:422:86 | text | repairOptions.feedbackKo | feedback-or-error | repeated-text |
| src/content/missionValidation.test.ts:426:73 | text | [9영99-99] | learner-text-candidate | — |
| src/content/missionValidation.ts:18:6 | text | DUPLICATE_FEEDBACK | feedback-or-error | repeated-text |
| src/content/missionValidation.ts:77:22 | text | mission.id); const issues: ValidationIssue[] = []; for (const mission of orderedMissions) gradeBandCounts[mission.gradeBand] += 1; if (missions.length !== EXPECTED_MISSION_COUNT) { issues.push(issue('pack', 'PACK_COUNT', 'missions', '미션은 정확히 10개여야 합니다.')); } const seenIds = new Set | learner-text-candidate | long-or-dense, technical-or-internal |
| src/content/missionValidation.ts:83:58 | text | 미션은 정확히 10개여야 합니다. | learner-text-candidate | — |
| src/content/missionValidation.ts:89:60 | text | 미션 ID는 서로 달라야 합니다. | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/content/missionValidation.ts:95:71 | text | 각 학년군 미션은 5개여야 합니다. | learner-text-candidate | — |
| src/content/missionValidation.ts:99:75 | text | 네 가지 수리 전략이 모두 사용되어야 합니다. | learner-text-candidate | — |
| src/content/missionValidation.ts:107:83 | text | ${stage} 단계에 수락 선택지가 필요합니다. | learner-text-candidate | — |
| src/content/missionValidation.ts:111:69 | text | option.accepted); for (const option of acceptedRepairs) { if (!mission.allowedStrategyIds.includes(option.strategyId)) { issues.push(issue(mission.id, 'REPAIR_NOT_ALLOWED', 'repairOptions.strategyId', '수락 수리 표현은 허용 전략이어야 합니다.')); } } if (acceptedRepairs.length | learner-text-candidate | long-or-dense, technical-or-internal |
| src/content/missionValidation.ts:114:90 | text | 수락 수리 표현은 허용 전략이어야 합니다. | learner-text-candidate | — |
| src/content/missionValidation.ts:118:87 | text | 수락 수리 표현이 2개 이상 필요합니다. | learner-text-candidate | — |
| src/content/missionValidation.ts:122:38 | text | DUPLICATE_FEEDBACK | feedback-or-error | repeated-text |
| src/content/missionValidation.ts:122:60 | text | repairOptions.feedbackKo | feedback-or-error | repeated-text |
| src/content/missionValidation.ts:122:88 | text | 수락 수리 표현의 피드백은 서로 달라야 합니다. | feedback-or-error | — |
| src/content/missionValidation.ts:126:85 | text | 교육과정 연결 코드가 하나 이상 필요합니다. | learner-text-candidate | — |
| src/content/missionValidation.ts:130:87 | text | 학습 목표 ${target} 연결이 필요합니다. | learner-text-candidate | — |
| src/content/missionValidation.ts:136:79 | text | 음원은 로컬 audio/ 경로여야 합니다. | learner-text-candidate | — |
| src/content/missionValidation.ts:139:89 | text | 제공된 음원에는 비어 있지 않은 대본이 필요합니다. | learner-text-candidate | — |
| src/content/missions/audioDialogueParity.test.ts:39:34 | text | Transcript is not composed of exact Speaker: text turns: ${transcript} | feedback-or-error | long-or-dense |
| src/content/missions/audioDialogueParity.test.ts:44:22 | text | Transcript has non-turn text or ambiguous separators: ${transcript} | feedback-or-error | long-or-dense |
| src/content/missions/audioDialogueParity.test.ts:63:34 | text | Missing canonical mission contract: ${missionId} | feedback-or-error | technical-or-internal |
| src/content/missions/audioDialogueParity.test.ts:69:30 | text | Missing observation cue: ${missionId} | feedback-or-error | technical-or-internal |
| src/content/missions/audioManifest.ts:8:31 | text | Missing audio cues for mission: ${missionId} | feedback-or-error | technical-or-internal |
| src/content/missions/contentIntegrity.test.ts:6:7 | text | does not expose an accepted ambiguity label or registered Korean translation | learner-text-candidate | long-or-dense |
| src/content/missions/contentIntegrity.test.ts:17:20 | text | 종이 울려 친구의 문장 전체를 놓쳤습니다. | learner-text-candidate | — |
| src/content/missions/contentIntegrity.test.ts:18:20 | text | 문장 전체 | learner-text-candidate | repeated-text |
| src/content/missions/contentIntegrity.test.ts:21:20 | text | 종이 울려 친구의 말을 잘 듣지 못했습니다. | learner-text-candidate | repeated-text, shaming-tone |
| src/content/missions/contentIntegrity.ts:4:27 | text | 문장 전체 | learner-text-candidate | repeated-text |
| src/content/missions/contentIntegrity.ts:4:36 | text | 전체 문장 | learner-text-candidate | — |
| src/content/missions/contentIntegrity.ts:5:19 | text | 저기 | learner-text-candidate | — |
| src/content/missions/contentIntegrity.ts:5:25 | text | 저곳 | learner-text-candidate | — |
| src/content/missions/contentIntegrity.ts:5:31 | text | 그곳 | learner-text-candidate | — |
| src/content/missions/contract-fixtures/grade34-classroom.ts:5:10 | text | g34-classroom-box | learner-text-candidate | — |
| src/content/missions/contract-fixtures/grade34-classroom.ts:5:58 | text | 어느 상자 | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:5:79 | text | 교실에 빨간 상자와 파란 상자가 함께 있습니다. | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:5:128 | text | classroom-polite | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:5:166 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:5:198 | text | understand | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:5:212 | text | apply | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:5:221 | text | analyze | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:5:232 | text | create | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:8:14 | text | g34-classroom-box--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:8:61 | text | g34-classroom-box-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:8:100 | text | that box | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:8:122 | text | object | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:8:160 | text | 불명확한 대상을 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:9:14 | text | g34-classroom-box--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:9:67 | text | g34-classroom-box-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:9:106 | text | the crayons | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:9:131 | text | object | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:9:170 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:10:14 | text | g34-classroom-box--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:10:67 | text | g34-classroom-box-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:10:106 | text | Please put | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:10:130 | text | object | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:10:169 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:14:14 | text | g34-classroom-box--repair-best | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:14:60 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:14:79 | text | Which box? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:14:106 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:14:146 | text | 어느 상자인지 직접 물어 상황에 꼭 맞는 표현이에요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:15:14 | text | g34-classroom-box--repair-works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:15:61 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:15:80 | text | Do you mean the blue box? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:15:122 | text | works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:15:159 | text | 가능한 상자를 정중하게 확인해 대화를 이어 갔어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:16:14 | text | g34-classroom-box--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:16:61 | text | repeat | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:16:79 | text | Could you say that again? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:16:137 | text | 말은 들었지만 어느 상자인지가 아직 분명하지 않아요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:20:14 | text | g34-classroom-box--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:20:61 | text | 창가에 있는 파란 상자 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:20:105 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:21:14 | text | g34-classroom-box--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:21:61 | text | 문 옆 빨간 상자 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:21:103 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 대상 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:22:14 | text | g34-classroom-box--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:22:61 | text | 책상 아래 파란 상자 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:22:105 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 대상 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:25:14 | text | g34-classroom-box--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:25:63 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:25:82 | text | So, I’ll put the crayons in the blue box by the window. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:25:169 | text | 창가의 파란 상자라는 뜻을 정확히 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:26:14 | text | g34-classroom-box--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:26:63 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:26:82 | text | So, I’ll put the crayons in the red box by the door. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:26:167 | text | 어떤 정보가 아직 없나요? 확인 문장에서 대상 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:27:14 | text | g34-classroom-box--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:27:63 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:27:82 | text | So, I’ll put the crayons in the blue box under the desk. | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:27:171 | text | 어떤 정보가 아직 없나요? 확인 문장에서 대상 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:34:10 | text | g34-classroom-pencil | learner-text-candidate | — |
| src/content/missions/contract-fixtures/grade34-classroom.ts:34:61 | text | 어떤 연필 | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:34:82 | text | 책상에 긴 연필과 짧은 연필이 있습니다. | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:34:127 | text | classroom-polite | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:34:165 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:34:197 | text | understand | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:34:211 | text | apply | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:34:220 | text | analyze | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:34:231 | text | create | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:37:14 | text | g34-classroom-pencil--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:37:64 | text | g34-classroom-pencil-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:37:106 | text | that one | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:37:128 | text | object | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:37:166 | text | 불명확한 대상을 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:38:14 | text | g34-classroom-pencil--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:38:70 | text | g34-classroom-pencil-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:38:112 | text | pass me | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:38:133 | text | object | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:38:172 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:39:14 | text | g34-classroom-pencil--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:39:70 | text | g34-classroom-pencil-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:39:112 | text | Can you | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:39:133 | text | object | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:39:172 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:43:14 | text | g34-classroom-pencil--repair-best | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:43:63 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:43:82 | text | Which one? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:43:109 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:43:149 | text | 어떤 연필인지 바로 물어 필요한 정보를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:44:14 | text | g34-classroom-pencil--repair-works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:44:64 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:44:83 | text | Do you mean the long pencil? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:44:128 | text | works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:44:165 | text | 가능한 연필을 정중하게 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:45:14 | text | g34-classroom-pencil--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:45:64 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:45:83 | text | What time? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:45:126 | text | 시간이 아니라 어떤 물건인지 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:49:14 | text | g34-classroom-pencil--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:49:64 | text | 짧은 연필 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:49:101 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:50:14 | text | g34-classroom-pencil--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:50:64 | text | 긴 연필 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:50:101 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 대상 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:51:14 | text | g34-classroom-pencil--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:51:64 | text | 짧은 자 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:51:101 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 대상 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:54:14 | text | g34-classroom-pencil--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:54:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:54:85 | text | Okay, you mean the short pencil. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:54:149 | text | 짧은 연필이라는 뜻을 정확히 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:55:14 | text | g34-classroom-pencil--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:55:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:55:85 | text | Okay, you mean the long pencil. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:55:149 | text | 어떤 정보가 아직 없나요? 확인 문장에서 대상 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:56:14 | text | g34-classroom-pencil--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:56:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:56:85 | text | Okay, you mean the short ruler. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-classroom.ts:56:149 | text | 어떤 정보가 아직 없나요? 확인 문장에서 대상 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:5:10 | text | g34-recess-place | learner-text-candidate | — |
| src/content/missions/contract-fixtures/grade34-recess.ts:5:57 | text | 약속 장소 | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:5:78 | text | 놀이터에 그네, 운동장 문, 벤치가 보입니다. | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:5:126 | text | peer-brief | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:5:158 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:5:190 | text | understand | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:5:204 | text | apply | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:5:213 | text | analyze | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:5:224 | text | create | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:8:14 | text | g34-recess-place--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:8:60 | text | g34-recess-place-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:8:98 | text | there | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:8:117 | text | place | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:8:154 | text | 불명확한 장소를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:9:14 | text | g34-recess-place--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:9:66 | text | g34-recess-place-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:9:104 | text | after lunch | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:9:129 | text | place | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:9:167 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:10:14 | text | g34-recess-place--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:10:66 | text | g34-recess-place-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:10:104 | text | Let’s meet | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:10:128 | text | place | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:10:166 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:14:14 | text | g34-recess-place--repair-best | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:14:59 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:14:78 | text | Where should we meet? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:14:116 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:14:156 | text | 빠진 장소를 직접 물어 약속을 분명하게 했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:15:14 | text | g34-recess-place--repair-works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:15:60 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:15:79 | text | Do you mean by the swings? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:15:122 | text | works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:15:159 | text | 떠올린 장소가 맞는지 확인해 대화를 이어 갔어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:16:14 | text | g34-recess-place--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:16:60 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:16:79 | text | What time? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:16:122 | text | 만날 때는 알지만 만날 장소가 아직 없어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:20:14 | text | g34-recess-place--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:20:60 | text | 운동장 문 옆 벤치 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:20:102 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:21:14 | text | g34-recess-place--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:21:60 | text | 그네 옆 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:21:97 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 장소 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:22:14 | text | g34-recess-place--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:22:60 | text | 교실 문 앞 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:22:99 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 장소 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:25:14 | text | g34-recess-place--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:25:62 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:25:81 | text | We’ll meet at the bench beside the playground gate. | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/content/missions/contract-fixtures/grade34-recess.ts:25:164 | text | 운동장 문 옆 벤치라는 뜻을 정확히 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:26:14 | text | g34-recess-place--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:26:62 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:26:81 | text | We’ll meet by the swings. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:26:139 | text | 어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:27:14 | text | g34-recess-place--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:27:62 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:27:81 | text | We’ll meet by the classroom door. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:27:147 | text | 어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:34:10 | text | g34-recess-time | learner-text-candidate | — |
| src/content/missions/contract-fixtures/grade34-recess.ts:34:56 | text | 놀이 시작 시간 | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:34:80 | text | 종이 울려 친구의 말을 잘 듣지 못했습니다. | learner-text-candidate | repeated-text, shaming-tone |
| src/content/missions/contract-fixtures/grade34-recess.ts:34:127 | text | peer-brief | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:34:159 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:34:191 | text | understand | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:34:205 | text | apply | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:34:214 | text | analyze | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:34:225 | text | create | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:35:23 | text | g34-recess-time-dialogue | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:35:60 | text | Partner | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:35:79 | text | You could not catch this sentence because the bell rang. | learner-text-candidate | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:35:156 | text | 종소리 때문에 친구가 말한 내용을 놓쳤습니다. | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:37:14 | text | g34-recess-time--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:37:59 | text | g34-recess-time-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:37:96 | text | the whole sentence | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:37:128 | text | whole-utterance | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:37:175 | text | 놓친 문장 전체를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:38:14 | text | g34-recess-time--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:38:65 | text | g34-recess-time-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:38:102 | text | the bell sound | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:38:130 | text | whole-utterance | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:38:178 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:39:14 | text | g34-recess-time--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:39:65 | text | g34-recess-time-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:39:102 | text | the speaker | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:39:127 | text | whole-utterance | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:39:175 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:43:14 | text | g34-recess-time--repair-best | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:43:58 | text | repeat | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:43:76 | text | Could you say that again? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:43:118 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:43:158 | text | 문장 전체를 놓친 상황에 꼭 맞는 다시 말하기 표현이에요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:44:14 | text | g34-recess-time--repair-works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:44:59 | text | repeat | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:44:77 | text | Sorry, can you repeat that? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:44:121 | text | works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:44:158 | text | 미안함을 덧붙여 정중하게 반복을 요청했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:45:14 | text | g34-recess-time--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:45:59 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:45:78 | text | Which one? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:45:121 | text | 문장 전체를 놓쳤을 때 쓰는 다시 말하기 신호를 찾아보세요. | feedback-or-error | multiple-conditions, repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:49:14 | text | g34-recess-time--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:49:59 | text | 오후 1시 30분 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:49:100 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:50:14 | text | g34-recess-time--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:50:59 | text | 오후 1시 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:50:97 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 문장 전체 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:51:14 | text | g34-recess-time--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:51:59 | text | 오후 2시 30분 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:51:101 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 문장 전체 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:54:14 | text | g34-recess-time--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:54:61 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:54:80 | text | The game starts at one thirty, right? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:54:149 | text | 놀이 시작 시간이 오후 1시 30분이라는 뜻을 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:55:14 | text | g34-recess-time--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:55:61 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:55:80 | text | The game starts at one, right? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:55:143 | text | 어떤 정보가 아직 없나요? 확인 문장에서 문장 전체 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:56:14 | text | g34-recess-time--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:56:61 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:56:80 | text | The game starts at two thirty, right? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:56:150 | text | 어떤 정보가 아직 없나요? 확인 문장에서 문장 전체 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:63:10 | text | g34-recess-rephrase | learner-text-candidate | — |
| src/content/missions/contract-fixtures/grade34-recess.ts:63:60 | text | 장소를 다시 설명하기 | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:63:87 | text | 친구가 내가 말한 장소를 이해하지 못했습니다. | learner-text-candidate | repeated-text, shaming-tone |
| src/content/missions/contract-fixtures/grade34-recess.ts:63:135 | text | peer-brief | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:63:167 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:63:199 | text | understand | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:63:213 | text | apply | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:63:222 | text | analyze | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:63:233 | text | create | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:69:14 | text | g34-recess-rephrase--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:69:63 | text | g34-recess-rephrase-you-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:69:108 | text | over there | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:69:132 | text | place | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:69:169 | text | 불명확한 장소를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:70:14 | text | g34-recess-rephrase--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:70:69 | text | g34-recess-rephrase-you-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:70:114 | text | Let’s | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:70:133 | text | place | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:70:171 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:71:14 | text | g34-recess-rephrase--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:71:69 | text | g34-recess-rephrase-you-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:71:114 | text | do it | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:71:133 | text | place | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:71:171 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:75:14 | text | g34-recess-rephrase--repair-best | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:75:62 | text | rephrase | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:75:82 | text | Let me say it another way. Let’s draw with chalk beside the hopscotch grid. | feedback-or-error | long-or-dense, missing-term-explanation, repeated-text, technical-or-internal |
| src/content/missions/contract-fixtures/grade34-recess.ts:75:174 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:75:214 | text | 장소를 구체적으로 넣어 내 뜻을 분명하게 바꾸어 말했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:76:14 | text | g34-recess-rephrase--repair-works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:76:63 | text | rephrase | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:76:83 | text | I mean the place beside the hopscotch grid. | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/content/missions/contract-fixtures/grade34-recess.ts:76:143 | text | works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:76:180 | text | 핵심 장소를 다른 말로 풀어 상대가 이해할 수 있게 했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:77:14 | text | g34-recess-rephrase--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:77:63 | text | repeat | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:77:81 | text | Could you say that again? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:77:139 | text | 상대가 내 말을 이해하지 못했으니 내 뜻을 다른 말로 풀어보세요. | feedback-or-error | repeated-text, shaming-tone |
| src/content/missions/contract-fixtures/grade34-recess.ts:81:14 | text | g34-recess-rephrase--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:81:63 | text | 사방치기 칸 옆 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:81:103 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:82:14 | text | g34-recess-rephrase--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:82:63 | text | 큰 나무 아래 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:82:103 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 장소 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:83:14 | text | g34-recess-rephrase--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:83:63 | text | 그네 옆 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:83:100 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 장소 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:86:14 | text | g34-recess-rephrase--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:86:65 | text | rephrase | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:86:85 | text | Right, I mean the place beside the hopscotch grid. | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/content/missions/contract-fixtures/grade34-recess.ts:86:167 | text | 사방치기 칸 옆이라는 뜻을 다시 분명하게 말했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:87:14 | text | g34-recess-rephrase--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:87:65 | text | rephrase | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:87:85 | text | Right, I mean the place under the big tree. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:87:161 | text | 어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:88:14 | text | g34-recess-rephrase--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:88:65 | text | rephrase | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade34-recess.ts:88:85 | text | Right, I mean the place beside the swings. | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/content/missions/contract-fixtures/grade34-recess.ts:88:160 | text | 어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:5:10 | text | g56-directions-place | instruction | — |
| src/content/missions/contract-fixtures/grade56-directions.ts:5:61 | text | 비슷한 장소 이름 | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:5:86 | text | 길 안내에 체육관과 음악당이 함께 나옵니다. | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:5:133 | text | peer-brief | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:5:165 | text | [6영02-07] | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:5:178 | text | [6영02-09] | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:5:210 | text | understand | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:5:224 | text | apply | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:5:233 | text | analyze | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:5:244 | text | create | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:8:14 | text | g56-directions-place--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:8:64 | text | g56-directions-place-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:8:106 | text | the hall | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:8:128 | text | place | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:8:165 | text | 불명확한 장소를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:9:14 | text | g56-directions-place--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:9:70 | text | g56-directions-place-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:9:112 | text | the bank | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:9:134 | text | place | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:9:172 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:10:14 | text | g56-directions-place--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:10:70 | text | g56-directions-place-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:10:112 | text | After | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:10:131 | text | place | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:10:169 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:14:14 | text | g56-directions-place--repair-best | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:14:63 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:14:82 | text | Which hall do you mean? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:14:122 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:14:162 | text | 어느 홀인지 직접 물어 장소를 구체화했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:15:14 | text | g56-directions-place--repair-works | feedback-or-error, instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:15:64 | text | confirm | feedback-or-error, instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:15:83 | text | Do you mean the music hall? | feedback-or-error, instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:15:127 | text | works | feedback-or-error, instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:15:164 | text | 가능한 홀 이름을 확인해 길 안내를 이어 갔어요. | feedback-or-error, instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:16:14 | text | g56-directions-place--repair-retry | feedback-or-error, instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:16:64 | text | repeat | feedback-or-error, instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:16:82 | text | Could you say that again? | feedback-or-error, instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:16:140 | text | 안내는 들었지만 어느 장소인지 구체화해야 해요. | feedback-or-error, instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:20:14 | text | g56-directions-place--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:20:64 | text | 빵집 맞은편 음악당 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:20:106 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:21:14 | text | g56-directions-place--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:21:64 | text | 빵집 맞은편 체육관 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:21:107 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 장소 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:22:14 | text | g56-directions-place--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:22:64 | text | 은행 옆 음악당 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:22:105 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 장소 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:25:14 | text | g56-directions-place--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:25:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:25:85 | text | I turn toward the music hall across from the bakery. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:25:169 | text | 빵집 맞은편 음악당이라는 장소를 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:26:14 | text | g56-directions-place--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:26:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:26:85 | text | I turn toward the sports hall across from the bakery. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:26:171 | text | 어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:27:14 | text | g56-directions-place--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:27:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:27:85 | text | I turn toward the music hall beside the bank. | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/content/missions/contract-fixtures/grade56-directions.ts:27:163 | text | 어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:34:10 | text | g56-directions-sequence | instruction | — |
| src/content/missions/contract-fixtures/grade56-directions.ts:34:64 | text | 길 안내 순서 | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:34:87 | text | 약국과 두 번째 신호등 뒤의 이동 순서를 확인합니다. | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:34:139 | text | peer-brief | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:34:171 | text | [6영02-07] | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:34:184 | text | [6영02-09] | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:34:216 | text | understand | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:34:230 | text | apply | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:34:239 | text | analyze | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:34:250 | text | create | instruction | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:37:14 | text | g56-directions-sequence--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:37:67 | text | g56-directions-sequence-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:37:112 | text | the next turn | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:37:139 | text | sequence | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:37:179 | text | 불명확한 이동 순서를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:38:14 | text | g56-directions-sequence--ambiguity-distractor-a | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:38:73 | text | g56-directions-sequence-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:38:118 | text | the pharmacy | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:38:144 | text | sequence | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:38:185 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:39:14 | text | g56-directions-sequence--ambiguity-distractor-b | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:39:73 | text | g56-directions-sequence-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:39:118 | text | the second light | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:39:148 | text | sequence | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:39:189 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:43:14 | text | g56-directions-sequence--repair-best | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:43:66 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:43:85 | text | What should I do after the second traffic light? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:43:150 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:43:190 | text | 두 번째 신호등 뒤의 순서를 직접 물었어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:44:14 | text | g56-directions-sequence--repair-works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:44:67 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:44:86 | text | Do I turn right after the second light? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:44:142 | text | works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:44:179 | text | 예상한 방향이 맞는지 구체적으로 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:45:14 | text | g56-directions-sequence--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:45:67 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:45:86 | text | Where is the pharmacy? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:45:141 | text | 약국 뒤에 어떤 순서로 움직이는지 확인해 보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:49:14 | text | g56-directions-sequence--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:49:67 | text | 두 번째 신호등 뒤 우회전, 왼쪽 첫 건물 도서관 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:49:126 | text | 추가 응답과 이동 순서가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:50:14 | text | g56-directions-sequence--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:50:67 | text | 두 번째 신호등 뒤 좌회전 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:50:114 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 순서 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:51:14 | text | g56-directions-sequence--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:51:67 | text | 우회전 뒤 왼쪽 두 번째 건물 도서관 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:51:120 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 순서 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:54:14 | text | g56-directions-sequence--confirmation-correct | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:54:69 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:54:88 | text | After the second light, I turn right and find the library on the left. | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:54:190 | text | 두 번째 신호등 뒤 우회전과 도서관 위치를 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:55:14 | text | g56-directions-sequence--confirmation-retry-a | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:55:69 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:55:88 | text | After the second light, I turn left. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:55:157 | text | 어떤 정보가 아직 없나요? 확인 문장에서 순서 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:56:14 | text | g56-directions-sequence--confirmation-retry-b | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:56:69 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:56:88 | text | After the second light, I turn right and pass the library on the right. | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade56-directions.ts:56:192 | text | 어떤 정보가 아직 없나요? 확인 문장에서 순서 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:5:10 | text | g56-event-decision | learner-text-candidate | — |
| src/content/missions/contract-fixtures/grade56-events.ts:5:59 | text | 행사 최종 계획 | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:5:83 | text | 두 시간·장소 제안 가운데 확정된 계획을 확인합니다. | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:5:135 | text | peer-brief | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:5:167 | text | [6영02-07] | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:5:180 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:5:193 | text | [6영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:5:225 | text | understand | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:5:239 | text | apply | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:5:248 | text | analyze | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:5:259 | text | create | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:8:14 | text | g56-event-decision--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:8:62 | text | g56-event-decision-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:8:102 | text | the final time and place | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:8:140 | text | decision | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:8:180 | text | 최종 결정이 무엇인지 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:9:14 | text | g56-event-decision--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:9:68 | text | g56-event-decision-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:9:108 | text | the library | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:9:133 | text | decision | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:9:174 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:10:14 | text | g56-event-decision--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:10:68 | text | g56-event-decision-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:10:108 | text | the art room | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:10:134 | text | decision | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:10:175 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:14:14 | text | g56-event-decision--repair-best | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:14:61 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:14:80 | text | Do you mean we’re meeting at three in the art room? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:14:148 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:14:188 | text | 두 제안 중 최종 시간과 장소를 함께 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:15:14 | text | g56-event-decision--repair-works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:15:62 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:15:81 | text | Is the final plan three o’clock in the art room? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:15:146 | text | works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:15:183 | text | 최종 계획의 시간과 장소를 다시 묻는 자연스러운 표현이에요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:16:14 | text | g56-event-decision--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:16:62 | text | repeat | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:16:80 | text | Could you say that again? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:16:138 | text | 두 제안 중 무엇이 최종 결정인지 확인해 보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:20:14 | text | g56-event-decision--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:20:62 | text | 오후 3시 미술실이 최종 계획 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:20:110 | text | 추가 응답과 최종 결정의 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:21:14 | text | g56-event-decision--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:21:62 | text | 오후 2시 도서관이 최종 계획 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:21:111 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 최종 결정 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:22:14 | text | g56-event-decision--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:22:62 | text | 오후 3시 도서관이 최종 계획 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:22:111 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 최종 결정 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:25:14 | text | g56-event-decision--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:25:64 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:25:83 | text | Got it. The final plan is three o’clock in the art room. | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:25:171 | text | 오후 3시 미술실이라는 최종 계획을 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:26:14 | text | g56-event-decision--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:26:64 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:26:83 | text | Got it. The final plan is two o’clock in the library. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:26:169 | text | 어떤 정보가 아직 없나요? 확인 문장에서 최종 결정 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:27:14 | text | g56-event-decision--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:27:64 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:27:83 | text | Got it. The final plan is three o’clock in the library. | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade56-events.ts:27:171 | text | 어떤 정보가 아직 없나요? 확인 문장에서 최종 결정 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:5:10 | text | g56-materials-quantity | learner-text-candidate | — |
| src/content/missions/contract-fixtures/grade56-materials.ts:5:63 | text | 준비물 수량 | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:5:85 | text | 모둠 포스터에 필요한 종이 수량을 정합니다. | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:5:132 | text | classroom-polite | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:5:170 | text | [6영02-07] | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:5:183 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:5:215 | text | understand | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:5:229 | text | apply | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:5:238 | text | analyze | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:5:249 | text | create | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:8:14 | text | g56-materials-quantity--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:8:66 | text | g56-materials-quantity-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:8:110 | text | some sheets | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:8:135 | text | quantity | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:8:175 | text | 불명확한 수량을 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:9:14 | text | g56-materials-quantity--ambiguity-distractor-a | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:9:72 | text | g56-materials-quantity-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:9:116 | text | poster paper | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:9:142 | text | quantity | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:9:183 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:10:14 | text | g56-materials-quantity--ambiguity-distractor-b | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:10:72 | text | g56-materials-quantity-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:10:116 | text | tomorrow | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:10:138 | text | quantity | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:10:179 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:14:14 | text | g56-materials-quantity--repair-best | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:14:65 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:14:84 | text | How many sheets of poster paper should I bring? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:14:148 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:14:188 | text | 필요한 종이 수량을 정확히 물었어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:15:14 | text | g56-materials-quantity--repair-works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:15:66 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:15:85 | text | How much poster paper should I bring? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:15:139 | text | works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:15:176 | text | 묻는 범위가 넓지만 필요한 수량을 확인할 수 있어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:16:14 | text | g56-materials-quantity--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:16:66 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:16:85 | text | Who will bring it? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:16:136 | text | 담당자가 아니라 필요한 종이 수량을 확인해 보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:20:14 | text | g56-materials-quantity--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:20:66 | text | 포스터 종이 네 장 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:20:108 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:21:14 | text | g56-materials-quantity--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:21:66 | text | 포스터 종이 두 장 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:21:109 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 수량 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:22:14 | text | g56-materials-quantity--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:22:66 | text | 포스터 종이 네 묶음 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:22:110 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 수량 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:25:14 | text | g56-materials-quantity--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:25:68 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:25:87 | text | I’ll bring four sheets of poster paper tomorrow. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:25:167 | text | 포스터 종이 네 장이라는 수량을 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:26:14 | text | g56-materials-quantity--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:26:68 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:26:87 | text | I’ll bring two sheets of poster paper tomorrow. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:26:167 | text | 어떤 정보가 아직 없나요? 확인 문장에서 수량 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:27:14 | text | g56-materials-quantity--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:27:68 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:27:87 | text | I’ll bring four packs of poster paper tomorrow. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:27:167 | text | 어떤 정보가 아직 없나요? 확인 문장에서 수량 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:34:10 | text | g56-materials-person | learner-text-candidate | — |
| src/content/missions/contract-fixtures/grade56-materials.ts:34:61 | text | 준비물 담당자 | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:34:84 | text | 테이프와 마커를 누가 가져올지 확인합니다. | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:34:130 | text | classroom-polite | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:34:168 | text | [6영02-07] | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:34:181 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:34:194 | text | [6영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:34:226 | text | understand | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:34:240 | text | apply | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:34:249 | text | analyze | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:34:260 | text | create | learner-text-candidate | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:37:14 | text | g56-materials-person--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:37:64 | text | g56-materials-person-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:37:106 | text | who brings the markers | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:37:142 | text | person | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:37:180 | text | 빠진 담당자를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:38:14 | text | g56-materials-person--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:38:70 | text | g56-materials-person-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:38:112 | text | Minseo has the tape | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:38:145 | text | person | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:38:184 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:39:14 | text | g56-materials-person--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:39:70 | text | g56-materials-person-dialogue | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:39:112 | text | the tape | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:39:134 | text | person | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:39:173 | text | 어떤 정보가 아직 없나요? 대화에서 두 가지로 해석되거나 놓친 부분을 다시 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:43:14 | text | g56-materials-person--repair-best | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:43:63 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:43:82 | text | Who will bring the markers? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:43:126 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:43:166 | text | 빠진 담당자를 직접 물어 역할을 분명하게 했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:44:14 | text | g56-materials-person--repair-works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:44:64 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:44:83 | text | Do you mean you will bring the markers? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:44:139 | text | works | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:44:176 | text | 가능한 담당자가 맞는지 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:45:14 | text | g56-materials-person--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:45:64 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:45:83 | text | How many markers? | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:45:133 | text | 수량보다 누가 맡는지가 아직 정해지지 않았어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:49:14 | text | g56-materials-person--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:49:64 | text | 상대가 마커 두 묶음, 민서가 테이프 담당 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:49:119 | text | 추가 응답과 담당 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:50:14 | text | g56-materials-person--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:50:64 | text | 민서가 마커와 테이프 모두 담당 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:50:114 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 담당자 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:51:14 | text | g56-materials-person--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:51:64 | text | 상대가 테이프, 민서가 마커 담당 | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:51:115 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 담당자 정보를 다시 찾아보세요. | feedback-or-error | multiple-actions, repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:54:14 | text | g56-materials-person--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:54:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:54:85 | text | You’ll bring two packs of markers, and Minseo has the tape. | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:54:176 | text | 상대와 민서의 준비물 담당을 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:55:14 | text | g56-materials-person--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:55:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:55:85 | text | Minseo will bring the markers and the tape. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:55:161 | text | 어떤 정보가 아직 없나요? 확인 문장에서 담당자 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:56:14 | text | g56-materials-person--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:56:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:56:85 | text | You’ll bring the tape, and Minseo has the markers. | feedback-or-error | repeated-text |
| src/content/missions/contract-fixtures/grade56-materials.ts:56:168 | text | 어떤 정보가 아직 없나요? 확인 문장에서 담당자 정보가 바뀌거나 빠졌어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:9:15 | text | 어느 상자 | learner-text-candidate | repeated-text |
| src/content/missions/grade34-classroom.ts:10:18 | text | 교실에 빨간 상자와 파란 상자가 함께 있습니다. | learner-text-candidate | repeated-text |
| src/content/missions/grade34-classroom.ts:12:24 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/grade34-classroom.ts:18:14 | text | g34-classroom-box--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:18:61 | text | g34-classroom-box-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:18:100 | text | that box | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:18:122 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:18:160 | text | 불명확한 대상을 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:19:14 | text | g34-classroom-box--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:19:67 | text | g34-classroom-box-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:19:106 | text | the crayons | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:19:131 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:20:14 | text | g34-classroom-box--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:20:67 | text | g34-classroom-box-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:20:106 | text | Please put | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:20:130 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:24:14 | text | g34-classroom-box--repair-best | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:24:60 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:24:79 | text | Which box? | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:24:106 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:24:146 | text | 어느 상자인지 직접 물어 상황에 꼭 맞는 표현이에요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:25:14 | text | g34-classroom-box--repair-works | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:25:61 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:25:80 | text | Do you mean the blue box? | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:25:122 | text | works | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:25:159 | text | 가능한 상자를 정중하게 확인해 대화를 이어 갔어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:26:14 | text | g34-classroom-box--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:26:61 | text | repeat | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:26:79 | text | Could you say that again? | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:26:137 | text | 말은 들었지만 어느 상자인지가 아직 분명하지 않아요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:30:14 | text | g34-classroom-box--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:30:61 | text | 창가에 있는 파란 상자 | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:30:105 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:31:14 | text | g34-classroom-box--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:31:61 | text | 문 옆 빨간 상자 | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:31:130 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:32:14 | text | g34-classroom-box--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:32:61 | text | 책상 아래 파란 상자 | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:32:132 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:35:14 | text | g34-classroom-box--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:35:63 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:35:82 | text | So, I’ll put the crayons in the blue box by the window. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:35:169 | text | 창가의 파란 상자라는 뜻을 정확히 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:36:14 | text | g34-classroom-box--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:36:63 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:36:82 | text | So, I’ll put the crayons in the red box by the door. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:36:199 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:37:14 | text | g34-classroom-box--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:37:63 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:37:82 | text | So, I’ll put the crayons in the blue box under the desk. | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/grade34-classroom.ts:37:203 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:44:15 | text | 어떤 연필 | learner-text-candidate | repeated-text |
| src/content/missions/grade34-classroom.ts:45:18 | text | 책상에 긴 연필과 짧은 연필이 있습니다. | learner-text-candidate | repeated-text |
| src/content/missions/grade34-classroom.ts:47:24 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/grade34-classroom.ts:53:14 | text | g34-classroom-pencil--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:53:64 | text | g34-classroom-pencil-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:53:106 | text | that one | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:53:128 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:53:166 | text | 불명확한 대상을 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:54:14 | text | g34-classroom-pencil--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:54:70 | text | g34-classroom-pencil-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:54:112 | text | pass me | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:54:133 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:55:14 | text | g34-classroom-pencil--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:55:70 | text | g34-classroom-pencil-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:55:112 | text | Can you | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:55:133 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:59:14 | text | g34-classroom-pencil--repair-best | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:59:63 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:59:82 | text | Which one? | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:59:109 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:59:149 | text | 어떤 연필인지 바로 물어 필요한 정보를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:60:14 | text | g34-classroom-pencil--repair-works | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:60:64 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:60:83 | text | Do you mean the long pencil? | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:60:128 | text | works | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:60:165 | text | 가능한 연필을 정중하게 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:61:14 | text | g34-classroom-pencil--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:61:64 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:61:83 | text | What time? | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:61:126 | text | 시간이 아니라 어떤 물건인지 찾아보세요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:65:14 | text | g34-classroom-pencil--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:65:64 | text | 짧은 연필 | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:65:101 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:66:14 | text | g34-classroom-pencil--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:66:64 | text | 긴 연필 | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:66:128 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:67:14 | text | g34-classroom-pencil--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:67:64 | text | 짧은 자 | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:67:128 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:70:14 | text | g34-classroom-pencil--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:70:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:70:85 | text | Okay, you mean the short pencil. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:70:149 | text | 짧은 연필이라는 뜻을 정확히 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:71:14 | text | g34-classroom-pencil--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:71:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:71:85 | text | Okay, you mean the long pencil. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:71:181 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:72:14 | text | g34-classroom-pencil--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:72:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:72:85 | text | Okay, you mean the short ruler. | feedback-or-error | repeated-text |
| src/content/missions/grade34-classroom.ts:72:181 | text | object | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:9:15 | text | 약속 장소 | learner-text-candidate | repeated-text |
| src/content/missions/grade34-recess.ts:10:18 | text | 놀이터에 그네, 운동장 문, 벤치가 보입니다. | learner-text-candidate | repeated-text |
| src/content/missions/grade34-recess.ts:12:24 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/grade34-recess.ts:18:14 | text | g34-recess-place--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:18:60 | text | g34-recess-place-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:18:98 | text | there | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:18:117 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:18:154 | text | 불명확한 장소를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:19:14 | text | g34-recess-place--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:19:66 | text | g34-recess-place-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:19:104 | text | after lunch | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:19:129 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:20:14 | text | g34-recess-place--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:20:66 | text | g34-recess-place-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:20:104 | text | Let’s meet | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:20:128 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:24:14 | text | g34-recess-place--repair-best | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:24:59 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:24:78 | text | Where should we meet? | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:24:116 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:24:156 | text | 빠진 장소를 직접 물어 약속을 분명하게 했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:25:14 | text | g34-recess-place--repair-works | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:25:60 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:25:79 | text | Do you mean by the swings? | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:25:122 | text | works | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:25:159 | text | 떠올린 장소가 맞는지 확인해 대화를 이어 갔어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:26:14 | text | g34-recess-place--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:26:60 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:26:79 | text | What time? | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:26:122 | text | 만날 때는 알지만 만날 장소가 아직 없어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:30:14 | text | g34-recess-place--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:30:60 | text | 운동장 문 옆 벤치 | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:30:102 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:31:14 | text | g34-recess-place--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:31:60 | text | 그네 옆 | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:31:124 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:32:14 | text | g34-recess-place--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:32:60 | text | 교실 문 앞 | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:32:126 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:35:14 | text | g34-recess-place--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:35:62 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:35:81 | text | We’ll meet at the bench beside the playground gate. | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/content/missions/grade34-recess.ts:35:164 | text | 운동장 문 옆 벤치라는 뜻을 정확히 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:36:14 | text | g34-recess-place--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:36:62 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:36:81 | text | We’ll meet by the swings. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:36:171 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:37:14 | text | g34-recess-place--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:37:62 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:37:81 | text | We’ll meet by the classroom door. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:37:179 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:44:15 | text | 놀이 시작 시간 | learner-text-candidate | repeated-text |
| src/content/missions/grade34-recess.ts:45:18 | text | 종이 울려 친구의 말을 잘 듣지 못했습니다. | learner-text-candidate | repeated-text, shaming-tone |
| src/content/missions/grade34-recess.ts:47:24 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/grade34-recess.ts:50:14 | text | g34-recess-time-dialogue | learner-text-candidate | repeated-text |
| src/content/missions/grade34-recess.ts:50:51 | text | Partner | learner-text-candidate | repeated-text |
| src/content/missions/grade34-recess.ts:50:70 | text | You could not catch this sentence because the bell rang. | learner-text-candidate | long-or-dense, repeated-text |
| src/content/missions/grade34-recess.ts:50:147 | text | 종소리 때문에 친구가 말한 내용을 놓쳤습니다. | learner-text-candidate | repeated-text |
| src/content/missions/grade34-recess.ts:53:14 | text | g34-recess-time--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:53:59 | text | g34-recess-time-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:53:96 | text | the whole sentence | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:53:128 | text | whole-utterance | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:53:175 | text | 놓친 문장 전체를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:54:14 | text | g34-recess-time--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:54:65 | text | g34-recess-time-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:54:102 | text | the bell sound | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:54:130 | text | whole-utterance | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:55:14 | text | g34-recess-time--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:55:65 | text | g34-recess-time-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:55:102 | text | the speaker | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:55:127 | text | whole-utterance | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:59:14 | text | g34-recess-time--repair-best | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:59:58 | text | repeat | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:59:76 | text | Could you say that again? | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:59:118 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:59:158 | text | 문장 전체를 놓친 상황에 꼭 맞는 다시 말하기 표현이에요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:60:14 | text | g34-recess-time--repair-works | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:60:59 | text | repeat | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:60:77 | text | Sorry, can you repeat that? | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:60:121 | text | works | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:60:158 | text | 미안함을 덧붙여 정중하게 반복을 요청했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:61:14 | text | g34-recess-time--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:61:59 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:61:78 | text | Which one? | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:61:121 | text | 문장 전체를 놓쳤을 때 쓰는 다시 말하기 신호를 찾아보세요. | feedback-or-error | multiple-conditions, repeated-text |
| src/content/missions/grade34-recess.ts:65:14 | text | g34-recess-time--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:65:59 | text | 오후 1시 30분 | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:65:100 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:66:14 | text | g34-recess-time--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:66:59 | text | 오후 1시 | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:66:124 | text | whole-utterance | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:67:14 | text | g34-recess-time--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:67:59 | text | 오후 2시 30분 | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:67:128 | text | whole-utterance | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:70:14 | text | g34-recess-time--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:70:61 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:70:80 | text | The game starts at one thirty, right? | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:70:149 | text | 놀이 시작 시간이 오후 1시 30분이라는 뜻을 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:71:14 | text | g34-recess-time--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:71:61 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:71:80 | text | The game starts at one, right? | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:71:175 | text | whole-utterance | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:72:14 | text | g34-recess-time--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:72:61 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:72:80 | text | The game starts at two thirty, right? | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:72:182 | text | whole-utterance | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:79:15 | text | 장소를 다시 설명하기 | learner-text-candidate | repeated-text |
| src/content/missions/grade34-recess.ts:80:18 | text | 친구가 내가 말한 장소를 이해하지 못했습니다. | learner-text-candidate | repeated-text, shaming-tone |
| src/content/missions/grade34-recess.ts:82:24 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/grade34-recess.ts:89:14 | text | g34-recess-rephrase--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:89:63 | text | g34-recess-rephrase-you-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:89:108 | text | over there | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:89:132 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:89:169 | text | 불명확한 장소를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:90:14 | text | g34-recess-rephrase--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:90:69 | text | g34-recess-rephrase-you-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:90:114 | text | Let’s | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:90:133 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:91:14 | text | g34-recess-rephrase--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:91:69 | text | g34-recess-rephrase-you-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:91:114 | text | do it | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:91:133 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:95:14 | text | g34-recess-rephrase--repair-best | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:95:62 | text | rephrase | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:95:82 | text | Let me say it another way. Let’s draw with chalk beside the hopscotch grid. | feedback-or-error | long-or-dense, missing-term-explanation, repeated-text, technical-or-internal |
| src/content/missions/grade34-recess.ts:95:174 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:95:214 | text | 장소를 구체적으로 넣어 내 뜻을 분명하게 바꾸어 말했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:96:14 | text | g34-recess-rephrase--repair-works | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:96:63 | text | rephrase | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:96:83 | text | I mean the place beside the hopscotch grid. | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/content/missions/grade34-recess.ts:96:143 | text | works | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:96:180 | text | 핵심 장소를 다른 말로 풀어 상대가 이해할 수 있게 했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:97:14 | text | g34-recess-rephrase--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:97:63 | text | repeat | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:97:81 | text | Could you say that again? | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:97:139 | text | 상대가 내 말을 이해하지 못했으니 내 뜻을 다른 말로 풀어보세요. | feedback-or-error | repeated-text, shaming-tone |
| src/content/missions/grade34-recess.ts:101:14 | text | g34-recess-rephrase--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:101:63 | text | 사방치기 칸 옆 | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:101:103 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:102:14 | text | g34-recess-rephrase--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:102:63 | text | 큰 나무 아래 | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:102:130 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:103:14 | text | g34-recess-rephrase--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:103:63 | text | 그네 옆 | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:103:127 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:106:14 | text | g34-recess-rephrase--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:106:65 | text | rephrase | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:106:85 | text | Right, I mean the place beside the hopscotch grid. | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/content/missions/grade34-recess.ts:106:167 | text | 사방치기 칸 옆이라는 뜻을 다시 분명하게 말했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:107:14 | text | g34-recess-rephrase--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:107:65 | text | rephrase | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:107:85 | text | Right, I mean the place under the big tree. | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:107:193 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:108:14 | text | g34-recess-rephrase--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:108:65 | text | rephrase | feedback-or-error | repeated-text |
| src/content/missions/grade34-recess.ts:108:85 | text | Right, I mean the place beside the swings. | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/content/missions/grade34-recess.ts:108:192 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:9:15 | text | 비슷한 장소 이름 | learner-text-candidate | repeated-text |
| src/content/missions/grade56-directions.ts:10:18 | text | 길 안내에 체육관과 음악당이 함께 나옵니다. | instruction | repeated-text |
| src/content/missions/grade56-directions.ts:12:24 | text | [6영02-07] | learner-text-candidate | repeated-text |
| src/content/missions/grade56-directions.ts:12:37 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/content/missions/grade56-directions.ts:18:14 | text | g56-directions-place--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:18:64 | text | g56-directions-place-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:18:106 | text | the hall | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:18:128 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:18:165 | text | 불명확한 장소를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:19:14 | text | g56-directions-place--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:19:70 | text | g56-directions-place-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:19:112 | text | the bank | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:19:134 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:20:14 | text | g56-directions-place--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:20:70 | text | g56-directions-place-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:20:112 | text | After | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:20:131 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:24:14 | text | g56-directions-place--repair-best | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:24:63 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:24:82 | text | Which hall do you mean? | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:24:122 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:24:162 | text | 어느 홀인지 직접 물어 장소를 구체화했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:25:14 | text | g56-directions-place--repair-works | feedback-or-error, instruction | repeated-text |
| src/content/missions/grade56-directions.ts:25:64 | text | confirm | feedback-or-error, instruction | repeated-text |
| src/content/missions/grade56-directions.ts:25:83 | text | Do you mean the music hall? | feedback-or-error, instruction | repeated-text |
| src/content/missions/grade56-directions.ts:25:127 | text | works | feedback-or-error, instruction | repeated-text |
| src/content/missions/grade56-directions.ts:25:164 | text | 가능한 홀 이름을 확인해 길 안내를 이어 갔어요. | feedback-or-error, instruction | repeated-text |
| src/content/missions/grade56-directions.ts:26:14 | text | g56-directions-place--repair-retry | feedback-or-error, instruction | repeated-text |
| src/content/missions/grade56-directions.ts:26:64 | text | repeat | feedback-or-error, instruction | repeated-text |
| src/content/missions/grade56-directions.ts:26:82 | text | Could you say that again? | feedback-or-error, instruction | repeated-text |
| src/content/missions/grade56-directions.ts:26:140 | text | 안내는 들었지만 어느 장소인지 구체화해야 해요. | feedback-or-error, instruction | repeated-text |
| src/content/missions/grade56-directions.ts:30:14 | text | g56-directions-place--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:30:64 | text | 빵집 맞은편 음악당 | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:30:106 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:31:14 | text | g56-directions-place--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:31:64 | text | 빵집 맞은편 체육관 | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:31:134 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:32:14 | text | g56-directions-place--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:32:64 | text | 은행 옆 음악당 | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:32:132 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:35:14 | text | g56-directions-place--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:35:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:35:85 | text | I turn toward the music hall across from the bakery. | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:35:169 | text | 빵집 맞은편 음악당이라는 장소를 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:36:14 | text | g56-directions-place--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:36:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:36:85 | text | I turn toward the sports hall across from the bakery. | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:36:203 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:37:14 | text | g56-directions-place--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:37:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:37:85 | text | I turn toward the music hall beside the bank. | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/content/missions/grade56-directions.ts:37:195 | text | place | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:44:15 | text | 길 안내 순서 | instruction | repeated-text |
| src/content/missions/grade56-directions.ts:45:18 | text | 약국과 두 번째 신호등 뒤의 이동 순서를 확인합니다. | learner-text-candidate | repeated-text |
| src/content/missions/grade56-directions.ts:47:24 | text | [6영02-07] | learner-text-candidate | repeated-text |
| src/content/missions/grade56-directions.ts:47:37 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/content/missions/grade56-directions.ts:53:14 | text | g56-directions-sequence--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:53:67 | text | g56-directions-sequence-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:53:112 | text | the next turn | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:53:139 | text | sequence | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:53:179 | text | 불명확한 이동 순서를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:54:14 | text | g56-directions-sequence--ambiguity-distractor-a | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/grade56-directions.ts:54:73 | text | g56-directions-sequence-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:54:118 | text | the pharmacy | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:54:144 | text | sequence | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:55:14 | text | g56-directions-sequence--ambiguity-distractor-b | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/grade56-directions.ts:55:73 | text | g56-directions-sequence-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:55:118 | text | the second light | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:55:148 | text | sequence | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:59:14 | text | g56-directions-sequence--repair-best | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:59:66 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:59:85 | text | What should I do after the second traffic light? | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:59:150 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:59:190 | text | 두 번째 신호등 뒤의 순서를 직접 물었어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:60:14 | text | g56-directions-sequence--repair-works | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:60:67 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:60:86 | text | Do I turn right after the second light? | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:60:142 | text | works | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:60:179 | text | 예상한 방향이 맞는지 구체적으로 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:61:14 | text | g56-directions-sequence--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:61:67 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:61:86 | text | Where is the pharmacy? | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:61:141 | text | 약국 뒤에 어떤 순서로 움직이는지 확인해 보세요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:65:14 | text | g56-directions-sequence--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:65:67 | text | 두 번째 신호등 뒤 우회전, 왼쪽 첫 건물 도서관 | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:65:126 | text | 추가 응답과 이동 순서가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:66:14 | text | g56-directions-sequence--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:66:67 | text | 두 번째 신호등 뒤 좌회전 | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:66:141 | text | sequence | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:67:14 | text | g56-directions-sequence--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:67:67 | text | 우회전 뒤 왼쪽 두 번째 건물 도서관 | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:67:147 | text | sequence | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:70:14 | text | g56-directions-sequence--confirmation-correct | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/grade56-directions.ts:70:69 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:70:88 | text | After the second light, I turn right and find the library on the left. | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/grade56-directions.ts:70:190 | text | 두 번째 신호등 뒤 우회전과 도서관 위치를 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:71:14 | text | g56-directions-sequence--confirmation-retry-a | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/grade56-directions.ts:71:69 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:71:88 | text | After the second light, I turn left. | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:71:189 | text | sequence | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:72:14 | text | g56-directions-sequence--confirmation-retry-b | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/grade56-directions.ts:72:69 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-directions.ts:72:88 | text | After the second light, I turn right and pass the library on the right. | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/grade56-directions.ts:72:224 | text | sequence | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:9:15 | text | 행사 최종 계획 | learner-text-candidate | repeated-text |
| src/content/missions/grade56-events.ts:10:18 | text | 두 시간·장소 제안 가운데 확정된 계획을 확인합니다. | learner-text-candidate | repeated-text |
| src/content/missions/grade56-events.ts:12:24 | text | [6영02-07] | learner-text-candidate | repeated-text |
| src/content/missions/grade56-events.ts:12:37 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/content/missions/grade56-events.ts:12:50 | text | [6영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/grade56-events.ts:18:14 | text | g56-event-decision--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:18:62 | text | g56-event-decision-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:18:102 | text | the final time and place | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:18:140 | text | decision | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:18:180 | text | 최종 결정이 무엇인지 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:19:14 | text | g56-event-decision--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:19:68 | text | g56-event-decision-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:19:108 | text | the library | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:19:133 | text | decision | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:20:14 | text | g56-event-decision--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:20:68 | text | g56-event-decision-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:20:108 | text | the art room | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:20:134 | text | decision | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:24:14 | text | g56-event-decision--repair-best | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:24:61 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:24:80 | text | Do you mean we’re meeting at three in the art room? | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:24:148 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:24:188 | text | 두 제안 중 최종 시간과 장소를 함께 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:25:14 | text | g56-event-decision--repair-works | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:25:62 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:25:81 | text | Is the final plan three o’clock in the art room? | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:25:146 | text | works | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:25:183 | text | 최종 계획의 시간과 장소를 다시 묻는 자연스러운 표현이에요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:26:14 | text | g56-event-decision--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:26:62 | text | repeat | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:26:80 | text | Could you say that again? | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:26:138 | text | 두 제안 중 무엇이 최종 결정인지 확인해 보세요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:30:14 | text | g56-event-decision--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:30:62 | text | 오후 3시 미술실이 최종 계획 | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:30:110 | text | 추가 응답과 최종 결정의 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:31:14 | text | g56-event-decision--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:31:62 | text | 오후 2시 도서관이 최종 계획 | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:31:138 | text | decision | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:32:14 | text | g56-event-decision--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:32:62 | text | 오후 3시 도서관이 최종 계획 | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:32:138 | text | decision | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:35:14 | text | g56-event-decision--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:35:64 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:35:83 | text | Got it. The final plan is three o’clock in the art room. | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/grade56-events.ts:35:171 | text | 오후 3시 미술실이라는 최종 계획을 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:36:14 | text | g56-event-decision--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:36:64 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:36:83 | text | Got it. The final plan is two o’clock in the library. | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:36:201 | text | decision | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:37:14 | text | g56-event-decision--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:37:64 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-events.ts:37:83 | text | Got it. The final plan is three o’clock in the library. | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/grade56-events.ts:37:203 | text | decision | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:9:15 | text | 준비물 수량 | learner-text-candidate | repeated-text |
| src/content/missions/grade56-materials.ts:10:18 | text | 모둠 포스터에 필요한 종이 수량을 정합니다. | learner-text-candidate | repeated-text |
| src/content/missions/grade56-materials.ts:12:24 | text | [6영02-07] | learner-text-candidate | repeated-text |
| src/content/missions/grade56-materials.ts:12:37 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/content/missions/grade56-materials.ts:18:14 | text | g56-materials-quantity--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:18:66 | text | g56-materials-quantity-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:18:110 | text | some sheets | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:18:135 | text | quantity | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:18:175 | text | 불명확한 수량을 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:19:14 | text | g56-materials-quantity--ambiguity-distractor-a | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/grade56-materials.ts:19:72 | text | g56-materials-quantity-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:19:116 | text | poster paper | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:19:142 | text | quantity | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:20:14 | text | g56-materials-quantity--ambiguity-distractor-b | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/grade56-materials.ts:20:72 | text | g56-materials-quantity-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:20:116 | text | tomorrow | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:20:138 | text | quantity | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:24:14 | text | g56-materials-quantity--repair-best | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:24:65 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:24:84 | text | How many sheets of poster paper should I bring? | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:24:148 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:24:188 | text | 필요한 종이 수량을 정확히 물었어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:25:14 | text | g56-materials-quantity--repair-works | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:25:66 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:25:85 | text | How much poster paper should I bring? | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:25:139 | text | works | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:25:176 | text | 묻는 범위가 넓지만 필요한 수량을 확인할 수 있어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:26:14 | text | g56-materials-quantity--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:26:66 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:26:85 | text | Who will bring it? | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:26:136 | text | 담당자가 아니라 필요한 종이 수량을 확인해 보세요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:30:14 | text | g56-materials-quantity--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:30:66 | text | 포스터 종이 네 장 | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:30:108 | text | 추가 응답과 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:31:14 | text | g56-materials-quantity--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:31:66 | text | 포스터 종이 두 장 | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:31:136 | text | quantity | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:32:14 | text | g56-materials-quantity--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:32:66 | text | 포스터 종이 네 묶음 | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:32:137 | text | quantity | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:35:14 | text | g56-materials-quantity--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:35:68 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:35:87 | text | I’ll bring four sheets of poster paper tomorrow. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:35:167 | text | 포스터 종이 네 장이라는 수량을 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:36:14 | text | g56-materials-quantity--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:36:68 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:36:87 | text | I’ll bring two sheets of poster paper tomorrow. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:36:199 | text | quantity | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:37:14 | text | g56-materials-quantity--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:37:68 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:37:87 | text | I’ll bring four packs of poster paper tomorrow. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:37:199 | text | quantity | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:44:15 | text | 준비물 담당자 | learner-text-candidate | repeated-text |
| src/content/missions/grade56-materials.ts:45:18 | text | 테이프와 마커를 누가 가져올지 확인합니다. | learner-text-candidate | repeated-text |
| src/content/missions/grade56-materials.ts:47:24 | text | [6영02-07] | learner-text-candidate | repeated-text |
| src/content/missions/grade56-materials.ts:47:37 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/content/missions/grade56-materials.ts:47:50 | text | [6영02-10] | learner-text-candidate | repeated-text |
| src/content/missions/grade56-materials.ts:53:14 | text | g56-materials-person--ambiguity-target | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:53:64 | text | g56-materials-person-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:53:106 | text | who brings the markers | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:53:142 | text | person | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:53:180 | text | 빠진 담당자를 찾았어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:54:14 | text | g56-materials-person--ambiguity-distractor-a | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:54:70 | text | g56-materials-person-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:54:112 | text | Minseo has the tape | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:54:145 | text | person | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:55:14 | text | g56-materials-person--ambiguity-distractor-b | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:55:70 | text | g56-materials-person-dialogue | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:55:112 | text | the tape | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:55:134 | text | person | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:59:14 | text | g56-materials-person--repair-best | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:59:63 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:59:82 | text | Who will bring the markers? | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:59:126 | text | best-fit | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:59:166 | text | 빠진 담당자를 직접 물어 역할을 분명하게 했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:60:14 | text | g56-materials-person--repair-works | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:60:64 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:60:83 | text | Do you mean you will bring the markers? | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:60:139 | text | works | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:60:176 | text | 가능한 담당자가 맞는지 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:61:14 | text | g56-materials-person--repair-retry | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:61:64 | text | specify | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:61:83 | text | How many markers? | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:61:133 | text | 수량보다 누가 맡는지가 아직 정해지지 않았어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:65:14 | text | g56-materials-person--meaning-correct | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:65:64 | text | 상대가 마커 두 묶음, 민서가 테이프 담당 | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:65:119 | text | 추가 응답과 담당 의미가 맞아요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:66:14 | text | g56-materials-person--meaning-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:66:64 | text | 민서가 마커와 테이프 모두 담당 | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:66:141 | text | person | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:67:14 | text | g56-materials-person--meaning-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:67:64 | text | 상대가 테이프, 민서가 마커 담당 | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:67:142 | text | person | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:70:14 | text | g56-materials-person--confirmation-correct | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:70:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:70:85 | text | You’ll bring two packs of markers, and Minseo has the tape. | feedback-or-error | long-or-dense, repeated-text |
| src/content/missions/grade56-materials.ts:70:176 | text | 상대와 민서의 준비물 담당을 확인했어요. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:71:14 | text | g56-materials-person--confirmation-retry-a | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:71:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:71:85 | text | Minseo will bring the markers and the tape. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:71:193 | text | person | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:72:14 | text | g56-materials-person--confirmation-retry-b | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:72:66 | text | confirm | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:72:85 | text | You’ll bring the tape, and Minseo has the markers. | feedback-or-error | repeated-text |
| src/content/missions/grade56-materials.ts:72:200 | text | person | feedback-or-error | repeated-text |
| src/content/missions/missions.test.ts:81:7 | text | preserves the exact contracted dialogue, responses, labels, and feedback | feedback-or-error | long-or-dense |
| src/content/missions/missions.test.ts:81:87 | text | { const expected: Record | feedback-or-error | — |
| src/content/missions/missions.test.ts:96:27 | text | g34-recess-time-dialogue | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:96:64 | text | Partner | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:96:83 | text | You could not catch this sentence because the bell rang. | learner-text-candidate | long-or-dense, repeated-text |
| src/content/missions/missions.test.ts:96:160 | text | 종소리 때문에 친구가 말한 내용을 놓쳤습니다. | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:132:25 | text | 종소리 때문에 친구가 말한 내용을 놓쳤습니다. | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:142:20 | text | 창가에 있는 파란 상자 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:142:36 | text | 문 옆 빨간 상자 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:142:49 | text | 책상 아래 파란 상자 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:146:20 | text | 짧은 연필 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:146:29 | text | 긴 연필 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:146:37 | text | 짧은 자 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:150:20 | text | 운동장 문 옆 벤치 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:150:34 | text | 그네 옆 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:150:42 | text | 교실 문 앞 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:154:20 | text | 오후 1시 30분 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:154:33 | text | 오후 1시 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:154:42 | text | 오후 2시 30분 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:158:20 | text | 사방치기 칸 옆 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:158:32 | text | 큰 나무 아래 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:158:43 | text | 그네 옆 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:162:20 | text | 포스터 종이 네 장 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:162:34 | text | 포스터 종이 두 장 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:162:48 | text | 포스터 종이 네 묶음 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:166:20 | text | 상대가 마커 두 묶음, 민서가 테이프 담당 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:166:47 | text | 민서가 마커와 테이프 모두 담당 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:166:68 | text | 상대가 테이프, 민서가 마커 담당 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:170:20 | text | 빵집 맞은편 음악당 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:170:34 | text | 빵집 맞은편 체육관 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:170:48 | text | 은행 옆 음악당 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:174:20 | text | 두 번째 신호등 뒤 우회전, 왼쪽 첫 건물 도서관 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:174:51 | text | 두 번째 신호등 뒤 좌회전 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:174:69 | text | 우회전 뒤 왼쪽 두 번째 건물 도서관 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:178:20 | text | 오후 3시 미술실이 최종 계획 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:178:40 | text | 오후 2시 도서관이 최종 계획 | learner-text-candidate | repeated-text |
| src/content/missions/missions.test.ts:178:60 | text | 오후 3시 도서관이 최종 계획 | learner-text-candidate | repeated-text |
| src/content/strategies.ts:13:15 | text | 다시 말해 주세요 | learner-text-candidate | repeated-text |
| src/content/strategies.ts:14:17 | text | 전체 발화를 놓쳤을 때 | learner-text-candidate | repeated-text |
| src/content/strategies.ts:19:15 | text | 더 구체적으로 | learner-text-candidate | repeated-text |
| src/content/strategies.ts:20:17 | text | 대상·시간·장소·수량·담당·순서가 불분명할 때 | learner-text-candidate | repeated-text |
| src/content/strategies.ts:25:15 | text | 뜻 확인 | learner-text-candidate | repeated-text |
| src/content/strategies.ts:26:17 | text | 내가 이해한 내용이 맞는지 확인할 때 | learner-text-candidate | multiple-conditions, repeated-text |
| src/content/strategies.ts:31:15 | text | 다르게 말하기 | learner-text-candidate | repeated-text |
| src/content/strategies.ts:32:17 | text | 상대가 내 말을 이해하지 못했을 때 | learner-text-candidate | repeated-text, shaming-tone |
| src/domain/evaluation.test.ts:46:26 | text | feedbackKo | feedback-or-error | repeated-text |
| src/domain/evaluation.test.ts:46:40 | text | optionId | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/domain/evaluation.test.ts:46:52 | text | revealAnswer | feedback-or-error | repeated-text |
| src/domain/evaluation.test.ts:46:68 | text | stage | feedback-or-error | repeated-text |
| src/domain/evaluation.test.ts:46:77 | text | status | feedback-or-error | repeated-text |
| src/domain/evaluation.test.ts:47:36 | text | feedbackKo | feedback-or-error | repeated-text |
| src/domain/evaluation.test.ts:47:50 | text | naturalness | feedback-or-error | — |
| src/domain/evaluation.test.ts:47:65 | text | optionId | feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/domain/evaluation.test.ts:47:77 | text | revealAnswer | feedback-or-error | repeated-text |
| src/domain/evaluation.test.ts:47:93 | text | stage | feedback-or-error | repeated-text |
| src/domain/evaluation.test.ts:47:102 | text | status | feedback-or-error | repeated-text |
| src/domain/evaluation.test.ts:66:33 | text | Expected ${key} to contain an option | feedback-or-error | — |
| src/domain/evaluation.test.ts:71:8 | text | labelEn | learner-text-candidate | — |
| src/domain/evaluation.test.ts:73:8 | text | labelKo | learner-text-candidate | — |
| src/domain/evaluation.test.ts:88:12 | text | MissionChoiceError | feedback-or-error | repeated-text |
| src/domain/evaluation.test.ts:120:7 | text | preserves the two natural repair expressions and their distinct feedback | feedback-or-error | long-or-dense |
| src/domain/evaluation.test.ts:131:7 | text | returns hint-only feedback for every retry without leaking accepted content | feedback-or-error, hint | long-or-dense |
| src/domain/evaluation.test.ts:156:39 | text | 말은 들었지만 어느 상자인지가 아직 분명하지 않아요. | feedback-or-error | repeated-text |
| src/domain/evaluation.test.ts:157:48 | text | Which box? | feedback-or-error | repeated-text |
| src/domain/evaluation.test.ts:212:7 | text | rejects every unknown and wrong-stage ID with an exact MissionChoiceError | feedback-or-error | long-or-dense, missing-term-explanation, technical-or-internal |
| src/domain/evaluation.ts:16:18 | text | MissionChoiceError | feedback-or-error | repeated-text |
| src/domain/evaluation.ts:21:20 | text | Unhandled mission stage: ${String(value)} | feedback-or-error | repeated-text |
| src/domain/mission-contract.test.ts:27:4 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/domain/mission-contract.test.ts:28:4 | text | [6영02-07] | learner-text-candidate | repeated-text |
| src/domain/mission-contract.test.ts:29:4 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/domain/mission-contract.test.ts:30:4 | text | [6영02-10] | learner-text-candidate | repeated-text |
| src/domain/mission-contract.test.ts:51:15 | text | 그 상자에 크레용을 넣어 주세요. | learner-text-candidate | — |
| src/domain/mission-contract.test.ts:52:21 | text | 어느 상자인지 잘 모르겠어요. | learner-text-candidate | — |
| src/domain/mission-contract.test.ts:58:13 | text | that box | learner-text-candidate | repeated-text |
| src/domain/mission-contract.test.ts:61:16 | text | 대상이 여러 개라서 어느 상자인지 물어볼 수 있어요. | feedback-or-error | — |
| src/domain/mission-contract.test.ts:70:16 | text | 대상을 구체적으로 물었어요. | feedback-or-error | — |
| src/domain/mission-contract.test.ts:75:13 | text | 창가 옆 파란 상자 | learner-text-candidate | — |
| src/domain/mission-contract.test.ts:77:16 | text | 추가 응답의 핵심 정보를 연결했어요. | feedback-or-error | — |
| src/domain/mission-contract.test.ts:85:16 | text | 이해한 뜻을 다시 확인했어요. | feedback-or-error | — |
| src/domain/mission-contract.test.ts:107:13 | text | 상자 찾기 | learner-text-candidate | — |
| src/domain/mission-contract.test.ts:108:16 | text | 교실에서 물건을 정리합니다. | learner-text-candidate | — |
| src/domain/mission-contract.test.ts:139:29 | text | 서로 뜻을 확인하며 대화를 이어 갔어요. | feedback-or-error | — |
| src/domain/mission-contract.test.ts:170:48 | text | [4영02-11] | learner-text-candidate | — |
| src/domain/mission-contract.test.ts:253:5 | text | keeps session state and every action variant usable | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/domain/mission.ts:4:6 | text | [4영02-10] | learner-text-candidate | repeated-text |
| src/domain/mission.ts:5:6 | text | [6영02-07] | learner-text-candidate | repeated-text |
| src/domain/mission.ts:6:6 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/domain/mission.ts:7:6 | text | [6영02-10] | learner-text-candidate | repeated-text |
| src/domain/session.test.ts:19:54 | text | ${status}:${stage} | feedback-or-error | — |
| src/domain/session.test.ts:25:18 | text | 정답을 공개하는 위조 피드백 | feedback-or-error | — |
| src/domain/session.test.ts:78:33 | text | 비난하지 않고 확인 질문으로 대화를 이어 갔어요. | feedback-or-error | repeated-text |
| src/domain/session.test.ts:254:7 | text | throws controlled errors for incomplete state and IDs absent from the supplied mission | feedback-or-error | long-or-dense, missing-term-explanation, technical-or-internal |
| src/domain/session.ts:68:20 | text | Unhandled mission stage: ${String(value)} | feedback-or-error | repeated-text |
| src/domain/session.ts:86:58 | text | id === optionId); } function isCurrentStage(state: MissionSessionState, stage: MissionStage): boolean { return stagePhase[stage] === state.phase; } export function createInitialSession(): MissionSessionState { return { phase: 'center', missionId: null, selectedOptionIds: {}, acceptedResults: {}, latestResult: null, attempts: [], firstMeaningOptionId: null, evidence: null, }; } export function missionSessionReducer( state: MissionSessionState, action: MissionSessionAction, ): MissionSessionState { switch (action.type) { case 'mission.started': if (state.phase !== 'center') return state; return { ...createInitialSession(), phase: 'observe', missionId: action.missionId }; case 'choice.selected': if (!isCurrentStage(state, action.stage)) return state; return { ...state, selectedOptionIds: { ...state.selectedOptionIds, [action.stage]: action.optionId }, latestResult: null, }; case 'choice.submitted': { const { mission, result } = action; if ( mission.id !== state.missionId \|\| !isCurrentStage(state, result.stage) \|\| state.selectedOptionIds[result.stage] !== result.optionId \|\| !hasMissionOption(mission, result.stage, result.optionId) ) { return state; } const submittedResult = evaluateMissionChoice(mission, result.stage, result.optionId); const acceptedResults = submittedResult.status === 'accepted' ? { ...state.acceptedResults, [result.stage]: submittedResult } : state.acceptedResults; const firstMeaningOptionId = result.stage === 'meaning' && state.firstMeaningOptionId === null ? result.optionId : state.firstMeaningOptionId; const nextState: MissionSessionState = { ...state, phase: submittedResult.status === 'accepted' ? nextPhase[result.stage] : state.phase, acceptedResults, latestResult: submittedResult, attempts: [...state.attempts, { stage: result.stage, optionId: result.optionId, status: submittedResult.status }], firstMeaningOptionId, }; if (result.stage === 'confirmation' && submittedResult.status === 'accepted') { return { ...nextState, evidence: buildMissionEvidence(mission, nextState) }; } return nextState; } case 'phase.back': { const previousPhase = previousLearningPhase[state.phase]; if (!previousPhase) return state; return { ...state, phase: previousPhase, latestResult: null }; } case 'mission.restarted': if (state.missionId === null) return state; return { ...createInitialSession(), phase: 'observe', missionId: state.missionId }; case 'center.returned': return createInitialSession(); } return assertNever(action); } function incompleteEvidence(): never { throw new Error('Cannot build evidence before all learning stages are accepted'); } function acceptedResult( state: MissionSessionState, stage: MissionStage, ): EvaluationResult { const candidate = state.acceptedResults[stage]; if (!candidate \|\| candidate.stage !== stage \|\| candidate.status !== 'accepted') return incompleteEvidence(); return candidate; } function findEvidenceOption | button-or-action, feedback-or-error | long-or-dense, technical-or-internal |
| src/domain/session.ts:173:20 | text | Cannot build evidence before all learning stages are accepted | feedback-or-error | long-or-dense, missing-term-explanation, technical-or-internal |
| src/domain/session.ts:190:42 | text | id === optionId); if (!option) { throw new Error(`Cannot build evidence: ${stage} option ${optionId} was not found in supplied mission`); } return option; } function findAcceptedEvidenceOption | feedback-or-error | long-or-dense, technical-or-internal |
| src/domain/session.ts:192:22 | text | Cannot build evidence: ${stage} option ${optionId} was not found in supplied mission | feedback-or-error | long-or-dense, technical-or-internal |
| src/domain/session.ts:204:22 | text | Cannot build evidence: ${stage} option ${optionId} is not accepted in supplied mission | feedback-or-error | long-or-dense, technical-or-internal |
| src/domain/session.ts:234:31 | text | 비난하지 않고 확인 질문으로 대화를 이어 갔어요. | feedback-or-error | repeated-text |
| src/features/audio/AudioPreferenceToggle.tsx:9:15 | text | 음성 자료 | learner-text-candidate | — |
| src/features/audio/AudioPreferenceToggle.tsx:15:11 | text | {' '} 음성 자료 사용(선택 사항) | learner-text-candidate | — |
| src/features/audio/AudioPreferenceToggle.tsx:19:18 | text | 음성은 선택 사항이에요 · 발음 점수 없음 | learner-text-candidate | — |
| src/features/audio/AudioPreferenceToggle.tsx:20:12 | text | 컴퓨터가 만든 참고 소리예요. 음성 없이도 대본으로 미션을 할 수 있어요. | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:27:91 | text | { const { user } = renderWithUser( | learner-text-candidate | — |
| src/features/audio/MissionAudioPlayer.test.tsx:28:76 | text | 대화 듣기 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:30:58 | text | 재생 속도 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:35:40 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:35:58 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:39:72 | text | { vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new Error('blocked')); const { user } = renderWithUser( | feedback-or-error | long-or-dense |
| src/features/audio/MissionAudioPlayer.test.tsx:40:81 | text | blocked | feedback-or-error | — |
| src/features/audio/MissionAudioPlayer.test.tsx:41:76 | text | 대화 듣기 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:42:40 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:42:58 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:43:30 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:43:48 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:44:59 | text | 음성을 재생할 수 없어요. 아래 대본을 읽어 주세요. | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:48:40 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:48:58 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:49:30 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:49:48 | text | 일시 정지 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:52:30 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:52:48 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:55:94 | text | { renderWithUser( | learner-text-candidate | — |
| src/features/audio/MissionAudioPlayer.test.tsx:56:59 | text | 대화 듣기 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:61:30 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:61:48 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:66:107 | text | { resolvePlay = resolve; })); const view = renderWithUser( | learner-text-candidate | long-or-dense, repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:67:72 | text | 대화 듣기 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:67:81 | text | ); await view.user.click(screen.getByRole('button', { name: '재생' })); view.rerender( | button-or-action | long-or-dense, repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:68:45 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:68:63 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:69:64 | text | 응답 듣기 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:72:30 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:72:48 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:77:109 | text | { rejectPlay = reject; })); const view = renderWithUser( | learner-text-candidate | long-or-dense |
| src/features/audio/MissionAudioPlayer.test.tsx:78:72 | text | 대화 듣기 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:78:81 | text | ); await view.user.click(screen.getByRole('button', { name: '재생' })); view.rerender( | button-or-action | long-or-dense, repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:79:45 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:79:63 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:80:64 | text | 응답 듣기 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:81:53 | text | late rejection | feedback-or-error | — |
| src/features/audio/MissionAudioPlayer.test.tsx:83:30 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:83:48 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:88:107 | text | { resolvePlay = resolve; })); const view = renderWithUser( | learner-text-candidate | long-or-dense, repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:89:72 | text | 대화 듣기 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:90:45 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:90:63 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:91:45 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:91:63 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:93:30 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:93:48 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:99:107 | text | { resolvePlay = resolve; })); const view = renderWithUser( | learner-text-candidate | long-or-dense, repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:100:72 | text | 대화 듣기 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:101:45 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:101:63 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:104:32 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:104:50 | text | 일시 정지 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:112:67 | text | { resolveLatePlay = resolve; })); const view = renderWithUser( | learner-text-candidate | long-or-dense |
| src/features/audio/MissionAudioPlayer.test.tsx:113:84 | text | 대화 듣기 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:114:45 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:114:63 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:116:30 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:116:48 | text | 일시 정지 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:117:45 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:117:63 | text | 일시 정지 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:118:45 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:118:63 | text | 재생 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:121:32 | text | button | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.test.tsx:121:50 | text | 일시 정지 | button-or-action | repeated-text |
| src/features/audio/MissionAudioPlayer.tsx:13:24 | text | ${labelKo} 음원 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.tsx:15:18 | text | { const audio = audioRef.current; if (audio) audio.playbackRate = playbackRate; }, [playbackRate]); return ( | learner-text-candidate | long-or-dense |
| src/features/audio/MissionAudioPlayer.tsx:32:69 | text | {isPlaying ? '일시 정지' : '재생'} | button-or-action | — |
| src/features/audio/MissionAudioPlayer.tsx:33:25 | text | 일시 정지 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.tsx:33:35 | text | 재생 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.tsx:35:16 | text | 재생 속도 | learner-text-candidate | repeated-text |
| src/features/audio/MissionAudioPlayer.tsx:39:25 | aria-label | 재생 속도 | aria-label | repeated-text |
| src/features/audio/MissionAudioPlayer.tsx:48:42 | text | {playbackError ? | feedback-or-error | — |
| src/features/audio/MissionAudioPlayer.tsx:49:52 | text | polite | feedback-or-error | repeated-text |
| src/features/audio/MissionAudioPlayer.tsx:49:79 | text | : null} | feedback-or-error | repeated-text, technical-or-internal |
| src/features/audio/MissionAudioPlayer.tsx:50:10 | text | 컴퓨터가 만든 참고 소리이며 발음 점수는 없어요. 아래 대본으로도 연습할 수 있어요. | learner-text-candidate | — |
| src/features/audio/audioIntegration.test.tsx:11:56 | text | 대화 듣기 음원 | learner-text-candidate | repeated-text |
| src/features/audio/audioIntegration.test.tsx:23:50 | text | 대화 듣기 음원 | learner-text-candidate | repeated-text |
| src/features/audio/audioIntegration.test.tsx:28:56 | text | 응답 듣기 음원 | learner-text-candidate | repeated-text |
| src/features/audio/audioIntegration.test.tsx:40:50 | text | 응답 듣기 음원 | learner-text-candidate | repeated-text |
| src/features/audio/useAudioPlayer.ts:19:70 | text | (1); const [playbackError, setPlaybackError] = useState | feedback-or-error | long-or-dense, technical-or-internal |
| src/features/audio/useAudioPlayer.ts:89:25 | text | 음성을 재생할 수 없어요. 아래 대본을 읽어 주세요. | feedback-or-error | repeated-text |
| src/features/center/EmptyMissionState.tsx:5:47 | text | void; } export function EmptyMissionState({ gradeBand, onGradeBandChange }: EmptyMissionStateProps) { const alternateGradeBand: GradeBand = gradeBand === '3-4' ? '5-6' : '3-4'; const alternateLabel = alternateGradeBand === '3-4' ? '3~4학년' : '5~6학년'; return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/center/EmptyMissionState.tsx:10:58 | text | 3~4학년 | learner-text-candidate | repeated-text |
| src/features/center/EmptyMissionState.tsx:10:68 | text | 5~6학년 | learner-text-candidate | repeated-text |
| src/features/center/EmptyMissionState.tsx:14:10 | text | 이 수준의 미션을 찾을 수 없어요. | learner-text-candidate | repeated-text |
| src/features/center/EmptyMissionState.tsx:15:10 | text | 다른 수준을 골라 미션을 다시 찾아볼까요? | learner-text-candidate | — |
| src/features/center/EmptyMissionState.tsx:16:83 | text | {alternateLabel} 미션 보기 | button-or-action | — |
| src/features/center/LearningPromise.tsx:8:46 | text | 대화 수리 신호센터 | heading | repeated-text |
| src/features/center/LearningPromise.tsx:9:10 | text | 못 알아들은 순간은 대화를 이어 가는 신호예요. | learner-text-candidate | repeated-text |
| src/features/center/LearningPromise.tsx:10:54 | text | first-action-heading | heading | — |
| src/features/center/LearningPromise.tsx:11:39 | text | 오늘의 첫 행동 | heading | repeated-text |
| src/features/center/LearningPromise.tsx:12:12 | text | 학년을 고른 뒤 | learner-text-candidate | — |
| src/features/center/LearningPromise.tsx:12:63 | text | 부터 시작해 보세요. | learner-text-candidate | — |
| src/features/center/MissionCard.tsx:5:34 | text | void; isRecommended?: boolean; } function gradeLabel(gradeBand: Mission['gradeBand']) { return gradeBand === '3-4' ? '3~4학년' : '5~6학년'; } function contextLabel(context: Mission['politenessContext']) { return context === 'classroom-polite' ? '교실에서 정중하게 말하는 상황' : '친구와 간단히 말하는 상황'; } export function MissionCard({ mission, onStart, isRecommended = false }: MissionCardProps) { return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/center/MissionCard.tsx:9:41 | text | gradeBand | learner-text-candidate | — |
| src/features/center/MissionCard.tsx:10:33 | text | 3~4학년 | learner-text-candidate | repeated-text |
| src/features/center/MissionCard.tsx:10:43 | text | 5~6학년 | learner-text-candidate | repeated-text |
| src/features/center/MissionCard.tsx:13:41 | text | politenessContext | learner-text-candidate | — |
| src/features/center/MissionCard.tsx:15:8 | text | 교실에서 정중하게 말하는 상황 | learner-text-candidate | — |
| src/features/center/MissionCard.tsx:16:8 | text | 친구와 간단히 말하는 상황 | learner-text-candidate | — |
| src/features/center/MissionCard.tsx:21:93 | text | {isRecommended ? ( | learner-text-candidate | — |
| src/features/center/MissionCard.tsx:24:40 | text | 추천 미션 | learner-text-candidate | repeated-text |
| src/features/center/MissionCard.tsx:25:85 | text | 먼저 해 보기 | learner-text-candidate | repeated-text |
| src/features/center/MissionCard.tsx:26:15 | text | ) : null} | heading | repeated-text, technical-or-internal |
| src/features/center/MissionCard.tsx:31:15 | text | {gradeLabel(mission.gradeBand)} | learner-text-candidate | — |
| src/features/center/MissionCard.tsx:31:62 | text | {contextLabel(mission.politenessContext)} | learner-text-candidate | — |
| src/features/center/MissionCard.tsx:36:44 | text | ${mission.id}-recommendation | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/features/center/MissionCard.tsx:38:8 | text | {mission.titleKo} 미션 시작 | button-or-action | — |
| src/features/center/SetupPanel.tsx:19:57 | text | grade-selection-heading | heading | — |
| src/features/center/SetupPanel.tsx:20:42 | text | 수준에 맞는 미션 고르기 | heading | — |
| src/features/center/SetupPanel.tsx:22:19 | text | 학년 수준 선택 | learner-text-candidate | — |
| src/features/center/SetupPanel.tsx:28:12 | text | 3~4학년 | button-or-action | repeated-text |
| src/features/center/SetupPanel.tsx:36:12 | text | 5~6학년 | button-or-action | repeated-text |
| src/features/center/SetupPanel.tsx:40:58 | text | 현재 선택: {gradeBand === '3-4' ? '3~4학년' : '5~6학년'} | learner-text-candidate | — |
| src/features/center/SetupPanel.tsx:40:89 | text | 3~4학년 | learner-text-candidate | repeated-text |
| src/features/center/SetupPanel.tsx:40:99 | text | 5~6학년 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:12:33 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:13:30 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:13:48 | text | 어느 상자 미션 시작 | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:14:30 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:14:48 | text | 어떤 연필 미션 시작 | button-or-action | — |
| src/features/center/SignalCenter.test.tsx:16:40 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:16:58 | text | 5~6학년 | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:18:33 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:19:30 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:19:48 | text | 준비물 수량 미션 시작 | button-or-action | — |
| src/features/center/SignalCenter.test.tsx:20:30 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:20:48 | text | 행사 최종 계획 미션 시작 | button-or-action | — |
| src/features/center/SignalCenter.test.tsx:21:30 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:21:48 | text | 3~4학년 | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:21:76 | text | aria-pressed | button-or-action | missing-term-explanation, repeated-text, technical-or-internal |
| src/features/center/SignalCenter.test.tsx:21:92 | text | false | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:22:30 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:22:48 | text | 5~6학년 | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:22:76 | text | aria-pressed | button-or-action | missing-term-explanation, repeated-text, technical-or-internal |
| src/features/center/SignalCenter.test.tsx:22:92 | text | true | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:23:30 | text | 현재 선택: 5~6학년 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:24:30 | text | 먼저 해 보기 | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:24:49 | text | article | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:24:75 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:24:98 | text | gi-pulse | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:32:30 | text | 먼저 해 보기 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:33:30 | text | 먼저 해 보기 | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:33:49 | text | article | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:33:75 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:33:98 | text | gi-pulse | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:42:21 | text | header | heading | — |
| src/features/center/SignalCenter.test.tsx:42:53 | text | section[aria-labelledby="grade-selection-heading"] | heading | long-or-dense, repeated-text, technical-or-internal |
| src/features/center/SignalCenter.test.tsx:43:21 | text | section[aria-labelledby="grade-selection-heading"] | heading | long-or-dense, repeated-text, technical-or-internal |
| src/features/center/SignalCenter.test.tsx:43:97 | text | .audio-preference-toggle | heading | repeated-text |
| src/features/center/SignalCenter.test.tsx:44:21 | text | .audio-preference-toggle | heading | repeated-text |
| src/features/center/SignalCenter.test.tsx:44:71 | text | section[aria-labelledby="mission-list-heading"] | heading | long-or-dense, technical-or-internal |
| src/features/center/SignalCenter.test.tsx:51:30 | text | heading | heading | repeated-text |
| src/features/center/SignalCenter.test.tsx:51:49 | text | 오늘의 첫 행동 | heading | repeated-text |
| src/features/center/SignalCenter.test.tsx:52:74 | text | 학년을 고른 뒤 어느 상자부터 시작해 보세요. | learner-text-candidate | — |
| src/features/center/SignalCenter.test.tsx:53:30 | text | 어느 상자 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:58:30 | text | 추천 미션 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:61:7 | text | keeps the recommended card labels in one compact row for narrow screens | learner-text-candidate | long-or-dense |
| src/features/center/SignalCenter.test.tsx:61:86 | text | { render( | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:65:40 | text | .mission-card-labels | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:66:40 | text | .mission-card-labels | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:66:88 | text | 추천 미션 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:67:40 | text | .mission-card-labels | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:67:88 | text | 먼저 해 보기 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:77:30 | text | 컴퓨터가 만든 참고 소리예요. 음성 없이도 대본으로 미션을 할 수 있어요. | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:82:40 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:82:58 | text | 5~6학년 | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:89:30 | text | 못 알아들은 순간은 대화를 이어 가는 신호예요. | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:90:30 | text | 이해가 안 되면 다시 물어도 괜찮아요. | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:91:30 | text | 권장 학습 시간 20~30분 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:92:30 | text | 이름을 묻지 않으며, 새로고침하면 현재 통신 기록이 사라져요. | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:93:30 | text | 전략 도움말 | hint | repeated-text |
| src/features/center/SignalCenter.test.tsx:94:30 | text | 대화 수리 전략 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:100:57 | text | 전략 한눈에 보기 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:101:30 | text | heading | heading | repeated-text |
| src/features/center/SignalCenter.test.tsx:101:49 | text | 전략 한눈에 보기 | heading | repeated-text |
| src/features/center/SignalCenter.test.tsx:102:40 | text | 다시 말해 주세요 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:103:40 | text | 전체 발화를 놓쳤을 때 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:104:40 | text | 더 구체적으로 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:105:40 | text | 대상·시간·장소·수량·담당·순서가 불분명할 때 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:106:40 | text | 뜻 확인 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:107:40 | text | 내가 이해한 내용이 맞는지 확인할 때 | learner-text-candidate | multiple-conditions, repeated-text |
| src/features/center/SignalCenter.test.tsx:108:40 | text | 다르게 말하기 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:109:40 | text | 상대가 내 말을 이해하지 못했을 때 | learner-text-candidate | repeated-text, shaming-tone |
| src/features/center/SignalCenter.test.tsx:110:30 | text | 대화 수리 전략 | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:127:58 | text | 이 수준의 미션을 찾을 수 없어요. | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:128:40 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:128:58 | text | 5~6학년 미션 보기 | button-or-action | — |
| src/features/center/SignalCenter.test.tsx:139:40 | text | button | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:139:58 | text | 어느 상자 미션 시작 | button-or-action | repeated-text |
| src/features/center/SignalCenter.test.tsx:141:30 | text | heading | heading | repeated-text |
| src/features/center/SignalCenter.test.tsx:141:49 | text | 다시 물어볼 부분 찾기 | heading | repeated-text |
| src/features/center/SignalCenter.test.tsx:142:30 | text | heading | heading | repeated-text |
| src/features/center/SignalCenter.test.tsx:142:49 | text | 어느 상자 | heading | repeated-text |
| src/features/center/SignalCenter.test.tsx:143:30 | text | 교실에 빨간 상자와 파란 상자가 함께 있습니다. | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:154:44 | text | 어느 상자인지 물어보세요. | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.test.tsx:161:30 | text | 어느 상자인지 물어보세요. | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.tsx:29:81 | text | 첫 미션 | learner-text-candidate | — |
| src/features/center/SignalCenter.tsx:38:33 | text | mission-list-heading | heading | — |
| src/features/center/SignalCenter.tsx:39:39 | text | 미션 선택 | heading | repeated-text |
| src/features/center/SignalCenter.tsx:51:35 | text | 이름을 묻지 않으며, 새로고침하면 현재 통신 기록이 사라져요. | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.tsx:52:79 | text | 학년·음성을 고른 뒤 시작하세요. | learner-text-candidate | — |
| src/features/center/SignalCenter.tsx:54:33 | text | today-strategy-heading | heading | — |
| src/features/center/SignalCenter.tsx:55:41 | text | 오늘의 전략 | heading | repeated-text |
| src/features/center/SignalCenter.tsx:56:12 | text | 이해가 안 되면 다시 물어도 괜찮아요. | learner-text-candidate | repeated-text |
| src/features/center/SignalCenter.tsx:57:12 | text | 권장 학습 시간 20~30분 | learner-text-candidate | repeated-text |
| src/features/center/StrategyLegend.tsx:7:16 | text | 전략 도움말 | hint | repeated-text |
| src/features/center/StrategyLegend.tsx:8:33 | text | strategy-legend-heading | heading | — |
| src/features/center/StrategyLegend.tsx:9:42 | text | 대화 수리 전략 | heading | repeated-text |
| src/features/center/StrategyLegend.tsx:15:32 | text | ${strategy.labelKo} 예시 | learner-text-candidate | repeated-text |
| src/features/center/StrategySummary.tsx:5:60 | text | strategy-summary-heading | heading | — |
| src/features/center/StrategySummary.tsx:6:41 | text | 전략 한눈에 보기 | heading | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:8:25 | text | 어떤 정보가 아직 없나요? 확인 문장에서 대상 정보가 바뀌거나 빠졌어요. | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:9:28 | text | 어떤 정보가 아직 없나요? 확인 문장에서 대상 정보가 바뀌거나 빠졌어요. | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:10:24 | text | 어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요. | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:11:23 | text | 어떤 정보가 아직 없나요? 확인 문장에서 문장 전체 정보가 바뀌거나 빠졌어요. | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:12:27 | text | 어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요. | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:13:30 | text | 어떤 정보가 아직 없나요? 확인 문장에서 수량 정보가 바뀌거나 빠졌어요. | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:14:28 | text | 어떤 정보가 아직 없나요? 확인 문장에서 담당자 정보가 바뀌거나 빠졌어요. | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:15:28 | text | 어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요. | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:16:31 | text | 어떤 정보가 아직 없나요? 확인 문장에서 순서 정보가 바뀌거나 빠졌어요. | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:17:26 | text | 어떤 정보가 아직 없나요? 확인 문장에서 최종 결정 정보가 바뀌거나 빠졌어요. | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:23:32 | text | heading | heading | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:23:51 | text | 통신 기록 | heading | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:27:37 | text | test mission has no accepted confirmation | feedback-or-error | — |
| src/features/confirmation/ConfirmationCall.test.tsx:30:40 | text | button | button-or-action | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:30:58 | text | 확인 질문 보내기 | button-or-action | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:32:30 | text | heading | heading | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:32:49 | text | 통신 기록 | heading | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:33:33 | text | 뜻 확인 | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:34:30 | text | 의미 확인 완료 | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:37:7 | text | keeps the retry feedback tied to confirmation and does not reveal the answer | feedback-or-error | long-or-dense |
| src/features/confirmation/ConfirmationCall.test.tsx:41:34 | text | test mission has no retry confirmation | feedback-or-error | — |
| src/features/confirmation/ConfirmationCall.test.tsx:44:40 | text | button | button-or-action | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:44:58 | text | 확인 질문 보내기 | button-or-action | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:46:59 | text | 어떤 정보가 아직 없나요? | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:50:32 | text | heading | heading | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:50:51 | text | 통신 기록 | heading | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:56:47 | text | 내가 이해한 뜻을 영어로 다시 확인해 보세요. | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:63:7 | text | checks every retry option for every mission with an independent slot and mode hint | hint | long-or-dense |
| src/features/confirmation/ConfirmationCall.test.tsx:67:56 | text | confirmation options incomplete for ${mission.id} | feedback-or-error, hint | long-or-dense, missing-term-explanation, technical-or-internal |
| src/features/confirmation/ConfirmationCall.test.tsx:72:44 | text | button | button-or-action | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:72:62 | text | 확인 질문 보내기 | button-or-action | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:77:71 | text | 장소 | hint | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:77:108 | text | 정보 | hint | — |
| src/features/confirmation/ConfirmationCall.test.tsx:78:34 | text | heading | heading | repeated-text |
| src/features/confirmation/ConfirmationCall.test.tsx:78:53 | text | 내가 이해한 뜻 확인하기 | heading | repeated-text |
| src/features/confirmation/ConfirmationCall.tsx:11:34 | text | void; } export function ConfirmationCall({ mission, selectedOptionId, latestResult, onSelect, onSubmit, }: ConfirmationCallProps) { const confirmationResult = latestResult?.stage === 'confirmation' ? latestResult : null; return ( | heading, button-or-action | long-or-dense, technical-or-internal |
| src/features/confirmation/ConfirmationCall.tsx:24:31 | text | confirm-heading | heading | — |
| src/features/confirmation/ConfirmationCall.tsx:25:34 | text | 확인 통화 | learner-text-candidate | — |
| src/features/confirmation/ConfirmationCall.tsx:26:46 | text | 내가 이해한 뜻 확인하기 | heading | repeated-text |
| src/features/confirmation/ConfirmationCall.tsx:27:20 | text | 상대의 추가 답을 바탕으로 내가 이해한 뜻을 다시 연결해 보세요. | learner-text-candidate | — |
| src/features/confirmation/ConfirmationCall.tsx:29:17 | text | 내가 이해한 뜻을 영어로 다시 확인해 보세요. | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.tsx:31:99 | text | true | learner-text-candidate | repeated-text |
| src/features/confirmation/ConfirmationCall.tsx:31:108 | text | false | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:15:7 | text | keeps the learner in observation and announces a Korean hint after a wrong slot | feedback-or-error, hint | long-or-dense |
| src/features/observation/DialogueObservation.test.tsx:18:40 | text | button | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:18:58 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:19:59 | text | 어떤 정보가 아직 없나요? | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:20:30 | text | heading | heading | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:20:49 | text | 다시 물어볼 부분 찾기 | heading | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:27:40 | text | button | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:27:58 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:28:30 | text | heading | heading | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:28:49 | text | 어떻게 다시 물어볼까요? | heading | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:34:53 | text | 대화 순서 | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:36:46 | text | ${index + 1}.${turn.speaker}${turn.textEn}${turn.obscuredLabelKo ?? ''} | learner-text-candidate | long-or-dense |
| src/features/observation/DialogueObservation.test.tsx:39:86 | text | lang | learner-text-candidate | — |
| src/features/observation/DialogueObservation.test.tsx:39:94 | text | ko | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:40:30 | text | button | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:40:48 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:43:7 | text | keeps the exact dialogue text with voice off and labels the optional player with voice on | learner-text-candidate | long-or-dense |
| src/features/observation/DialogueObservation.test.tsx:47:50 | text | 대화 듣기 음원 | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:53:48 | text | 대화 듣기 음원 | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:61:47 | text | 어느 부분이 분명하지 않나요? | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:65:30 | text | button | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:65:48 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:71:40 | text | button | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:71:58 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:80:40 | text | button | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:80:58 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:81:30 | text | heading | heading | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:81:49 | text | 어떻게 다시 물어볼까요? | heading | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:86:7 | text | renders semantic headings for every harness phase without later-stage interactions | heading | long-or-dense |
| src/features/observation/DialogueObservation.test.tsx:88:32 | text | 어떻게 다시 물어볼까요? | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:89:34 | text | 상대의 대답 살펴보기 | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:90:38 | text | 내가 이해한 뜻 확인하기 | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:93:32 | text | heading | heading | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:99:82 | text | { render( | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:101:37 | text | send-confirmation | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:101:107 | aria-label | 다른 이름 | aria-label, button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:101:114 | text | caller text | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:105:38 | text | button | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:105:56 | text | 확인 질문 보내기 | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:106:37 | text | type | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:106:45 | text | button | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:107:33 | text | gi-pulse | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:107:45 | text | caller-class | button-or-action | — |
| src/features/observation/DialogueObservation.test.tsx:108:43 | text | caller text | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:109:32 | text | button | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:109:50 | text | 다른 이름 | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:119:40 | text | button | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:119:58 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:121:39 | text | 어떤 정보가 아직 없나요? | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.test.tsx:124:7 | text | reports invalid phase and missing accepted replay options with controlled errors | feedback-or-error | long-or-dense, missing-term-explanation, technical-or-internal |
| src/features/observation/DialogueObservation.tsx:14:34 | text | void; } export function DialogueObservation({ mission, selectedOptionId, latestResult, voiceEnabled = false, onSelect, onSubmit, }: DialogueObservationProps) { return ( | heading, button-or-action | long-or-dense, technical-or-internal |
| src/features/observation/DialogueObservation.tsx:26:31 | text | observe-heading | heading | — |
| src/features/observation/DialogueObservation.tsx:27:34 | text | 대화 관측 | learner-text-candidate | — |
| src/features/observation/DialogueObservation.tsx:28:46 | text | 다시 물어볼 부분 찾기 | heading | repeated-text |
| src/features/observation/DialogueObservation.tsx:29:10 | text | 대화에서 어떤 부분이 분명하지 않은지 살펴보세요. | learner-text-candidate | — |
| src/features/observation/DialogueObservation.tsx:30:49 | aria-label | 대화 순서 | aria-label | repeated-text |
| src/features/observation/DialogueObservation.tsx:34:12 | text | {voiceEnabled && mission.audioCues[0] ? ( | learner-text-candidate | — |
| src/features/observation/DialogueObservation.tsx:36:65 | text | 대화 듣기 | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.tsx:36:74 | text | ) : null} | learner-text-candidate | repeated-text, technical-or-internal |
| src/features/observation/DialogueObservation.tsx:39:17 | text | 어느 부분이 분명하지 않나요? | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.tsx:41:99 | text | true | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.tsx:41:108 | text | false | learner-text-candidate | repeated-text |
| src/features/observation/DialogueObservation.tsx:49:37 | text | en | learner-text-candidate | — |
| src/features/observation/DialogueTurnView.tsx:12:56 | text | 문장 ${sequence} | learner-text-candidate | — |
| src/features/observation/DialogueTurnView.tsx:12:73 | text | {sequence}. | learner-text-candidate | — |
| src/features/observation/DialogueTurnView.tsx:15:91 | text | : null} {turn.obscuredLabelKo ? | learner-text-candidate | technical-or-internal |
| src/features/observation/DialogueTurnView.tsx:16:55 | text | ko | learner-text-candidate | repeated-text |
| src/features/observation/DialogueTurnView.tsx:16:63 | text | p | learner-text-candidate | — |
| src/features/observation/DialogueTurnView.tsx:16:103 | text | : null} | learner-text-candidate | repeated-text, technical-or-internal |
| src/features/record/CommunicationRecord.test.tsx:18:41 | text | test session should have evidence | feedback-or-error | missing-term-explanation, technical-or-internal |
| src/features/record/CommunicationRecord.test.tsx:35:46 | text | option.accepted); if (!retry \|\| !accepted) throw new Error(`retry-rich fixture incomplete for ${missionId}/${stage}`); state = missionSessionReducer(state, { type: 'choice.selected', stage, optionId: retry.id }); state = missionSessionReducer(state, { type: 'choice.submitted', mission, result: { stage, optionId: retry.id, status: 'retry', feedbackKo: retry.feedbackKo, revealAnswer: false } }); state = missionSessionReducer(state, { type: 'choice.selected', stage, optionId: accepted.id }); state = missionSessionReducer(state, { type: 'choice.submitted', mission, result: { stage, optionId: accepted.id, status: 'accepted', feedbackKo: accepted.feedbackKo, revealAnswer: false } }); } if (!state.evidence) throw new Error(`retry-rich fixture has no evidence for ${missionId}`); return { mission, evidence: state.evidence }; } function MissionFlowHarness({ initialState, exposeState = false }: { initialState: MissionSessionState; exposeState?: boolean }) { const mission = getMissionById(initialState.missionId ?? 'g34-classroom-box'); const [session, dispatch] = useReducer(missionSessionReducer, initialState); return ( | button-or-action, feedback-or-error | long-or-dense, technical-or-internal |
| src/features/record/CommunicationRecord.test.tsx:36:47 | text | retry-rich fixture incomplete for ${missionId}/${stage} | feedback-or-error | long-or-dense, missing-term-explanation, technical-or-internal |
| src/features/record/CommunicationRecord.test.tsx:38:51 | text | choice.submitted | button-or-action, feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/features/record/CommunicationRecord.test.tsx:38:125 | text | retry | button-or-action, feedback-or-error | — |
| src/features/record/CommunicationRecord.test.tsx:40:51 | text | choice.submitted | button-or-action, feedback-or-error | missing-term-explanation, repeated-text, technical-or-internal |
| src/features/record/CommunicationRecord.test.tsx:40:128 | text | accepted | button-or-action, feedback-or-error | — |
| src/features/record/CommunicationRecord.test.tsx:42:41 | text | retry-rich fixture has no evidence for ${missionId} | feedback-or-error | long-or-dense, missing-term-explanation, technical-or-internal |
| src/features/record/CommunicationRecord.test.tsx:62:30 | text | heading | heading | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:62:49 | text | 통신 기록 | heading | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:63:30 | text | 처음 생각한 뜻 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:64:30 | text | 확인한 뜻 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:65:30 | text | 의미 확인 완료 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:73:30 | text | heading | heading | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:73:49 | text | 오늘 배운 점 | heading | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:74:30 | text | heading | heading | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:74:49 | text | 다음에 해 보기 | heading | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:75:47 | text | 교사용 보기 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:75:82 | text | 오늘 배운 점 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:78:7 | text | renders the exact mission slot, strategy, collaboration feedback, and attempt counts | feedback-or-error | long-or-dense |
| src/features/record/CommunicationRecord.test.tsx:78:99 | text | { const { mission, evidence } = completedEvidence('g56-materials-person'); renderWithUser( | feedback-or-error | long-or-dense, technical-or-internal |
| src/features/record/CommunicationRecord.test.tsx:82:30 | text | 담당자 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:83:30 | text | 더 구체적으로 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:84:30 | text | 비난하지 않고 확인 질문으로 대화를 이어 갔어요. | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:93:40 | text | button | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:93:58 | text | 이 미션 다시 하기 | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:94:40 | text | button | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:94:58 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:102:30 | text | button | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:102:48 | text | 이 미션 다시 하기 | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:102:77 | text | primary-action | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:103:30 | text | button | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:103:48 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:103:81 | text | primary-action | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:106:7 | text | renders a controlled error for impossible evidence references | feedback-or-error | long-or-dense, missing-term-explanation, technical-or-internal |
| src/features/record/CommunicationRecord.test.tsx:106:76 | text | { const { mission, evidence } = completedEvidence('g34-classroom-box'); renderWithUser( | feedback-or-error | long-or-dense, technical-or-internal |
| src/features/record/CommunicationRecord.test.tsx:117:32 | text | 의미 확인 완료 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:140:32 | text | button | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:140:50 | text | 이 미션 다시 하기 | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:141:32 | text | button | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:141:50 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:154:32 | text | 처음 생각한 뜻 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:155:32 | text | 확인한 뜻 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:162:158 | text | ); await retryView.user.click(screen.getByRole('button', { name: '이 미션 다시 하기' })); expect(retryView.container.querySelector('[data-session-phase="observe"]')).toBeInTheDocument(); expect(screen.getByRole('heading', { name: '다시 물어볼 부분 찾기' })).toBeVisible(); retryView.unmount(); const centerView = renderWithUser( | heading, button-or-action | long-or-dense |
| src/features/record/CommunicationRecord.test.tsx:163:50 | text | button | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:163:68 | text | 이 미션 다시 하기 | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:165:30 | text | heading | heading | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:165:49 | text | 다시 물어볼 부분 찾기 | heading | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:169:51 | text | button | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:169:69 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:176:58 | text | 학습 증거를 찾을 수 없습니다 | learner-text-candidate | — |
| src/features/record/CommunicationRecord.test.tsx:177:30 | text | button | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:177:48 | text | 이 미션 다시 하기 | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:178:30 | text | button | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:178:48 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:186:47 | text | 교사용 보기 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:187:30 | text | 교사용 보기 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:188:30 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:190:40 | text | 교사용 보기 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:191:30 | text | [6영02-09] | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:192:30 | text | 불명확한 부분을 찾았어요 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:193:30 | text | 상황에 맞는 수리 전략을 골랐어요 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:194:30 | text | 상대의 추가 응답과 의미를 연결했어요 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.test.tsx:195:30 | text | 확인 질문으로 협력적으로 대화를 이어 갔어요 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.tsx:12:24 | text | void; } const STAGE_LABELS: Record | learner-text-candidate | technical-or-internal |
| src/features/record/CommunicationRecord.tsx:15:49 | text | = { ambiguity: '찾은 정보 고르기', repair: '다시 물어볼 표현 고르기', meaning: '상대 답에서 뜻 찾기', confirmation: '내가 이해한 뜻 확인하기', }; type Validation = \| { ok: true; evidence: MissionEvidence } \| { ok: false; message: string }; function isObject(value: unknown): value is Record | learner-text-candidate | long-or-dense, multiple-actions, technical-or-internal |
| src/features/record/CommunicationRecord.tsx:16:15 | text | 찾은 정보 고르기 | learner-text-candidate | — |
| src/features/record/CommunicationRecord.tsx:17:12 | text | 다시 물어볼 표현 고르기 | learner-text-candidate | — |
| src/features/record/CommunicationRecord.tsx:18:13 | text | 상대 답에서 뜻 찾기 | learner-text-candidate | — |
| src/features/record/CommunicationRecord.tsx:19:18 | text | 내가 이해한 뜻 확인하기 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.tsx:26:68 | text | { return typeof value === 'object' && value !== null && !Array.isArray(value); } function isMissionStage(value: unknown): value is MissionStage { return value === 'ambiguity' \|\| value === 'repair' \|\| value === 'meaning' \|\| value === 'confirmation'; } function optionsForStage(mission: Mission, stage: MissionStage) { switch (stage) { case 'ambiguity': return mission.ambiguityOptions; case 'repair': return mission.repairOptions; case 'meaning': return mission.meaningOptions; case 'confirmation': return mission.confirmationOptions; } } function isSlotKind(value: string): value is keyof typeof SLOT_LABELS_KO { return Object.prototype.hasOwnProperty.call(SLOT_LABELS_KO, value); } function RecoveryActions({ onRetry, onReturnCenter }: Pick | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/record/CommunicationRecord.tsx:50:74 | text | 이 미션 다시 하기 | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.tsx:51:54 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.tsx:52:11 | text | ); } function controlledError( message: string, callbacks: Pick | feedback-or-error | long-or-dense |
| src/features/record/CommunicationRecord.tsx:58:74 | text | , ) { return ( | heading | — |
| src/features/record/CommunicationRecord.tsx:61:31 | text | record-heading | heading | repeated-text |
| src/features/record/CommunicationRecord.tsx:62:45 | text | 통신 기록 | heading | repeated-text |
| src/features/record/CommunicationRecord.tsx:64:53 | text | 복구 방법을 선택해 학습을 이어 갈 수 있어요. | learner-text-candidate | — |
| src/features/record/CommunicationRecord.tsx:66:15 | text | ); } function validateEvidence(mission: Mission, value: unknown): Validation { if (!isObject(value)) { return { ok: false, message: '통신 기록의 학습 증거를 읽을 수 없습니다. 이 미션을 다시 시작해 주세요.' }; } if (value.missionId !== mission.id) { return { ok: false, message: '이 미션의 통신 기록을 확인할 수 없습니다. 신호센터에서 다시 시작해 주세요.' }; } if (!Array.isArray(value.attempts)) { return { ok: false, message: '통신 기록의 시도 정보가 올바르지 않습니다. 이 미션을 다시 시작해 주세요.' }; } const seenStages = new Set | learner-text-candidate | long-or-dense, multiple-actions, technical-or-internal |
| src/features/record/CommunicationRecord.tsx:72:35 | text | 통신 기록의 학습 증거를 읽을 수 없습니다. 이 미션을 다시 시작해 주세요. | learner-text-candidate | — |
| src/features/record/CommunicationRecord.tsx:75:35 | text | 이 미션의 통신 기록을 확인할 수 없습니다. 신호센터에서 다시 시작해 주세요. | learner-text-candidate | multiple-actions |
| src/features/record/CommunicationRecord.tsx:78:35 | text | 통신 기록의 시도 정보가 올바르지 않습니다. 이 미션을 다시 시작해 주세요. | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.tsx:85:37 | text | 통신 기록의 시도 정보가 올바르지 않습니다. 이 미션을 다시 시작해 주세요. | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.tsx:89:37 | text | 통신 기록의 선택 근거가 미션과 맞지 않습니다. 이 미션을 다시 시작해 주세요. | learner-text-candidate | multiple-actions |
| src/features/record/CommunicationRecord.tsx:96:35 | text | 통신 기록에 필요한 학습 단계가 빠져 있습니다. 이 미션을 다시 시작해 주세요. | learner-text-candidate | — |
| src/features/record/CommunicationRecord.tsx:101:35 | text | 통신 기록의 불명확한 정보가 미션과 맞지 않습니다. 이 미션을 다시 시작해 주세요. | learner-text-candidate | — |
| src/features/record/CommunicationRecord.tsx:105:35 | text | 통신 기록의 수리 전략을 확인할 수 없습니다. 이 미션을 다시 시작해 주세요. | learner-text-candidate | multiple-actions |
| src/features/record/CommunicationRecord.tsx:108:35 | text | 통신 기록의 처음 이해를 확인할 수 없습니다. 이 미션을 다시 시작해 주세요. | learner-text-candidate | multiple-actions |
| src/features/record/CommunicationRecord.tsx:112:35 | text | 통신 기록의 확인된 이해를 확인할 수 없습니다. 이 미션을 다시 시작해 주세요. | learner-text-candidate | multiple-actions |
| src/features/record/CommunicationRecord.tsx:114:49 | text | string | feedback-or-error | — |
| src/features/record/CommunicationRecord.tsx:115:35 | text | 통신 기록의 협력 피드백을 확인할 수 없습니다. 이 미션을 다시 시작해 주세요. | learner-text-candidate | multiple-actions |
| src/features/record/CommunicationRecord.tsx:135:94 | text | 통신 기록을 표시할 수 없습니다. 이 미션을 다시 시작해 주세요. | feedback-or-error | — |
| src/features/record/CommunicationRecord.tsx:140:53 | text | attempt.stage === stage).length, })); return ( | heading | — |
| src/features/record/CommunicationRecord.tsx:144:31 | text | record-heading | heading | repeated-text |
| src/features/record/CommunicationRecord.tsx:145:45 | text | 통신 기록 | heading | repeated-text |
| src/features/record/CommunicationRecord.tsx:146:53 | text | 학습 기록이 준비되었습니다. | learner-text-candidate | — |
| src/features/record/CommunicationRecord.tsx:147:11 | text | 미션 | heading | — |
| src/features/record/CommunicationRecord.tsx:152:13 | text | 찾은 정보 | learner-text-candidate | — |
| src/features/record/CommunicationRecord.tsx:156:13 | text | 고른 방법 | learner-text-candidate | — |
| src/features/record/CommunicationRecord.tsx:160:13 | text | 처음 생각한 뜻 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.tsx:164:13 | text | 확인한 뜻 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.tsx:168:13 | text | 확인 질문 | learner-text-candidate | — |
| src/features/record/CommunicationRecord.tsx:169:15 | text | 의미 확인 완료 | learner-text-candidate | repeated-text |
| src/features/record/CommunicationRecord.tsx:172:13 | text | 대화 태도 | learner-text-candidate | — |
| src/features/record/CommunicationRecord.tsx:177:11 | text | 다시 해 본 횟수 | heading | repeated-text |
| src/features/record/CommunicationRecord.tsx:178:23 | aria-label | 다시 해 본 횟수 | aria-label | repeated-text |
| src/features/record/CommunicationRecord.tsx:180:46 | text | {label}: {count}회 | learner-text-candidate | — |
| src/features/record/CommunicationRecord.tsx:187:76 | text | 이 미션 다시 하기 | button-or-action | repeated-text |
| src/features/record/CommunicationRecord.tsx:188:56 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:14:29 | text | 비난하지 않고 확인 질문으로 대화를 이어 갔어요. | feedback-or-error | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:21:34 | text | 어느 상자 미션에서 어느 것인지 헷갈리는 부분을 찾고, 더 구체적으로 물어보는 방법을 배웠어요. | learner-text-candidate | — |
| src/features/record/LearnerTakeaway.test.tsx:22:35 | text | 다음 대화에서 어느 것인지 헷갈리면 구체적으로 물어보세요. | learner-text-candidate | — |
| src/features/record/LearnerTakeaway.test.tsx:23:44 | text | 점수 | learner-text-candidate | — |
| src/features/record/LearnerTakeaway.test.tsx:27:17 | text | 다시 말해 달라고 부탁하는 방법을 배웠어요. | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:27:45 | text | 다시 말해 달라고 부탁해 보세요. | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:28:18 | text | 뜻을 확인하는 방법을 배웠어요. | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:28:39 | text | 내가 이해한 뜻을 확인해 보세요. | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:29:19 | text | 다른 말로 다시 설명하는 방법을 배웠어요. | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:29:46 | text | 다른 말로 다시 설명해 보세요. | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:32:34 | text | 어느 상자 미션에서 어느 것인지 헷갈리는 부분을 찾고, ${learnedEnding} | learner-text-candidate | — |
| src/features/record/LearnerTakeaway.test.tsx:33:35 | text | 다음 대화에서 어느 것인지 헷갈리면 ${nextEnding} | learner-text-candidate | — |
| src/features/record/LearnerTakeaway.test.tsx:37:26 | text | 무슨 말인지 | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:38:17 | text | 어느 것인지 | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:39:15 | text | 언제인지 | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:40:16 | text | 어디인지 | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:41:19 | text | 몇 개인지 | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:42:17 | text | 누가 맡는지 | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:43:19 | text | 어떤 순서인지 | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:44:19 | text | 어떤 결정인지 | learner-text-candidate | repeated-text |
| src/features/record/LearnerTakeaway.test.tsx:47:39 | text | 어느 상자 미션에서 ${prompt} 헷갈리는 부분을 찾고 | learner-text-candidate | — |
| src/features/record/LearnerTakeaway.test.tsx:48:40 | text | 다음 대화에서 ${prompt} 헷갈리면 | learner-text-candidate | — |
| src/features/record/LearnerTakeaway.tsx:13:60 | text | learner-takeaway-heading | heading | — |
| src/features/record/LearnerTakeaway.tsx:14:41 | text | 오늘 배운 점 | heading | repeated-text |
| src/features/record/LearnerTakeaway.tsx:16:11 | text | 다음에 해 보기 | heading | repeated-text |
| src/features/record/TeacherSummary.tsx:11:5 | text | 이해 | learner-text-candidate | — |
| src/features/record/TeacherSummary.tsx:11:11 | text | 다시 묻기와 확인하기가 자연스러운 의사소통 전략임을 알아요. | learner-text-candidate | — |
| src/features/record/TeacherSummary.tsx:12:5 | text | 적용 | learner-text-candidate | abstract-or-formal |
| src/features/record/TeacherSummary.tsx:12:11 | text | 불명확한 정보의 종류에 맞는 수리 표현을 선택해요. | learner-text-candidate | — |
| src/features/record/TeacherSummary.tsx:13:5 | text | 분석 | learner-text-candidate | abstract-or-formal |
| src/features/record/TeacherSummary.tsx:13:11 | text | 무엇이 빠졌거나 두 가지로 해석되는지 찾아요. | learner-text-candidate | — |
| src/features/record/TeacherSummary.tsx:14:5 | text | 생성 | learner-text-candidate | — |
| src/features/record/TeacherSummary.tsx:14:11 | text | 수리 표현과 확인 응답을 연결해 대화를 완성해요. | learner-text-candidate | — |
| src/features/record/TeacherSummary.tsx:18:4 | text | 불명확한 부분을 찾았어요 | learner-text-candidate | repeated-text |
| src/features/record/TeacherSummary.tsx:19:4 | text | 상황에 맞는 수리 전략을 골랐어요 | learner-text-candidate | repeated-text |
| src/features/record/TeacherSummary.tsx:20:4 | text | 상대의 추가 응답과 의미를 연결했어요 | learner-text-candidate | repeated-text |
| src/features/record/TeacherSummary.tsx:21:4 | text | 확인 질문으로 협력적으로 대화를 이어 갔어요 | learner-text-candidate | repeated-text |
| src/features/record/TeacherSummary.tsx:27:62 | text | !link); return ( | learner-text-candidate | — |
| src/features/record/TeacherSummary.tsx:30:26 | aria-label | 교사용 보기 | aria-label | repeated-text |
| src/features/record/TeacherSummary.tsx:31:16 | text | 교사용 보기 | learner-text-candidate | repeated-text |
| src/features/record/TeacherSummary.tsx:33:13 | text | 교육과정 연결 | heading | repeated-text |
| src/features/record/TeacherSummary.tsx:35:27 | text | 교육과정 연결 정보를 표시할 수 없습니다. | learner-text-candidate | — |
| src/features/record/TeacherSummary.tsx:47:13 | text | 네 가지 학습 목표 | heading | repeated-text |
| src/features/record/TeacherSummary.tsx:50:53 | text | : {target} | learner-text-candidate | — |
| src/features/record/TeacherSummary.tsx:54:13 | text | 성취를 보여 주는 활동 증거 | heading | repeated-text |
| src/features/record/TeacherSummary.tsx:58:12 | text | 이 내용은 이번 활동에서 확인한 학습 과정의 참고 기록입니다. | learner-text-candidate | multiple-actions |
| src/features/record/learnerTakeawayCopy.ts:10:74 | text | = { 'whole-utterance': '무슨 말인지', object: '어느 것인지', time: '언제인지', place: '어디인지', quantity: '몇 개인지', person: '누가 맡는지', sequence: '어떤 순서인지', decision: '어떤 결정인지', }; const STRATEGY_TEMPLATES: Record | learner-text-candidate | long-or-dense |
| src/features/record/learnerTakeawayCopy.ts:11:23 | text | 무슨 말인지 | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:12:12 | text | 어느 것인지 | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:13:10 | text | 언제인지 | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:14:11 | text | 어디인지 | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:15:14 | text | 몇 개인지 | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:16:12 | text | 누가 맡는지 | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:17:14 | text | 어떤 순서인지 | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:18:14 | text | 어떤 결정인지 | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:23:15 | text | 다시 말해 달라고 부탁하는 방법을 배웠어요. | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:24:12 | text | 다시 말해 달라고 부탁해 보세요. | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:27:15 | text | 더 구체적으로 물어보는 방법을 배웠어요. | learner-text-candidate | — |
| src/features/record/learnerTakeawayCopy.ts:28:12 | text | 구체적으로 물어보세요. | learner-text-candidate | — |
| src/features/record/learnerTakeawayCopy.ts:31:15 | text | 뜻을 확인하는 방법을 배웠어요. | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:32:12 | text | 내가 이해한 뜻을 확인해 보세요. | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:35:15 | text | 다른 말로 다시 설명하는 방법을 배웠어요. | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:36:12 | text | 다른 말로 다시 설명해 보세요. | learner-text-candidate | repeated-text |
| src/features/record/learnerTakeawayCopy.ts:41:68 | text | 무엇인지 | learner-text-candidate | — |
| src/features/record/learnerTakeawayCopy.ts:44:17 | text | ${mission.titleKo} 미션에서 ${slotPrompt} 헷갈리는 부분을 찾고, ${template.learned} | learner-text-candidate | long-or-dense |
| src/features/record/learnerTakeawayCopy.ts:45:18 | text | 다음 대화에서 ${slotPrompt} 헷갈리면 ${template.next} | learner-text-candidate | — |
| src/features/repair/RepairTransmission.test.tsx:37:30 | text | 더 구체적으로 | learner-text-candidate | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:38:30 | text | 대상·시간·장소·수량·담당·순서가 불분명할 때 | learner-text-candidate | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:39:33 | text | 교실에서 정중하게 | learner-text-candidate | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:42:30 | text | button | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:42:48 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:42:81 | text | gi-pulse | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:50:43 | text | 불명확한 대상을 찾았어요. | learner-text-candidate | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:52:40 | text | button | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:52:58 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:54:39 | text | 말은 들었지만 어느 상자인지가 아직 분명하지 않아요. | learner-text-candidate | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:60:7 | text | requires selection, then accepts both natural expressions with distinct feedback | feedback-or-error | long-or-dense |
| src/features/repair/RepairTransmission.test.tsx:62:38 | text | button | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:62:56 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:68:59 | text | 어느 상자인지 직접 물어 상황에 꼭 맞는 표현이에요. | learner-text-candidate | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:69:30 | text | heading | heading | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:69:49 | text | 상대의 대답 살펴보기 | heading | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:72:7 | text | keeps a retry on repair and gives a Korean hint without exposing an accepted expression | hint | long-or-dense |
| src/features/repair/RepairTransmission.test.tsx:75:40 | text | button | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:75:58 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:76:30 | text | heading | heading | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:76:49 | text | 어떻게 다시 물어볼까요? | heading | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:77:59 | text | 말은 들었지만 어느 상자인지가 아직 분명하지 않아요. | learner-text-candidate | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:82:7 | text | preserves the second accepted expression feedback when entering response | feedback-or-error | long-or-dense |
| src/features/repair/RepairTransmission.test.tsx:85:40 | text | button | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:85:58 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:86:30 | text | heading | heading | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:86:49 | text | 상대의 대답 살펴보기 | heading | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:87:59 | text | 가능한 상자를 정중하게 확인해 대화를 이어 갔어요. | learner-text-candidate | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:90:7 | text | keeps accepted repair feedback in response, then clears the same status after meaning selection | feedback-or-error | long-or-dense |
| src/features/repair/RepairTransmission.test.tsx:93:40 | text | button | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:93:58 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:95:39 | text | 어느 상자인지 직접 물어 상황에 꼭 맞는 표현이에요. | learner-text-candidate | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:97:57 | text | 창가에 있는 파란 상자 | learner-text-candidate | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:102:22 | text | keeps each repair retry hint free of accepted answer data for %s | hint | long-or-dense |
| src/features/repair/RepairTransmission.test.tsx:108:40 | text | button | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:108:58 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:109:40 | text | status | feedback-or-error | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:120:38 | text | button | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:120:56 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:123:30 | text | heading | heading | repeated-text |
| src/features/repair/RepairTransmission.test.tsx:123:49 | text | 상대의 대답 살펴보기 | heading | repeated-text |
| src/features/repair/RepairTransmission.tsx:23:65 | text | mission.allowedStrategyIds.includes(id)); return ( | heading | long-or-dense, technical-or-internal |
| src/features/repair/RepairTransmission.tsx:26:31 | text | repair-heading | heading | — |
| src/features/repair/RepairTransmission.tsx:27:34 | text | 수리 송신 | learner-text-candidate | — |
| src/features/repair/RepairTransmission.tsx:28:45 | text | 어떻게 다시 물어볼까요? | heading | repeated-text |
| src/features/repair/RepairTransmission.tsx:29:20 | text | 대화가 막힌 신호에 맞는 표현을 골라 보내 보세요. | learner-text-candidate | — |
| src/features/repair/RepairTransmission.tsx:30:50 | aria-label | 허용된 수리 전략 | aria-label | — |
| src/features/repair/RepairTransmission.tsx:36:17 | text | 어떤 표현으로 다시 물어볼까요? | learner-text-candidate | — |
| src/features/repair/RepairTransmission.tsx:38:99 | text | true | learner-text-candidate | repeated-text |
| src/features/repair/RepairTransmission.tsx:38:108 | text | false | learner-text-candidate | repeated-text |
| src/features/repair/RepairTransmission.tsx:57:56 | text | repair | feedback-or-error | repeated-text |
| src/features/repair/StrategyCard.tsx:13:17 | text | ko | heading | repeated-text |
| src/features/repair/StrategyCard.tsx:15:20 | text | {politenessContext === 'classroom-polite' ? '교실에서 정중하게' : '친구 사이에서 간단하게'} | learner-text-candidate | long-or-dense |
| src/features/repair/StrategyCard.tsx:16:54 | text | 교실에서 정중하게 | learner-text-candidate | repeated-text |
| src/features/repair/StrategyCard.tsx:16:68 | text | 친구 사이에서 간단하게 | learner-text-candidate | — |
| src/features/repair/StrategyCard.tsx:18:24 | text | ${strategy.labelKo} 예시 | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.test.tsx:11:23 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 문장 전체 정보를 다시 찾아보세요. | learner-text-candidate | multiple-actions, repeated-text |
| src/features/response/ResponseReception.test.tsx:12:12 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 대상 정보를 다시 찾아보세요. | learner-text-candidate | multiple-actions, repeated-text |
| src/features/response/ResponseReception.test.tsx:13:10 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 시간 정보를 다시 찾아보세요. | learner-text-candidate | multiple-actions |
| src/features/response/ResponseReception.test.tsx:14:11 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 장소 정보를 다시 찾아보세요. | learner-text-candidate | multiple-actions, repeated-text |
| src/features/response/ResponseReception.test.tsx:15:14 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 수량 정보를 다시 찾아보세요. | learner-text-candidate | multiple-actions, repeated-text |
| src/features/response/ResponseReception.test.tsx:16:12 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 담당자 정보를 다시 찾아보세요. | learner-text-candidate | multiple-actions, repeated-text |
| src/features/response/ResponseReception.test.tsx:17:14 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 순서 정보를 다시 찾아보세요. | learner-text-candidate | multiple-actions, repeated-text |
| src/features/response/ResponseReception.test.tsx:18:14 | text | 어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 최종 결정 정보를 다시 찾아보세요. | learner-text-candidate | multiple-actions, repeated-text |
| src/features/response/ResponseReception.test.tsx:26:30 | text | heading | heading | repeated-text |
| src/features/response/ResponseReception.test.tsx:26:49 | text | 상대의 대답 살펴보기 | heading | repeated-text |
| src/features/response/ResponseReception.test.tsx:27:47 | text | 상대가 확인해 준 뜻은 무엇인가요? | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.test.tsx:30:30 | text | button | button-or-action | repeated-text |
| src/features/response/ResponseReception.test.tsx:30:48 | text | 이해한 뜻 확인하기 | button-or-action | repeated-text |
| src/features/response/ResponseReception.test.tsx:33:7 | text | keeps the exact response text and only adds the labelled player when voice is on | learner-text-candidate | long-or-dense |
| src/features/response/ResponseReception.test.tsx:37:50 | text | 응답 듣기 음원 | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.test.tsx:43:48 | text | 응답 듣기 음원 | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.test.tsx:50:97 | text | 창가 쪽 파란 상자예요. | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.test.tsx:57:30 | text | 창가 쪽 파란 상자예요. | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.test.tsx:60:7 | text | keeps a wrong meaning choice in response with the exact slot hint and no answer leak | feedback-or-error, hint | long-or-dense |
| src/features/response/ResponseReception.test.tsx:62:57 | text | 문 옆 빨간 상자 | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.test.tsx:63:40 | text | button | button-or-action | repeated-text |
| src/features/response/ResponseReception.test.tsx:63:58 | text | 이해한 뜻 확인하기 | button-or-action | repeated-text |
| src/features/response/ResponseReception.test.tsx:64:30 | text | heading | heading | repeated-text |
| src/features/response/ResponseReception.test.tsx:64:49 | text | 상대의 대답 살펴보기 | heading | repeated-text |
| src/features/response/ResponseReception.test.tsx:65:30 | text | status | feedback-or-error | repeated-text |
| src/features/response/ResponseReception.test.tsx:66:63 | text | 창가에 있는 파란 상자 | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.test.tsx:67:47 | text | 문 옆 빨간 상자 | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.test.tsx:72:57 | text | 창가에 있는 파란 상자 | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.test.tsx:73:40 | text | button | button-or-action | repeated-text |
| src/features/response/ResponseReception.test.tsx:73:58 | text | 이해한 뜻 확인하기 | button-or-action | repeated-text |
| src/features/response/ResponseReception.test.tsx:74:30 | text | heading | heading | repeated-text |
| src/features/response/ResponseReception.test.tsx:74:49 | text | 내가 이해한 뜻 확인하기 | heading | repeated-text |
| src/features/response/ResponseReception.test.tsx:79:34 | text | No retry meaning option for ${mission.id} | feedback-or-error | missing-term-explanation, technical-or-internal |
| src/features/response/ResponseReception.test.tsx:82:40 | text | radio | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.test.tsx:83:40 | text | button | button-or-action | repeated-text |
| src/features/response/ResponseReception.test.tsx:83:58 | text | 이해한 뜻 확인하기 | button-or-action | repeated-text |
| src/features/response/ResponseReception.tsx:13:34 | text | void; } export function ResponseReception({ mission, selectedOptionId, latestResult, voiceEnabled = false, onSelect, onSubmit, }: ResponseReceptionProps) { return ( | heading, button-or-action | long-or-dense, technical-or-internal |
| src/features/response/ResponseReception.tsx:25:31 | text | response-heading | heading | — |
| src/features/response/ResponseReception.tsx:26:34 | text | 응답 수신 | learner-text-candidate | — |
| src/features/response/ResponseReception.tsx:27:47 | text | 상대의 대답 살펴보기 | heading | repeated-text |
| src/features/response/ResponseReception.tsx:33:20 | text | {voiceEnabled && mission.audioCues[1] ? ( | learner-text-candidate | — |
| src/features/response/ResponseReception.tsx:35:65 | text | 응답 듣기 | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.tsx:35:74 | text | ) : null} | learner-text-candidate | repeated-text, technical-or-internal |
| src/features/response/ResponseReception.tsx:38:17 | text | 상대가 확인해 준 뜻은 무엇인가요? | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.tsx:40:99 | text | true | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.tsx:40:108 | text | false | learner-text-candidate | repeated-text |
| src/features/response/ResponseReception.tsx:48:37 | text | ko | learner-text-candidate | repeated-text |
| src/features/updates/UpdateHistoryButton.tsx:4:17 | text | void; inert?: boolean; } export const UpdateHistoryButton = forwardRef | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/updates/UpdateHistoryButton.tsx:8:91 | text | ( function UpdateHistoryButton({ onClick, inert = false }, ref) { return ( | button-or-action | long-or-dense |
| src/features/updates/UpdateHistoryButton.tsx:11:119 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:11:7 | text | opens, focuses the title, and restores trigger focus on Escape | learner-text-candidate | long-or-dense |
| src/features/updates/UpdateHistoryDialog.test.tsx:11:83 | text | { const user = userEvent.setup(); render( | learner-text-candidate | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:14:39 | text | button | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:14:57 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:16:56 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:19:37 | text | aria-labelledby | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| src/features/updates/UpdateHistoryDialog.test.tsx:19:56 | text | update-history-title | learner-text-candidate | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:20:30 | text | heading | heading | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:20:49 | text | 업데이트 내역 | heading | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:22:30 | text | button | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:22:48 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:22:78 | text | inert | button-or-action | — |
| src/features/updates/UpdateHistoryDialog.test.tsx:24:41 | text | 본문으로 건너뛰기 | learner-text-candidate | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:26:25 | text | button | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:26:43 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:29:30 | text | button | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:29:48 | text | 업데이트 내역 닫기 | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:32:30 | text | heading | heading | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:32:49 | text | 업데이트 내역 | heading | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:40:7 | text | closes with the close button and lists dated records | button-or-action | — |
| src/features/updates/UpdateHistoryDialog.test.tsx:40:73 | text | { const user = userEvent.setup(); render( | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:43:40 | text | button | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:43:58 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:44:30 | text | 최초 설계 문서를 작성했습니다. | learner-text-candidate | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:45:40 | text | button | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:45:58 | text | 업데이트 내역 닫기 | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:69:45 | text | error | feedback-or-error | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:69:77 | text | undefined); try { render( | feedback-or-error | technical-or-internal |
| src/features/updates/UpdateHistoryDialog.test.tsx:82:40 | text | button | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:82:58 | text | 어느 상자 미션 시작 | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:83:39 | text | button | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:83:57 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.test.tsx:86:48 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| src/features/updates/UpdateHistoryDialog.tsx:6:17 | text | void; } export function UpdateHistoryDialog({ records, onClose }: UpdateHistoryDialogProps): JSX.Element { const titleRef = useRef | heading | long-or-dense, technical-or-internal |
| src/features/updates/UpdateHistoryDialog.tsx:10:46 | text | (null); const dialogRef = useRef | heading | technical-or-internal |
| src/features/updates/UpdateHistoryDialog.tsx:22:62 | text | { if (event.key !== 'Tab') return; const focusable = [ titleRef.current, ...Array.from(dialogRef.current?.querySelectorAll | button-or-action, input | long-or-dense |
| src/features/updates/UpdateHistoryDialog.tsx:26:71 | text | button, a, input, select, textarea, [tabindex] | button-or-action, input | — |
| src/features/updates/UpdateHistoryDialog.tsx:47:26 | text | update-history-title | learner-text-candidate | repeated-text |
| src/features/updates/UpdateHistoryDialog.tsx:51:70 | text | 업데이트 내역 | heading | repeated-text |
| src/features/updates/UpdateHistoryDialog.tsx:52:45 | aria-label | 업데이트 내역 닫기 | aria-label, button-or-action | repeated-text |
| src/features/updates/UpdateHistoryDialog.tsx:52:75 | text | 닫기 | button-or-action | — |
| src/main.tsx:9:20 | text | Root element not found | feedback-or-error | — |
| src/shared/CriticalActionButton.test.tsx:5:11 | text | CriticalActionButton | learner-text-candidate | — |
| src/shared/CriticalActionButton.test.tsx:7:25 | text | 모호한 부분 찾기 | learner-text-candidate | repeated-text |
| src/shared/CriticalActionButton.test.tsx:8:22 | text | 이 표현으로 다시 물어보기 | learner-text-candidate | repeated-text |
| src/shared/CriticalActionButton.test.tsx:9:26 | text | 이해한 뜻 확인하기 | learner-text-candidate | repeated-text |
| src/shared/CriticalActionButton.test.tsx:10:28 | text | 확인 질문 보내기 | learner-text-candidate | repeated-text |
| src/shared/CriticalActionButton.test.tsx:11:16 | text | renders only the required pulse action: %s | learner-text-candidate | — |
| src/shared/CriticalActionButton.test.tsx:11:79 | text | { render( | learner-text-candidate | repeated-text |
| src/shared/CriticalActionButton.test.tsx:13:30 | text | button | button-or-action | repeated-text |
| src/shared/CriticalActionButton.test.tsx:13:70 | text | gi-pulse | button-or-action | repeated-text |
| src/shared/CriticalActionButton.test.tsx:16:80 | text | { render( | learner-text-candidate | repeated-text |
| src/shared/CriticalActionButton.test.tsx:17:42 | text | find-ambiguity | learner-text-candidate | — |
| src/shared/CriticalActionButton.test.tsx:18:30 | text | button | button-or-action | repeated-text |
| src/shared/CriticalActionButton.test.tsx:18:48 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| src/shared/CriticalActionButton.test.tsx:18:76 | text | gi-pulse | button-or-action | repeated-text |
| src/shared/CriticalActionButton.test.tsx:21:7 | text | keeps the action union and button label controlled by the action literal | button-or-action | long-or-dense |
| src/shared/CriticalActionButton.test.tsx:21:87 | text | { render( | button-or-action | repeated-text |
| src/shared/CriticalActionButton.test.tsx:22:42 | text | send-confirmation | learner-text-candidate | repeated-text |
| src/shared/CriticalActionButton.test.tsx:22:61 | text | caller text | learner-text-candidate | repeated-text |
| src/shared/CriticalActionButton.test.tsx:23:38 | text | button | button-or-action | repeated-text |
| src/shared/CriticalActionButton.test.tsx:23:56 | text | 확인 질문 보내기 | button-or-action | repeated-text |
| src/shared/CriticalActionButton.test.tsx:24:37 | text | type | button-or-action | repeated-text |
| src/shared/CriticalActionButton.test.tsx:24:45 | text | button | button-or-action | repeated-text |
| src/shared/CriticalActionButton.test.tsx:25:43 | text | caller text | button-or-action | repeated-text |
| src/shared/CriticalActionButton.tsx:1:44 | text | react | learner-text-candidate | — |
| src/shared/CriticalActionButton.tsx:3:91 | text | { action: 'find-ambiguity' \| 'send-repair' \| 'confirm-meaning' \| 'send-confirmation'; } const ACTION_LABELS: Record | learner-text-candidate | long-or-dense |
| src/shared/CriticalActionButton.tsx:7:56 | text | action | learner-text-candidate | — |
| src/shared/CriticalActionButton.tsx:7:73 | text | = { 'find-ambiguity': '모호한 부분 찾기', 'send-repair': '이 표현으로 다시 물어보기', 'confirm-meaning': '이해한 뜻 확인하기', 'send-confirmation': '확인 질문 보내기', }; export function CriticalActionButton({ action, className = '', children, type, ...props }: CriticalActionButtonProps) { void children; void type; const exactLabel = ACTION_LABELS[action]; return ( | button-or-action | long-or-dense, multiple-actions, technical-or-internal |
| src/shared/CriticalActionButton.tsx:8:22 | text | 모호한 부분 찾기 | learner-text-candidate | repeated-text |
| src/shared/CriticalActionButton.tsx:9:19 | text | 이 표현으로 다시 물어보기 | learner-text-candidate | repeated-text |
| src/shared/CriticalActionButton.tsx:10:23 | text | 이해한 뜻 확인하기 | learner-text-candidate | repeated-text |
| src/shared/CriticalActionButton.tsx:11:25 | text | 확인 질문 보내기 | learner-text-candidate | repeated-text |
| src/shared/FeedbackNotice.tsx:9:35 | text | polite | feedback-or-error | repeated-text |
| src/shared/FeedbackNotice.tsx:9:49 | text | ko | feedback-or-error | repeated-text |
| src/shared/FeedbackNotice.tsx:9:93 | text | empty | feedback-or-error | — |
| src/shared/FeedbackNotice.tsx:9:101 | text | {result?.feedbackKo ?? ''} | feedback-or-error | — |
| src/shared/PhaseProgress.test.tsx:7:7 | text | shows four semantic steps and marks the current step with aria-current | learner-text-candidate | long-or-dense, missing-term-explanation, technical-or-internal |
| src/shared/PhaseProgress.test.tsx:7:85 | text | { render( | learner-text-candidate | repeated-text |
| src/shared/PhaseProgress.test.tsx:12:30 | text | button | button-or-action | repeated-text |
| src/shared/PhaseProgress.test.tsx:12:48 | text | 이전 단계 보기 | button-or-action | repeated-text |
| src/shared/PhaseProgress.test.tsx:18:32 | text | button | button-or-action | repeated-text |
| src/shared/PhaseProgress.test.tsx:18:50 | text | 이전 단계 보기 | button-or-action | repeated-text |
| src/shared/PhaseProgress.test.tsx:25:40 | text | button | button-or-action | repeated-text |
| src/shared/PhaseProgress.test.tsx:25:58 | text | 이전 단계 보기 | button-or-action | repeated-text |
| src/shared/PhaseProgress.test.tsx:29:7 | text | labels completed and upcoming steps while keeping one current step | learner-text-candidate | long-or-dense |
| src/shared/PhaseProgress.test.tsx:29:81 | text | { render( | learner-text-candidate | repeated-text |
| src/shared/PhaseProgress.tsx:6:13 | text | observe | learner-text-candidate | — |
| src/shared/PhaseProgress.tsx:6:31 | text | 다시 물어볼 부분 찾기 | learner-text-candidate | repeated-text |
| src/shared/PhaseProgress.tsx:7:13 | text | repair | learner-text-candidate | repeated-text |
| src/shared/PhaseProgress.tsx:7:30 | text | 어떻게 다시 물어볼까요? | learner-text-candidate | repeated-text |
| src/shared/PhaseProgress.tsx:8:13 | text | response | learner-text-candidate | — |
| src/shared/PhaseProgress.tsx:8:32 | text | 상대의 대답 살펴보기 | learner-text-candidate | repeated-text |
| src/shared/PhaseProgress.tsx:9:13 | text | confirm | learner-text-candidate | repeated-text |
| src/shared/PhaseProgress.tsx:9:31 | text | 내가 이해한 뜻 확인하기 | learner-text-candidate | repeated-text |
| src/shared/PhaseProgress.tsx:18:50 | text | item.phase === phase); const previous = PHASES[currentIndex - 1]; return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/shared/PhaseProgress.tsx:21:49 | aria-label | 미션 단계 | aria-label | — |
| src/shared/PhaseProgress.tsx:27:26 | text | ${index + 1}/4 ${item.label} | learner-text-candidate | — |
| src/shared/PhaseProgress.tsx:30:19 | text | {index + 1}/4 | learner-text-candidate | — |
| src/shared/PhaseProgress.tsx:33:12 | text | {previous && onBack ? ( | button-or-action | — |
| src/shared/PhaseProgress.tsx:35:60 | aria-label | 이전 단계 보기 | aria-label, button-or-action | repeated-text |
| src/shared/PhaseProgress.tsx:35:70 | text | 이전 단계 보기 | button-or-action | repeated-text |
| src/shared/PhaseProgress.tsx:37:18 | text | ) : null} | button-or-action | repeated-text, technical-or-internal |
| src/test/missionHarnessState.ts:20:45 | text | candidate.accepted); if (!option) throw new Error(`No accepted option for ${mission.id} at ${stage}`); return option; } export function createSessionAtPhase(mission: Mission, targetPhase: Exclude | feedback-or-error | long-or-dense, technical-or-internal |
| src/test/missionHarnessState.ts:21:33 | text | No accepted option for ${mission.id} at ${stage} | feedback-or-error | missing-term-explanation, technical-or-internal |
| src/test/missionHarnessState.ts:25:100 | text | ): MissionSessionState { const targetIndex = TARGET_PHASES.indexOf(targetPhase); if (targetIndex | feedback-or-error | long-or-dense, technical-or-internal |
| src/test/missionHarnessState.ts:27:41 | text | Invalid target phase: ${String(targetPhase)} | feedback-or-error | technical-or-internal |
| tests/e2e/accessibility.spec.ts:28:48 | text | 본문으로 건너뛰기 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:30:25 | text | 어느 상자 미션 시작 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:32:32 | text | heading | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:32:51 | text | 다시 물어볼 부분 찾기 | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:35:25 | text | 모호한 부분 찾기 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:37:32 | text | heading | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:37:51 | text | 어떻게 다시 물어볼까요? | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:40:25 | text | 이 표현으로 다시 물어보기 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:42:32 | text | heading | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:42:51 | text | 상대의 대답 살펴보기 | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:45:25 | text | 이해한 뜻 확인하기 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:47:32 | text | heading | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:47:51 | text | 내가 이해한 뜻 확인하기 | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:50:25 | text | 확인 질문 보내기 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:52:32 | text | heading | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:52:51 | text | 통신 기록 | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:53:32 | text | heading | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:53:51 | text | 통신 기록 | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:54:25 | text | 신호센터로 돌아가기 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:56:25 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:58:50 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:60:50 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:61:32 | text | button | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:61:50 | text | 업데이트 내역 | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:69:25 | text | radio | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:70:39 | text | button | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:70:57 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:85:25 | text | radio | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:86:25 | text | button | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:86:43 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:89:25 | text | button | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:89:43 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:91:25 | text | radio | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:92:25 | text | button | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:92:43 | text | 이해한 뜻 확인하기 | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:95:25 | text | button | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:95:43 | text | 확인 질문 보내기 | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:107:32 | text | heading | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:109:32 | text | heading | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:109:51 | text | 통신 기록 | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:117:39 | text | 교사용 보기 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:119:32 | text | 교육과정 연결 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:120:32 | text | 네 가지 학습 목표 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:121:32 | text | 성취를 보여 주는 활동 증거 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:122:32 | text | 불명확한 부분을 찾았어요 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:123:32 | text | 상황에 맞는 수리 전략을 골랐어요 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:124:32 | text | 상대의 추가 응답과 의미를 연결했어요 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:125:32 | text | 확인 질문으로 협력적으로 대화를 이어 갔어요 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:137:34 | text | Unsupported color: ${value} | feedback-or-error | — |
| tests/e2e/accessibility.spec.ts:164:32 | text | heading | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:164:51 | text | 다시 물어볼 부분 찾기 | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:167:25 | text | radio | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:168:25 | text | button | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:168:43 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:169:32 | text | heading | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:169:51 | text | 어떻게 다시 물어볼까요? | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:173:25 | text | button | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:173:43 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:174:32 | text | heading | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:174:51 | text | 상대의 대답 살펴보기 | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:177:25 | text | radio | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:178:25 | text | button | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:178:43 | text | 이해한 뜻 확인하기 | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:179:32 | text | heading | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:179:51 | text | 내가 이해한 뜻 확인하기 | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:183:25 | text | button | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:183:43 | text | 확인 질문 보내기 | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:184:32 | text | heading | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:184:51 | text | 통신 기록 | heading | repeated-text |
| tests/e2e/accessibility.spec.ts:187:25 | text | button | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:187:43 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:189:25 | text | button | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:189:43 | text | 업데이트 내역 | button-or-action | repeated-text |
| tests/e2e/accessibility.spec.ts:190:50 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:198:45 | text | { const viewport = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight, }; const candidates = Array.from(document.querySelectorAll | button-or-action | long-or-dense, technical-or-internal |
| tests/e2e/accessibility.spec.ts:203:75 | text | a, button, select, summary, .choice-label, .audio-preference-label, [role="button"] | button-or-action | long-or-dense |
| tests/e2e/accessibility.spec.ts:211:21 | text | { const box = node.getBoundingClientRect(); return { label: node.getAttribute('aria-label') ?? node.textContent?.trim() ?? node.tagName, left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height, position: getComputedStyle(node).position, }; }); const turns = Array.from(document.querySelectorAll | learner-text-candidate | long-or-dense, technical-or-internal |
| tests/e2e/accessibility.spec.ts:214:35 | text | aria-label | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| tests/e2e/accessibility.spec.ts:242:30 | text | = 2) { expect(await findOverlappingBoxes(page.locator('.dialogue-turn')), `${phase} dialogue overlap`).toEqual([]); } else if (geometry.turns.length === 1) { // A single-turn phase still needs containment; the representative path above exercises pairwise overlap. const [turn] = geometry.turns; expect(turn!.left).toBeGreaterThanOrEqual(0); expect(turn!.right).toBeLessThanOrEqual(geometry.viewport.width); expect(turn!.bottom).toBeGreaterThan(turn!.top); } } async function assertDialogGeometry(page: Page) { const viewport = page.viewportSize(); const dialogBox = await page.getByRole('dialog', { name: '업데이트 내역' }).boundingBox(); expect(dialogBox).not.toBeNull(); expect(dialogBox!.x).toBeGreaterThanOrEqual(0); expect(dialogBox!.y).toBeGreaterThanOrEqual(0); expect(dialogBox!.x + dialogBox!.width).toBeLessThanOrEqual(viewport!.width); expect(dialogBox!.y + dialogBox!.height).toBeLessThanOrEqual(viewport!.height); } async function tabUntil(page: Page, label: string, maximumTabs = 80) { for (let index = 0; index | learner-text-candidate | long-or-dense, technical-or-internal |
| tests/e2e/accessibility.spec.ts:255:61 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| tests/e2e/accessibility.spec.ts:273:35 | text | aria-label | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| tests/e2e/accessibility.spec.ts:281:20 | text | Keyboard focus did not reach ${label} | feedback-or-error | missing-term-explanation, technical-or-internal |
| tests/e2e/audio-off-parity.spec.ts:22:29 | text | radio | learner-text-candidate | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:23:29 | text | button | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:23:47 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:25:29 | text | button | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:25:47 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:54:51 | text | 대화 듣기 | learner-text-candidate | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:58:27 | text | radio | learner-text-candidate | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:59:27 | text | button | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:59:45 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:61:27 | text | button | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:61:45 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:62:51 | text | 응답 듣기 | learner-text-candidate | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:82:89 | text | ({ speaker: node.querySelector('.dialogue-speaker')?.textContent, text: node.querySelector('p[lang="en"]')?.textContent, })))).resolves.toEqual([ { speaker: 'You', text: 'Let’s do it over there.' }, { speaker: 'Partner', text: 'I’m not sure what you mean.' }, ]); await expect(page.locator('audio')).toHaveCount(0); }); async function expectCue( page: import('@playwright/test').Page, cue: { src: string; transcriptEn: string }, labelKo: string, audioResponses: Map | learner-text-candidate | long-or-dense |
| tests/e2e/audio-off-parity.spec.ts:99:34 | text | figure | learner-text-candidate | — |
| tests/e2e/audio-off-parity.spec.ts:99:52 | text | ${labelKo} 음원 | learner-text-candidate | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:124:60 | text | 재생 속도 | learner-text-candidate | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:131:27 | text | button | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:131:45 | text | 재생 | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:133:34 | text | button | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:133:52 | text | 일시 정지 | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:134:27 | text | button | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:134:45 | text | 일시 정지 | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:136:34 | text | button | button-or-action | repeated-text |
| tests/e2e/audio-off-parity.spec.ts:136:52 | text | 재생 | button-or-action | repeated-text |
| tests/e2e/audio-preference-geometry.spec.ts:3:7 | text | audio preference label has a computed and measured 44px hit surface | learner-text-candidate | long-or-dense |
| tests/e2e/audio-preference-geometry.spec.ts:5:31 | text | label.audio-preference-label | learner-text-candidate | — |
| tests/e2e/center-layout.spec.ts:8:38 | text | button | button-or-action | repeated-text |
| tests/e2e/center-layout.spec.ts:20:47 | text | .mission-grid article[data-recommended="true"] button | button-or-action | long-or-dense, technical-or-internal |
| tests/e2e/center-layout.spec.ts:28:25 | text | button | button-or-action | repeated-text |
| tests/e2e/center-layout.spec.ts:28:43 | text | 5~6학년 | button-or-action | repeated-text |
| tests/e2e/center-layout.spec.ts:29:32 | text | button | button-or-action | repeated-text |
| tests/e2e/center-layout.spec.ts:29:50 | text | 5~6학년 | button-or-action | repeated-text |
| tests/e2e/center-layout.spec.ts:29:78 | text | aria-pressed | button-or-action | missing-term-explanation, repeated-text, technical-or-internal |
| tests/e2e/center-layout.spec.ts:29:94 | text | true | button-or-action | repeated-text |
| tests/e2e/center-layout.spec.ts:30:32 | text | 현재 선택: 5~6학년 | learner-text-candidate | repeated-text |
| tests/e2e/center-layout.spec.ts:31:30 | text | [aria-pressed="true"] | learner-text-candidate | technical-or-internal |
| tests/e2e/center-layout.spec.ts:37:35 | text | button | button-or-action | repeated-text |
| tests/e2e/center-layout.spec.ts:37:53 | text | 업데이트 내역 | button-or-action | repeated-text |
| tests/e2e/center-layout.spec.ts:39:42 | text | { const cta = document.querySelector | button-or-action | — |
| tests/e2e/center-layout.spec.ts:40:52 | text | ('.mission-card[data-recommended="true"] button')?.getBoundingClientRect(); const update = document.querySelector | button-or-action | long-or-dense |
| tests/e2e/center-layout.spec.ts:40:54 | text | .mission-card[data-recommended="true"] button | button-or-action | — |
| tests/e2e/learner-flow.spec.ts:11:36 | text | heading | heading | repeated-text |
| tests/e2e/learner-flow.spec.ts:11:55 | text | 통신 기록 | heading | repeated-text |
| tests/e2e/learner-flow.spec.ts:12:36 | text | 의미 확인 완료 | learner-text-candidate | repeated-text |
| tests/e2e/learner-flow.spec.ts:21:34 | text | heading | heading | repeated-text |
| tests/e2e/learner-flow.spec.ts:21:53 | text | 통신 기록 | heading | repeated-text |
| tests/e2e/learner-flow.spec.ts:22:34 | text | 의미 확인 완료 | learner-text-candidate | repeated-text |
| tests/e2e/learner-flow.spec.ts:31:34 | text | heading | heading | repeated-text |
| tests/e2e/learner-flow.spec.ts:31:53 | text | 통신 기록 | heading | repeated-text |
| tests/e2e/learner-flow.spec.ts:32:34 | text | 의미 확인 완료 | learner-text-candidate | repeated-text |
| tests/e2e/navigation-recovery.spec.ts:5:25 | text | button | button-or-action | repeated-text |
| tests/e2e/navigation-recovery.spec.ts:5:43 | text | 어느 상자 미션 시작 | button-or-action | repeated-text |
| tests/e2e/navigation-recovery.spec.ts:6:30 | text | [aria-current="step"] | learner-text-candidate | repeated-text, technical-or-internal |
| tests/e2e/navigation-recovery.spec.ts:8:25 | text | button | button-or-action | repeated-text |
| tests/e2e/navigation-recovery.spec.ts:8:43 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| tests/e2e/navigation-recovery.spec.ts:9:30 | text | [aria-current="step"] | learner-text-candidate | repeated-text, technical-or-internal |
| tests/e2e/navigation-recovery.spec.ts:10:25 | text | button | button-or-action | repeated-text |
| tests/e2e/navigation-recovery.spec.ts:10:43 | text | 이전 단계 보기 | button-or-action | repeated-text |
| tests/e2e/navigation-recovery.spec.ts:11:30 | text | [aria-current="step"] | learner-text-candidate | repeated-text, technical-or-internal |
| tests/e2e/navigation-recovery.spec.ts:13:25 | text | button | button-or-action | repeated-text |
| tests/e2e/navigation-recovery.spec.ts:13:43 | text | 이 미션 다시 하기 | button-or-action | repeated-text |
| tests/e2e/navigation-recovery.spec.ts:14:30 | text | [aria-current="step"] | learner-text-candidate | repeated-text, technical-or-internal |
| tests/e2e/navigation-recovery.spec.ts:16:25 | text | button | button-or-action | repeated-text |
| tests/e2e/navigation-recovery.spec.ts:16:43 | text | 신호센터로 돌아가기 | button-or-action | repeated-text |
| tests/e2e/navigation-recovery.spec.ts:17:32 | text | heading | heading | repeated-text |
| tests/e2e/navigation-recovery.spec.ts:17:51 | text | 대화 수리 신호센터 | heading | repeated-text |
| tests/e2e/privacy.spec.ts:21:25 | text | button | button-or-action | repeated-text |
| tests/e2e/privacy.spec.ts:21:43 | text | 어느 상자 미션 시작 | button-or-action | repeated-text |
| tests/e2e/privacy.spec.ts:22:32 | text | heading | heading | repeated-text |
| tests/e2e/privacy.spec.ts:22:51 | text | 다시 물어볼 부분 찾기 | heading | repeated-text |
| tests/e2e/zoom-geometry.spec.ts:3:7 | text | update dialog keeps title and close control inside a zoomed viewport | learner-text-candidate | long-or-dense, missing-term-explanation, technical-or-internal |
| tests/e2e/zoom-geometry.spec.ts:7:25 | text | button | button-or-action | repeated-text |
| tests/e2e/zoom-geometry.spec.ts:7:43 | text | 업데이트 내역 | button-or-action | repeated-text |
| tests/e2e/zoom-geometry.spec.ts:9:55 | text | ('[role="dialog"]')!.getBoundingClientRect(); const title = document.querySelector | heading | long-or-dense |
| tests/e2e/zoom-geometry.spec.ts:10:54 | text | ('#update-history-title')!.getBoundingClientRect(); const close = document.querySelector | heading | long-or-dense |
| tests/e2e/zoom-geometry.spec.ts:10:56 | text | #update-history-title | heading | — |
| tests/e2e/zoom-geometry.spec.ts:11:56 | text | [aria-label="업데이트 내역 닫기"] | learner-text-candidate | technical-or-internal |
| tests/e2e/zoom-geometry.spec.ts:11:69 | aria-label | 업데이트 내역 닫기 | aria-label | repeated-text |
| tests/e2e/zoom-geometry.spec.ts:27:25 | text | button | button-or-action | repeated-text |
| tests/e2e/zoom-geometry.spec.ts:27:43 | text | 업데이트 내역 | button-or-action | repeated-text |
| tests/e2e/zoom-geometry.spec.ts:28:58 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| tests/fixtures/accepted-paths.ts:24:20 | text | Accepted paths must cover the canonical mission IDs. | feedback-or-error | long-or-dense, missing-term-explanation, technical-or-internal |
| tests/fixtures/accepted-paths.ts:30:25 | text | button | button-or-action | repeated-text |
| tests/fixtures/accepted-paths.ts:30:70 | text | 3~4학년 | button-or-action | repeated-text |
| tests/fixtures/accepted-paths.ts:30:80 | text | 5~6학년 | button-or-action | repeated-text |
| tests/fixtures/accepted-paths.ts:32:25 | text | button | button-or-action | repeated-text |
| tests/fixtures/accepted-paths.ts:32:43 | text | ${mission.titleKo} 미션 시작 | button-or-action | repeated-text |
| tests/fixtures/accepted-paths.ts:40:25 | text | radio | learner-text-candidate | repeated-text |
| tests/fixtures/accepted-paths.ts:41:25 | text | button | button-or-action | repeated-text |
| tests/fixtures/accepted-paths.ts:41:43 | text | 모호한 부분 찾기 | button-or-action | repeated-text |
| tests/fixtures/accepted-paths.ts:43:25 | text | button | button-or-action | repeated-text |
| tests/fixtures/accepted-paths.ts:43:43 | text | 이 표현으로 다시 물어보기 | button-or-action | repeated-text |
| tests/fixtures/accepted-paths.ts:44:25 | text | radio | learner-text-candidate | repeated-text |
| tests/fixtures/accepted-paths.ts:45:25 | text | button | button-or-action | repeated-text |
| tests/fixtures/accepted-paths.ts:45:43 | text | 이해한 뜻 확인하기 | button-or-action | repeated-text |
| tests/fixtures/accepted-paths.ts:47:25 | text | button | button-or-action | repeated-text |
| tests/fixtures/accepted-paths.ts:47:43 | text | 확인 질문 보내기 | button-or-action | repeated-text |

## Limitations

- Candidates are triage signals, not an automatic grade-level or readability certification.
- Static scanning can miss runtime-composed text, fetched content, canvas/image text, and some template syntax.
- Every candidate requires rendered-state, target-grade, learning-intent, and curriculum-accuracy review.
- This command reads source files and writes only the optional report path; it never rewrites source files.

## Configuration

- Extensions: `.astro, .cjs, .htm, .html, .js, .jsx, .mjs, .svelte, .ts, .tsx, .vue`
- Excluded directories: `.git, .next, .nuxt, .parcel-cache, .turbo, .vite, build, coverage, dist, node_modules, out, target, vendor`
