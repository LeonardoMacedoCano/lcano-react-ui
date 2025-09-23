import React from 'react';
import { VariantColor } from '../../utils';
import Button from '../Button';
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
declare const ConfirmModal: React.FC<ConfirmModalProps>;
export default ConfirmModal;
//# sourceMappingURL=ConfirmModal.d.ts.map