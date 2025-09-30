import { CSSObject } from 'styled-components';
import { VariantColor } from '../types';
export declare const convertReactStyleToCSSObject: (style: React.CSSProperties) => CSSObject;
export interface VariantProps {
    variant: VariantColor;
}
export declare const getVariantColor: (theme: any, variant?: VariantProps["variant"]) => any;
//# sourceMappingURL=StyledUtils.d.ts.map