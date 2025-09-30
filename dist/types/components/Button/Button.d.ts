import React from 'react';
import { VariantColor } from '../../types';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: VariantColor;
    width?: string;
    height?: string;
    icon?: React.ReactNode;
    description?: string;
    hint?: string;
    disabledHover?: boolean;
    style?: React.CSSProperties;
}
declare const Button: React.FC<ButtonProps>;
export default Button;
//# sourceMappingURL=Button.d.ts.map