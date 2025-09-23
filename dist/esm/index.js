import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import styled, { css, keyframes, useTheme } from 'styled-components';
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';

const convertReactStyleToCSSObject = (style) => {
    return Object.fromEntries(Object.entries(style).map(([key, value]) => [key, value]));
};
const getVariantColor = (theme, variant) => {
    const colors = theme.colors;
    const validVariant = variant || 'info';
    switch (validVariant) {
        case 'primary':
        case 'secondary':
        case 'tertiary':
        case 'quaternary':
        case 'success':
        case 'info':
        case 'warning':
            return colors[validVariant];
        default:
            return colors.defaultColor;
    }
};

const getCurrentDate = () => new Date();
const parseShortStringToDateTime = (dateStr) => {
    if (!dateStr)
        return '';
    const dateParts = dateStr.toString().split(',');
    return `${dateParts[2].padStart(2, '0')}/${(parseInt(dateParts[1], 10) + 1)
        .toString()
        .padStart(2, '0')}/${dateParts[0].slice(-2)} ${dateParts[3].padStart(2, '0')}:${dateParts[4].padStart(2, '0')}`;
};
const formatDateToShortString = (date) => {
    if (!date)
        return '';
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
};
const formatDateToYMDString = (date) => {
    if (!date)
        return '';
    const dateObj = new Date(date);
    const year = dateObj.getFullYear().toString();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const formatDateToYMString = (date) => {
    if (!date)
        return '';
    const dateObj = new Date(date);
    const year = dateObj.getFullYear().toString();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
};
const parseDateStringToDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
};
const isDateValid = (date) => {
    if (typeof date === 'number' || typeof date === 'string') {
        date = new Date(date);
    }
    return date instanceof Date && !isNaN(date.getTime());
};

const ThemeSelector = ({ themes, currentTheme, onThemeChange, }) => {
    return (jsx(ThemeGrid, { children: themes.map((theme) => (jsxs(ThemeItem, { isSelected: theme.id === currentTheme, onClick: () => onThemeChange(theme.id), borderColor: theme.quaternaryColor, children: [jsx(ThemeName, { children: theme.title }), jsxs(ColorPalette, { children: [jsx(ColorBlock, { color: theme.primaryColor }), jsx(ColorBlock, { color: theme.secondaryColor }), jsx(ColorBlock, { color: theme.tertiaryColor }), jsx(ColorBlock, { color: theme.quaternaryColor })] })] }, theme.title))) }));
};
const ThemeGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  width: 100%;
`;
const ThemeItem = styled.div `
  background-color: ${props => props.theme.colors.primary};
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 2px solid ${props => props.isSelected ? props.borderColor : 'transparent'};

  &:hover {
    transform: translateY(-3px);
  }
`;
const ThemeName = styled.div `
  padding: 10px;
  text-align: center;
  font-weight: 600;
  color: ${props => props.theme.colors.white};
`;
const ColorPalette = styled.div `
  display: flex;
  height: 30px;
`;
const ColorBlock = styled.div `
  flex: 1;
  height: 100%;
  background-color: ${props => props.color};
`;

const Container$1 = ({ children, height, width, maxWidth, margin, padding, backgroundColor, variantColor, style }) => (jsx(StyledContainer, { height: height, width: width, margin: margin, padding: padding, backgroundColor: backgroundColor, variantColor: variantColor, style: style, maxWidth: maxWidth, children: children }));
const StyledContainer = styled.div `
  height: ${({ height }) => height || 'auto'};
  width: ${({ width }) => width || 'auto'};
  margin: ${({ margin }) => margin || '0'};
  padding: ${({ padding }) => padding || '0'};
  max-width: ${({ maxWidth }) => maxWidth || 'none'};
  background-color: ${({ backgroundColor, theme, variantColor }) => variantColor && theme.colors[variantColor] || backgroundColor};
`;

const Panel = ({ title, children, footer, width, maxWidth, padding, actionButton, style, transparent = false }) => {
    return (jsxs(Container$1, { width: width || '100%', maxWidth: maxWidth, padding: padding, margin: "auto", backgroundColor: "transparent", style: style, children: [(title || actionButton) && (jsxs(Title, { children: [jsx("h3", { children: title }), actionButton && jsx(ActionContainer, { children: actionButton })] })), jsxs(Container$1, { width: "100%", variantColor: transparent ? undefined : "secondary", backgroundColor: transparent ? "transparent" : undefined, margin: "20px 0 0 0", style: transparent ?
                    {} :
                    {
                        boxShadow: '0 0 2px',
                        borderRadius: '5px',
                    }, children: [jsx(Body, { children: children }), footer && jsx(Footer, { children: footer })] })] }));
};
const Title = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
  h3 {
    color: ${({ theme }) => theme.colors.white};
  }
`;
const ActionContainer = styled.div `
  margin-left: auto;
  display: flex;
  align-items: center;
`;
const BaseBox = styled.div `
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Body = styled(BaseBox) `
  justify-content: space-between;
