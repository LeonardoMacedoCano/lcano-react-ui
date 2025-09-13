import React from 'react';
export interface ActionOption {
    icon: React.ReactNode;
    hint: string;
    action: () => void;
    disabled?: boolean;
}
export interface ActionButtonProps {
    icon: React.ReactNode;
    hint?: string;
    onClick?: () => void;
    options?: ActionOption[];
    disabled?: boolean;
}
declare const ActionButton: React.FC<ActionButtonProps>;
export default ActionButton;
//# sourceMappingURL=ActionButton.d.ts.map