import { expect, test } from '@playwright/test';

test('update dialog keeps title and close control inside a zoomed viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('./');
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  await page.getByRole('button', { name: '업데이트 내역' }).click();
  const geometry = await page.evaluate(() => {
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!.getBoundingClientRect();
    const title = document.querySelector<HTMLElement>('#update-history-title')!.getBoundingClientRect();
    const close = document.querySelector<HTMLElement>('[aria-label="업데이트 내역 닫기"]')!.getBoundingClientRect();
    return { dialog, title, close, viewport: { width: innerWidth, height: innerHeight } };
  });
  expect(geometry.dialog.top).toBeGreaterThanOrEqual(0);
  for (const box of [geometry.title, geometry.close]) {
    expect(box.top).toBeGreaterThanOrEqual(0);
    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.bottom).toBeLessThanOrEqual(geometry.viewport.height);
    expect(box.right).toBeLessThanOrEqual(geometry.viewport.width);
  }
  await expect(page.locator('[role="dialog"]')).toHaveCSS('overflow-y', 'auto');
});
