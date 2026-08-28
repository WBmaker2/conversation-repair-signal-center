import { expect, test } from '@playwright/test';

test('learner can review the previous phase, restart, and return to center', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: '어느 상자 미션 시작' }).click();
  await expect(page.locator('[aria-current="step"]')).toContainText('1/4');
  await page.getByRole('radio', { name: 'that box' }).check();
  await page.getByRole('button', { name: '모호한 부분 찾기' }).click();
  await expect(page.locator('[aria-current="step"]')).toContainText('2/4');
  await page.getByRole('button', { name: '이전 단계 보기' }).click();
  await expect(page.locator('[aria-current="step"]')).toContainText('1/4');
  await expect(page.getByRole('radio', { name: 'that box' })).toBeChecked();
  await page.getByRole('button', { name: '이 미션 다시 하기' }).click();
  await expect(page.locator('[aria-current="step"]')).toContainText('1/4');
  await expect(page.getByRole('radio', { name: 'that box' })).not.toBeChecked();
  await page.getByRole('button', { name: '신호센터로 돌아가기' }).click();
  await expect(page.getByRole('heading', { name: '대화 수리 신호센터' })).toBeVisible();
});
