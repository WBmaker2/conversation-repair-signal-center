import { expect, test } from '@playwright/test';
import { ACCEPTED_PATHS, chooseGradeAndMission } from '../fixtures/accepted-paths';
import { getMissionById } from '../../src/content/missionRepository';

interface AudioResponseRecord {
  count: number;
  statuses: number[];
  ok: boolean[];
}

test.describe('audio-off text parity', () => {
  for (const path of ACCEPTED_PATHS) {
    test(`${path.missionId} keeps dialogue and response text without players`, async ({ page }) => {
      const mission = getMissionById(path.missionId);
      await page.goto('/');
      await expect(page.getByRole('checkbox', { name: /음성 자료/ })).not.toBeChecked();
      await chooseGradeAndMission(page, path);
      for (const turn of mission.dialogue) {
        await expect(page.getByText(turn.textEn, { exact: true })).toBeVisible();
      }
      await expect(page.locator('audio')).toHaveCount(0);
      await page.getByRole('radio', { name: path.ambiguityLabel }).check();
      await page.getByRole('button', { name: '모호한 부분 찾기' }).click();
      await page.getByRole('radio', { name: path.repairExpression }).check();
      await page.getByRole('button', { name: '수리 표현 보내기' }).click();
      await expect(page.getByText(mission.clarifyingResponse.textEn, { exact: true })).toBeVisible();
      await expect(page.locator('audio')).toHaveCount(0);
    });
  }
});

test('voice-on exposes every manifest cue with transcript, source, controls, and three rates', async ({ page }) => {
  const previewPort = process.env.PLAYWRIGHT_PORT ?? '4173';
  const previewOrigin = new URL(`http://127.0.0.1:${previewPort}`).origin;
  const audioResponses = new Map<string, AudioResponseRecord>();
  const mediaOrigins = new Set<string>();
  page.on('response', (response) => {
    if (response.request().resourceType() !== 'media') return;
    const url = new URL(response.url());
    mediaOrigins.add(url.origin);
    const record = audioResponses.get(url.pathname) ?? { count: 0, statuses: [], ok: [] };
    record.count += 1;
    record.statuses.push(response.status());
    record.ok.push(response.ok());
    audioResponses.set(url.pathname, record);
  });

  for (const path of ACCEPTED_PATHS) {
    const mission = getMissionById(path.missionId);
    await page.goto('/');
    const voice = page.getByRole('checkbox', { name: /음성 자료/ });
    await voice.check();
    await chooseGradeAndMission(page, path);
    await expectCue(page, mission.audioCues[0]!, '대화 듣기', audioResponses, previewOrigin);
    for (const turn of mission.dialogue) {
      await expect(page.getByText(turn.textEn, { exact: true })).toBeVisible();
    }
    await page.getByRole('radio', { name: path.ambiguityLabel }).check();
    await page.getByRole('button', { name: '모호한 부분 찾기' }).click();
    await page.getByRole('radio', { name: path.repairExpression }).check();
    await page.getByRole('button', { name: '수리 표현 보내기' }).click();
    await expectCue(page, mission.audioCues[1]!, '응답 듣기', audioResponses, previewOrigin);
    await expect(page.getByText(mission.clarifyingResponse.textEn, { exact: true })).toBeVisible();
  }

  expect([...mediaOrigins].filter((origin) => origin !== previewOrigin)).toEqual([]);
  for (const cue of ACCEPTED_PATHS.flatMap(({ missionId }) => getMissionById(missionId).audioCues)) {
    const expectedPath = new URL(cue.src, `${previewOrigin}/`).pathname;
    const record = audioResponses.get(expectedPath);
    expect(record, `${expectedPath} was requested`).toBeDefined();
    expect(record!.count, `${expectedPath} request count`).toBeGreaterThanOrEqual(1);
    expect(record!.ok, `${expectedPath} response.ok`).toEqual(record!.ok.map(() => true));
    expect(record!.statuses.every((status) => status >= 200 && status < 300), `${expectedPath} statuses`).toBe(true);
  }
});

test('g34-recess-rephrase keeps both exact speaker turns visible with voice disabled', async ({ page }) => {
  const path = ACCEPTED_PATHS.find(({ missionId }) => missionId === 'g34-recess-rephrase')!;
  await page.goto('/');
  await chooseGradeAndMission(page, path);
  await expect(page.locator('.dialogue-turn')).toHaveCount(2);
  await expect(page.locator('.dialogue-turn').evaluateAll((nodes) => nodes.map((node) => ({
    speaker: node.querySelector('.dialogue-speaker')?.textContent,
    text: node.querySelector('p[lang="en"]')?.textContent,
  })))).resolves.toEqual([
    { speaker: 'You', text: 'Let’s do it over there.' },
    { speaker: 'Partner', text: 'I’m not sure what you mean.' },
  ]);
  await expect(page.locator('audio')).toHaveCount(0);
});

async function expectCue(
  page: import('@playwright/test').Page,
  cue: { src: string; transcriptEn: string },
  labelKo: string,
  audioResponses: Map<string, AudioResponseRecord>,
  previewOrigin: string,
) {
  const figure = page.getByRole('figure', { name: `${labelKo} 음원` });
  await expect(figure).toBeVisible();
  const audio = figure.locator('audio');
  const expectedSource = new URL(cue.src, page.url()).href;
  const expectedPath = new URL(expectedSource).pathname;
  await expect(audio).toHaveAttribute('src', `./${cue.src}`);
  await audio.evaluate((node) => (node as HTMLMediaElement).load());
  await expect.poll(() => audio.evaluate((node) => ({
    currentSrc: (node as HTMLMediaElement).currentSrc,
    duration: (node as HTMLMediaElement).duration,
    error: (node as HTMLMediaElement).error?.code ?? null,
    hasMetadata: (node as HTMLMediaElement).readyState >= HTMLMediaElement.HAVE_METADATA,
  }))).toEqual({
    currentSrc: expectedSource,
    duration: expect.any(Number),
    error: null,
    hasMetadata: true,
  });
  await expect.poll(() => audio.evaluate((node) => Number.isFinite((node as HTMLMediaElement).duration)
    && (node as HTMLMediaElement).duration > 0)).toBe(true);
  await expect.poll(() => audioResponses.get(expectedPath)?.count ?? 0).toBeGreaterThanOrEqual(1);
  expect(new URL(expectedSource).origin).toBe(previewOrigin);
  await expect(audio).not.toHaveAttribute('autoplay');
  await expect(audio).not.toHaveAttribute('controls');
  await expect(figure.getByText(cue.transcriptEn, { exact: true })).toHaveAttribute('lang', 'en');
  const rateSelect = figure.getByRole('combobox', { name: '재생 속도' });
  await expect(rateSelect.locator('option')).toHaveCount(3);
  await expect(rateSelect.locator('option')).toHaveText(['0.75×', '1×', '1.25×']);
  for (const rate of ['0.75', '1', '1.25']) {
    await rateSelect.selectOption(rate);
    await expect.poll(() => audio.evaluate((node) => (node as HTMLAudioElement).playbackRate)).toBe(Number(rate));
  }
  await figure.getByRole('button', { name: '재생' }).click();
  await expect.poll(() => audio.evaluate((node) => !(node as HTMLAudioElement).paused)).toBe(true);
  await expect(figure.getByRole('button', { name: '일시 정지' })).toBeVisible();
  await figure.getByRole('button', { name: '일시 정지' }).click();
  await expect.poll(() => audio.evaluate((node) => (node as HTMLAudioElement).paused)).toBe(true);
  await expect(figure.getByRole('button', { name: '재생' })).toBeVisible();
}
