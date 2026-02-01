import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import {
  FaTimes,
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationCircle
} from 'react-icons/fa';

export type ToastType = 'error' | 'success' | 'info';
export type ToastVariant = 'warning' | 'success' | 'info';

export interface ToastNotificationProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <FaCheckCircle />,
  info: <FaInfoCircle />,
  error: <FaExclamationCircle />,
};

const getVariant = (type: ToastType): ToastVariant => {
  switch (type) {
    case 'error':
      return 'warning';
    case 'success':
      return 'success';
    default:
      return 'info';
  }
};

const ToastNotification: React.FC<ToastNotificationProps> = ({
  type,
  message,
  onClose
}) => {
  const icon = iconMap[type];
  const variant = getVariant(type);

  return (
    <ToastContainer>
      <ToastCard $variant={variant}>
        <ToastIcon $variant={variant}>{icon}</ToastIcon>
        <ToastMessage>{message}</ToastMessage>
        <CloseButton $variant={variant} onClick={onClose} />
      </ToastCard>
    </ToastContainer>
  );
};

export default ToastNotification;

export const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

interface ToastCardProps {
  $variant: ToastVariant;
}

export const ToastCard = styled.div<ToastCardProps>`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.tertiary};
  color: ${({ theme, $variant }) => theme.colors[$variant]};
  border-left: 5px solid ${({ theme, $variant }) => theme.colors[$variant]};
  border-radius: 6px;
  padding: 12px 16px;
  min-width: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const ToastIcon = styled.div<ToastCardProps>`
  font-size: 20px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ToastMessage = styled.div`
  flex: 1;
  font-size: 14px;
`;

interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $variant: ToastVariant;
}

const CloseButtonBase: React.FC<CloseButtonProps> = ({ $variant, ...props }) => (
  <button {...props}>
    <FaTimes />
  </button>
);

export const CloseButton = styled(CloseButtonBase)<CloseButtonProps>`
  background: none;
  border: none;
  color: ${({ theme, $variant }) => theme.colors[$variant]};
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;