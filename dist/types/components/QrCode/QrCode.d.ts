import React from 'react';
export interface QrCodeProps {
    value: string;
    size?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}
declare const QrCode: React.FC<QrCodeProps>;
export default QrCode;
//# sourceMappingURL=QrCode.d.ts.map