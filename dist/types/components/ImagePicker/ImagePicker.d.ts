import React from 'react';
export interface ImagePickerProps {
    icon: React.ReactNode;
    currentImage?: string;
    onImageChange?: (file: File) => void;
    size?: string;
    borderColor?: string;
    isLoading?: boolean;
}
declare const ImagePicker: React.FC<ImagePickerProps>;
export default ImagePicker;
//# sourceMappingURL=ImagePicker.d.ts.map