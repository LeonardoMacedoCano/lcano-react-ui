import { CSSObject } from 'styled-components';
export declare const convertReactStyleToCSSObject: (style: React.CSSProperties) => CSSObject;
export type VariantColor = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'success' | 'info' | 'warning';
export interface VariantProps {
    variant: VariantColor;
}
export declare const getVariantColor: (theme: any, variant?: VariantProps["variant"]) => any;
//# sourceMappingURL=StyledUtils.d.ts.map