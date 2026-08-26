import { forwardRef } from 'react';

export interface UpdateHistoryButtonProps {
  onClick: () => void;
  inert?: boolean;
}

export const UpdateHistoryButton = forwardRef<HTMLButtonElement, UpdateHistoryButtonProps>(
  function UpdateHistoryButton({ onClick, inert = false }, ref) {
    return (
      <button ref={ref} className="update-history-trigger" inert={inert || undefined} type="button" onClick={onClick}>
        업데이트 내역
      </button>
    );
  },
);
