import React from 'react';
import { VariantColor } from '../../types';
export type FieldTextAreaProps = {
    value?: string;
    variant?: VariantColor;
    description?: string;
    hint?: string;
    editable?: boolean;
    width?: string;
    maxWidth?: string;
    maxLength?: number;
    minRows?: number;
    inline?: boolean;
    padding?: string;
    placeholder?: string;
    onUpdate?: (value: string) => void;
};
declare const FieldTextArea: React.FC<FieldTextAreaProps>;
export default FieldTextArea;
//# sourceMappingURL=FieldTextArea.d.ts.map