`;
const Footer = styled(BaseBox) `
  height: 35px;
  justify-content: center;
  border-top: 1px solid ${({ theme }) => theme.colors.gray};
`;

const Stack = ({ children, direction = 'row', divider, gap, ...rest }) => {
    return (jsx(StackContainer, { direction: direction, divider: divider, gap: gap, ...rest, children: children }));
};
const StackContainer = styled.div `
  display: flex;
  flex-direction: ${({ direction }) => direction};
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || 'auto'};

  ${({ alignCenter }) => alignCenter && 'align-items: center;'}
  ${({ alignRight }) => alignRight && 'align-items: flex-end;'}
  ${({ justifyCenter }) => justifyCenter && 'justify-content: center;'}
  ${({ justifyBetween }) => justifyBetween && 'justify-content: space-between;'}

  ${({ gap }) => gap && `gap: ${gap};`}

  ${({ divider, direction, theme }) => divider &&
    css `
      > * + * {
        ${(() => {
        const color = theme.colors.gray;
        if (direction === 'row') {
            if (divider === 'left' || divider === 'x')
                return `border-left: 1px solid ${color};`;
            if (divider === 'right')
                return `border-right: 1px solid ${color};`;
        }
        if (direction === 'column') {
            if (divider === 'top' || divider === 'y')
                return `border-top: 1px solid ${color};`;
            if (divider === 'bottom')
                return `border-bottom: 1px solid ${color};`;
        }
        return '';
    })()}
      }
    `}
`;

const FieldValue = ({ type, value = '', variant, description, hint, editable = true, width, maxWidth, maxHeight, minValue, maxValue, inputWidth, inline, options, icon, padding, placeholder, maxDecimalPlaces = 2, maxIntegerDigits = 8, onUpdate, onKeyDown, }) => {
    const handleChange = (event) => {
        if (!onUpdate)
            return;
        let val = event.target.value;
        switch (type) {
            case 'number':
                val = enforceNumeric(val);
                break;
            case 'boolean':
                val = val === 'true';
                break;
            case 'date':
                val = parseDateStringToDate(val);
                break;
        }
        onUpdate(val);
    };
    const enforceNumeric = (val) => {
        const [integerPart, decimalPart] = val.split('.');
        let newVal = integerPart.slice(0, maxIntegerDigits) + (decimalPart ? `.${decimalPart.slice(0, maxDecimalPlaces)}` : '');
        if (minValue !== undefined && parseFloat(newVal) < minValue)
            newVal = String(minValue);
        if (maxValue !== undefined && parseFloat(newVal) > maxValue)
            newVal = String(maxValue);
        return newVal;
    };
    const formattedValue = () => {
        if (type === 'number' || type === 'string')
            return String(value);
        if (type === 'boolean')
            return value ? 'true' : 'false';
        if (type === 'date')
            return formatDateToYMDString(value);
        if (type === 'month')
            return formatDateToYMString(value);
        if (type === 'select')
            return value?.key ?? '';
        return '';
    };
    return (jsxs(FieldWrapper, { width: width, maxWidth: maxWidth, maxHeight: maxHeight, inline: inline, padding: padding, children: [description && jsx(Label, { title: hint, children: description }), type === 'select' || type === 'boolean' ? (jsxs(StyledSelect, { value: formattedValue(), onChange: handleChange, disabled: !editable, inputWidth: inputWidth, inline: inline, variant: variant, children: [type === 'select' && jsx("option", { value: "", children: placeholder || 'Selecione...' }), type === 'select'
                        ? options?.map(opt => jsx("option", { value: opt.key, children: opt.value }, opt.key))
                        : (jsxs(Fragment, { children: [jsx("option", { value: "true", children: "Sim" }), jsx("option", { value: "false", children: "N\u00E3o" })] }))] })) : (jsxs(Fragment, { children: [icon && jsx(Icon, { children: icon }), jsx(StyledInput, { type: editable ? type : 'string', readOnly: !editable, value: formattedValue(), onChange: handleChange, onKeyDown: onKeyDown, inputWidth: inputWidth, inline: inline, placeholder: placeholder, variant: variant })] }))] }));
};
const FieldWrapper = styled.div `
  width: ${({ width }) => width || '100%'};
  max-width: ${({ maxWidth }) => maxWidth || 'none'};
  max-height: ${({ maxHeight }) => maxHeight || 'none'};
  height: 100%;
  padding: ${({ padding }) => padding || '5px'};
  display: flex;
  flex-direction: ${({ inline }) => (inline ? 'row' : 'column')};
  align-items: ${({ inline }) => (inline ? 'center' : 'stretch')};
`;
const Label = styled.span `
  color: ${({ theme }) => theme.colors.quaternary};
  font-weight: bold;
  font-size: 15px;
  height: 100%;
  display: flex;
  align-items: center;
