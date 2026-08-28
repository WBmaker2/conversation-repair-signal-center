export interface AudioPreferenceToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function AudioPreferenceToggle({ checked, onChange }: AudioPreferenceToggleProps) {
  return (
    <fieldset className="audio-preference-toggle">
      <legend>음성 자료</legend>
      <label className="audio-preference-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.currentTarget.checked)}
        />{' '}
        음성 자료 사용(선택 사항)
      </label>
      <details className="audio-help">
        <summary>음성은 선택 사항이에요 · 발음 점수 없음</summary>
        <p>컴퓨터가 만든 참고 소리예요. 음성 없이도 대본으로 미션을 할 수 있어요.</p>
      </details>
    </fieldset>
  );
}
