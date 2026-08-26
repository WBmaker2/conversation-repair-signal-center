import type { EvaluationResult } from '../domain/mission';

export interface FeedbackNoticeProps {
  result: EvaluationResult | null;
}

export function FeedbackNotice({ result }: FeedbackNoticeProps) {
  if (!result) return null;
  return (
    <div role="status" aria-live="polite" lang="ko">
      {result.feedbackKo}
    </div>
  );
}
