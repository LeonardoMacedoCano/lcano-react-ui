import React, { ReactNode } from 'react';
export interface ContextMessageProps {
    showError: (message: string) => void;
    showErrorWithLog: (message: string, error: any) => void;
    showSuccess: (message: string) => void;
    showInfo: (message: string) => void;
}
export interface MessageProviderProps {
    children: ReactNode;
}
declare const ContextMessageProvider: React.FC<MessageProviderProps>;
export declare const useMessage: () => ContextMessageProps;
export default ContextMessageProvider;
//# sourceMappingURL=ContextMessageProvider.d.ts.map