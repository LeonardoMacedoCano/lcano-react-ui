import { Locale } from '../types';

const BOOLEAN_LABELS: Record<Locale, { true: string; false: string }> = {
  pt: { true: 'Sim', false: 'Não' },
  en: { true: 'Yes', false: 'No' },
};

export const formatBooleanToSimNao = (value: string, locale: Locale = 'pt'): string =>
  value === 'true' ? BOOLEAN_LABELS[locale].true : BOOLEAN_LABELS[locale].false;
