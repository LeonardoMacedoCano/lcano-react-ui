import { ReactNode, CSSProperties, FC } from 'react';
import { VariantColor } from '../../types';
export interface ContainerProps {
    children: ReactNode;
    height?: string;
    width?: string;
    maxWidth?: string;
    margin?: string;
    padding?: string;
    backgroundColor?: string;
    variantColor?: VariantColor;
    style?: CSSProperties;
}
declare const Container: FC<ContainerProps>;
export default Container;
//# sourceMappingURL=Container.d.ts.map