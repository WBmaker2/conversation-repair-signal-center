import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { extname, join, resolve } from 'node:path';

export const FORBIDDEN_TOKENS = [
  'navigator.mediaDevices', 'MediaRecorder', 'SpeechRecognition', 'webkitSpeechRecognition',
  'fetch(', 'XMLHttpRequest', 'WebSocket', 'EventSource',
  'localStorage', 'sessionStorage', 'document.cookie',
  'indexedDB', 'cookieStore', 'http://', 'https://', 'gtag', 'google-analytics', 'analytics',
  'mixpanel', 'amplitude', 'posthog', 'plausible', 'sentry', 'dataLayer', 'track(',
  'navigator.sendBeacon', 'getUserMedia',
];

export function findPrivacyViolations(source, fileName = 'source') {
  return FORBIDDEN_TOKENS
    .filter((token) => source.includes(token))
    .map((token) => `${fileName}: ${token}`);
}

export async function collectSourceFiles(rootUrl) {
  const rootPath = fileURLToPath(rootUrl);
  const files = [];
  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (['.ts', '.tsx'].includes(extname(entry.name))) files.push(path);
    }
  }
  await visit(rootPath);
  return files.sort();
}

export async function scanRuntimeSources(rootUrl) {
  const files = await collectSourceFiles(rootUrl);
  const violations = [];
  for (const file of files) {
    if (/\.(test|spec)\.[tj]sx?$/.test(file)) continue;
    const source = await readFile(file, 'utf8');
    violations.push(...findPrivacyViolations(source, file));
  }
  return violations;
}

async function main() {
  const sourceRoot = new URL('../src/', import.meta.url);
  const violations = await scanRuntimeSources(sourceRoot);
  if (violations.length) {
    console.error(violations.join('\n'));
    process.exitCode = 1;
    return;
  }
  console.log('Privacy boundary verified: 0 forbidden capabilities.');
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) await main();
