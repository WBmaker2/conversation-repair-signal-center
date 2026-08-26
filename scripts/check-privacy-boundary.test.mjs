import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { findPrivacyViolations } from './check-privacy-boundary.mjs';

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
});
