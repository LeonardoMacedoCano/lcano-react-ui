import React from 'react';
import { Tema } from '../../types/Tema';
export interface ThemeOption {
    title: string;
    colors: {
        primary: string;
        secondary: string;
        tertiary: string;
        quaternary: string;
        [key: string]: string;
    };
}
export interface ThemeSelectorProps {
    themes: Tema[];
    currentTheme?: number;
    onThemeChange: (id: number) => void;
}
declare const ThemeSelector: React.FC<ThemeSelectorProps>;
export default ThemeSelector;
//# sourceMappingURL=ThemeSelector.d.ts.map