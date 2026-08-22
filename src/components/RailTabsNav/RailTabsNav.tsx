import { type ReactNode } from 'react';
import styled from 'styled-components';

export interface RailTabsNavItem {
  id: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export interface RailTabsNavProps {
  items: RailTabsNavItem[];
  compactBelow?: string;
  denseBelow?: string;
  ariaLabel?: string;
}

const DEFAULT_COMPACT_BELOW = '700px';
const DEFAULT_DENSE_BELOW = '500px';

const RailTabsNav = ({
  items,
  compactBelow = DEFAULT_COMPACT_BELOW,
  denseBelow = DEFAULT_DENSE_BELOW,
  ariaLabel = 'Navigation',
}: RailTabsNavProps) => {
  return (
    <>
      <Rail aria-label={ariaLabel} $compactBelow={compactBelow} $denseBelow={denseBelow}>
        {items.map((item) => (
          <RailButton
            key={item.id}
            type="button"
            title={item.label}
            aria-label={item.label}
            aria-current={item.active ? 'page' : undefined}
            $active={!!item.active}
            onClick={item.onClick}
          >
            <span aria-hidden>{item.icon}</span>
          </RailButton>
        ))}
      </Rail>

      <Tabs aria-label={ariaLabel} $compactBelow={compactBelow}>
        {items.map((item) => (
          <TabButton
            key={item.id}
            type="button"
            aria-current={item.active ? 'page' : undefined}
            $active={!!item.active}
            onClick={item.onClick}
          >
            <TabIcon aria-hidden>{item.icon}</TabIcon>
            <TabLabel>{item.label}</TabLabel>
          </TabButton>
        ))}
      </Tabs>
    </>
  );
};

export default RailTabsNav;

const Rail = styled.nav<{ $compactBelow: string; $denseBelow: string }>`
  display: none;

  @media (min-width: ${({ $compactBelow }) => $compactBelow}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 76px;
    padding: 16px 6px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: ${({ theme }) => theme.colors.black};
    border-right: 1px solid ${({ theme }) => theme.colors.gray};
    z-index: 20;
  }

  @media (min-width: ${({ $compactBelow }) => $compactBelow}) and (max-height: ${({ $denseBelow }) => $denseBelow}) {
    gap: 4px;
    padding: 8px 6px;
  }
`;

const Tabs = styled.nav<{ $compactBelow: string }>`
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 64px;
  overflow-x: auto;
  background-color: ${({ theme }) => theme.colors.black};
  border-top: 1px solid ${({ theme }) => theme.colors.gray};
  z-index: 20;

  @media (min-width: ${({ $compactBelow }) => $compactBelow}) {
    display: none;
  }
`;

const RailButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  padding: 10px 4px;
  border-radius: 8px;
  font-size: 22px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme, $active }) => ($active ? theme.colors.quaternary : 'transparent')};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme, $active }) => ($active ? theme.colors.quaternary : theme.colors.secondary)};
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex-shrink: 0;
  min-width: 48px;
  padding: 8px 4px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme, $active }) => ($active ? theme.colors.quaternary : 'transparent')};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme, $active }) => ($active ? theme.colors.quaternary : theme.colors.secondary)};
  }
`;

const TabIcon = styled.span`
  font-size: 20px;
  line-height: 1;
`;

const TabLabel = styled.span`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;
`;
