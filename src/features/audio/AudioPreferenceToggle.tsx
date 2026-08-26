export interface AudioPreferenceToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function AudioPreferenceToggle({ checked, onChange }: AudioPreferenceToggleProps) {
  return (
    <fieldset>
      <legend>음성 자료</legend>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.currentTarget.checked)}
        />{' '}
        음성 자료 사용(선택 사항)
      </label>
      <p>번들 음성은 선택 사항이며 처음에는 꺼져 있어요.</p>
    </fieldset>
  );
}