`;
const StyledInput = styled.input `
  width: ${({ inputWidth }) => inputWidth || '100%'};
  font-size: 15px;
  height: 100%;
  outline: none;
  background-color: transparent;
  margin-left: ${({ inline }) => (inline ? '5px' : '0')};
  cursor: ${({ readOnly }) => (readOnly ? 'not-allowed' : 'pointer')};

  &::-webkit-calendar-picker-indicator {
    filter: invert(100%);
  }

  ${({ variant, theme }) => variant &&
    css `
      color: ${getVariantColor(theme, variant)};
    `}
`;
const StyledSelect = styled.select `
  width: ${({ inputWidth }) => inputWidth || '100%'};
  font-size: 15px;
  height: 100%;
  outline: none;
  background-color: transparent;
  margin-left: ${({ inline }) => (inline ? '5px' : '0')};

  ${({ variant, theme }) => variant &&
    css `
      color: ${getVariantColor(theme, variant)};
    `}

  option {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;
const Icon = styled.div `
  height: 100%;
  width: auto;
`;

const Button = ({ variant, description, width, height, icon, hint, disabled, disabledHover, ...props }) => {
    return (jsxs(StyledButton, { variant: variant, width: width, height: height, title: hint, disabled: disabled, disabledHover: disabledHover, ...props, children: [icon && jsx(IconWrapper$1, { children: icon }), description && jsx(Description, { children: description })] }));
};
const getButtonVariantStyles = (variant, theme) => {
    if (!variant)
        return '';
    return css `
    background-color: ${getVariantColor(theme, variant)};
    color: ${theme.colors.white};
  `;
};
const StyledButton = styled.button `
  border: none;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  outline: none;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  opacity: ${props => (props.disabled ? '0.3' : '1')};
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: ${props => (props.disabledHover ? '1' : '0.85')};
  }

  ${({ variant, theme }) => getButtonVariantStyles(variant, theme)}

  ${props => props.style && css `${convertReactStyleToCSSObject(props.style)}`}
`;
const IconWrapper$1 = styled.span `
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Description = styled.span `
  margin-left: 8px;
`;

const ImagePicker = ({ imageUrl, onChange, size = '150px', borderColor, isLoading = false, icon, }) => {
    const fileInputRef = useRef(null);
    const handleImageClick = () => {
        if (!isLoading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file && onChange) {
            onChange(file);
        }
    };
    return (jsxs(Container, { size: size, children: [jsx(Avatar, { src: imageUrl || '/default-profile-image.png', alt: "Profile", borderColor: borderColor, isLoading: isLoading }), isLoading && jsx(Spinner, {}), jsx(CameraButton, { onClick: handleImageClick, borderColor: borderColor, disabled: isLoading, "aria-label": "Upload image", children: icon }), jsx("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: "image/*", style: { display: 'none' } })] }));
};
const Container = styled.div `
  position: relative;
  width: ${props => props.size};
  height: ${props => props.size};
  margin: 0 auto;
`;
const Avatar = styled.img `
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${props => props.borderColor || props.theme.colors.quaternary};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.isLoading ? 0.7 : 1};
`;
const spin = keyframes `
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
`;
const Spinner = styled.div `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
const CameraButton = styled.button `
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${props => props.borderColor || props.theme.colors.quaternary};
  color: ${props => props.theme.colors.primary};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};
  border: none;
  outline: none;

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.1)'};
  }
`;

const ActionButton = ({ icon, hint, onClick, options, disabled, }) => {
    const [expanded, setExpanded] = useState(false);
    const toggleOptions = (show) => setExpanded(show);
    const handleOptionClick = (action) => {
        action();
        setExpanded(false);
    };
    return (jsxs(Wrapper, { children: [jsx(MainButton, { onMouseEnter: () => toggleOptions(true), onMouseLeave: () => toggleOptions(false), onClick: onClick, title: hint, disabled: disabled, "aria-label": hint, children: icon }), options && expanded && (jsx(OptionsContainer, { onMouseEnter: () => toggleOptions(true), onMouseLeave: () => toggleOptions(false), children: options.map((option, index) => (jsx(OptionButton, { onClick: () => handleOptionClick(option.action), title: option.hint, disabled: option.disabled, "aria-label": option.hint, children: option.icon }, index))) }))] }));
};
const Wrapper = styled.div `
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;
const commonButtonStyles = css `
  color: white;
  background-color: ${({ theme }) => theme.colors.tertiary};
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  transition: background-color 0.3s ease, opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`;
const MainButton = styled.button `
  ${commonButtonStyles};
  width: 55px;
  height: 55px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;
const OptionsContainer = styled.div `
  position: absolute;
  bottom: 65px;
  right: 0;
  width: 55px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;
const OptionButton = styled.button `
  ${commonButtonStyles};
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;

