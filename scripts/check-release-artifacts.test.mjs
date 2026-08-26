import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('keeps production-preview Playwright artifacts ignored', () => {
  const ignoreRules = readFileSync(join(repositoryRoot, '.gitignore'), 'utf8').split(/\r?\n/);
  assert.ok(ignoreRules.includes('output/playwright/'));
  const check = spawnSync('git', [
    '-C', repositoryRoot,
    'check-ignore',
    '--quiet',
    'output/playwright/.last-run.json',
  ]);
  assert.equal(check.status, 0, 'output/playwright/.last-run.json must be ignored');
});
