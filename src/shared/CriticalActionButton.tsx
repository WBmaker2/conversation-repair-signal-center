import type { ButtonHTMLAttributes } from 'react';

export interface CriticalActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  action: 'find-ambiguity' | 'send-confirmation';
}

export function CriticalActionButton({
  action,
  className = '',
  children,
  type,
  ...props
}: CriticalActionButtonProps) {
  void children;
  void type;
  const exactLabel = action === 'find-ambiguity' ? '모호한 부분 찾기' : '확인 질문 보내기';
  return (
    <button {...props} type="button" className={`gi-pulse ${className}`.trim()} aria-label={exactLabel}>
      {exactLabel}
    </button>
  );
}