const svgAnimation = `
  @keyframes rotateRightLeft {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }

  .spin {
    animation: rotateRightLeft 4s ease-in-out infinite;
  }
`;
const LOADING_DELAY = 100;
const Loading = ({ isLoading }) => {
    const [shouldDisplay, setShouldDisplay] = useState(false);
    const theme = useTheme();
    useEffect(() => {
        let timer;
        if (isLoading) {
            timer = setTimeout(() => {
                setShouldDisplay(true);
            }, LOADING_DELAY);
        }
        else {
            setShouldDisplay(false);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [isLoading]);
    if (!shouldDisplay)
        return null;
    const svgContent = `
    <style>${svgAnimation}</style>
    <svg 
      version="1.0" 
      xmlns="http://www.w3.org/2000/svg"
      width="150px"
      height="150px"
      viewBox="0 0 512.000000 512.000000"
      preserveAspectRatio="xMidYMid meet" 
      class="spin"
    >
      <g 
        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
        fill="${theme.colors.quaternary}" 
        stroke="none"
      >
        <path d="M2815 4467 c-97 -38 -137 -87 -179 -215 -17 -49 -35 -86 -46 -92 -10
        -6 -43 -10 -72 -10 -29 0 -93 -5 -141 -11 -104 -13 -103 -13 -154 80 -55 100
        -80 129 -136 158 -41 22 -66 27 -119 28 -66 0 -72 -2 -274 -104 -114 -57 -224
        -119 -245 -138 -53 -48 -81 -114 -81 -190 0 -53 6 -76 41 -149 22 -47 41 -95
        41 -106 0 -11 -24 -45 -53 -76 -29 -31 -71 -79 -92 -105 -56 -70 -62 -72 -156
        -42 -109 34 -180 34 -250 -3 -85 -44 -108 -83 -184 -319 -73 -222 -85 -288
        -65 -349 33 -98 86 -145 218 -188 49 -17 86 -35 92 -46 6 -10 10 -43 10 -72 0
        -29 5 -93 11 -141 13 -105 14 -103 -89 -159 -97 -53 -122 -76 -152 -134 -19
        -38 -25 -65 -25 -116 0 -66 3 -73 104 -274 57 -114 119 -224 138 -245 48 -53
        114 -81 190 -81 53 0 76 6 149 41 47 22 95 41 106 41 11 0 45 -24 76 -53 31
        -29 79 -71 105 -92 70 -56 72 -62 42 -156 -47 -150 -23 -263 72 -335 49 -37
        426 -164 509 -172 87 -7 184 38 226 106 12 20 36 74 53 121 36 101 25 95 215
        110 157 13 142 20 210 -101 36 -63 58 -91 94 -115 59 -41 117 -57 176 -49 58
        7 437 194 489 242 56 50 82 112 82 192 0 55 -6 77 -40 149 -23 47 -41 94 -41
        105 0 11 24 45 53 76 29 31 71 79 92 105 56 70 62 72 156 42 109 -34 180 -34
        250 3 85 44 108 83 184 319 76 232 86 292 61 357 -37 96 -87 138 -214 180 -49
        17 -86 35 -92 46 -6 10 -10 43 -10 72 0 29 -5 93 -11 142 -13 105 -17 99 103
        166 63 36 91 58 115 94 41 59 57 117 49 176 -7 57 -195 438 -243 491 -48 53
        -114 81 -190 81 -53 0 -76 -6 -149 -41 -47 -22 -95 -41 -106 -41 -11 0 -45 24
        -76 53 -31 29 -79 71 -105 92 -70 56 -72 62 -42 156 34 109 34 180 -3 250 -44
        85 -83 108 -319 185 -218 71 -300 85 -358 61z m274 -243 c225 -72 231 -75 231
        -118 0 -18 -8 -57 -19 -87 -30 -89 -34 -133 -17 -191 19 -67 46 -104 121 -164
        33 -26 89 -74 123 -106 115 -103 203 -113 360 -38 85 40 93 42 114 28 34 -24
        211 -383 204 -414 -5 -17 -26 -34 -79 -60 -99 -50 -129 -76 -162 -136 -23 -42
        -29 -66 -29 -113 0 -111 16 -290 30 -340 25 -92 90 -147 224 -190 64 -20 90
        -40 90 -67 0 -24 -107 -361 -127 -400 -16 -33 -55 -37 -124 -13 -85 30 -129
        36 -185 25 -68 -14 -120 -51 -180 -125 -26 -33 -74 -88 -105 -122 -104 -112
        -114 -204 -39 -361 40 -85 42 -93 28 -114 -24 -34 -383 -211 -414 -204 -17 5
        -34 26 -60 79 -50 99 -76 129 -136 162 -59 33 -89 35 -288 21 -162 -11 -211
        -27 -270 -85 -39 -39 -52 -62 -75 -132 -30 -92 -48 -119 -78 -119 -10 0 -109
        30 -218 66 -233 76 -226 70 -188 193 50 159 22 257 -100 353 -35 28 -91 76
        -124 106 -75 69 -125 91 -203 92 -50 0 -74 -7 -144 -41 -135 -65 -127 -70
        -244 161 -117 230 -117 220 9 287 92 49 138 97 161 167 17 51 17 53 -11 370
        -9 103 -82 180 -210 222 -88 29 -115 47 -115 77 0 10 30 109 66 218 76 233 70
        226 193 188 159 -50 257 -22 353 100 28 35 76 91 106 124 69 75 91 125 92 203
        0 50 -7 74 -41 144 -65 135 -70 127 161 244 230 117 220 117 287 -9 78 -145
        157 -186 320 -166 50 6 118 11 151 11 158 0 241 67 297 240 20 64 40 90 68 90
        10 0 99 -25 196 -56z"/>
        <path d="M2380 3444 c-184 -39 -325 -117 -460 -253 -110 -111 -166 -201 -216
        -349 -95 -278 -41 -596 141 -833 288 -374 822 -461 1214 -198 184 123 310 296
        373 516 19 66 23 102 23 233 0 132 -3 167 -23 235 -96 336 -358 580 -695 649
        -93 19 -268 20 -357 0z m401 -216 c229 -80 401 -264 459 -494 27 -106 27 -254
        -1 -354 -68 -247 -261 -438 -505 -500 -106 -27 -254 -27 -354 1 -194 53 -356
        184 -442 356 -62 124 -81 213 -76 356 3 92 9 127 34 198 77 219 261 389 486
        449 109 30 295 24 399 -12z"/>
      </g>
    </svg>
  `;
    return (jsx(Container$1, { width: "100vw", height: "100vh", backgroundColor: "transparent", style: {
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        }, children: jsx("div", { dangerouslySetInnerHTML: { __html: svgContent } }) }));
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = React.createContext && /*#__PURE__*/React.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/React.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/React.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/React.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/React.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/React.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaAngleDoubleLeft (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M223.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L319.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L393.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34zm-192 34l136 136c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9L127.9 256l96.4-96.4c9.4-9.4 9.4-24.6 0-33.9L201.7 103c-9.4-9.4-24.6-9.4-33.9 0l-136 136c-9.5 9.4-9.5 24.6-.1 34z"},"child":[]}]})(props);
}function FaAngleDoubleRight (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"},"child":[]}]})(props);
}function FaAngleLeft (props) {
  return GenIcon({"attr":{"viewBox":"0 0 256 512"},"child":[{"tag":"path","attr":{"d":"M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"},"child":[]}]})(props);
}function FaAngleRight (props) {
  return GenIcon({"attr":{"viewBox":"0 0 256 512"},"child":[{"tag":"path","attr":{"d":"M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"},"child":[]}]})(props);
}function FaCheckCircle (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"},"child":[]}]})(props);
}function FaEdit (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"},"child":[]}]})(props);
}function FaExclamationCircle (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"},"child":[]}]})(props);
}function FaExclamationTriangle (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"},"child":[]}]})(props);
}function FaEye (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"},"child":[]}]})(props);
}function FaInfoCircle (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"},"child":[]}]})(props);
}function FaTimes (props) {
  return GenIcon({"attr":{"viewBox":"0 0 352 512"},"child":[{"tag":"path","attr":{"d":"M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"},"child":[]}]})(props);
}function FaTrash (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"},"child":[]}]})(props);
}

const usePaginationState = (page) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(page.number);
    useEffect(() => {
        setCurrentPageIndex(page.number);
    }, [page.number]);
    return useMemo(() => ({
        isFirstPage: currentPageIndex === 0,
        isLastPage: currentPageIndex === page.totalPages - 1,
        currentPage: currentPageIndex,
        totalPages: page.totalPages,
        pageSize: page.size,
    }), [currentPageIndex, page.totalPages, page.size]);
};
const useNavigationHandlers = (loadPage, state) => {
    const { currentPage, totalPages, pageSize } = state;
    return useMemo(() => ({
        goToFirst: () => {
            if (!state.isFirstPage) {
                loadPage(0, pageSize);
            }
        },
        goToPrevious: () => {
            if (currentPage > 0) {
                loadPage(currentPage - 1, pageSize);
            }
        },
        goToNext: () => {
            if (currentPage < totalPages - 1) {
                loadPage(currentPage + 1, pageSize);
            }
        },
        goToLast: () => {
            if (!state.isLastPage) {
                loadPage(totalPages - 1, pageSize);
            }
        },
    }), [loadPage, currentPage, totalPages, pageSize, state.isFirstPage, state.isLastPage]);
};
const PaginationControls = ({ state, handlers }) => {
    const { isFirstPage, isLastPage, currentPage, totalPages } = state;
    const { goToFirst, goToPrevious, goToNext, goToLast } = handlers;
    return (jsxs(StyledPaginationControls, { children: [jsx(ControlItem, { onClick: goToFirst, disabled: isFirstPage, children: jsx(FaAngleDoubleLeft, {}) }), jsx(ControlItem, { onClick: goToPrevious, disabled: isFirstPage, children: jsx(FaAngleLeft, {}) }), jsxs(PageIndicator, { children: [currentPage + 1, " / ", totalPages] }), jsx(ControlItem, { onClick: goToNext, disabled: isLastPage, children: jsx(FaAngleRight, {}) }), jsx(ControlItem, { onClick: goToLast, disabled: isLastPage, children: jsx(FaAngleDoubleRight, {}) })] }));
};
const SearchPagination = ({ page, height, width, loadPage }) => {
    const state = usePaginationState(page);
    const handlers = useNavigationHandlers(loadPage, state);
    return (jsx(Container$1, { height: height, width: width, backgroundColor: "transparent", children: jsx(Stack, { direction: "row", alignCenter: true, justifyCenter: true, gap: "10px", children: jsx(PaginationControls, { state: state, handlers: handlers }) }) }));
};
const StyledPaginationControls = styled.ul `
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  color: ${({ theme }) => theme.colors.quaternary};
`;
const ControlItem = styled.li `
  width: 35px;
  height: 35px;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? '0.2' : '1'};

  &:hover {
    color: ${({ theme, disabled }) => disabled ? theme.colors.white : theme.colors.gray};
  }
`;
const PageIndicator = styled.span `
  margin: 0 8px;
  user-select: none;
`;

const Column = ({}) => null;
const COMMON_BUTTON_STYLES = {
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    height: '25px',
    width: '25px',
};
const TableActions = ({ onView, onEdit, onDelete, visible, customActions }) => (jsx(ActionsContainer, { children: jsxs(ActionsWrapper, { visible: visible, children: [customActions && (jsx(CustomActionWrapper, { children: customActions() })), onView && (jsx(Button, { onClick: onView, variant: "success", icon: jsx(FaEye, {}), hint: "Visualizar", style: COMMON_BUTTON_STYLES })), onEdit && (jsx(Button, { variant: "info", icon: jsx(FaEdit, {}), onClick: onEdit, style: COMMON_BUTTON_STYLES })), onDelete && (jsx(Button, { variant: "warning", icon: jsx(FaTrash, {}), onClick: onDelete, style: COMMON_BUTTON_STYLES }))] }) }));
const isPagedResponse = (values) => typeof values === 'object' && values !== null && 'content' in values;
const getTableData = (values) => isPagedResponse(values) ? values.content || [] : values;
const TableHeader = ({ columns }) => (jsx("thead", { children: jsx(TableHeadRow, { children: columns.map((column, index) => {
            if (!React.isValidElement(column))
                return null;
            const { header, titleAlign = 'center' } = column.props;
            return (jsx(TableHeadColumn, { children: jsx(TableColumnTitle, { align: titleAlign, children: header }) }, index));
        }) }) }));
const TableBody = ({ data, columns, messageEmpty, keyExtractor, onClickRow, rowSelected, onView, onEdit, onDelete, customActions, hoveredRowIndex, onRowHover, }) => {
    if (data.length === 0) {
        return (jsx("tbody", { children: jsx("tr", { children: jsx("td", { colSpan: columns.length + 1, children: jsx(EmptyMessage, { children: messageEmpty }) }) }) }));
    }
    return (jsx("tbody", { children: data.map((item, index) => (jsxs(TableRow, { onClick: () => onClickRow?.(item, index), onMouseEnter: () => onRowHover(index), onMouseLeave: () => onRowHover(null), children: [columns.map((column, columnIndex) => {
                    if (!React.isValidElement(column))
                        return null;
                    const { value, width, align } = column.props;
                    const isSelected = rowSelected?.(item) ?? false;
                    return (jsx(TableColumn, { isSelected: isSelected, width: width, align: align, children: jsx(TruncatedContent, { children: value(item, index) }) }, columnIndex));
                }), jsx(ActionColumn, { children: jsx(TableActions, { onView: onView ? () => onView(item) : undefined, onEdit: onEdit ? () => onEdit(item) : undefined, onDelete: onDelete ? () => onDelete(item) : undefined, visible: hoveredRowIndex === index, customActions: customActions ? () => customActions(item) : undefined }) })] }, keyExtractor(item, index)))) }));
};
const TablePagination = ({ values, loadPage }) => {
    if (!loadPage || !isPagedResponse(values) || values.totalElements <= 0) {
        return null;
    }
    return (jsx(SearchPagination, { height: "35px", page: values, loadPage: loadPage }));
};
const Table = ({ values, columns, messageEmpty, keyExtractor, onClickRow, rowSelected, loadPage, onView, onEdit, onDelete, customActions, }) => {
    const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
    const tableData = useMemo(() => getTableData(values), [values]);
    const isEmpty = tableData.length === 0;
    if (isEmpty) {
        return (jsx(Container$1, { backgroundColor: "transparent", width: "100%", children: jsx(EmptyMessage, { children: messageEmpty }) }));
    }
    return (jsxs(Container$1, { backgroundColor: "transparent", width: "100%", children: [jsx(TableContainer, { children: jsxs(StyledTable, { children: [jsx(TableHeader, { columns: columns }), jsx(TableBody, { data: tableData, columns: columns, messageEmpty: messageEmpty, keyExtractor: keyExtractor, onClickRow: onClickRow, rowSelected: rowSelected, onView: onView, onEdit: onEdit, onDelete: onDelete, customActions: customActions, hoveredRowIndex: hoveredRowIndex, onRowHover: setHoveredRowIndex })] }) }), jsx(TablePagination, { values: values, loadPage: loadPage })] }));
};
const TableContainer = styled.div `
  width: 100%;
  overflow: hidden;
  table-layout: fixed;
`;
const EmptyMessage = styled.div `
  padding: 10px;
`;
const StyledTable = styled.table `
  width: 100%;
  border-collapse: collapse;
`;
const TableHeadRow = styled.tr `
  border-bottom: 2px solid ${({ theme }) => theme.colors.quaternary};
`;
const TableHeadColumn = styled.th `
  padding: 0 3px;
  text-align: left;
  background-color: transparent;
  border-left: 1px solid ${({ theme }) => theme.colors.gray};

  &:first-child {
    border-left: none;
  }
`;
const TableColumn = styled.td `
  font-size: 13px;
  height: 35px;
  text-align: ${({ align }) => align || 'left'};
  border-left: 1px solid ${({ theme }) => theme.colors.gray};
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${({ width }) => width || 'auto'};
  width: ${({ width }) => width || 'auto'};
  padding: 0 5px;
  display: table-cell;

  &:first-child::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 5px;
    background-color: ${({ theme, isSelected }) => isSelected ? theme.colors.quaternary : 'transparent'};
  }

  &:first-child {
    border-left: none;
  }
`;
const TruncatedContent = styled.div `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
`;
const TableColumnTitle = styled.div `
  font-size: 14px;
  height: 40px;
  text-align: ${({ align }) => align};
  display: flex;
  align-items: center;
  justify-content: ${({ align }) => align === 'left' ? 'flex-start' :
    align === 'right' ? 'flex-end' : 'center'};
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.quaternary};
`;
const TableRow = styled.tr `
  background-color: ${({ theme }) => theme.colors.secondary};
  position: relative;

  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  }
`;
const ActionColumn = styled.td `
  position: sticky;
  right: 0;
  padding: 2px;
  z-index: 2;
`;
const ActionsContainer = styled.div `
  position: relative;
  height: 100%;
`;
const ActionsWrapper = styled.div `
  position: sticky;
  top: 0;
  right: 5px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  opacity: ${({ visible }) => visible ? 1 : 0};
  pointer-events: ${({ visible }) => visible ? 'auto' : 'none'};
  transition: opacity 0.2s ease-in-out;
`;
const CustomActionWrapper = styled.div `
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  align-items: center;
`;

const Modal = ({ isOpen, title, content, onClose, variant = 'warning', actions, showCloseButton = true, closeButtonSize = '20px', modalWidth = '500px', maxWidth, modalHeight = 'auto', icon = jsx(FaExclamationTriangle, {}) }) => {
    if (!isOpen)
        return null;
    return (jsx(ModalOverlay, { onClick: onClose, children: jsxs(ModalContainer, { onClick: (e) => e.stopPropagation(), width: modalWidth, maxWidth: maxWidth, height: modalHeight, children: [jsxs(ModalHeader, { variant: variant, children: [jsxs(HeaderLeft, { children: [icon && jsx(IconWrapper, { children: icon }), jsx(ModalTitle, { children: title })] }), showCloseButton && (jsx(Button, { width: closeButtonSize, height: closeButtonSize, style: {
                                backgroundColor: 'transparent',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }, icon: jsx(FaTimes, {}), hint: "Fechar", onClick: onClose }))] }), jsx(ModalContent, { children: content }), actions && jsx(ModalActions, { children: actions })] }) }));
};
const ModalOverlay = styled.div `
  z-index: 1000;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ModalContainer = styled.div `
  width: ${({ width }) => width};
  max-width: ${({ maxWidth }) => maxWidth ?? '90%'};
  height: ${({ height }) => height};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  box-shadow: 0 0 5px 5px ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
`;
const ModalHeader = styled.div `
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ variant, theme }) => getVariantColor(theme, variant)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 15px;
`;
const HeaderLeft = styled.div `
  display: flex;
  align-items: center;
  gap: 10px;
