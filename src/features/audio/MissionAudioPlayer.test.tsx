import { act, cleanup, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderWithUser } from '../../test/renderWithApp';
import { getAudioCues } from '../../content/missions/audioManifest';
import { MissionAudioPlayer } from './MissionAudioPlayer';

const cue = {
  id: 'g34-classroom-box-dialogue',
  src: 'audio/g34-classroom-box/dialogue.mp3',
  mimeType: 'audio/mpeg' as const,
  transcriptEn: 'Teacher: Please put the crayons in that box.',
};

describe('MissionAudioPlayer', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('keeps exact transcript visible and changes playback rate', async () => {
    const { user } = renderWithUser(<MissionAudioPlayer cue={cue} labelKo="대화 듣기" />);
    expect(screen.getByText(cue.transcriptEn)).toHaveAttribute('lang', 'en');
    const select = screen.getByRole('combobox', { name: '재생 속도' });
    await user.selectOptions(select, '0.75');
    expect(screen.getByTestId('audio-element')).toHaveProperty('playbackRate', 0.75);
    await user.click(screen.getByRole('button', { name: '재생' }));
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce();
  });

  it('recovers when play rejects and stops/reset on ended', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new Error('blocked'));
    const { user } = renderWithUser(<MissionAudioPlayer cue={cue} labelKo="대화 듣기" />);
    await user.click(screen.getByRole('button', { name: '재생' }));
    expect(screen.getByRole('button', { name: '재생' })).toBeVisible();

    const audio = screen.getByTestId('audio-element') as HTMLAudioElement;
    Object.defineProperty(audio, 'currentTime', { configurable: true, writable: true, value: 4 });
    await user.click(screen.getByRole('button', { name: '재생' }));
    expect(screen.getByRole('button', { name: '일시 정지' })).toBeVisible();
    act(() => audio.dispatchEvent(new Event('ended')));
    expect(audio.currentTime).toBe(0);
    expect(screen.getByRole('button', { name: '재생' })).toBeVisible();
  });

  it('uses BASE_URL-safe local sources and does not autoplay', () => {
    renderWithUser(<MissionAudioPlayer cue={cue} labelKo="대화 듣기" />);
    const audio = screen.getByTestId('audio-element');
    expect(audio).toHaveAttribute('src', expect.stringContaining('audio/g34-classroom-box/dialogue.mp3'));
    expect(audio).not.toHaveAttribute('autoplay');
    expect(screen.getByRole('button', { name: '재생' })).toBeVisible();
  });

  it('provides the exact 20-cue manifest contract', () => {
    const allCues = Object.values({
      ...Object.fromEntries([
        ['g34-classroom-box', getAudioCues('g34-classroom-box')],
        ['g34-classroom-pencil', getAudioCues('g34-classroom-pencil')],
        ['g34-recess-place', getAudioCues('g34-recess-place')],
        ['g34-recess-time', getAudioCues('g34-recess-time')],
        ['g34-recess-rephrase', getAudioCues('g34-recess-rephrase')],
        ['g56-materials-quantity', getAudioCues('g56-materials-quantity')],
        ['g56-materials-person', getAudioCues('g56-materials-person')],
        ['g56-directions-place', getAudioCues('g56-directions-place')],
        ['g56-directions-sequence', getAudioCues('g56-directions-sequence')],
        ['g56-event-decision', getAudioCues('g56-event-decision')],
      ]),
    }).flat();
    expect(allCues).toHaveLength(20);
    expect(new Set(allCues.map((item) => item.id)).size).toBe(20);
    expect(new Set(allCues.map((item) => item.src)).size).toBe(20);
    expect(allCues.every((item) => item.transcriptEn.trim())).toBe(true);
  });
});
