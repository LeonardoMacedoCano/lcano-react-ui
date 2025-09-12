import { ReactNode, CSSProperties, FC } from 'react';
export interface ContainerProps {
    children: ReactNode;
    height?: string;
    width?: string;
    maxWidth?: string;
    margin?: string;
    padding?: string;
    backgroundColor?: string;
    variantColor?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
    style?: CSSProperties;
}
declare const Container: FC<ContainerProps>;
export default Container;
//# sourceMappingURL=Container.d.ts.map