`;
const IconWrapper = styled.span `
  display: flex;
  align-items: center;
`;
const ModalTitle = styled.div `
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
`;
const ModalContent = styled.div `
  padding: 20px;
  flex: 1;
`;
const ModalActions = styled.div `
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
`;

const ConfirmModal = ({ isOpen, title, content, onClose, onConfirm, modalWidth = '400px', variantPrimary = 'warning', variantSecondary = 'secondary', confirmLabel = 'ACEITAR', cancelLabel = 'CANCELAR', confirmButtonProps, cancelButtonProps, }) => {
    const defaultButtonStyle = {
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };
    const renderButton = (label, variant, onClick, props) => (jsx(Button, { variant: variant, width: "100px", height: "30px", style: defaultButtonStyle, description: label, onClick: onClick, ...props }));
    return (jsx(Modal, { isOpen: isOpen, variant: variantPrimary, title: title, content: content, modalWidth: modalWidth, maxWidth: "85%", onClose: onClose, showCloseButton: false, actions: jsxs(Fragment, { children: [renderButton(cancelLabel, variantSecondary, onClose, cancelButtonProps), renderButton(confirmLabel, variantPrimary, () => {
                    onConfirm();
                    onClose();
                }, confirmButtonProps)] }) }));
};

const iconMap = {
    success: jsx(FaCheckCircle, {}),
    info: jsx(FaInfoCircle, {}),
    error: jsx(FaExclamationCircle, {}),
};
const getVariant = (type) => {
    switch (type) {
        case 'error':
            return 'warning';
        case 'success':
            return 'success';
        default:
            return 'info';
    }
};
const ToastNotification = ({ type, message, onClose }) => {
    const icon = iconMap[type];
    const variant = getVariant(type);
    return (jsx(ToastContainer, { children: jsxs(ToastCard, { variant: variant, children: [jsx(ToastIcon, { variant: variant, children: icon }), jsx(ToastMessage, { children: message }), jsx(CloseButton, { variant: variant, onClick: onClose })] }) }));
};
const ToastContainer = styled.div `
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;
const ToastCard = styled.div `
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.tertiary};
  color: ${({ theme, variant }) => theme.colors[variant]};
  border-left: 5px solid ${({ theme, variant }) => theme.colors[variant]};
  border-radius: 6px;
  padding: 12px 16px;
  min-width: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
`;
const ToastIcon = styled.div `
  font-size: 20px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ToastMessage = styled.div `
  flex: 1;
  font-size: 14px;
