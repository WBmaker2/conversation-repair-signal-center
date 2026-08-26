import { expect, test, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ACCEPTED_PATHS, chooseGradeAndMission, completeAcceptedPath } from '../fixtures/accepted-paths';
import { getMissionById } from '../../src/content/missionRepository';

test('375px dialogue stays in one column without overlap or horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const path = ACCEPTED_PATHS.find(({ missionId }) => missionId === 'g56-directions-sequence')!;
  await chooseGradeAndMission(page, path);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
  await expect.poll(() => page.evaluate(() => document.documentElement.clientWidth)).toBe(375);
  expect(await findOverlappingBoxes(page.locator('.dialogue-turn'))).toEqual([]);
  const undersized = await page.locator('button, select, summary, .choice-label').evaluateAll((nodes) => nodes
    .filter((node) => {
      const box = node.getBoundingClientRect();
      return box.width < 44 || box.height < 44;
    })
    .map((node) => node.textContent?.trim() || node.getAttribute('aria-label') || node.tagName));
  expect(undersized).toEqual([]);
});

test('200% zoom keeps content and update dialog inside the viewport width', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
  await expect.poll(() => page.evaluate(() => document.documentElement.clientWidth)).toBe(375);
  const controls = await page.locator('button, select, summary, input').evaluateAll((nodes) => nodes
    .filter((node) => getComputedStyle(node).position !== 'fixed')
    .filter((node) => {
      const box = node.getBoundingClientRect();
      return box.left < 0 || box.right > document.documentElement.clientWidth;
    })
    .map((node) => node.textContent?.trim() || node.getAttribute('aria-label') || node.tagName));
  expect(controls).toEqual([]);
  await page.getByRole('button', { name: '업데이트 내역' }).click();
  const dialog = page.getByRole('dialog', { name: '업데이트 내역' });
  const dialogBox = await dialog.boundingBox();
  expect(dialogBox).not.toBeNull();
  expect(dialogBox!.x).toBeGreaterThanOrEqual(0);
  expect(dialogBox!.x + dialogBox!.width).toBeLessThanOrEqual(375);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
});

test('keyboard-only navigation completes g34-classroom-box and closes update dialog', async ({ page }) => {
  const path = ACCEPTED_PATHS.find(({ missionId }) => missionId === 'g34-classroom-box')!;
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '본문으로 건너뛰기' })).toBeFocused();
  await page.keyboard.press('Enter');
  await tabUntil(page, '어느 상자 미션 시작');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: '대화 관측' })).toBeFocused();
  await tabUntil(page, path.ambiguityLabel);
  await page.keyboard.press('Space');
  await tabUntil(page, '모호한 부분 찾기');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: '수리 송신' })).toBeFocused();
  await tabUntil(page, path.repairExpression);
  await page.keyboard.press('Space');
  await tabUntil(page, '수리 표현 보내기');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: '응답 수신' })).toBeFocused();
  await tabUntil(page, path.meaningLabelKo);
  await page.keyboard.press('Space');
  await tabUntil(page, '이해한 뜻 확인하기');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: '확인 통화' })).toBeFocused();
  await tabUntil(page, path.confirmationExpression);
  await page.keyboard.press('Space');
  await tabUntil(page, '확인 질문 보내기');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: '통신 기록' })).toBeFocused();
  await expect(page.getByRole('heading', { name: '통신 기록' })).toBeVisible();
  await tabUntil(page, '신호센터로 돌아가기');
  await page.keyboard.press('Enter');
  await tabUntil(page, '업데이트 내역');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: '업데이트 내역' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: '업데이트 내역' })).not.toBeVisible();
  await expect(page.getByRole('button', { name: '업데이트 내역' })).toBeFocused();
});

test('reduced motion uses static pulse, outline, and dialogue signals', async ({ page }) => {
  const path = ACCEPTED_PATHS[0]!;
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await chooseGradeAndMission(page, path);
  await page.getByRole('radio', { name: path.ambiguityLabel }).check();
  const style = await page.getByRole('button', { name: '모호한 부분 찾기' }).evaluate((node) => {
    const computed = getComputedStyle(node);
    return { animationName: computed.animationName, outlineWidth: computed.outlineWidth };
  });
  expect(style).toEqual({ animationName: 'none', outlineWidth: '3px' });
  const transforms = await page.locator('.dialogue-turn').evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).transform));
  expect(transforms.every((transform) => transform === 'none')).toBe(true);
});

test('each learning phase has no serious or critical axe violations', async ({ page }) => {
  const path = ACCEPTED_PATHS[0]!;
  await page.goto('/');
  await expectNoSeriousAxe(page, 'center');
  await chooseGradeAndMission(page, path);
  await expectNoSeriousAxe(page, 'observe');
  await page.getByRole('radio', { name: path.ambiguityLabel }).check();
  await page.getByRole('button', { name: '모호한 부분 찾기' }).click();
  await expectNoSeriousAxe(page, 'repair');
  await page.getByRole('radio', { name: path.repairExpression }).check();
  await page.getByRole('button', { name: '수리 표현 보내기' }).click();
  await expectNoSeriousAxe(page, 'response');
  await page.getByRole('radio', { name: path.meaningLabelKo }).check();
  await page.getByRole('button', { name: '이해한 뜻 확인하기' }).click();
  await expectNoSeriousAxe(page, 'confirm');
  await page.getByRole('radio', { name: path.confirmationExpression }).check();
  await page.getByRole('button', { name: '확인 질문 보내기' }).click();
  await expectNoSeriousAxe(page, 'record');
});

