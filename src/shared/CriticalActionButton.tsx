import type { ButtonHTMLAttributes } from 'react';

export interface CriticalActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  action: 'find-ambiguity' | 'send-repair' | 'confirm-meaning' | 'send-confirmation';
}

const ACTION_LABELS: Record<CriticalActionButtonProps['action'], string> = {
  'find-ambiguity': '모호한 부분 찾기',
  'send-repair': '이 표현으로 다시 물어보기',
  'confirm-meaning': '이해한 뜻 확인하기',
  'send-confirmation': '확인 질문 보내기',
};

export function CriticalActionButton({
  action,
  className = '',
  children,
  type,
  ...props
}: CriticalActionButtonProps) {
  void children;
  void type;
  const exactLabel = ACTION_LABELS[action];
  return (
    <button {...props} type="button" className={`gi-pulse ${className}`.trim()} aria-label={exactLabel}>
      {exactLabel}
    </button>
  );
}
