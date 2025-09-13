import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import styled, { css, keyframes } from 'styled-components';
import { useRef } from 'react';

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
    return (jsxs(StyledButton, { variant: variant, width: width, height: height, title: hint, disabled: disabled, disabledHover: disabledHover, ...props, children: [icon && jsx(IconWrapper, { children: icon }), description && jsx(Description, { children: description })] }));
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
const IconWrapper = styled.span `
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

export { Button, Container$1 as Container, FieldValue, ImagePicker, Panel, Stack, ThemeSelector, convertReactStyleToCSSObject, formatDateToShortString, formatDateToYMDString, formatDateToYMString, getCurrentDate, getVariantColor, isDateValid, parseDateStringToDate, parseShortStringToDateTime };
