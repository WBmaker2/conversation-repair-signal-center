import { expect, test } from '@playwright/test';

test('preview uses no external requests, microphone, or browser storage', async ({ page }) => {
  const previewPort = process.env.PLAYWRIGHT_PORT ?? '4173';
  const previewOrigin = new URL(`http://127.0.0.1:${previewPort}`).origin;
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== previewOrigin) externalRequests.push(request.url());
  });
  await page.addInitScript(() => {
    (window as Window & { __micCalled?: boolean }).__micCalled = false;
    const mediaDevices = navigator.mediaDevices;
    if (mediaDevices?.getUserMedia) {
      mediaDevices.getUserMedia = async () => {
        (window as Window & { __micCalled?: boolean }).__micCalled = true;
        throw new DOMException('blocked by test');
      };
    }
  });
  await page.goto('/');
  await page.getByRole('button', { name: '어느 상자 미션 시작' }).click();
  await expect(page.getByRole('heading', { name: '대화 관측' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => ({
    mic: (window as Window & { __micCalled?: boolean }).__micCalled,
    local: localStorage.length,
    session: sessionStorage.length,
  }))).toEqual({ mic: false, local: 0, session: 0 });
  expect(externalRequests).toEqual([]);
});
