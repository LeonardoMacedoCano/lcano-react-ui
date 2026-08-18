import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import styled, { keyframes } from 'styled-components';
import { Locale } from '../../types';

export interface ToastStackItem {
  icon: ReactNode;
  title: string;
  description?: string;
  eyebrow?: string;
}

interface QueuedToastStackItem extends ToastStackItem {
  id: number;
}

interface ToastStackContextValue {
  toasts: QueuedToastStackItem[];
  notify: (items: ToastStackItem[]) => void;
  dismiss: (id: number) => void;
}

const ToastStackContext = createContext<ToastStackContextValue | undefined>(undefined);

export function ToastStackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<QueuedToastStackItem[]>([]);
  const nextIdRef = useRef(0);

  const notify = useCallback((items: ToastStackItem[]) => {
    if (items.length === 0) return;
    setToasts((current) => [...current, ...items.map((item) => ({ ...item, id: nextIdRef.current++ }))]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ toasts, notify, dismiss }), [toasts, notify, dismiss]);

  return <ToastStackContext.Provider value={value}>{children}</ToastStackContext.Provider>;
}

function useToastStackContext(): ToastStackContextValue {
  const context = useContext(ToastStackContext);
  if (!context) throw new Error('useToastStack must be used within a <ToastStackProvider>');
  return context;
}

export function useToastStack(): { notify: (items: ToastStackItem[]) => void } {
  const { notify } = useToastStackContext();
  return { notify };
}

const UI_TEXT: Record<Locale, { dismissLabel: string }> = {
  pt: { dismissLabel: 'Descartar' },
  en: { dismissLabel: 'Dismiss' },
};

export interface ToastStackProps {
  onItemClick?: (item: ToastStackItem) => void;
  autoDismissMs?: number;
  locale?: Locale;
}

export function ToastStack({ onItemClick, autoDismissMs = 6000, locale = 'pt' }: ToastStackProps) {
  const { toasts, dismiss } = useToastStackContext();
  const dismissLabel = UI_TEXT[locale].dismissLabel;

  return (
    <ToastStackContainer>
      {toasts.map((toast) => (
        <ToastStackCard
          key={toast.id}
          toast={toast}
          onItemClick={onItemClick}
          onDismiss={dismiss}
          autoDismissMs={autoDismissMs}
          dismissLabel={dismissLabel}
        />
      ))}
    </ToastStackContainer>
  );
}

function ToastStackCard({
  toast,
  onItemClick,
  onDismiss,
  autoDismissMs,
  dismissLabel,
}: {
  toast: QueuedToastStackItem;
  onItemClick?: (item: ToastStackItem) => void;
  onDismiss: (id: number) => void;
  autoDismissMs: number;
  dismissLabel: string;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), autoDismissMs);
    return () => clearTimeout(timer);
  }, [onDismiss, toast.id, autoDismissMs]);

  const clickable = !!onItemClick;

  function handleActivate() {
    onItemClick?.(toast);
    onDismiss(toast.id);
  }

  return (
    <ToastStackCardContainer
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      $clickable={clickable}
      onClick={clickable ? handleActivate : undefined}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') handleActivate();
            }
          : undefined
      }
    >
      <ToastStackIcon>{toast.icon}</ToastStackIcon>
      <ToastStackBody>
        {toast.eyebrow && <ToastStackEyebrow>{toast.eyebrow}</ToastStackEyebrow>}
        <ToastStackTitle>{toast.title}</ToastStackTitle>
        {toast.description && <ToastStackDescription>{toast.description}</ToastStackDescription>}
      </ToastStackBody>
      <ToastStackCloseButton
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDismiss(toast.id);
        }}
        aria-label={dismissLabel}
      >
        ✕
      </ToastStackCloseButton>
    </ToastStackCardContainer>
  );
}

const slideIn = keyframes`
  from { transform: translateX(24px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const ToastStackContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: min(340px, calc(100vw - 32px));
`;

export const ToastStackCardContainer = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.quaternary};
  background-color: ${({ theme }) => theme.colors.tertiary};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  animation: ${slideIn} 0.2s ease-out;

  &:hover {
    filter: ${({ $clickable }) => ($clickable ? 'brightness(1.1)' : 'none')};
  }
`;

export const ToastStackIcon = styled.div`
  font-size: 1.8em;
  line-height: 1;
  flex-shrink: 0;
`;

export const ToastStackBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ToastStackEyebrow = styled.div`
  font-size: 0.7em;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.quaternary};
  font-weight: bold;
`;

export const ToastStackTitle = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
  margin-top: 2px;
`;

export const ToastStackDescription = styled.div`
  font-size: 0.85em;
  color: ${({ theme }) => theme.colors.white};
  opacity: 0.8;
  margin-top: 2px;
`;

export const ToastStackCloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  opacity: 0.6;
  cursor: pointer;
  font-size: 0.8em;
  padding: 2px;
  flex-shrink: 0;

  &:hover {
    opacity: 1;
  }
`;
