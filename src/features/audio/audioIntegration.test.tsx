import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MISSIONS } from '../../content/missionRepository';
import { renderMissionAtPhase } from '../../test/missionHarness';

afterEach(cleanup);

describe('mission audio stage parity', () => {
  it.each(MISSIONS)('renders only the dialogue cue for %s when voice is enabled', (mission) => {
    renderMissionAtPhase(mission.id, 'observe', true);
    const player = screen.getByRole('figure', { name: '대화 듣기 음원' });
    expect(player).toBeVisible();
    expect(screen.getByText(mission.dialogue[0]!.textEn)).toBeVisible();
    expect(screen.getByText(mission.audioCues[0]!.transcriptEn)).toHaveAttribute('lang', 'en');
    expect(player.querySelector('audio')).toHaveAttribute('src', expect.stringContaining(mission.audioCues[0]!.src));
    expect(player.querySelector('audio')).not.toHaveAttribute('autoplay');
    expect(player.querySelector('audio')).not.toHaveAttribute('controls');
  });

  it.each(MISSIONS)('keeps dialogue text and hides the player for %s when voice is disabled', (mission) => {
    renderMissionAtPhase(mission.id, 'observe', false);
    expect(screen.getByText(mission.dialogue[0]!.textEn)).toBeVisible();
    expect(screen.queryByRole('figure', { name: '대화 듣기 음원' })).not.toBeInTheDocument();
  });

  it.each(MISSIONS)('renders only the response cue for %s when voice is enabled', (mission) => {
    renderMissionAtPhase(mission.id, 'response', true);
    const player = screen.getByRole('figure', { name: '응답 듣기 음원' });
    expect(player).toBeVisible();
    expect(screen.getByText(mission.clarifyingResponse.textEn)).toBeVisible();
    expect(screen.getByText(mission.audioCues[1]!.transcriptEn)).toHaveAttribute('lang', 'en');
    expect(player.querySelector('audio')).toHaveAttribute('src', expect.stringContaining(mission.audioCues[1]!.src));
    expect(player.querySelector('audio')).not.toHaveAttribute('autoplay');
    expect(player.querySelector('audio')).not.toHaveAttribute('controls');
  });

  it.each(MISSIONS)('keeps response text and hides the player for %s when voice is disabled', (mission) => {
    renderMissionAtPhase(mission.id, 'response', false);
    expect(screen.getByText(mission.clarifyingResponse.textEn)).toBeVisible();
    expect(screen.queryByRole('figure', { name: '응답 듣기 음원' })).not.toBeInTheDocument();
  });
});
