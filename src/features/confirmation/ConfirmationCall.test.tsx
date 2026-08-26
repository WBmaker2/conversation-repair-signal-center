import { cleanup, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { evaluateMissionChoice } from '../../domain/evaluation';
import { getMissionById, MISSIONS } from '../../content/missionRepository';
import { renderMissionAtConfirmation } from '../../test/missionHarness';

describe('ConfirmationCall', () => {
  it('requires a final confirmation before showing the record', async () => {
    const { user } = renderMissionAtConfirmation('g56-event-decision');
    expect(screen.queryByRole('heading', { name: '통신 기록' })).not.toBeInTheDocument();

    const mission = getMissionById('g56-event-decision');
    const accepted = mission.confirmationOptions.find((option) => option.accepted);
    if (!accepted) throw new Error('test mission has no accepted confirmation');

    await user.click(screen.getByRole('radio', { name: accepted.textEn }));
    await user.click(screen.getByRole('button', { name: '확인 질문 보내기' }));

    expect(screen.getByRole('heading', { name: '통신 기록' })).toBeVisible();
    expect(screen.getAllByText('뜻 확인').length).toBeGreaterThan(0);
    expect(screen.getByText('의미 확인 완료')).toBeVisible();
  });

  it('keeps the retry feedback tied to confirmation and does not reveal the answer', async () => {
    const { user } = renderMissionAtConfirmation('g34-classroom-box');
    const mission = getMissionById('g34-classroom-box');
    const retry = mission.confirmationOptions.find((option) => !option.accepted);
    if (!retry) throw new Error('test mission has no retry confirmation');

    await user.click(screen.getByRole('radio', { name: retry.textEn }));
    await user.click(screen.getByRole('button', { name: '확인 질문 보내기' }));

    expect(screen.getByRole('status')).toHaveTextContent('어떤 정보가 아직 없나요?');
    expect(screen.getByRole('status')).not.toHaveTextContent(
      mission.confirmationOptions.find((option) => option.accepted)?.textEn ?? '',
    );
    expect(screen.queryByRole('heading', { name: '통신 기록' })).not.toBeInTheDocument();
    expect(evaluateMissionChoice(mission, 'confirmation', retry.id).stage).toBe('confirmation');
  });

  it('uses accessible English radios with the confirmation group name', () => {
    renderMissionAtConfirmation('g34-recess-rephrase');
    expect(screen.getByRole('group', { name: '내가 이해한 뜻을 영어로 다시 확인해 보세요.' })).toBeVisible();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getAllByRole('radio').every((radio) => radio.getAttribute('name') === 'confirmation')).toBe(true);
    expect(screen.getAllByRole('radio').every((radio) => radio.getAttribute('lang') === null)).toBe(true);
    expect(screen.getAllByText(/\w/).some((node) => node.getAttribute('lang') === 'en')).toBe(true);
  });

  it('completes confirmation for every mission and keeps each retry hint non-revealing', async () => {
    for (const mission of MISSIONS) {
      const { user, unmount } = renderMissionAtConfirmation(mission.id);
      const retry = mission.confirmationOptions.find((option) => !option.accepted);
      const accepted = mission.confirmationOptions.find((option) => option.accepted);
      if (!retry || !accepted) throw new Error(`confirmation options incomplete for ${mission.id}`);

      await user.click(screen.getByRole('radio', { name: retry.textEn }));
      await user.click(screen.getByRole('button', { name: '확인 질문 보내기' }));
      expect(screen.getByRole('status')).toHaveTextContent('어떤 정보가 아직 없나요?');
      expect(screen.getByRole('status')).not.toHaveTextContent(accepted.textEn);

      await user.click(screen.getByRole('radio', { name: accepted.textEn }));
      await user.click(screen.getByRole('button', { name: '확인 질문 보내기' }));
      expect(screen.getByRole('heading', { name: '통신 기록' })).toBeVisible();
      unmount();
      cleanup();
    }
  });
});
