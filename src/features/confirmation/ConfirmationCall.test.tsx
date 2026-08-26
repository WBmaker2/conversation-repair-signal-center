import { cleanup, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { evaluateMissionChoice } from '../../domain/evaluation';
import { getMissionById, MISSIONS } from '../../content/missionRepository';
import { renderMissionAtConfirmation } from '../../test/missionHarness';

const EXPECTED_CONFIRMATION_RETRY_HINTS: Record<string, string> = {
  'g34-classroom-box': '어떤 정보가 아직 없나요? 확인 문장에서 대상 정보가 바뀌거나 빠졌어요.',
  'g34-classroom-pencil': '어떤 정보가 아직 없나요? 확인 문장에서 대상 정보가 바뀌거나 빠졌어요.',
  'g34-recess-place': '어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요.',
  'g34-recess-time': '어떤 정보가 아직 없나요? 확인 문장에서 문장 전체 정보가 바뀌거나 빠졌어요.',
  'g34-recess-rephrase': '어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요.',
  'g56-materials-quantity': '어떤 정보가 아직 없나요? 확인 문장에서 수량 정보가 바뀌거나 빠졌어요.',
  'g56-materials-person': '어떤 정보가 아직 없나요? 확인 문장에서 담당자 정보가 바뀌거나 빠졌어요.',
  'g56-directions-place': '어떤 정보가 아직 없나요? 확인 문장에서 장소 정보가 바뀌거나 빠졌어요.',
  'g56-directions-sequence': '어떤 정보가 아직 없나요? 확인 문장에서 순서 정보가 바뀌거나 빠졌어요.',
  'g56-event-decision': '어떤 정보가 아직 없나요? 확인 문장에서 최종 결정 정보가 바뀌거나 빠졌어요.',
};

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

  it('checks every retry option for every mission with an independent slot and mode hint', async () => {
    for (const mission of MISSIONS) {
      const accepted = mission.confirmationOptions.find((option) => option.accepted);
      const expectedHint = EXPECTED_CONFIRMATION_RETRY_HINTS[mission.id];
      if (!accepted || !expectedHint) throw new Error(`confirmation options incomplete for ${mission.id}`);

      for (const retry of mission.confirmationOptions.filter((option) => !option.accepted)) {
        const { user, unmount } = renderMissionAtConfirmation(mission.id);
        await user.click(screen.getByRole('radio', { name: retry.textEn }));
        await user.click(screen.getByRole('button', { name: '확인 질문 보내기' }));
        const status = screen.getByRole('status');
        expect(status).toHaveTextContent(expectedHint);
        expect(status).not.toHaveTextContent(accepted.textEn);
        expect(status).not.toHaveTextContent(accepted.id);
        expect(status).toHaveTextContent(retry.mode === 'rephrase' ? '장소' : expectedHint.split(' ')[5] ?? '정보');
        expect(screen.getByRole('heading', { name: '확인 통화' })).toBeVisible();
        unmount();
        cleanup();
      }
    }
  });
});
