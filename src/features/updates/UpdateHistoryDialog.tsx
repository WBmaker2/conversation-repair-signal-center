import { useEffect, useRef, type JSX } from 'react';
import type { ChangeRecord } from '../../content/changelog';

export interface UpdateHistoryDialogProps {
  records: readonly ChangeRecord[];
  onClose: () => void;
}

export function UpdateHistoryDialog({ records, onClose }: UpdateHistoryDialogProps): JSX.Element {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="update-history-backdrop">
      <section
        className="update-history-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-history-title"
      >
        <div className="update-history-dialog-header">
          <h2 id="update-history-title" ref={titleRef} tabIndex={-1}>업데이트 내역</h2>
          <button type="button" aria-label="업데이트 내역 닫기" onClick={onClose}>닫기</button>
        </div>
        <ol className="update-history-list">
          {records.map((record) => (
            <li key={`${record.date}-${record.category}`}>
              <p><time dateTime={record.date}>{record.date}</time> · {record.category}</p>
              <p lang="ko">{record.detailKo}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
