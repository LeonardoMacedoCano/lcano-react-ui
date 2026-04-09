import styled from "styled-components";
import { ReactNode } from "react";
import { VariantColor } from "../../types";
import { getVariantColor } from "../../utils";

export interface SummaryCardProps {
  label: string;
  value: ReactNode;
  variant: VariantColor;
}

const SummaryCard = ({ label, value, variant }: SummaryCardProps) => (
  <Card $variant={variant}>
    <CardLabel>{label}</CardLabel>
    <CardValue $variant={variant}>{value}</CardValue>
  </Card>
);

export default SummaryCard;

const Card = styled.div<{ $variant: VariantColor }>`
  flex: 1;
  min-width: 180px;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid ${({ theme, $variant }) => getVariantColor(theme, $variant)};
  background: ${({ theme }) => theme.colors.primary};
`;

const CardLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.tertiary};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardValue = styled.div<{ $variant: VariantColor }>`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme, $variant }) => getVariantColor(theme, $variant)};
`;