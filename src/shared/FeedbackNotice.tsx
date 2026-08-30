import type { EvaluationResult } from '../domain/mission';

export interface FeedbackNoticeProps {
  result: EvaluationResult | null;
}

export function FeedbackNotice({ result }: FeedbackNoticeProps) {
  return (
    <div role="status" aria-live="polite" lang="ko" data-feedback-state={result?.status ?? 'empty'}>
      {result?.feedbackKo ?? ''}
    </div>
  );
}
