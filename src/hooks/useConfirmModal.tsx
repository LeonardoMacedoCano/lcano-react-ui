import React, { useState, useCallback, useMemo } from 'react';
import { ConfirmModal } from '../components';

export interface UseConfirmModalResult {
  confirm: (title: string, content: React.ReactNode) => Promise<boolean>;
  ConfirmModalComponent: JSX.Element;
}

const useConfirmModal = (): UseConfirmModalResult => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>('Confirmação');
  const [content, setContent] = useState<React.ReactNode>(
    <p>Deseja realmente executar esta ação?</p>
  );
  const [resolver, setResolver] = useState<(value: boolean) => void>(() => () => {});

  const confirm = useCallback((newTitle: string, newContent: React.ReactNode) => {
    setTitle(newTitle);
    setContent(newContent);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleClose = useCallback((value: boolean) => {
    setIsOpen(false);
    resolver(value);
  }, [resolver]);

  const ConfirmModalComponent = useMemo(() => (
    <ConfirmModal
      isOpen={isOpen}
      title={title}
      content={content}
      onClose={() => handleClose(false)}
      onConfirm={() => handleClose(true)}
    />
  ), [isOpen, title, content, handleClose]);

  return { confirm, ConfirmModalComponent };
};

export default useConfirmModal;
