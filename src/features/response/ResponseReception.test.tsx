import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MISSIONS } from '../../content/missionRepository';
import { createMeaningRetryFeedback } from '../../content/feedback';
import { getMissionById } from '../../content/missionRepository';
import { renderMissionAtResponse } from '../../test/missionHarness';
import { ResponseReception } from './ResponseReception';

afterEach(cleanup);

describe('ResponseReception', () => {
  it('renders the exact response and optional support language metadata', () => {
    renderMissionAtResponse('g34-classroom-box');
    const mission = getMissionById('g34-classroom-box');
    expect(screen.getByText(mission.clarifyingResponse.textEn)).toHaveAttribute('lang', 'en');
    expect(screen.getByRole('heading', { name: '응답 수신' })).toBeVisible();
    expect(screen.getByRole('group', { name: '상대가 확인해 준 뜻은 무엇인가요?' })).toBeVisible();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('button', { name: '이해한 뜻 확인하기' })).toBeDisabled();
  });

  it('marks optional Korean support as Korean text', () => {
    const mission = getMissionById('g34-classroom-box');
    render(
      <ResponseReception
        mission={{ ...mission, clarifyingResponse: { ...mission.clarifyingResponse, supportKo: '창가 쪽 파란 상자예요.' } }}
        selectedOptionId={undefined}
        latestResult={null}
        onSelect={() => undefined}
        onSubmit={() => undefined}
      />,
    );
    expect(screen.getByText('창가 쪽 파란 상자예요.')).toHaveAttribute('lang', 'ko');
  });

  it('keeps a wrong meaning choice in response with the exact slot hint and no answer leak', async () => {
    const { user } = renderMissionAtResponse('g34-classroom-box');
    await user.click(screen.getByRole('radio', { name: '문 옆 빨간 상자' }));
    await user.click(screen.getByRole('button', { name: '이해한 뜻 확인하기' }));
    expect(screen.getByRole('heading', { name: '응답 수신' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent(createMeaningRetryFeedback('object'));
    expect(screen.getByRole('status')).not.toHaveTextContent('창가에 있는 파란 상자');
    expect(screen.getByRole('radio', { name: '문 옆 빨간 상자' })).toBeChecked();
  });

  it('advances to confirmation after the accepted meaning', async () => {
    const { user } = renderMissionAtResponse('g34-classroom-box');
    await user.click(screen.getByRole('radio', { name: '창가에 있는 파란 상자' }));
    await user.click(screen.getByRole('button', { name: '이해한 뜻 확인하기' }));
    expect(screen.getByRole('heading', { name: '확인 통화' })).toBeVisible();
  });

  it.each(MISSIONS)('uses the slot-specific retry factory for %s', async (mission) => {
    const retry = mission.meaningOptions.find((option) => !option.accepted);
    if (!retry) throw new Error(`No retry meaning option for ${mission.id}`);
    const { user } = renderMissionAtResponse(mission.id);
    await user.click(screen.getByRole('radio', { name: retry.labelKo }));
    await user.click(screen.getByRole('button', { name: '이해한 뜻 확인하기' }));
    expect(screen.getByRole('status')).toHaveTextContent(createMeaningRetryFeedback(mission.ambiguityOptions.find((option) => option.accepted)!.slotKind));
  });
});
