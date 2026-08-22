import React from 'react';
import styled from 'styled-components';
import {
  FaExclamationTriangle,
  FaTimes
} from 'react-icons/fa';
import { getVariantColor } from '../../utils';
import { Button } from '../Button';
import { VariantColor } from '../../types';

const DEFAULT_DENSE_BELOW = '500px';

export interface ModalProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  variant?: VariantColor;
  actions?: React.ReactNode;
  showCloseButton?: boolean;
  closeButtonSize?: string;
  closeButtonHint?: string;
  modalWidth?: string;
  maxWidth?: string;
  modalHeight?: string;
  icon?: React.ReactNode;
  /** Viewport height below which the header/content/actions padding shrinks (e.g. a phone in landscape). */
  denseBelow?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  content,
  onClose,
  variant = 'warning',
  actions,
  showCloseButton = true,
  closeButtonSize = '20px',
  closeButtonHint = 'Fechar',
  modalWidth = '500px',
  maxWidth,
  modalHeight = 'auto',
  icon = <FaExclamationTriangle />,
  denseBelow = DEFAULT_DENSE_BELOW,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay $denseBelow={denseBelow} onClick={onClose}>
      <ModalContainer
        onClick={(e) => e.stopPropagation()}
        $width={modalWidth}
        $maxWidth={maxWidth}
        $height={modalHeight}
      >
        <ModalHeader $variant={variant} $denseBelow={denseBelow}>
          <HeaderLeft>
            {icon && <IconWrapper>{icon}</IconWrapper>}
            <ModalTitle>{title}</ModalTitle>
          </HeaderLeft>

          {showCloseButton && (
            <Button
              width={closeButtonSize}
              height={closeButtonSize}
              style={{
                backgroundColor: 'transparent',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              icon={<FaTimes />}
              hint={closeButtonHint}
              onClick={onClose}
            />
          )}
        </ModalHeader>

        <ModalContent $denseBelow={denseBelow}>{content}</ModalContent>
        {actions && <ModalActions $denseBelow={denseBelow}>{actions}</ModalActions>}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;

interface ModalContainerProps {
  $width: string;
  $maxWidth?: string;
  $height: string;
}

export const ModalOverlay = styled.div<{ $denseBelow: string }>`
  z-index: 1000;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;

  @media (max-height: ${({ $denseBelow }) => $denseBelow}) {
    padding: 10px;
  }
`;

export const ModalContainer = styled.div<ModalContainerProps>`
  width: ${({ $width }) => $width};
  max-width: ${({ $maxWidth }) => $maxWidth ?? '90%'};
  height: ${({ $height }) => $height};
  max-height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  box-shadow: 0 0 5px 5px ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

interface ModalHeaderProps {
  $variant: VariantColor;
  $denseBelow: string;
}
export const ModalHeader = styled.div<ModalHeaderProps>`
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ $variant, theme }) => getVariantColor(theme, $variant)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 15px;

  @media (max-height: ${({ $denseBelow }) => $denseBelow}) {
    padding: 8px 15px;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
`;

export const ModalTitle = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
`;

export const ModalContent = styled.div<{ $denseBelow: string }>`
  padding: 20px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-wrap: break-word;

  @media (max-height: ${({ $denseBelow }) => $denseBelow}) {
    padding: 10px 15px;
  }
`;

export const ModalActions = styled.div<{ $denseBelow: string }>`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;

  @media (max-height: ${({ $denseBelow }) => $denseBelow}) {
    padding: 10px 15px;
  }
`;
