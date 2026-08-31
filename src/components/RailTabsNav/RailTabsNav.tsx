import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import styled from 'styled-components';

export interface RailTabsNavSubItem {
  id: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}

interface RailTabsNavItemShared {
  id: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
}

export interface RailTabsNavActionItem extends RailTabsNavItemShared {
  onClick: () => void;
  submenu?: never;
}

export interface RailTabsNavSubmenuItem extends RailTabsNavItemShared {
  onClick?: never;
  submenu: RailTabsNavSubItem[];
}

export interface RailTabsNavActionSubmenuItem extends RailTabsNavItemShared {
  onClick: () => void;
  submenu: RailTabsNavSubItem[];
}

export type RailTabsNavItem =
  | RailTabsNavActionItem
  | RailTabsNavSubmenuItem
  | RailTabsNavActionSubmenuItem;

export interface RailTabsNavProps {
  items: RailTabsNavItem[];
  compactBelow?: string;
  denseBelow?: string;
  ariaLabel?: string;
}

const DEFAULT_COMPACT_BELOW = '700px';
const DEFAULT_DENSE_BELOW = '500px';

const getSubmenu = (item: RailTabsNavItem): RailTabsNavSubItem[] | undefined => {
  const submenu = (item as { submenu?: RailTabsNavSubItem[] }).submenu;
  return submenu && submenu.length > 0 ? submenu : undefined;
};

const runAction = (item: RailTabsNavItem): void => {
  const action = (item as { onClick?: () => void }).onClick;
  if (typeof action === 'function') action();
};

const RailTabsNav = ({
  items,
  compactBelow = DEFAULT_COMPACT_BELOW,
  denseBelow = DEFAULT_DENSE_BELOW,
  ariaLabel = 'Navigation',
}: RailTabsNavProps) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [anchorTop, setAnchorTop] = useState(16);

  const railRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpenId(null), []);

  const openItem = openId
    ? items.find((item) => item.id === openId && getSubmenu(item)) ?? null
    : null;
  const openSubmenu = openItem ? getSubmenu(openItem) : undefined;
  const isOpen = !!openItem && !!openSubmenu;

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        railRef.current?.contains(target) ||
        tabsRef.current?.contains(target) ||
        submenuRef.current?.contains(target)
      ) {
        return;
      }
      close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', close);
    };
  }, [isOpen, close]);

  const handleItemClick = (item: RailTabsNavItem, trigger: HTMLElement) => {
    if (!getSubmenu(item)) {
      setOpenId(null);
      runAction(item);
      return;
    }
    const willOpen = openId !== item.id;
    setAnchorTop(Math.max(8, trigger.getBoundingClientRect().top));
    setOpenId(willOpen ? item.id : null);
    if (willOpen) runAction(item);
  };

  const handleSubItemClick = (subItem: RailTabsNavSubItem) => {
    setOpenId(null);
    subItem.onClick();
  };

  return (
    <>
      <Rail ref={railRef} aria-label={ariaLabel} $compactBelow={compactBelow} $denseBelow={denseBelow}>
        {items.map((item) => {
          const submenu = getSubmenu(item);
          return (
            <RailButton
              key={item.id}
              type="button"
              title={item.label}
              aria-label={item.label}
              aria-current={item.active ? 'page' : undefined}
              aria-haspopup={submenu ? 'menu' : undefined}
              aria-expanded={submenu ? openId === item.id : undefined}
              $active={!!item.active}
              $open={openId === item.id}
              onClick={(event) => handleItemClick(item, event.currentTarget)}
            >
              <span aria-hidden>{item.icon}</span>
            </RailButton>
          );
        })}
      </Rail>

      <Tabs ref={tabsRef} aria-label={ariaLabel} $compactBelow={compactBelow}>
        {items.map((item) => {
          const submenu = getSubmenu(item);
          return (
            <TabButton
              key={item.id}
              type="button"
              aria-current={item.active ? 'page' : undefined}
              aria-haspopup={submenu ? 'menu' : undefined}
              aria-expanded={submenu ? openId === item.id : undefined}
              $active={!!item.active}
              $open={openId === item.id}
              onClick={(event) => handleItemClick(item, event.currentTarget)}
            >
              <TabIcon aria-hidden>{item.icon}</TabIcon>
              <TabLabel>{item.label}</TabLabel>
            </TabButton>
          );
        })}
      </Tabs>

      {isOpen && openItem && openSubmenu && (
        <Submenu
          ref={submenuRef}
          role="menu"
          aria-label={openItem.label}
          $compactBelow={compactBelow}
          $anchorTop={anchorTop}
        >
          <SubmenuTitle>{openItem.label}</SubmenuTitle>
          {openSubmenu.map((subItem) => (
            <SubmenuItem
              key={subItem.id}
              type="button"
              role="menuitem"
              aria-current={subItem.active ? 'page' : undefined}
              $active={!!subItem.active}
              onClick={() => handleSubItemClick(subItem)}
            >
              {subItem.label}
            </SubmenuItem>
          ))}
        </Submenu>
      )}
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

const RailButton = styled.button<{ $active: boolean; $open: boolean }>`
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
  background-color: ${({ theme, $active, $open }) =>
    $active ? theme.colors.quaternary : $open ? theme.colors.secondary : 'transparent'};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme, $active }) => ($active ? theme.colors.quaternary : theme.colors.secondary)};
  }
`;

const TabButton = styled.button<{ $active: boolean; $open: boolean }>`
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
  background-color: ${({ theme, $active, $open }) =>
    $active ? theme.colors.quaternary : $open ? theme.colors.secondary : 'transparent'};
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

const Submenu = styled.div<{ $compactBelow: string; $anchorTop: number }>`
  position: fixed;
  z-index: 25;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.gray};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  left: 8px;
  right: 8px;
  bottom: 72px;
  max-height: 55vh;
  overflow-y: auto;

  @media (min-width: ${({ $compactBelow }) => $compactBelow}) {
    left: 84px;
    right: auto;
    bottom: auto;
    top: ${({ $anchorTop }) => $anchorTop}px;
    width: 220px;
    max-height: calc(100vh - ${({ $anchorTop }) => $anchorTop}px - 16px);
  }
`;

const SubmenuTitle = styled.span`
  padding: 6px 12px 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray};
`;

const SubmenuItem = styled.button<{ $active: boolean }>`
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme, $active }) => ($active ? theme.colors.quaternary : 'transparent')};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme, $active }) => ($active ? theme.colors.quaternary : theme.colors.tertiary)};
  }
`;
