import type { DialogueTurn } from '../../domain/mission';
import { LanguageText } from '../../shared/LanguageText';

export interface DialogueTurnViewProps {
  turn: DialogueTurn;
  sequence: number;
}

export function DialogueTurnView({ turn, sequence }: DialogueTurnViewProps) {
  return (
    <li>
      <span aria-label={`문장 ${sequence}`}>{sequence}.</span>
      <span>{turn.speaker}</span>
      <LanguageText language="en" as="p">{turn.textEn}</LanguageText>
      {turn.supportKo ? <LanguageText language="ko" as="p">{turn.supportKo}</LanguageText> : null}
      {turn.obscuredLabelKo ? <LanguageText language="ko" as="p">{turn.obscuredLabelKo}</LanguageText> : null}
    </li>
  );
}
