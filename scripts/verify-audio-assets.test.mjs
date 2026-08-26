import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const verifier = path.join(root, 'scripts/verify-audio-assets.mjs');
const manifest = path.join(root, 'src/content/missions/audio-manifest.json');
const contract = path.join(root, 'scripts/audio-contract.json');
const publicRoot = path.join(root, 'public');
const ffmpeg = process.env.AUDIO_FFMPEG || 'ffmpeg';
const tempPrefix = (name) => path.join(tmpdir(), `task11-${name}-`);

async function run(env) {
  try {
    await execFileAsync(process.execPath, [verifier], { env: { ...process.env, ...env } });
    return { code: 0, output: '' };
  } catch (error) {
    return { code: error.code ?? 1, output: `${error.stdout ?? ''}\n${error.stderr ?? ''}` };
  }
}

test('fails closed when ffprobe is explicitly unavailable', async () => {
  const result = await run({ AUDIO_FFPROBE: tempPrefix('no-such-ffprobe') });
  assert.notEqual(result.code, 0);
  assert.match(result.output, /ffprobe is required/);
});

test('fails closed when ffmpeg is explicitly unavailable', async () => {
  const result = await run({ AUDIO_FFMPEG: tempPrefix('no-such-ffmpeg') });
  assert.notEqual(result.code, 0);
  assert.match(result.output, /ffmpeg is required/);
});

test('rejects a tampered transcript before media work', async () => {
  const folder = await mkdtemp(tempPrefix('tampered-manifest'));
  try {
    const parsed = JSON.parse(await readFile(manifest, 'utf8'));
    parsed['g34-classroom-box'][0].transcriptEn = 'tampered';
    const fixture = path.join(folder, 'manifest.json');
    await writeFile(fixture, JSON.stringify(parsed));
    const result = await run({ AUDIO_MANIFEST_PATH: fixture });
    assert.notEqual(result.code, 0);
    assert.match(result.output, /production manifest differs from independent canonical audio contract/);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test('rejects an unsafe path through the path validator after canonical parity', async () => {
  const folder = await mkdtemp(tempPrefix('unsafe-path'));
  try {
    const parsed = JSON.parse(await readFile(manifest, 'utf8'));
    const independent = JSON.parse(await readFile(contract, 'utf8'));
    const unsafePath = 'https://example.invalid/audio.mp3';
    parsed['g34-classroom-box'][1].src = unsafePath;
    independent['g34-classroom-box'][1].src = unsafePath;
    const fixture = path.join(folder, 'manifest.json');
    const independentFixture = path.join(folder, 'contract.json');
    await writeFile(fixture, JSON.stringify(parsed));
    await writeFile(independentFixture, JSON.stringify(independent));
    const result = await run({ AUDIO_MANIFEST_PATH: fixture, AUDIO_CONTRACT_PATH: independentFixture });
    assert.notEqual(result.code, 0);
    assert.match(result.output, /g34-classroom-box-response: unsafe local source https:\/\/example\.invalid\/audio\.mp3/);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test('rejects a tampered media fixture without modifying real assets', async () => {
  const folder = await mkdtemp(tempPrefix('tampered-media'));
  try {
    await cp(publicRoot, folder, { recursive: true });
    await writeFile(path.join(folder, 'audio/g34-classroom-box/dialogue.mp3'), Buffer.alloc(2048));
    const result = await run({ AUDIO_PUBLIC_ROOT: folder });
    assert.notEqual(result.code, 0);
    assert.match(result.output, /g34-classroom-box-dialogue: missing ID3\/MPEG magic/);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test('rejects a decodable media fixture with wrong metadata', async () => {
  const folder = await mkdtemp(tempPrefix('wrong-metadata'));
  const original = path.join(folder, 'audio/g34-classroom-box/dialogue.mp3');
  const converted = path.join(folder, 'wrong-rate.mp3');
  try {
    await cp(publicRoot, folder, { recursive: true });
    await execFileAsync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-i', original, '-ar', '22050', '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '128k', converted]);
    await writeFile(original, await readFile(converted));
    const result = await run({ AUDIO_PUBLIC_ROOT: folder });
    assert.notEqual(result.code, 0);
    assert.match(result.output, /g34-classroom-box-dialogue: metadata must be mp3\/44100Hz\/mono/);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
