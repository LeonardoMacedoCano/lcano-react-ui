import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ToastNotification } from '../components';
import { copyToClipboard } from '../utils';

export interface UseCopyFeedbackOptions {
  successMessage?: string;
  errorMessage?: string;
  durationMs?: number;
}

export interface UseCopyFeedbackResult {
  copy: (text: string) => Promise<boolean>;
  CopyFeedbackToast: JSX.Element | null;
}

const useCopyFeedback = ({
  successMessage = 'Copiado!',
  errorMessage = 'Falha ao copiar',
  durationMs = 2500,
}: UseCopyFeedbackOptions = {}): UseCopyFeedbackResult => {
  const [toastOk, setToastOk] = useState<boolean | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyToClipboard(text);
      setToastOk(ok);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setToastOk(null), durationMs);
      return ok;
    },
    [durationMs],
  );

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const CopyFeedbackToast =
    toastOk === null ? null : (
      <ToastNotification
        type={toastOk ? 'success' : 'error'}
        message={toastOk ? successMessage : errorMessage}
        onClose={() => setToastOk(null)}
      />
    );

  return { copy, CopyFeedbackToast };
};

export default useCopyFeedback;
