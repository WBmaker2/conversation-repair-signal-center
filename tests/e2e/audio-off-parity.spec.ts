import { expect, test } from '@playwright/test';
import { ACCEPTED_PATHS, chooseGradeAndMission } from '../fixtures/accepted-paths';
import { getMissionById } from '../../src/content/missionRepository';

test.describe('audio-off text parity', () => {
  for (const path of ACCEPTED_PATHS) {
    test(`${path.missionId} keeps dialogue and response text without players`, async ({ page }) => {
      const mission = getMissionById(path.missionId);
      await page.goto('/');
      await expect(page.getByRole('checkbox', { name: /음성 자료/ })).not.toBeChecked();
      await chooseGradeAndMission(page, path);
      await expect(page.getByText(mission.dialogue[0]!.textEn, { exact: true })).toBeVisible();
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
  const seenAudioResponses = new Set<string>();
  page.on('response', (response) => {
    if (response.request().resourceType() === 'media') seenAudioResponses.add(response.url());
  });

  for (const path of ACCEPTED_PATHS) {
    const mission = getMissionById(path.missionId);
    await page.goto('/');
    const voice = page.getByRole('checkbox', { name: /음성 자료/ });
    await voice.check();
    await chooseGradeAndMission(page, path);
    await expectCue(page, mission.audioCues[0]!, '대화 듣기');
    await expect(page.getByText(mission.dialogue[0]!.textEn, { exact: true })).toBeVisible();
    await page.getByRole('radio', { name: path.ambiguityLabel }).check();
    await page.getByRole('button', { name: '모호한 부분 찾기' }).click();
    await page.getByRole('radio', { name: path.repairExpression }).check();
    await page.getByRole('button', { name: '수리 표현 보내기' }).click();
    await expectCue(page, mission.audioCues[1]!, '응답 듣기');
    await expect(page.getByText(mission.clarifyingResponse.textEn, { exact: true })).toBeVisible();
  }

  expect(seenAudioResponses.size).toBeGreaterThanOrEqual(20);
});

async function expectCue(page: import('@playwright/test').Page, cue: { src: string; transcriptEn: string }, labelKo: string) {
  const figure = page.getByRole('figure', { name: `${labelKo} 음원` });
  await expect(figure).toBeVisible();
  const audio = figure.locator('audio');
  const expectedSource = new URL(cue.src, page.url()).href;
  await expect(audio).toHaveAttribute('src', `./${cue.src}`);
  await audio.evaluate((node) => (node as HTMLMediaElement).load());
  await expect.poll(() => audio.evaluate((node) => (node as HTMLMediaElement).currentSrc)).toBe(expectedSource);
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
}
