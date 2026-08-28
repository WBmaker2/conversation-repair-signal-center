import { expect, test } from '@playwright/test';

test('recommended mission CTA is in the first mobile viewport and the grid adapts', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('./');
  const recommended = page.locator('.mission-grid article[data-recommended="true"]');
  await expect(recommended).toHaveCount(1);
  const cta = recommended.getByRole('button');
  await expect(cta).toHaveClass(/gi-pulse/);
  const mobileGeometry = await cta.boundingBox();
  expect(mobileGeometry).not.toBeNull();
  expect(mobileGeometry!.y).toBeGreaterThanOrEqual(0);
  expect(mobileGeometry!.y + mobileGeometry!.height).toBeLessThanOrEqual(812);
  expect((await page.locator('.mission-grid').evaluate((node) => getComputedStyle(node).gridTemplateColumns)).split(' ').length).toBe(1);

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.reload();
  expect(await page.locator('.mission-grid').evaluate((node) => getComputedStyle(node).display)).toBe('grid');
  expect((await page.locator('.mission-grid').evaluate((node) => getComputedStyle(node).gridTemplateColumns)).split(' ').length).toBe(2);
  const desktopGeometry = await page.locator('.mission-grid article[data-recommended="true"] button').boundingBox();
  expect(desktopGeometry).not.toBeNull();
  expect(desktopGeometry!.y).toBeGreaterThanOrEqual(0);
  expect(desktopGeometry!.y + desktopGeometry!.height).toBeLessThanOrEqual(900);
});

test('grade selection exposes one visible selected state', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: '5~6학년' }).click();
  await expect(page.getByRole('button', { name: '5~6학년' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('현재 선택: 5~6학년')).toBeVisible();
  await expect(page.locator('[aria-pressed="true"]')).toHaveCount(1);
});
