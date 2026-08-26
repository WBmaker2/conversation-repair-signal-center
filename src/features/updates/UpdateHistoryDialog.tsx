import { useEffect, useRef, type JSX, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { ChangeRecord } from '../../content/changelog';

export interface UpdateHistoryDialogProps {
  records: readonly ChangeRecord[];
  onClose: () => void;
}

export function UpdateHistoryDialog({ records, onClose }: UpdateHistoryDialogProps): JSX.Element {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const trapTab = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = [
      titleRef.current,
      ...Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button, a, input, select, textarea, [tabindex]') ?? []),
    ].filter((element, index, elements) => element && elements.indexOf(element) === index && !element.hasAttribute('disabled'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <div className="update-history-backdrop">
      <section
        className="update-history-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-history-title"
        onKeyDown={trapTab}
      >
        <div className="update-history-dialog-header">
          <h2 id="update-history-title" ref={titleRef} tabIndex={-1}>업데이트 내역</h2>
          <button type="button" aria-label="업데이트 내역 닫기" onClick={onClose}>닫기</button>
        </div>
        <ol className="update-history-list">
          {records.map((record) => (
            <li key={`${record.date}-${record.category}-${record.detailKo}`}>
              <p><time dateTime={record.date}>{record.date}</time> · {record.category}</p>
              <p lang="ko">{record.detailKo}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
