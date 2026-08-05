export interface UseCopyFeedbackOptions {
    successMessage?: string;
    errorMessage?: string;
    durationMs?: number;
}
export interface UseCopyFeedbackResult {
    copy: (text: string) => Promise<boolean>;
    CopyFeedbackToast: JSX.Element | null;
}
declare const useCopyFeedback: ({ successMessage, errorMessage, durationMs, }?: UseCopyFeedbackOptions) => UseCopyFeedbackResult;
export default useCopyFeedback;
//# sourceMappingURL=useCopyFeedback.d.ts.map