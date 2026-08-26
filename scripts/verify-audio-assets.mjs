import { access, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'src/content/missions/audio-manifest.json');
const expectedMissionIds = [
  'g34-classroom-box',
  'g34-classroom-pencil',
  'g34-recess-place',
  'g34-recess-time',
  'g34-recess-rephrase',
  'g56-materials-quantity',
  'g56-materials-person',
  'g56-directions-place',
  'g56-directions-sequence',
  'g56-event-decision',
];

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const issues = [];
const missionIds = Object.keys(manifest);
if (JSON.stringify(missionIds) !== JSON.stringify(expectedMissionIds)) {
  issues.push(`Expected mission order ${expectedMissionIds.join(', ')}, got ${missionIds.join(', ')}`);
}

const allCues = [];
const ids = new Set();
const srcs = new Set();
for (const missionId of expectedMissionIds) {
  const cues = manifest[missionId];
  if (!Array.isArray(cues) || cues.length !== 2) {
    issues.push(`${missionId} must contain exactly dialogue and response cues`);
    continue;
  }
  for (const [index, cue] of cues.entries()) {
    const role = index === 0 ? 'dialogue' : 'response';
    const expectedId = `${missionId}-${role}`;
    const expectedSrc = `audio/${missionId}/${role}.mp3`;
    if (cue.id !== expectedId) issues.push(`${missionId} expected id ${expectedId}`);
    if (cue.src !== expectedSrc) issues.push(`${missionId} expected src ${expectedSrc}`);
    if (cue.mimeType !== 'audio/mpeg') issues.push(`${cue.id} must declare audio/mpeg`);
    if (typeof cue.transcriptEn !== 'string' || cue.transcriptEn.trim() === '') issues.push(`${cue.id} transcript is blank`);
    if (typeof cue.src !== 'string' || !cue.src.startsWith('audio/') || cue.src.includes('\\') || cue.src.includes('..') || /^[a-z][a-z\d+.-]*:/i.test(cue.src)) {
      issues.push(`${cue.id} has an unsafe local source: ${String(cue.src)}`);
    }
    if (ids.has(cue.id)) issues.push(`Duplicate cue id ${cue.id}`);
    if (srcs.has(cue.src)) issues.push(`Duplicate cue src ${cue.src}`);
    ids.add(cue.id);
    srcs.add(cue.src);
    allCues.push(cue);
  }
}
if (allCues.length !== 20) issues.push(`Expected 20 cues, got ${allCues.length}`);

const ffprobeAvailable = spawnSync('ffprobe', ['-version'], { encoding: 'utf8' }).status === 0;
for (const cue of allCues) {
  if (typeof cue.src !== 'string') continue;
  const filePath = path.resolve(root, 'public', cue.src);
  if (!filePath.startsWith(path.resolve(root, 'public/audio') + path.sep)) {
    issues.push(`${cue.id} escapes public/audio`);
    continue;
  }
  try {
    await access(filePath);
    const bytes = await readFile(filePath);
    const isId3 = bytes.subarray(0, 3).toString('ascii') === 'ID3';
    const isMpeg = bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0;
    if (bytes.length <= 1024) issues.push(`${cue.id} is ${bytes.length} bytes; must be > 1KB`);
    if (!isId3 && !isMpeg) issues.push(`${cue.id} has no ID3 or MPEG frame signature`);
    if (ffprobeAvailable) {
      const probe = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_name,sample_rate,channels', '-of', 'json', filePath], { encoding: 'utf8' });
      if (probe.status !== 0) {
        issues.push(`${cue.id} failed ffprobe decode`);
      } else {
        const stream = JSON.parse(probe.stdout).streams?.[0];
        if (stream?.codec_name !== 'mp3' || Number(stream?.sample_rate) !== 44100 || Number(stream?.channels) !== 1) {
          issues.push(`${cue.id} metadata must be mp3/44100Hz/mono, got ${JSON.stringify(stream)}`);
        }
      }
    }
  } catch {
    issues.push(`Missing audio file ${cue.src}`);
  }
}

if (issues.length) {
  console.error(issues.map((issue) => `- ${issue}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${allCues.length} local audio files with ${allCues.length} exact transcripts${ffprobeAvailable ? ' and 44.1kHz mono metadata.' : '.'}`);
}
