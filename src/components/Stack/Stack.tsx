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
  alignCenter?: boolean;
  alignRight?: boolean;
  justifyCenter?: boolean;
  justifyBetween?: boolean;
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

interface StackContainerProps extends StackProps {}

const StackContainer = styled.div<StackContainerProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || 'auto'};

  ${({ alignCenter }) => alignCenter && 'align-items: center;'}
  ${({ alignRight }) => alignRight && 'align-items: flex-end;'}
  ${({ justifyCenter }) => justifyCenter && 'justify-content: center;'}
  ${({ justifyBetween }) => justifyBetween && 'justify-content: space-between;'}

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
