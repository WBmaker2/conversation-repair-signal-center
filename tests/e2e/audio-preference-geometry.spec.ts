import { expect, test } from '@playwright/test';

test('audio preference label has a computed and measured 44px hit surface', async ({ page }) => {
  await page.goto('/');
  const label = page.locator('label.audio-preference-label');
  await expect(label).toHaveCount(1);
  const geometry = await label.evaluate((node) => {
    const style = getComputedStyle(node);
    const box = node.getBoundingClientRect();
    return {
      minBlockSize: style.minBlockSize,
      minInlineSize: style.minInlineSize,
      width: box.width,
      height: box.height,
      inputInside: Boolean(node.querySelector('input[type="checkbox"]')),
    };
  });
  expect(geometry).toMatchObject({
    minBlockSize: '44px',
    minInlineSize: '44px',
    inputInside: true,
  });
  expect(geometry.width).toBeGreaterThanOrEqual(44);
  expect(geometry.height).toBeGreaterThanOrEqual(44);
});
