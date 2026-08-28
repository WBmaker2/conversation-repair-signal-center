import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MISSIONS } from '../../content/missionRepository';
import { getMissionById } from '../../content/missionRepository';
import { renderMissionAtPhase, renderMissionAtResponse } from '../../test/missionHarness';
import { ResponseReception } from './ResponseReception';

afterEach(cleanup);

const EXPECTED_MEANING_RETRY_FEEDBACK: Record<string, string> = {
  'whole-utterance': '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 문장 전체 정보를 다시 찾아보세요.',
  object: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 대상 정보를 다시 찾아보세요.',
  time: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 시간 정보를 다시 찾아보세요.',
  place: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 장소 정보를 다시 찾아보세요.',
  quantity: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 수량 정보를 다시 찾아보세요.',
  person: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 담당자 정보를 다시 찾아보세요.',
  sequence: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 순서 정보를 다시 찾아보세요.',
  decision: '어떤 정보가 아직 없나요? 상대의 추가 답에서 새로 확인된 최종 결정 정보를 다시 찾아보세요.',
};

describe('ResponseReception', () => {
  it('renders the exact response and optional support language metadata', () => {
    renderMissionAtResponse('g34-classroom-box');
    const mission = getMissionById('g34-classroom-box');
    expect(screen.getByText(mission.clarifyingResponse.textEn)).toHaveAttribute('lang', 'en');
    expect(screen.getByRole('heading', { name: '상대의 대답 살펴보기' })).toBeVisible();
    expect(screen.getByRole('group', { name: '상대가 확인해 준 뜻은 무엇인가요?' })).toBeVisible();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getAllByRole('radio').every((radio) => radio.getAttribute('name') === 'meaning')).toBe(true);
    expect(screen.getByRole('button', { name: '이해한 뜻 확인하기' })).toBeDisabled();
  });

  it('keeps the exact response text and only adds the labelled player when voice is on', () => {
    const mission = getMissionById('g34-classroom-box');
    renderMissionAtResponse(mission.id);
    expect(screen.getByText(mission.clarifyingResponse.textEn)).toBeVisible();
    expect(screen.queryByRole('figure', { name: '응답 듣기 음원' })).not.toBeInTheDocument();
    cleanup();

    renderMissionAtPhase(mission.id, 'response', true);
    expect(screen.getByText(mission.clarifyingResponse.textEn)).toBeVisible();
    expect(screen.getByText(mission.audioCues[1]!.transcriptEn)).toHaveAttribute('lang', 'en');
    expect(screen.getByRole('figure', { name: '응답 듣기 음원' })).toBeVisible();
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
    expect(screen.getByRole('heading', { name: '상대의 대답 살펴보기' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent(EXPECTED_MEANING_RETRY_FEEDBACK.object!);
    expect(screen.getByRole('status')).not.toHaveTextContent('창가에 있는 파란 상자');
    expect(screen.getByRole('radio', { name: '문 옆 빨간 상자' })).toBeChecked();
  });

  it('advances to confirmation after the accepted meaning', async () => {
    const { user } = renderMissionAtResponse('g34-classroom-box');
    await user.click(screen.getByRole('radio', { name: '창가에 있는 파란 상자' }));
    await user.click(screen.getByRole('button', { name: '이해한 뜻 확인하기' }));
    expect(screen.getByRole('heading', { name: '내가 이해한 뜻 확인하기' })).toBeVisible();
  });

  it.each(MISSIONS)('uses the slot-specific retry factory for %s', async (mission) => {
    const retry = mission.meaningOptions.find((option) => !option.accepted);
    if (!retry) throw new Error(`No retry meaning option for ${mission.id}`);
    const { user } = renderMissionAtResponse(mission.id);
    expect(screen.getAllByRole('radio').every((radio) => radio.getAttribute('name') === 'meaning')).toBe(true);
    await user.click(screen.getByRole('radio', { name: retry.labelKo }));
    await user.click(screen.getByRole('button', { name: '이해한 뜻 확인하기' }));
    const status = screen.getByRole('status');
    const slotKind = mission.ambiguityOptions.find((option) => option.accepted)!.slotKind;
    expect(status).toHaveTextContent(EXPECTED_MEANING_RETRY_FEEDBACK[slotKind]!);
    const acceptedValues = [
      ...mission.meaningOptions.filter((option) => option.accepted).flatMap((option) => [option.id, option.labelKo]),
      ...mission.repairOptions.filter((option) => option.accepted).flatMap((option) => [option.id, option.textEn]),
    ];
    expect(acceptedValues.every((value) => !status.textContent!.includes(value))).toBe(true);
  });
});
