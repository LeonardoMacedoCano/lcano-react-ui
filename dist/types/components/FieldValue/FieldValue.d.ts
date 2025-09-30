import React, { FC, KeyboardEventHandler } from 'react';
import { FieldValueType, Option, VariantColor } from '../../types';
export type FieldValueProps = {
    type: FieldValueType;
    value?: string | number | boolean | Option;
    variant?: VariantColor;
    description?: string;
    hint?: string;
    editable?: boolean;
    width?: string;
    maxWidth?: string;
    maxHeight?: string;
    minValue?: number;
    maxValue?: number;
    inputWidth?: string;
    inline?: boolean;
    options?: Option[];
    icon?: React.ReactNode;
    padding?: string;
    placeholder?: string;
    maxDecimalPlaces?: number;
    maxIntegerDigits?: number;
    onUpdate?: (value: any) => void;
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};
declare const FieldValue: FC<FieldValueProps>;
export default FieldValue;
//# sourceMappingURL=FieldValue.d.ts.map