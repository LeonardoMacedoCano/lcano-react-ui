import React from 'react';
import styled, { css } from 'styled-components';
import { VariantColor } from '../../types';
import { getVariantColor } from '../../utils';

export interface HighlightBoxProps {
  variant?: VariantColor;
  width?: string;
  height?: string;
  bordered?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const HighlightBox: React.FC<HighlightBoxProps> = ({
  variant = 'info',
  width = '100%',
  height = '100%',
  bordered = false,
  style,
  children,
}) => {
  return (
    <CenterWrapper>
      <Box
        variant={variant}
        width={width}
        height={height}
        bordered={bordered}
        style={style}
        >
        {children}
      </Box>
    </CenterWrapper>
  );
};

export default HighlightBox;

const CenterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

interface BoxProps {
  variant: VariantColor;
  width: string;
  height: string;
  bordered: boolean;
}

const Box = styled.div<BoxProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${({ width }) => width};
  height: ${({ height }) => height};

  border-radius: 50px;
  background-color: transparent;
  font-weight: bold;
  text-align: center;

  color: ${({ theme, variant }) => getVariantColor(theme, variant)};

  ${({ bordered, theme, variant }) =>
    bordered &&
    css`
      border: 1px solid ${getVariantColor(theme, variant)};
    `}
`;