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
const secondCue = { ...cue, id: 'g34-classroom-box-response', src: 'audio/g34-classroom-box/response.mp3', transcriptEn: 'Teacher: The blue box by the window.' };

describe('MissionAudioPlayer', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('keeps exact transcript visible and changes through every playback rate', async () => {
    const { user } = renderWithUser(<MissionAudioPlayer cue={cue} labelKo="대화 듣기" />);
    expect(screen.getByText(cue.transcriptEn)).toHaveAttribute('lang', 'en');
    const select = screen.getByRole('combobox', { name: '재생 속도' });
    for (const rate of ['0.75', '1', '1.25']) {
      await user.selectOptions(select, rate);
      expect(screen.getByTestId('audio-element')).toHaveProperty('playbackRate', Number(rate));
    }
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

  it('uses BASE_URL-safe local sources and keeps custom controls as the only controls', () => {
    renderWithUser(<MissionAudioPlayer cue={cue} labelKo="대화 듣기" />);
    const audio = screen.getByTestId('audio-element');
    expect(audio).toHaveAttribute('src', expect.stringContaining('audio/g34-classroom-box/dialogue.mp3'));
    expect(audio).not.toHaveAttribute('autoplay');
    expect(audio).not.toHaveAttribute('controls');
    expect(screen.getByRole('button', { name: '재생' })).toBeVisible();
  });

  it('ignores a play resolution after cue swap', async () => {
    let resolvePlay: (() => void) | undefined;
    vi.mocked(HTMLMediaElement.prototype.play).mockImplementationOnce(() => new Promise<void>((resolve) => { resolvePlay = resolve; }));
    const view = renderWithUser(<MissionAudioPlayer cue={cue} labelKo="대화 듣기" />);
    await view.user.click(screen.getByRole('button', { name: '재생' }));
    view.rerender(<MissionAudioPlayer cue={secondCue} labelKo="응답 듣기" />);
    await act(async () => { resolvePlay?.(); await Promise.resolve(); });
    expect(screen.getByText(secondCue.transcriptEn)).toHaveAttribute('lang', 'en');
    expect(screen.getByRole('button', { name: '재생' })).toBeVisible();
  });

  it('ignores a play rejection after cue swap', async () => {
    let rejectPlay: ((error: Error) => void) | undefined;
    vi.mocked(HTMLMediaElement.prototype.play).mockImplementationOnce(() => new Promise<void>((_, reject) => { rejectPlay = reject; }));
    const view = renderWithUser(<MissionAudioPlayer cue={cue} labelKo="대화 듣기" />);
    await view.user.click(screen.getByRole('button', { name: '재생' }));
    view.rerender(<MissionAudioPlayer cue={secondCue} labelKo="응답 듣기" />);
    await act(async () => { rejectPlay?.(new Error('late rejection')); await Promise.resolve(); });
    expect(screen.getByText(secondCue.transcriptEn)).toHaveAttribute('lang', 'en');
    expect(screen.getByRole('button', { name: '재생' })).toBeVisible();
  });

  it('invalidates a pending play when stopped by a duplicate request', async () => {
    let resolvePlay: (() => void) | undefined;
    vi.mocked(HTMLMediaElement.prototype.play).mockImplementationOnce(() => new Promise<void>((resolve) => { resolvePlay = resolve; }));
    const view = renderWithUser(<MissionAudioPlayer cue={cue} labelKo="대화 듣기" />);
    await view.user.click(screen.getByRole('button', { name: '재생' }));
    await view.user.click(screen.getByRole('button', { name: '재생' }));
    await act(async () => { resolvePlay?.(); await Promise.resolve(); });
    expect(screen.getByRole('button', { name: '재생' })).toBeVisible();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('does not update state when a pending play resolves after unmount', async () => {
    let resolvePlay: (() => void) | undefined;
    vi.mocked(HTMLMediaElement.prototype.play).mockImplementationOnce(() => new Promise<void>((resolve) => { resolvePlay = resolve; }));
    const view = renderWithUser(<MissionAudioPlayer cue={cue} labelKo="대화 듣기" />);
    await view.user.click(screen.getByRole('button', { name: '재생' }));
    view.unmount();
    await act(async () => { resolvePlay?.(); await Promise.resolve(); });
    expect(screen.queryByRole('button', { name: '일시 정지' })).not.toBeInTheDocument();
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
