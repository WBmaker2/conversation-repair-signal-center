import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { MISSIONS } from '../../content/missionRepository';
import { REPAIR_STRATEGIES } from '../../content/strategies';
import { renderMissionAtRepair } from '../../test/missionHarness';

afterEach(cleanup);

describe('RepairTransmission', () => {
  it('filters strategy cards in canonical order and keeps exactly three controlled radios', () => {
    for (const mission of MISSIONS) {
      renderMissionAtRepair(mission.id);
      const cards = [...document.querySelectorAll('[data-strategy-id]')];
      expect(cards.map((card) => card.getAttribute('data-strategy-id'))).toEqual(
        REPAIR_STRATEGIES.filter(({ id }) => mission.allowedStrategyIds.some((allowedId) => allowedId === id)).map(({ id }) => id),
      );
      expect(screen.getAllByRole('radio')).toHaveLength(3);
      cleanup();
    }
  });

  it('renders Korean strategy names, purposes, context, and English examples with language metadata', () => {
    renderMissionAtRepair('g34-classroom-box');
    expect(screen.getByText('더 구체적으로')).toBeVisible();
    expect(screen.getByText('대상·시간·장소·수량·담당·순서가 불분명할 때')).toBeVisible();
    expect(screen.getAllByText('교실에서 정중하게')).toHaveLength(2);
    expect(screen.getByText('Which one?')).toHaveAttribute('lang', 'en');
    expect(screen.getAllByText('Do you mean the blue box?').every((element) => element.getAttribute('lang') === 'en')).toBe(true);
    expect(screen.getByRole('button', { name: '수리 표현 보내기' })).not.toHaveClass('gi-pulse');
  });

  it('requires selection, then accepts both natural expressions with distinct feedback', async () => {
    const { user } = renderMissionAtRepair('g34-classroom-box');
    const submit = screen.getByRole('button', { name: '수리 표현 보내기' });
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole('radio', { name: 'Which box?' }));
    expect(submit).toBeEnabled();
    await user.click(submit);
    expect(screen.getByRole('status')).toHaveTextContent('어느 상자인지 직접 물어 상황에 꼭 맞는 표현이에요.');
    expect(screen.getByRole('heading', { name: '응답 수신' })).toBeVisible();
  });

  it('keeps a retry on repair and gives a Korean hint without exposing an accepted expression', async () => {
    const { user } = renderMissionAtRepair('g34-classroom-box');
    await user.click(screen.getByRole('radio', { name: 'Could you say that again?' }));
    await user.click(screen.getByRole('button', { name: '수리 표현 보내기' }));
    expect(screen.getByRole('heading', { name: '수리 송신' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('말은 들었지만 어느 상자인지가 아직 분명하지 않아요.');
    expect(screen.getByRole('status')).not.toHaveTextContent('Which box?');
    expect(screen.getByRole('radio', { name: 'Could you say that again?' })).toBeChecked();
  });

  it('preserves the second accepted expression feedback when entering response', async () => {
    const { user } = renderMissionAtRepair('g34-classroom-box');
    await user.click(screen.getByRole('radio', { name: 'Do you mean the blue box?' }));
    await user.click(screen.getByRole('button', { name: '수리 표현 보내기' }));
    expect(screen.getByRole('heading', { name: '응답 수신' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('가능한 상자를 정중하게 확인해 대화를 이어 갔어요.');
  });

  it('supports keyboard selection and submission', async () => {
    const user = userEvent.setup();
    renderMissionAtRepair('g34-recess-place');
    const choice = screen.getByRole('radio', { name: 'Where should we meet?' });
    choice.focus();
    await user.keyboard(' ');
    expect(choice).toBeChecked();
    const submit = screen.getByRole('button', { name: '수리 표현 보내기' });
    submit.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('heading', { name: '응답 수신' })).toBeVisible();
  });
});
