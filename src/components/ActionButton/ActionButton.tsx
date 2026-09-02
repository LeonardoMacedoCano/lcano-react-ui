import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

export interface ActionOption {
  icon: React.ReactNode;
  hint: string;
  action: () => void;
  disabled?: boolean;
}

export interface ActionButtonProps {
  icon: React.ReactNode;
  hint?: string;
  onClick?: () => void;
  options?: ActionOption[];
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  hint,
  onClick,
  options,
  disabled,
}) => {
  const [expanded, setExpanded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const hasOptions = !!options && options.length > 0;

  const close = useCallback(() => setExpanded(false), []);

  useEffect(() => {
    if (!expanded) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [expanded, close]);

  const handleMainClick = () => {
    if (disabled) return;
    onClick?.();
    if (hasOptions) setExpanded((prev) => !prev);
  };

  const handleOptionClick = (option: ActionOption) => {
    if (option.disabled) return;
    option.action();
    close();
  };

  return (
    <Wrapper ref={wrapperRef}>
      {hasOptions && expanded && (
        <OptionsContainer
          role="menu"
          onMouseLeave={() => close()}
        >
          {options!.map((option) => (
            <OptionButton
              key={option.hint}
              type="button"
              role="menuitem"
              onClick={() => handleOptionClick(option)}
              title={option.hint}
              disabled={option.disabled}
              aria-label={option.hint}
            >
              {option.icon}
            </OptionButton>
          ))}
        </OptionsContainer>
      )}

      <MainButton
        type="button"
        onMouseEnter={() => hasOptions && !disabled && setExpanded(true)}
        onMouseLeave={() => hasOptions && close()}
        onClick={handleMainClick}
        title={hint}
        disabled={disabled}
        aria-label={hint}
        aria-haspopup={hasOptions ? 'menu' : undefined}
        aria-expanded={hasOptions ? expanded : undefined}
      >
        {icon}
      </MainButton>
    </Wrapper>
  );
};

export default ActionButton;

const Wrapper = styled.div`
  position: fixed;
  bottom: calc(20px + var(--lcano-action-button-inset-bottom, 0px));
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const commonButtonStyles = css`
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.tertiary};
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  touch-action: manipulation;
  transition: background-color 0.3s ease, opacity 0.3s ease;

  @media (hover: hover) {
    &:hover {
      opacity: 0.7;
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`;

const MainButton = styled.button`
  ${commonButtonStyles};
  width: 55px;
  height: 55px;
  cursor: pointer;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const OptionButton = styled.button`
  ${commonButtonStyles};
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
`;
