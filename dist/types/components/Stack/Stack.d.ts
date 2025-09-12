import { CSSProperties, FC, ReactNode } from 'react';
type DividerPosition = 'top' | 'bottom' | 'left' | 'right' | 'x' | 'y';
export interface StackProps {
    children: ReactNode;
    width?: string;
    height?: string;
    direction?: 'row' | 'column';
    divider?: DividerPosition;
    style?: CSSProperties;
    alignCenter?: boolean;
    alignRight?: boolean;
    justifyCenter?: boolean;
    justifyBetween?: boolean;
    gap?: string;
}
export declare const Stack: FC<StackProps>;
export default Stack;
//# sourceMappingURL=Stack.d.ts.map