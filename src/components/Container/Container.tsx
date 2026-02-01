import { ReactNode, CSSProperties, FC } from 'react';
import styled from 'styled-components';
import { VariantColor } from '../../types';

export interface ContainerProps {
  children: ReactNode;
  height?: string;
  width?: string;
  maxWidth?: string;
  margin?: string;
  padding?: string;
  backgroundColor?: string;
  variantColor?: VariantColor;
  style?: CSSProperties;
}

interface StyledContainerProps {
  $height?: string;
  $width?: string;
  $maxWidth?: string;
  $margin?: string;
  $padding?: string;
  $backgroundColor?: string;
  $variantColor?: VariantColor;
}

const Container: FC<ContainerProps> = ({
  children,
  height,
  width,
  maxWidth,
  margin,
  padding,
  backgroundColor,
  variantColor,
  style,
}) => (
  <StyledContainer
    $height={height}
    $width={width}
    $maxWidth={maxWidth}
    $margin={margin}
    $padding={padding}
    $backgroundColor={backgroundColor}
    $variantColor={variantColor}
    style={style}
  >
    {children}
  </StyledContainer>
);

export default Container;

const StyledContainer = styled.div<StyledContainerProps>`
  box-sizing: border-box;
  height: ${({ $height }) => $height || 'auto'};
  width: ${({ $width }) => $width || '100%'};
  margin: ${({ $margin }) => $margin || '0'};
  padding: ${({ $padding }) => $padding || '0'};
  max-width: ${({ $maxWidth }) => $maxWidth || 'none'};

  background-color: ${({ theme, $variantColor, $backgroundColor }) =>
    $variantColor ? theme.colors[$variantColor] : $backgroundColor};
`;
