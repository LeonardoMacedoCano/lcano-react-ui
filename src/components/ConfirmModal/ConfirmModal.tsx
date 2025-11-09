import React from 'react';
import { VariantColor } from '../../types';
import { Button } from '../Button';
import { Modal } from '../Modal';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  modalWidth?: string;
  variantPrimary?: VariantColor;
  variantSecondary?: VariantColor;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmButtonProps?: React.ComponentProps<typeof Button>;
  cancelButtonProps?: React.ComponentProps<typeof Button>;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  content,
  onClose,
  onConfirm,
  modalWidth = '400px',
  variantPrimary = 'warning',
  variantSecondary = 'secondary',
  confirmLabel = 'ACEITAR',
  cancelLabel = 'CANCELAR',
  confirmButtonProps,
  cancelButtonProps,
}) => {
  const defaultButtonStyle: React.CSSProperties = {
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const renderButton = (
    label: string,
    variant: VariantColor,
    onClick: () => void,
    props?: React.ComponentProps<typeof Button>
  ) => (
    <Button
      variant={variant}
      width="100px"
      height="30px"
      style={defaultButtonStyle}
      description={label}
      onClick={onClick}
      {...props}
    />
  );

  return (
    <Modal
      isOpen={isOpen}
      variant={variantPrimary}
      title={title}
      content={content}
      modalWidth={modalWidth}
      maxWidth="85%"
      onClose={onClose}
      showCloseButton={false}
      actions={
        <>
          {renderButton(cancelLabel, variantSecondary, onClose, cancelButtonProps)}
          {renderButton(confirmLabel, variantPrimary, () => {
            onConfirm();
            onClose();
          }, confirmButtonProps)}
        </>
      }
    />
  );
};

export default ConfirmModal;
