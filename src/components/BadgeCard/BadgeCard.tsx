import type { ReactNode } from 'react';
import styled from 'styled-components';

export interface BadgeCardProps {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  meta?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  height?: string;
}

const BadgeCard = ({ icon, title, description, meta, active = true, onClick, height = '150px' }: BadgeCardProps) => (
  <BadgeCardContainer $active={active} $clickable={!!onClick} $height={height} onClick={onClick}>
    <BadgeCardIcon>{icon}</BadgeCardIcon>
    <BadgeCardBody>
      <BadgeCardTitle>{title}</BadgeCardTitle>
      <BadgeCardDescription>{description}</BadgeCardDescription>
      {meta && <BadgeCardMeta>{meta}</BadgeCardMeta>}
    </BadgeCardBody>
  </BadgeCardContainer>
);

export default BadgeCard;

export const BadgeCardContainer = styled.div<{ $active: boolean; $clickable: boolean; $height: string }>`
  display: flex;
  align-items: stretch;
  height: ${({ $height }) => $height};
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.secondary};
  opacity: ${({ $active }) => ($active ? 1 : 0.55)};
  overflow: hidden;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:hover {
    border-color: ${({ theme, $clickable }) => ($clickable ? theme.colors.quaternary : theme.colors.gray)};
  }
`;

export const BadgeCardIcon = styled.div`
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.6rem;
  line-height: 1;
  background-color: ${({ theme }) => theme.colors.primary};
  border-right: 1px solid ${({ theme }) => theme.colors.gray};
`;

export const BadgeCardBody = styled.div`
  min-width: 0;
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`;

export const BadgeCardTitle = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const BadgeCardDescription = styled.div`
  font-size: 0.85em;
  color: ${({ theme }) => theme.colors.white};
  margin-top: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const BadgeCardMeta = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 2px;
  min-height: 2.2em;
  font-size: 0.75em;
  color: ${({ theme }) => theme.colors.tertiary};
  margin-top: 6px;
`;
