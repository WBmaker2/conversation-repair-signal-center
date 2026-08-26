import { forwardRef } from 'react';

export interface UpdateHistoryButtonProps {
  onClick: () => void;
}

export const UpdateHistoryButton = forwardRef<HTMLButtonElement, UpdateHistoryButtonProps>(
  function UpdateHistoryButton({ onClick }, ref) {
    return (
      <button ref={ref} className="update-history-trigger" type="button" onClick={onClick}>
        업데이트 내역
      </button>
    );
  },
);
