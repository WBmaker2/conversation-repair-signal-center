import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { MISSIONS } from '../../content/missionRepository';
import { renderMissionAtRepair } from '../../test/missionHarness';

afterEach(cleanup);

const EXPECTED_ALLOWED_STRATEGY_ORDER: Record<string, readonly string[]> = {
  'g34-classroom-box': ['specify', 'confirm'],
  'g34-classroom-pencil': ['specify', 'confirm'],
  'g34-recess-place': ['specify', 'confirm'],
  'g34-recess-time': ['repeat'],
  'g34-recess-rephrase': ['rephrase'],
  'g56-materials-quantity': ['specify'],
  'g56-materials-person': ['specify', 'confirm'],
  'g56-directions-place': ['specify', 'confirm'],
  'g56-directions-sequence': ['specify', 'confirm'],
  'g56-event-decision': ['confirm'],
};

describe('RepairTransmission', () => {
  it('filters strategy cards in canonical order and keeps exactly three controlled radios', () => {
    for (const mission of MISSIONS) {
      renderMissionAtRepair(mission.id);
      const cards = [...document.querySelectorAll('[data-strategy-id]')];
      expect(cards.map((card) => card.getAttribute('data-strategy-id'))).toEqual(EXPECTED_ALLOWED_STRATEGY_ORDER[mission.id]);
      expect(cards.every((card) => EXPECTED_ALLOWED_STRATEGY_ORDER[mission.id]!.includes(card.getAttribute('data-strategy-id')!))).toBe(true);
      expect(screen.getAllByRole('radio')).toHaveLength(3);
      expect(screen.getAllByRole('radio').every((radio) => radio.getAttribute('name') === 'repair')).toBe(true);
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
    expect(screen.getAllByRole('radio').every((radio) => radio.getAttribute('name') === 'repair')).toBe(true);
  });

  it('starts with an empty stable repair status and clears it on a new selection', async () => {
    const { user } = renderMissionAtRepair('g34-classroom-box');
    const status = screen.getByRole('status');
    expect(status).toBeEmptyDOMElement();
    expect(status).not.toHaveTextContent('불명확한 대상을 찾았어요.');
    await user.click(screen.getByRole('radio', { name: 'Could you say that again?' }));
    await user.click(screen.getByRole('button', { name: '수리 표현 보내기' }));
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('말은 들었지만 어느 상자인지가 아직 분명하지 않아요.');
    await user.click(screen.getByRole('radio', { name: 'Which box?' }));
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toBeEmptyDOMElement();
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

  it('keeps accepted repair feedback in response, then clears the same status after meaning selection', async () => {
    const { user } = renderMissionAtRepair('g34-classroom-box');
    await user.click(screen.getByRole('radio', { name: 'Which box?' }));
    await user.click(screen.getByRole('button', { name: '수리 표현 보내기' }));
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('어느 상자인지 직접 물어 상황에 꼭 맞는 표현이에요.');
    expect(screen.getAllByRole('radio').every((radio) => radio.getAttribute('name') === 'meaning')).toBe(true);
    await user.click(screen.getByRole('radio', { name: '창가에 있는 파란 상자' }));
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('');
  });

  it.each(MISSIONS)('keeps each repair retry hint free of accepted answer data for %s', async (mission) => {
    const retry = mission.repairOptions.find((option) => !option.accepted)!;
    const acceptedRepairValues = mission.repairOptions.filter((option) => option.accepted)
      .flatMap((option) => [option.id, option.textEn]);
    const { user } = renderMissionAtRepair(mission.id);
    await user.click(screen.getByRole('radio', { name: retry.textEn }));
    await user.click(screen.getByRole('button', { name: '수리 표현 보내기' }));
    const feedback = screen.getByRole('status').textContent ?? '';
    expect(acceptedRepairValues.every((value) => !feedback.includes(value))).toBe(true);
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
