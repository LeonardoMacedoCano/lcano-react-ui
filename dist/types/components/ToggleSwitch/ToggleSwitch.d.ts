export interface ToggleSwitchOption<T extends string> {
    label: string;
    value: T;
}
export interface ToggleSwitchProps<T extends string> {
    optionA: ToggleSwitchOption<T>;
    optionB: ToggleSwitchOption<T>;
    value: T;
    onChange: (value: T) => void;
}
declare const ToggleSwitch: <T extends string>({ optionA, optionB, value, onChange }: ToggleSwitchProps<T>) => import("react/jsx-runtime").JSX.Element;
export default ToggleSwitch;
//# sourceMappingURL=ToggleSwitch.d.ts.map