`;
const CloseButtonBase = ({ variant, ...props }) => (jsx("button", { ...props, children: jsx(FaTimes, {}) }));
const CloseButton = styled(CloseButtonBase) `
  background: none;
  border: none;
  color: ${({ theme, variant }) => theme.colors[variant]};
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

const DEFAULT_THEME_SYSTEM = {
    colors: {
        primary: '#cccccc',
        secondary: '#999999',
        tertiary: '#666666',
        quaternary: '#333333',
        white: '#ffffffb7',
        black: '#000000',
        gray: '#888888',
        success: '#28a745',
        info: '#17a2b8',
        warning: '#ffc107',
    }
};

const defaultRenderSvg = (theme) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <circle cx="256" cy="256" r="256" fill="${theme.colors.quaternary}" />
  </svg>
`;
const ThemeFavicon = ({ renderSvg }) => {
    const theme = useTheme() || DEFAULT_THEME_SYSTEM;
    const svgContent = renderSvg ? renderSvg(theme) : defaultRenderSvg(theme);
    useEffect(() => {
        let faviconLink = document.querySelector("link[rel='icon']");
        if (!faviconLink) {
            faviconLink = document.createElement('link');
            faviconLink.rel = 'icon';
            document.head.appendChild(faviconLink);
        }
        faviconLink.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    }, [svgContent]);
    return null;
};

const useConfirmModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('Confirmação');
    const [content, setContent] = useState(jsx("p", { children: "Deseja realmente executar esta a\u00E7\u00E3o?" }));
    const [resolver, setResolver] = useState(() => () => { });
    const confirm = useCallback((newTitle, newContent) => {
        setTitle(newTitle);
        setContent(newContent);
        setIsOpen(true);
        return new Promise((resolve) => {
            setResolver(() => resolve);
        });
    }, []);
    const handleClose = useCallback((value) => {
        setIsOpen(false);
        resolver(value);
    }, [resolver]);
    const ConfirmModalComponent = useMemo(() => (jsx(ConfirmModal, { isOpen: isOpen, title: title, content: content, onClose: () => handleClose(false), onConfirm: () => handleClose(true) })), [isOpen, title, content, handleClose]);
    return { confirm, ConfirmModalComponent };
};

export { ActionButton, Button, Column, ConfirmModal, Container$1 as Container, DEFAULT_THEME_SYSTEM, FieldValue, ImagePicker, Loading, Modal, Panel, SearchPagination, Stack, Table, ThemeFavicon, ThemeSelector, ToastNotification, convertReactStyleToCSSObject, formatDateToShortString, formatDateToYMDString, formatDateToYMString, getCurrentDate, getVariantColor, isDateValid, parseDateStringToDate, parseShortStringToDateTime, useConfirmModal };
//# sourceMappingURL=index.js.map
