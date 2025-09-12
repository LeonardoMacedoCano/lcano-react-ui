import { CSSProperties, FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

type DividerPosition = 'top' | 'bottom' | 'left' | 'right' | 'x' | 'y';

export interface StackProps {
  children: ReactNode;
  width?: string;
  height?: string;
  direction?: 'row' | 'column';
  divider?: DividerPosition;
  style?: CSSProperties;
}

export const Stack: FC<StackProps> = ({
  children,
  direction = 'row',
  divider,
  ...rest
}) => {
  return (
    <StackContainer direction={direction} divider={divider} {...rest}>
      {children}
    </StackContainer>
  );
};

export default Stack;

interface StackContainerProps {
  width?: string;
  height?: string;
  direction: 'row' | 'column';
  divider?: DividerPosition;
}

const StackContainer = styled.div<StackContainerProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || 'auto'};

  ${({ divider, direction, theme }) =>
    divider &&
    css`
      > * + * {
        ${(() => {
          const color = theme.colors.gray;

          if (direction === 'row') {
            if (divider === 'left' || divider === 'x') return `border-left: 1px solid ${color};`;
            if (divider === 'right') return `border-right: 1px solid ${color};`;
          }

          if (direction === 'column') {
            if (divider === 'top' || divider === 'y') return `border-top: 1px solid ${color};`;
            if (divider === 'bottom') return `border-bottom: 1px solid ${color};`;
          }

          return '';
        })()}
      }
    `}
`;
