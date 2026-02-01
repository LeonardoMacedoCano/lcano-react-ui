import React, { useState } from 'react';
import styled from 'styled-components';
import { Container } from '../Container';

interface Tab {
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
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
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabList>
      <TabContent>
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

const TabButton = styled.button<{ $active: boolean }>`
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
`;

const TabContent = styled.div`
`;