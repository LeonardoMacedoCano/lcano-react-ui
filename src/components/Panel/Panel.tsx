import React, { ReactNode } from 'react';
import styled, { CSSProperties } from 'styled-components';
import { Container } from '../Container';

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
  transparent = false
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
          <h3>{title}</h3>
          {actionButton && <ActionContainer>{actionButton}</ActionContainer>}
        </Title>
      )}
      <Container
        width="100%"
        variantColor={transparent ? undefined : "secondary"}
        backgroundColor={transparent ? "transparent" : undefined}
        margin="20px 0 0 0"
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
    </Container>
  );
};

export default Panel;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
  h3 {
    color: ${({ theme }) => theme.colors.white};
  }
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
