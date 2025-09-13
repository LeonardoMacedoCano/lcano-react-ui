import React, { useState } from 'react';
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

  const toggleOptions = (show: boolean) => setExpanded(show);

  const handleOptionClick = (action: () => void) => {
    action();
    setExpanded(false);
  };

  return (
    <Wrapper>
      <MainButton
        onMouseEnter={() => toggleOptions(true)}
        onMouseLeave={() => toggleOptions(false)}
        onClick={onClick}
        title={hint}
        disabled={disabled}
        aria-label={hint}
      >
        {icon}
      </MainButton>

      {options && expanded && (
        <OptionsContainer
          onMouseEnter={() => toggleOptions(true)}
          onMouseLeave={() => toggleOptions(false)}
        >
          {options.map((option, index) => (
            <OptionButton
              key={index}
              onClick={() => handleOptionClick(option.action)}
              title={option.hint}
              disabled={option.disabled}
              aria-label={option.hint}
            >
              {option.icon}
            </OptionButton>
          ))}
        </OptionsContainer>
      )}
    </Wrapper>
  );
};

export default ActionButton;

const Wrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const commonButtonStyles = css`
  color: white;
  background-color: ${({ theme }) => theme.colors.tertiary};
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  transition: background-color 0.3s ease, opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const MainButton = styled.button`
  ${commonButtonStyles};
  width: 55px;
  height: 55px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;

const OptionsContainer = styled.div`
  position: absolute;
  bottom: 65px;
  right: 0;
  width: 55px;
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
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;
