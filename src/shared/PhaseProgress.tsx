import type { SessionPhase } from '../domain/mission';

export type LearningPhase = Extract<SessionPhase, 'observe' | 'repair' | 'response' | 'confirm'>;

const PHASES: readonly { phase: LearningPhase; label: string }[] = [
  { phase: 'observe', label: '다시 물어볼 부분 찾기' },
  { phase: 'repair', label: '어떻게 다시 물어볼까요?' },
  { phase: 'response', label: '상대의 대답 살펴보기' },
  { phase: 'confirm', label: '내가 이해한 뜻 확인하기' },
];

export interface PhaseProgressProps {
  phase: LearningPhase;
  onBack?: (() => void) | undefined;
}

export function PhaseProgress({ phase, onBack }: PhaseProgressProps) {
  const currentIndex = PHASES.findIndex((item) => item.phase === phase);
  const previous = PHASES[currentIndex - 1];
  return (
    <nav className="phase-progress" aria-label="미션 단계">
      <ol>
        {PHASES.map((item, index) => (
          <li key={item.phase} aria-current={item.phase === phase ? 'step' : undefined}>
            <span>{index + 1}/4</span> <span>{item.label}</span>
          </li>
        ))}
      </ol>
      {previous && onBack ? (
        <button type="button" onClick={onBack} aria-label="이전 단계 보기">
          이전 단계 보기
        </button>
      ) : null}
    </nav>
  );
}
