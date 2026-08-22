import React, { useState } from 'react';
import styled from 'styled-components';
import { Container } from '../Container';

interface Tab {
  label: string;
  content: React.ReactNode;
}

const DEFAULT_DENSE_BELOW = '500px';

export interface TabsProps {
  tabs: Tab[];
  /** Viewport height below which the tab bar/content padding shrink (e.g. a phone in landscape). */
  denseBelow?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, denseBelow = DEFAULT_DENSE_BELOW }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <Container
      width='100%'
      backgroundColor='transparent'
    >
      <TabList>
        {tabs.map((tab, index) => (
          <TabButton
            key={index}
            $active={index === activeTab}
            $denseBelow={denseBelow}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabList>
      <TabContent $denseBelow={denseBelow}>
        {tabs[activeTab]?.content}
      </TabContent>
    </Container>
  );
};

export default Tabs;

const TabList = styled.div`
  display: flex;
  border-bottom: 2px solid ${({ theme }) => theme.colors.quaternary};
`;

const TabButton = styled.button<{ $active: boolean; $denseBelow: string }>`
  flex: 1;
  padding: 10px 0px;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  transition: background-color 0.3s, border-right-color 0.3s;

  &:not(:last-child) {
    border-right: 2px solid ${({ theme }) => theme.colors.tertiary};
  }

  &:first-child {
    border-top-left-radius: 5px;
  }

  &:last-child {
    border-top-right-radius: 5px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    cursor: default;
    background-color: ${theme.colors.tertiary};
    border-right-color: transparent;
  `}

  @media (max-height: ${({ $denseBelow }) => $denseBelow}) {
    padding: 6px 0px;
  }
`;

const TabContent = styled.div<{ $denseBelow: string }>`
  padding: 16px;

  @media (max-height: ${({ $denseBelow }) => $denseBelow}) {
    padding: 8px 16px;
  }
`;