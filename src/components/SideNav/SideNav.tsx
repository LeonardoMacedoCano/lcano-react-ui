import { useEffect, useRef, useState, type ReactNode } from 'react';
import styled from 'styled-components';
import { IconButton } from '../IconButton';

export interface SideNavItem {
  id: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export interface SideNavProps {
  items: SideNavItem[];
  compactBelow?: string;
  drawerHeader?: ReactNode;
  railHeader?: ReactNode;
  footer?: ReactNode;
  toggleLabel?: string;
  closeLabel?: string;
}

const DEFAULT_COMPACT_BELOW = '700px';

const SideNav = ({
  items,
  compactBelow = DEFAULT_COMPACT_BELOW,
  drawerHeader,
  railHeader,
  footer,
  toggleLabel = 'Menu',
  closeLabel = 'Close menu',
}: SideNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    drawerRef.current?.toggleAttribute('inert', !isOpen);
  }, [isOpen]);

  function selectItem(item: SideNavItem) {
    setIsOpen(false);
    item.onClick();
  }

  return (
    <>
      <Rail $compactBelow={compactBelow}>
        {railHeader}
        {items.map((item) => (
          <IconButton key={item.id} icon={item.icon} label={item.label} active={item.active} onClick={item.onClick} />
        ))}
        {footer}
      </Rail>

      <DrawerToggle $compactBelow={compactBelow}>
        <IconButton icon="☰" label={toggleLabel} onClick={() => setIsOpen(true)} />
      </DrawerToggle>

      {isOpen && <Overlay $compactBelow={compactBelow} onClick={() => setIsOpen(false)} />}

      <Drawer ref={drawerRef} $compactBelow={compactBelow} $open={isOpen}>
        <DrawerHeader>
          {drawerHeader}
          <CloseButtonSlot>
            <IconButton icon="✕" label={closeLabel} onClick={() => setIsOpen(false)} />
          </CloseButtonSlot>
        </DrawerHeader>

        <NavList>
          {items.map((item) => (
            <NavButton key={item.id} type="button" $active={item.active} onClick={() => selectItem(item)}>
              {item.label}
            </NavButton>
          ))}
        </NavList>

        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </Drawer>
    </>
  );
};

export default SideNav;

const Rail = styled.div<{ $compactBelow: string }>`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 20;
  display: none;
  flex-direction: column;
  gap: 10px;

  @media (min-width: ${({ $compactBelow }) => $compactBelow}) {
    display: flex;
  }
`;

const DrawerToggle = styled.div<{ $compactBelow: string }>`
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 20;

  @media (min-width: ${({ $compactBelow }) => $compactBelow}) {
    display: none;
  }
`;

const Overlay = styled.div<{ $compactBelow: string }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 29;

  @media (min-width: ${({ $compactBelow }) => $compactBelow}) {
    display: none;
  }
`;

const Drawer = styled.nav<{ $compactBelow: string; $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 30;
  width: min(280px, 85vw);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 16px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.primary};
  border-right: 1px solid ${({ theme }) => theme.colors.gray};
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.6);
  transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
  transition: transform 0.25s ease;

  @media (min-width: ${({ $compactBelow }) => $compactBelow}) {
    display: none;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButtonSlot = styled.div`
  margin-left: auto;
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const NavButton = styled.button<{ $active?: boolean }>`
  text-align: left;
  padding: 10px 12px;
  border-radius: 6px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme, $active }) => ($active ? theme.colors.quaternary : 'transparent')};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const DrawerFooter = styled.div`
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray};
`;
