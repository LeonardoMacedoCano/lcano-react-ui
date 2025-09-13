import React from 'react';
export interface ActionOption {
    icon: React.ReactNode;
    hint: string;
    action: () => void;
    disabled?: boolean;
}
export interface ExpandableActionButtonProps {
    icon: React.ReactNode;
    hint?: string;
    onClick?: () => void;
    options?: ActionOption[];
    disabled?: boolean;
}
declare const ExpandableActionButton: React.FC<ExpandableActionButtonProps>;
export default ExpandableActionButton;
//# sourceMappingURL=ExpandableActionButton.d.ts.map