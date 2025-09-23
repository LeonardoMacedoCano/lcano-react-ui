import React, { ButtonHTMLAttributes } from 'react';
export type ToastType = 'error' | 'success' | 'info';
export type ToastVariant = 'warning' | 'success' | 'info';
export interface ToastNotificationProps {
    type: ToastType;
    message: string;
    onClose: () => void;
}
declare const ToastNotification: React.FC<ToastNotificationProps>;
export default ToastNotification;
export declare const ToastContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
interface ToastCardProps {
    variant: ToastVariant;
}
export declare const ToastCard: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, ToastCardProps>> & string;
export declare const ToastIcon: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, ToastCardProps>> & string;
export declare const ToastMessage: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: ToastVariant;
}
export declare const CloseButton: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<CloseButtonProps, CloseButtonProps>> & string & Omit<React.FC<CloseButtonProps>, keyof React.Component<any, {}, any>>;
//# sourceMappingURL=ToastNotification.d.ts.map