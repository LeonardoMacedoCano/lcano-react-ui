import React from 'react';
export interface DragDropFileProps {
    onFileChange: (file: File | null) => void;
    acceptedFileFormats?: string[];
}
declare const DragDropFile: React.FC<DragDropFileProps>;
export default DragDropFile;
//# sourceMappingURL=DragDropFile.d.ts.map