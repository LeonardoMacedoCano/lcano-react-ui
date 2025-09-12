import React, { ReactNode } from 'react';
import { CSSProperties } from 'styled-components';
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
declare const Panel: React.FC<PanelProps>;
export default Panel;
//# sourceMappingURL=Panel.d.ts.map