test('English and Korean content keep language metadata and accessible names', async ({ page }) => {
  const path = ACCEPTED_PATHS[0]!;
  const mission = getMissionById(path.missionId);
  await page.goto('/');
  await chooseGradeAndMission(page, path);
  await expect(page.locator('[lang="en"]')).not.toHaveCount(0);
  await expect(page.locator('[lang="ko"]')).not.toHaveCount(0);
  await expect(page.getByRole('main')).toHaveAttribute('id', 'main-content');
  await expect(page.getByRole('heading', { name: mission.titleKo })).toBeVisible();
  await completeAcceptedPath(page, path);
  await expect(page.getByRole('heading', { name: '통신 기록' })).toBeVisible();
});

test('communication record exposes curriculum and four learning evidence items without scores or identity', async ({ page }) => {
  const path = ACCEPTED_PATHS[0]!;
  await page.goto('/');
  await chooseGradeAndMission(page, path);
  await completeAcceptedPath(page, path);
  const teacherView = page.getByText('교사용 보기', { exact: true });
  await teacherView.click();
  await expect(page.getByText('교육과정 연결', { exact: true })).toBeVisible();
  await expect(page.getByText('네 가지 학습 목표', { exact: true })).toBeVisible();
  await expect(page.getByText('성취를 보여 주는 활동 증거', { exact: true })).toBeVisible();
  await expect(page.getByText('불명확한 부분을 찾았어요', { exact: true })).toBeVisible();
  await expect(page.getByText('상황에 맞는 수리 전략을 골랐어요', { exact: true })).toBeVisible();
  await expect(page.getByText('상대의 추가 응답과 의미를 연결했어요', { exact: true })).toBeVisible();
  await expect(page.getByText('확인 질문으로 협력적으로 대화를 이어 갔어요', { exact: true })).toBeVisible();
  await expect(page.getByText(/점수|순위|이름/)).toHaveCount(0);
});

test('signal color contrast is at least 4.5 against paper and white', async ({ page }) => {
  await page.goto('/');
  const contrast = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    const parse = (value: string) => {
      const hex = value.trim().match(/^#([\da-f]{6})$/i);
      if (hex) return [0, 2, 4].map((offset) => Number.parseInt(hex[1]!.slice(offset, offset + 2), 16) / 255);
      const rgb = value.match(/rgba?\(([^)]+)\)/i);
      if (!rgb) throw new Error(`Unsupported color: ${value}`);
      return rgb[1]!.split(',').slice(0, 3).map((channel) => Number.parseFloat(channel.trim()) / 255);
    };
    const luminance = (color: number[]) => color.reduce((sum, channel, index) => {
      const linear = channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      return sum + linear * [0.2126, 0.7152, 0.0722][index]!;
    }, 0);
    const ratio = (first: number[], second: number[]) => {
      const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
      return (light + 0.05) / (dark + 0.05);
    };
    const signal = parse(styles.getPropertyValue('--color-signal'));
    const paper = parse(styles.getPropertyValue('--color-paper'));
    const white = [1, 1, 1];
    return { paper: ratio(signal, paper), white: ratio(signal, white) };
  });
  expect(contrast.paper).toBeGreaterThanOrEqual(4.5);
  expect(contrast.white).toBeGreaterThanOrEqual(4.5);
});

async function tabUntil(page: Page, label: string, maximumTabs = 80) {
  for (let index = 0; index < maximumTabs; index += 1) {
    const activeName = await page.evaluate(() => {
      const active = document.activeElement;
      const interactive = active instanceof HTMLAnchorElement
        || active instanceof HTMLButtonElement
        || active instanceof HTMLInputElement
        || active instanceof HTMLSelectElement
        || active instanceof HTMLElement && active.tagName === 'SUMMARY';
      if (!interactive) return '';
      return active.getAttribute('aria-label')
        ?? (active instanceof HTMLInputElement ? active.labels?.[0]?.textContent?.trim() : null)
        ?? active?.textContent?.trim()
        ?? '';
    });
    if (activeName.includes(label)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error(`Keyboard focus did not reach ${label}`);
}

async function findOverlappingBoxes(locator: Locator) {
  const boxes = (await locator.evaluateAll((nodes) => nodes.map((node) => {
    const box = node.getBoundingClientRect();
    return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
  }))).filter((box) => box.right > box.left && box.bottom > box.top);
  const overlaps: Array<[number, number]> = [];
  for (let first = 0; first < boxes.length; first += 1) {
    for (let second = first + 1; second < boxes.length; second += 1) {
      const horizontal = Math.min(boxes[first]!.right, boxes[second]!.right) - Math.max(boxes[first]!.left, boxes[second]!.left);
      const vertical = Math.min(boxes[first]!.bottom, boxes[second]!.bottom) - Math.max(boxes[first]!.top, boxes[second]!.top);
      if (horizontal > 0 && vertical > 0) overlaps.push([first, second]);
    }
  }
  return overlaps;
}

async function expectNoSeriousAxe(page: Page, phase: string) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const serious = result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical');
  expect(serious, `${phase} axe violations`).toEqual([]);
}
