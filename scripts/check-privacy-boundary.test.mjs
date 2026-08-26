import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { execFile as execFileCallback } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { collectSourceFiles, findPrivacyViolations, scanRuntimeSources } from './check-privacy-boundary.mjs';

const execFile = promisify(execFileCallback);

describe('privacy boundary scanner', () => {
  it('independently rejects microphone and speech recognition tokens', () => {
    assert.deepEqual(
      findPrivacyViolations('navigator.mediaDevices.getUserMedia(); MediaRecorder;', 'voice-fixture.ts'),
      [
        'voice-fixture.ts: navigator.mediaDevices',
        'voice-fixture.ts: MediaRecorder',
        'voice-fixture.ts: getUserMedia',
      ],
    );
    assert.deepEqual(
      findPrivacyViolations('new SpeechRecognition(); webkitSpeechRecognition;', 'speech-fixture.ts'),
      ['speech-fixture.ts: SpeechRecognition', 'speech-fixture.ts: webkitSpeechRecognition'],
    );
  });

  it('independently rejects network and persistent storage tokens', () => {
    assert.deepEqual(findPrivacyViolations('fetch(\'/api\');', 'network-fixture.ts'), ['network-fixture.ts: fetch(']);
    assert.deepEqual(findPrivacyViolations('localStorage.setItem(\'x\', \'y\');', 'storage-fixture.ts'), ['storage-fixture.ts: localStorage']);
    assert.deepEqual(findPrivacyViolations('document.cookie = \'x=y\';', 'cookie-fixture.ts'), ['cookie-fixture.ts: document.cookie']);
  });

  it('allows local bundled audio paths while rejecting remote URLs', () => {
    assert.deepEqual(findPrivacyViolations("src='audio/mission/dialogue.mp3'", 'audio-fixture.tsx'), []);
    assert.deepEqual(findPrivacyViolations("src='https://example.test/audio.mp3'", 'remote-fixture.tsx'), ['remote-fixture.tsx: https://']);
  });

  it('recursively scans runtime fixtures, excludes tests, and catches every capability category', async () => {
    const root = await mkdtemp(join(tmpdir(), 'privacy-boundary-'));
    try {
      await writeFile(join(root, 'runtime.ts'), "navigator.mediaDevices; MediaRecorder; SpeechRecognition; fetch(); XMLHttpRequest; WebSocket; EventSource; localStorage; sessionStorage; document.cookie; analytics.track(); http://example.test;", 'utf8');
      await mkdir(join(root, 'nested'));
      await writeFile(join(root, 'nested', 'audio.tsx'), "export const source = 'audio/mission/dialogue.mp3';", 'utf8');
      await writeFile(join(root, 'nested', 'ignored.test.ts'), 'fetch(); localStorage;', 'utf8');
      await writeFile(join(root, 'nested', 'ignored.spec.tsx'), 'navigator.mediaDevices; https://example.test;', 'utf8');
      const files = await collectSourceFiles(pathToFileURL(`${root}/`));
      assert.equal(files.length, 4);
      const violations = await scanRuntimeSources(pathToFileURL(`${root}/`));
      for (const token of ['navigator.mediaDevices', 'MediaRecorder', 'SpeechRecognition', 'fetch(', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'localStorage', 'sessionStorage', 'document.cookie', 'analytics', 'http://']) {
        assert.ok(violations.some((violation) => violation.endsWith(`: ${token}`)), `missing ${token}`);
      }
      assert.equal(violations.some((violation) => violation.includes('audio.tsx')), false);
      assert.equal(violations.some((violation) => violation.includes('ignored')), false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('keeps the CLI side-effect free on import and fixes its source root', async () => {
    const root = await mkdtemp(join(tmpdir(), 'privacy-cli-'));
    try {
      await writeFile(join(root, 'unsafe.ts'), 'export const request = fetch();', 'utf8');
      const ignoredEnvKey = ['PRIVACY', 'SOURCE_ROOT'].join('_');
      const { stdout } = await execFile(process.execPath, ['scripts/check-privacy-boundary.mjs'], {
          cwd: process.cwd(),
          env: { ...process.env, [ignoredEnvKey]: root },
      });
      assert.match(stdout, /Privacy boundary verified: 0 forbidden capabilities/);
      const script = await readFile(new URL('./check-privacy-boundary.mjs', import.meta.url), 'utf8');
      const packageJson = await readFile(new URL('../package.json', import.meta.url), 'utf8');
      assert.equal(script.includes(ignoredEnvKey), false);
      assert.equal(packageJson.includes(ignoredEnvKey), false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
