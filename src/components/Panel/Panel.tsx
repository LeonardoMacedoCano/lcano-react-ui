import React, { ReactNode } from 'react';
import styled, { CSSProperties } from 'styled-components';
import { Container } from '../Container';

const DEFAULT_DENSE_BELOW = '500px';

export interface PanelProps {
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
  maxWidth?: string;
  padding?: string;
  transparent?: boolean;
  actionButton?: ReactNode;
  style?: CSSProperties;
  /** Viewport height below which the gap under the title shrinks (e.g. a phone in landscape). */
  denseBelow?: string;
}

const Panel: React.FC<PanelProps> = ({
  title,
  children,
  footer,
  width,
  maxWidth,
  padding,
  actionButton ,
  style,
  transparent = false,
  denseBelow = DEFAULT_DENSE_BELOW,
}) => {
  return (
    <Container
      width={width || '100%'}
      maxWidth={maxWidth}
      padding={padding}
      margin="auto"
      backgroundColor="transparent"
      style={style}
    >
      {(title || actionButton) && (
        <Title>
          <TitleContent>{title}</TitleContent>
          {actionButton && <ActionContainer>{actionButton}</ActionContainer>}
        </Title>
      )}
      <Section $denseBelow={denseBelow}>
        <Container
          width="100%"
          variantColor={transparent ? undefined : "secondary"}
          backgroundColor={transparent ? "transparent" : undefined}
          style={
            transparent ?
            {} :
            {
              boxShadow: '0 0 2px',
              borderRadius: '5px',
            }
          }
        >
          <Body>{children}</Body>
          {footer && <Footer>{footer}</Footer>}
        </Container>
      </Section>
    </Container>
  );
};

export default Panel;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
`;

const Section = styled.div<{ $denseBelow: string }>`
  width: 100%;
  margin-top: 20px;

  @media (max-height: ${({ $denseBelow }) => $denseBelow}) {
    margin-top: 10px;
  }
`;

const TitleContent = styled.div`
  min-width: 0;
  flex: 1;
`;

const ActionContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const BaseBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Body = styled(BaseBox)`
  justify-content: space-between;
`;

const Footer = styled(BaseBox)`
  height: 35px;
  justify-content: center;
  border-top: 1px solid ${({ theme }) => theme.colors.gray};
`;
