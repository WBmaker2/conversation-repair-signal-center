import { access, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultManifestPath = path.join(root, 'src/content/missions/audio-manifest.json');
const defaultContractPath = path.join(root, 'scripts/audio-contract.json');
const defaultPublicRoot = path.join(root, 'public');
const expectedMissionIds = ['g34-classroom-box', 'g34-classroom-pencil', 'g34-recess-place', 'g34-recess-time', 'g34-recess-rephrase', 'g56-materials-quantity', 'g56-materials-person', 'g56-directions-place', 'g56-directions-sequence', 'g56-event-decision'];

function resolveTool(name, envName, candidates) {
  const override = process.env[envName];
  const paths = override ? [override] : candidates;
  for (const candidate of paths) {
    const result = spawnSync(candidate, ['-version'], { encoding: 'utf8' });
    if (result.status === 0) return candidate;
  }
  throw new Error(`${name} is required; set ${envName} to an executable absolute path or install ${name}`);
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  return { ...result, output: `${result.stdout ?? ''}\n${result.stderr ?? ''}` };
}

function checkLoudness(ffmpeg, filePath, cueId) {
  const result = run(ffmpeg, ['-hide_banner', '-i', filePath, '-filter_complex', 'ebur128=peak=true:framelog=verbose', '-f', 'null', '-']);
  if (result.status !== 0) throw new Error(`${cueId}: ffmpeg ebur128 failed`);
  const matches = [...result.output.matchAll(/^\s*I:\s*(-?\d+(?:\.\d+)?)\s+LUFS/gm)];
  const integrated = Number(matches.at(-1)?.[1]);
  if (!Number.isFinite(integrated)) throw new Error(`${cueId}: missing finite integrated loudness`);
  if (integrated < -18.5 || integrated > -14.5) throw new Error(`${cueId}: integrated loudness ${integrated} LUFS outside -18.5..-14.5 LUFS`);
  return integrated;
}

function checkEdgeSilence(ffmpeg, filePath, cueId, duration) {
  const result = run(ffmpeg, ['-hide_banner', '-i', filePath, '-af', 'silencedetect=n=-50dB:d=0.3', '-f', 'null', '-']);
  if (result.status !== 0) throw new Error(`${cueId}: ffmpeg silencedetect failed`);
  const starts = [...result.output.matchAll(/silence_start:\s*(-?\d+(?:\.\d+)?)/g)].map((match) => Number(match[1]));
  const ends = [...result.output.matchAll(/silence_end:\s*(-?\d+(?:\.\d+)?)/g)].map((match) => Number(match[1]));
  if (starts[0] !== undefined && starts[0] <= 0.01 && (ends[0] ?? 0) > 0.3) throw new Error(`${cueId}: leading silence ${(ends[0] ?? 0).toFixed(3)}s exceeds 0.3s`);
  const lastStart = starts.at(-1);
  const lastEnd = ends.at(-1);
  if (lastStart !== undefined && (lastEnd === undefined || lastEnd >= duration - 0.01) && duration - lastStart > 0.3) throw new Error(`${cueId}: trailing silence ${(duration - lastStart).toFixed(3)}s exceeds 0.3s`);
}

export async function runVerification({
  manifestPath = process.env.AUDIO_MANIFEST_PATH ?? defaultManifestPath,
  contractPath = process.env.AUDIO_CONTRACT_PATH ?? defaultContractPath,
  publicRoot = process.env.AUDIO_PUBLIC_ROOT ?? defaultPublicRoot,
  ffprobe = resolveTool('ffprobe', 'AUDIO_FFPROBE', ['/opt/homebrew/bin/ffprobe', '/usr/local/bin/ffprobe', 'ffprobe']),
  ffmpeg = resolveTool('ffmpeg', 'AUDIO_FFMPEG', ['/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg', 'ffmpeg']),
} = {}) {
  const issues = [];
  let manifest;
  let contract;
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    contract = JSON.parse(await readFile(contractPath, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read manifest/independent contract: ${error.message}`, { cause: error });
  }
  const missionIds = Object.keys(manifest);
  if (JSON.stringify(missionIds) !== JSON.stringify(expectedMissionIds)) issues.push(`mission order must be ${expectedMissionIds.join(', ')}`);
  if (JSON.stringify(manifest) !== JSON.stringify(contract)) issues.push('production manifest differs from independent canonical audio contract');
  const allCues = [];
  const ids = new Set();
  const srcs = new Set();
  for (const missionId of expectedMissionIds) {
    const cues = manifest[missionId];
    if (!Array.isArray(cues) || cues.length !== 2) {
      issues.push(`${missionId}: exactly dialogue and response cues are required`);
      continue;
    }
    for (const [index, cue] of cues.entries()) {
      const role = index === 0 ? 'dialogue' : 'response';
      const expectedId = `${missionId}-${role}`;
      const expectedSrc = `audio/${missionId}/${role}.mp3`;
      if (cue.id !== expectedId) issues.push(`${missionId}: expected cue id ${expectedId}, got ${String(cue.id)}`);
      if (cue.src !== expectedSrc) issues.push(`${missionId}: expected cue src ${expectedSrc}, got ${String(cue.src)}`);
      if (cue.mimeType !== 'audio/mpeg') issues.push(`${cue.id}: mimeType must be audio/mpeg`);
      if (typeof cue.transcriptEn !== 'string' || cue.transcriptEn.trim() === '') issues.push(`${cue.id}: transcriptEn must be nonblank`);
      if (typeof cue.src !== 'string' || !cue.src.startsWith('audio/') || cue.src.includes('\\') || cue.src.includes('..') || /^[a-z][a-z\d+.-]*:/i.test(cue.src)) issues.push(`${cue.id}: unsafe local source ${String(cue.src)}`);
      if (ids.has(cue.id)) issues.push(`${cue.id}: duplicate cue id`);
      if (srcs.has(cue.src)) issues.push(`${cue.id}: duplicate cue src`);
      ids.add(cue.id);
      srcs.add(cue.src);
      allCues.push(cue);
    }
  }
  if (allCues.length !== 20) issues.push(`expected 20 cues, got ${allCues.length}`);
  if (issues.length) throw new Error(issues.join('\n'));
  const audioRoot = path.resolve(publicRoot, 'audio');
  const measurements = [];
  for (const cue of allCues) {
    const filePath = path.resolve(publicRoot, cue.src);
    if (!filePath.startsWith(`${audioRoot}${path.sep}`)) {
      issues.push(`${cue.id}: path escapes public/audio`);
      continue;
    }
    try {
      await access(filePath);
      const bytes = await readFile(filePath);
      const isId3 = bytes.subarray(0, 3).toString('ascii') === 'ID3';
      const isMpeg = bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0;
      if (bytes.length <= 1024) issues.push(`${cue.id}: ${bytes.length} bytes is not >1KB`);
      if (!isId3 && !isMpeg) issues.push(`${cue.id}: missing ID3/MPEG magic`);
      const probe = run(ffprobe, ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_name,sample_rate,channels:format=duration', '-of', 'json', filePath]);
      if (probe.status !== 0) {
        issues.push(`${cue.id}: ffprobe decode failed`);
        continue;
      }
      const parsed = JSON.parse(probe.stdout);
      const stream = parsed.streams?.[0];
      const duration = Number(parsed.format?.duration);
      if (stream?.codec_name !== 'mp3' || Number(stream?.sample_rate) !== 44100 || Number(stream?.channels) !== 1) issues.push(`${cue.id}: metadata must be mp3/44100Hz/mono, got ${JSON.stringify(stream)}`);
      if (!Number.isFinite(duration) || duration <= 0) issues.push(`${cue.id}: duration must be finite and >0, got ${String(duration)}`);
      const integrated = checkLoudness(ffmpeg, filePath, cue.id);
      checkEdgeSilence(ffmpeg, filePath, cue.id, duration);
      measurements.push({ cue: cue.id, bytes: bytes.length, duration, integrated });
    } catch (error) {
      issues.push(`${cue.id}: ${error.message}`);
    }
  }
  if (issues.length) throw new Error(issues.join('\n'));
  return measurements;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const measurements = await runVerification();
    console.log(`Verified ${measurements.length} local audio files with exact canonical transcripts, mp3/44.1kHz/mono metadata, loudness, duration, and edge-silence checks.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
