import React from 'react';
export interface UseConfirmModalResult {
    confirm: (title: string, content: React.ReactNode) => Promise<boolean>;
    ConfirmModalComponent: JSX.Element;
}
declare const useConfirmModal: () => UseConfirmModalResult;
export default useConfirmModal;
//# sourceMappingURL=useConfirmModal.d.ts.map