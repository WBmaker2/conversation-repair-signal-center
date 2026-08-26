import { expect, test } from '@playwright/test';
import { ACCEPTED_PATHS, chooseGradeAndMission, completeAcceptedPath } from '../fixtures/accepted-paths';

test.describe('voice-off learner paths', () => {
  for (const path of ACCEPTED_PATHS) {
    test(`${path.missionId} completes without audio`, async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('checkbox', { name: /음성 자료/ })).not.toBeChecked();
      await chooseGradeAndMission(page, path);
      await completeAcceptedPath(page, path);
      await expect(page.getByRole('heading', { name: '통신 기록' })).toBeVisible();
      await expect(page.getByText('의미 확인 완료')).toBeVisible();
    });
  }

  test('g34-classroom-box accepts and completes with its best-fit repair expression', async ({ page }) => {
    const path = ACCEPTED_PATHS.find(({ missionId }) => missionId === 'g34-classroom-box')!;
    await page.goto('/');
    await chooseGradeAndMission(page, path);
    await completeAcceptedPath(page, path, path.repairExpression);
    await expect(page.getByRole('heading', { name: '통신 기록' })).toBeVisible();
    await expect(page.getByText('의미 확인 완료')).toBeVisible();
  });

  test('g34-classroom-box accepts and completes with its works repair expression', async ({ page }) => {
    const path = ACCEPTED_PATHS.find(({ missionId }) => missionId === 'g34-classroom-box')!;
    const worksExpression = 'Do you mean the blue box?';
    await page.goto('/');
    await chooseGradeAndMission(page, path);
    await completeAcceptedPath(page, path, worksExpression);
    await expect(page.getByRole('heading', { name: '통신 기록' })).toBeVisible();
    await expect(page.getByText('의미 확인 완료')).toBeVisible();
  });
});
