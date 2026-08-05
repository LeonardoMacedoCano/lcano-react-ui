import React, { useMemo } from 'react';
import qrcode from 'qrcode-generator';

export interface QrCodeProps {
  value: string;
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

const QrCode: React.FC<QrCodeProps> = ({ value, size = 256, errorCorrectionLevel = 'M' }) => {
  const svg = useMemo(() => {
    const qr = qrcode(0, errorCorrectionLevel);
    qr.addData(value);
    qr.make();
    return qr.createSvgTag({ scalable: true });
  }, [value, errorCorrectionLevel]);

  return (
    <div style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: svg }} />
  );
};

export default QrCode;
