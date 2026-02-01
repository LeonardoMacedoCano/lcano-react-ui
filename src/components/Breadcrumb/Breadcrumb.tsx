import styled from 'styled-components';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  LinkComponent?: React.ElementType;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  LinkComponent = "",
}) => {
  if (!items.length) return null;

  return (
    <BreadcrumbContainer>
      {items.map((item, index) => (
        <span key={item.path ?? item.label}>
          {item.path && index < items.length - 1 ? (
            <LinkComponent to={item.path}>
              {item.label}
            </LinkComponent>
          ) : (
            <strong>{item.label}</strong>
          )}
        </span>
      ))}
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px;
  font-size: 13px;

  max-width: 100%;
  min-width: 0;

  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;

  -webkit-overflow-scrolling: touch;

  width: 100%;
  max-width: 100%;
  flex: 1;
  min-width: 0;

  span {
    display: inline-flex;
    align-items: center;
    min-width: 0;
  }

  a,
  strong {
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.tertiary};
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.quaternary};
      color: ${({ theme }) => theme.colors.black};
    }
  }

  strong {
    color: ${({ theme }) => theme.colors.quaternary};
  }

  span:not(:last-child)::after {
    content: "›";
    margin: 0 6px;
    color: ${({ theme }) => theme.colors.quaternary};
    flex-shrink: 0;
  }
`;
