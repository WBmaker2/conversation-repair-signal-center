import type { ReactNode } from 'react';

export interface LanguageTextProps {
  language: 'en' | 'ko';
  as?: 'span' | 'p';
  children: ReactNode;
}

export function LanguageText({ language, as = 'span', children }: LanguageTextProps) {
  const Element = as;
  return <Element lang={language}>{children}</Element>;
}
