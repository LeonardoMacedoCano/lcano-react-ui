import React from 'react';
import { VariantColor } from '../../types';
export interface HighlightBoxProps {
    variant?: VariantColor;
    width?: string;
    height?: string;
    bordered?: boolean;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
declare const HighlightBox: React.FC<HighlightBoxProps>;
export default HighlightBox;
//# sourceMappingURL=HighlightBox.d.ts.map