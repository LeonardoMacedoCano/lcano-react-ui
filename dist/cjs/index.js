'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var styled = require('styled-components');

const OPERATOR_LABELS = {
    LIKE: { pt: 'Contém', en: 'Contains' },
    '==': { pt: 'Igual', en: 'Equal' },
    '!=': { pt: 'Diferente', en: 'Different' },
    '>': { pt: 'Maior', en: 'Greater' },
    '<': { pt: 'Menor', en: 'Less' },
    '>=': { pt: 'Maior ou igual', en: 'Greater or equal' },
    '<=': { pt: 'Menor ou igual', en: 'Less or equal' },
};
const OPERATOR_SYMBOLS_BY_TYPE = {
    STRING: ['LIKE', '==', '!='],
    NUMBER: ['==', '!=', '>', '<', '>=', '<='],
    DATE: ['==', '!=', '>', '<', '>=', '<='],
    SELECT: ['==', '!='],
    BOOLEAN: ['=='],
    MONTH: ['==', '!=', '>', '<', '>=', '<='],
};
function getOperators(fieldType, locale = 'pt') {
    return OPERATOR_SYMBOLS_BY_TYPE[fieldType].map((symbol) => ({
        name: OPERATOR_LABELS[symbol][locale],
        symbol,
    }));
}
const STRING_OPERATORS = getOperators('STRING');
const NUMBER_OPERATORS = getOperators('NUMBER');
const DATE_OPERATORS = getOperators('DATE');
const SELECT_OPERATORS = getOperators('SELECT');
const BOOLEAN_OPERATORS = getOperators('BOOLEAN');
const OPERATORS = {
    STRING: STRING_OPERATORS,
    NUMBER: NUMBER_OPERATORS,
    DATE: DATE_OPERATORS,
    SELECT: SELECT_OPERATORS,
    BOOLEAN: BOOLEAN_OPERATORS,
    MONTH: NUMBER_OPERATORS,
};
const PAGE_SIZE_DEFAULT = 10;
const PAGE_SIZE_COMPACT = 5;

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

const parseShortStringToDateTime = (dateStr) => {
    if (!dateStr)
        return '';
    const dateParts = dateStr.toString().split(',');
    return `${dateParts[2].padStart(2, '0')}/${(parseInt(dateParts[1], 10) + 1)
        .toString()
        .padStart(2, '0')}/${dateParts[0].slice(-2)} ${dateParts[3].padStart(2, '0')}:${dateParts[4].padStart(2, '0')}`;
};
const formatIsoDateToBrDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
};
const formatDateToBrString = (date) => {
    if (!date)
        return '';
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString();
    return `${day}/${month}/${year}`;
};
function formatDateTimeToBrString(date) {
    const d = new Date(date);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const minuto = String(d.getMinutes()).padStart(2, '0');
    const segundo = String(d.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
}
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

const formatFieldValueToString = (type, value) => {
    if (value === null || value === undefined)
        return '';
    switch (type) {
        case 'DATE':
            return value instanceof Date ? formatDateToYMDString(value) : String(value);
        case 'MONTH':
            return value instanceof Date ? formatDateToYMString(value) : String(value);
        case 'BOOLEAN':
            if (typeof value === 'boolean')
                return value ? 'true' : 'false';
            if (typeof value === 'string')
                return value.toLowerCase() === 'true' ? 'true' : 'false';
            return 'false';
        case 'NUMBER':
            return typeof value === 'number' ? String(value) : value ?? '';
        case 'SELECT':
            return typeof value === 'object' && value !== null ? value.key : String(value);
        default:
            return String(value);
    }
};
const formatNumericInputWithLimits = (val, maxIntegerDigits, maxDecimalPlaces, minValue, maxValue) => {
    const [integerPart, decimalPart] = val.split('.');
    let newVal = integerPart.slice(0, maxIntegerDigits) + (decimalPart ? `.${decimalPart.slice(0, maxDecimalPlaces)}` : '');
    if (minValue !== undefined && parseFloat(newVal) < minValue)
        newVal = String(minValue);
    if (maxValue !== undefined && parseFloat(newVal) > maxValue)
        newVal = String(maxValue);
    return newVal;
};

const formatBooleanToSimNao = (value) => value === 'true' ? 'Sim' : 'Não';

const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        }
        catch {
            return false;
        }
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    try {
        textarea.focus();
        textarea.select();
        return document.execCommand('copy');
    }
    catch {
        return false;
    }
    finally {
        document.body.removeChild(textarea);
    }
};

const ActionButton = ({ icon, hint, onClick, options, disabled, }) => {
    const [expanded, setExpanded] = React.useState(false);
    const toggleOptions = (show) => setExpanded(show);
    const handleOptionClick = (action) => {
        action();
        setExpanded(false);
    };
    return (jsxRuntime.jsxs(Wrapper$1, { children: [jsxRuntime.jsx(MainButton, { onMouseEnter: () => toggleOptions(true), onMouseLeave: () => toggleOptions(false), onClick: onClick, title: hint, disabled: disabled, "aria-label": hint, children: icon }), options && expanded && (jsxRuntime.jsx(OptionsContainer, { onMouseEnter: () => toggleOptions(true), onMouseLeave: () => toggleOptions(false), children: options.map((option, index) => (jsxRuntime.jsx(OptionButton, { onClick: () => handleOptionClick(option.action), title: option.hint, disabled: option.disabled, "aria-label": option.hint, children: option.icon }, index))) }))] }));
};
const Wrapper$1 = styled.div `
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;
const commonButtonStyles = styled.css `
  color: ${({ theme }) => theme.colors.white};
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
  bottom: 100%;
  padding-bottom: 10px;
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

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var propTypes = {exports: {}};

var reactIs = {exports: {}};

var reactIs_production_min = {};

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactIs_production_min;

function requireReactIs_production_min () {
	if (hasRequiredReactIs_production_min) return reactIs_production_min;
	hasRequiredReactIs_production_min = 1;
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
	Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
	function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}reactIs_production_min.AsyncMode=l;reactIs_production_min.ConcurrentMode=m;reactIs_production_min.ContextConsumer=k;reactIs_production_min.ContextProvider=h;reactIs_production_min.Element=c;reactIs_production_min.ForwardRef=n;reactIs_production_min.Fragment=e;reactIs_production_min.Lazy=t;reactIs_production_min.Memo=r;reactIs_production_min.Portal=d;
	reactIs_production_min.Profiler=g;reactIs_production_min.StrictMode=f;reactIs_production_min.Suspense=p;reactIs_production_min.isAsyncMode=function(a){return A(a)||z(a)===l};reactIs_production_min.isConcurrentMode=A;reactIs_production_min.isContextConsumer=function(a){return z(a)===k};reactIs_production_min.isContextProvider=function(a){return z(a)===h};reactIs_production_min.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};reactIs_production_min.isForwardRef=function(a){return z(a)===n};reactIs_production_min.isFragment=function(a){return z(a)===e};reactIs_production_min.isLazy=function(a){return z(a)===t};
	reactIs_production_min.isMemo=function(a){return z(a)===r};reactIs_production_min.isPortal=function(a){return z(a)===d};reactIs_production_min.isProfiler=function(a){return z(a)===g};reactIs_production_min.isStrictMode=function(a){return z(a)===f};reactIs_production_min.isSuspense=function(a){return z(a)===p};
	reactIs_production_min.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};reactIs_production_min.typeOf=z;
	return reactIs_production_min;
}

var reactIs_development = {};

/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactIs_development;

function requireReactIs_development () {
	if (hasRequiredReactIs_development) return reactIs_development;
	hasRequiredReactIs_development = 1;



	if (process.env.NODE_ENV !== "production") {
	  (function() {

	// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
	// nor polyfill, then a plain number is used for performance.
	var hasSymbol = typeof Symbol === 'function' && Symbol.for;
	var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
	var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
	var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
	var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
	var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
	var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
	var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
	// (unstable) APIs that have been removed. Can we remove the symbols?

	var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
	var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
	var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
	var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
	var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
	var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
	var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
	var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
	var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
	var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
	var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

	function isValidElementType(type) {
	  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
	  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
	}

	function typeOf(object) {
	  if (typeof object === 'object' && object !== null) {
	    var $$typeof = object.$$typeof;

	    switch ($$typeof) {
	      case REACT_ELEMENT_TYPE:
	        var type = object.type;

	        switch (type) {
	          case REACT_ASYNC_MODE_TYPE:
	          case REACT_CONCURRENT_MODE_TYPE:
	          case REACT_FRAGMENT_TYPE:
	          case REACT_PROFILER_TYPE:
	          case REACT_STRICT_MODE_TYPE:
	          case REACT_SUSPENSE_TYPE:
	            return type;

	          default:
	            var $$typeofType = type && type.$$typeof;

	            switch ($$typeofType) {
	              case REACT_CONTEXT_TYPE:
	              case REACT_FORWARD_REF_TYPE:
	              case REACT_LAZY_TYPE:
	              case REACT_MEMO_TYPE:
	              case REACT_PROVIDER_TYPE:
	                return $$typeofType;

	              default:
	                return $$typeof;
	            }

	        }

	      case REACT_PORTAL_TYPE:
	        return $$typeof;
	    }
	  }

	  return undefined;
	} // AsyncMode is deprecated along with isAsyncMode

	var AsyncMode = REACT_ASYNC_MODE_TYPE;
	var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
	var ContextConsumer = REACT_CONTEXT_TYPE;
	var ContextProvider = REACT_PROVIDER_TYPE;
	var Element = REACT_ELEMENT_TYPE;
	var ForwardRef = REACT_FORWARD_REF_TYPE;
	var Fragment = REACT_FRAGMENT_TYPE;
	var Lazy = REACT_LAZY_TYPE;
	var Memo = REACT_MEMO_TYPE;
	var Portal = REACT_PORTAL_TYPE;
	var Profiler = REACT_PROFILER_TYPE;
	var StrictMode = REACT_STRICT_MODE_TYPE;
	var Suspense = REACT_SUSPENSE_TYPE;
	var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

	function isAsyncMode(object) {
	  {
	    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
	      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

	      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
	    }
	  }

	  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
	}
	function isConcurrentMode(object) {
	  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
	}
	function isContextConsumer(object) {
	  return typeOf(object) === REACT_CONTEXT_TYPE;
	}
	function isContextProvider(object) {
	  return typeOf(object) === REACT_PROVIDER_TYPE;
	}
	function isElement(object) {
	  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function isForwardRef(object) {
	  return typeOf(object) === REACT_FORWARD_REF_TYPE;
	}
	function isFragment(object) {
	  return typeOf(object) === REACT_FRAGMENT_TYPE;
	}
	function isLazy(object) {
	  return typeOf(object) === REACT_LAZY_TYPE;
	}
	function isMemo(object) {
	  return typeOf(object) === REACT_MEMO_TYPE;
	}
	function isPortal(object) {
	  return typeOf(object) === REACT_PORTAL_TYPE;
	}
	function isProfiler(object) {
	  return typeOf(object) === REACT_PROFILER_TYPE;
	}
	function isStrictMode(object) {
	  return typeOf(object) === REACT_STRICT_MODE_TYPE;
	}
	function isSuspense(object) {
	  return typeOf(object) === REACT_SUSPENSE_TYPE;
	}

	reactIs_development.AsyncMode = AsyncMode;
	reactIs_development.ConcurrentMode = ConcurrentMode;
	reactIs_development.ContextConsumer = ContextConsumer;
	reactIs_development.ContextProvider = ContextProvider;
	reactIs_development.Element = Element;
	reactIs_development.ForwardRef = ForwardRef;
	reactIs_development.Fragment = Fragment;
	reactIs_development.Lazy = Lazy;
	reactIs_development.Memo = Memo;
	reactIs_development.Portal = Portal;
	reactIs_development.Profiler = Profiler;
	reactIs_development.StrictMode = StrictMode;
	reactIs_development.Suspense = Suspense;
	reactIs_development.isAsyncMode = isAsyncMode;
	reactIs_development.isConcurrentMode = isConcurrentMode;
	reactIs_development.isContextConsumer = isContextConsumer;
	reactIs_development.isContextProvider = isContextProvider;
	reactIs_development.isElement = isElement;
	reactIs_development.isForwardRef = isForwardRef;
	reactIs_development.isFragment = isFragment;
	reactIs_development.isLazy = isLazy;
	reactIs_development.isMemo = isMemo;
	reactIs_development.isPortal = isPortal;
	reactIs_development.isProfiler = isProfiler;
	reactIs_development.isStrictMode = isStrictMode;
	reactIs_development.isSuspense = isSuspense;
	reactIs_development.isValidElementType = isValidElementType;
	reactIs_development.typeOf = typeOf;
	  })();
	}
	return reactIs_development;
}

var hasRequiredReactIs;

function requireReactIs () {
	if (hasRequiredReactIs) return reactIs.exports;
	hasRequiredReactIs = 1;

	if (process.env.NODE_ENV === 'production') {
	  reactIs.exports = requireReactIs_production_min();
	} else {
	  reactIs.exports = requireReactIs_development();
	}
	return reactIs.exports;
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

var objectAssign;
var hasRequiredObjectAssign;

function requireObjectAssign () {
	if (hasRequiredObjectAssign) return objectAssign;
	hasRequiredObjectAssign = 1;
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};
	return objectAssign;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret_1;
var hasRequiredReactPropTypesSecret;

function requireReactPropTypesSecret () {
	if (hasRequiredReactPropTypesSecret) return ReactPropTypesSecret_1;
	hasRequiredReactPropTypesSecret = 1;

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	ReactPropTypesSecret_1 = ReactPropTypesSecret;
	return ReactPropTypesSecret_1;
}

var has;
var hasRequiredHas;

function requireHas () {
	if (hasRequiredHas) return has;
	hasRequiredHas = 1;
	has = Function.call.bind(Object.prototype.hasOwnProperty);
	return has;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var checkPropTypes_1;
var hasRequiredCheckPropTypes;

function requireCheckPropTypes () {
	if (hasRequiredCheckPropTypes) return checkPropTypes_1;
	hasRequiredCheckPropTypes = 1;

	var printWarning = function() {};

	if (process.env.NODE_ENV !== 'production') {
	  var ReactPropTypesSecret = requireReactPropTypesSecret();
	  var loggedTypeFailures = {};
	  var has = requireHas();

	  printWarning = function(text) {
	    var message = 'Warning: ' + text;
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) { /**/ }
	  };
	}

	/**
	 * Assert that the values match with the type specs.
	 * Error messages are memorized and will only be shown once.
	 *
	 * @param {object} typeSpecs Map of name to a ReactPropType
	 * @param {object} values Runtime values that need to be type-checked
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @param {string} componentName Name of the component for error messages.
	 * @param {?Function} getStack Returns the component stack.
	 * @private
	 */
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
	  if (process.env.NODE_ENV !== 'production') {
	    for (var typeSpecName in typeSpecs) {
	      if (has(typeSpecs, typeSpecName)) {
	        var error;
	        // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          if (typeof typeSpecs[typeSpecName] !== 'function') {
	            var err = Error(
	              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
	              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
	              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
	            );
	            err.name = 'Invariant Violation';
	            throw err;
	          }
	          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
	        } catch (ex) {
	          error = ex;
	        }
	        if (error && !(error instanceof Error)) {
	          printWarning(
	            (componentName || 'React class') + ': type specification of ' +
	            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
	            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
	            'You may have forgotten to pass an argument to the type checker ' +
	            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
	            'shape all require an argument).'
	          );
	        }
	        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error.message] = true;

	          var stack = getStack ? getStack() : '';

	          printWarning(
	            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
	          );
	        }
	      }
	    }
	  }
	}

	/**
	 * Resets warning cache when testing.
	 *
	 * @private
	 */
	checkPropTypes.resetWarningCache = function() {
	  if (process.env.NODE_ENV !== 'production') {
	    loggedTypeFailures = {};
	  }
	};

	checkPropTypes_1 = checkPropTypes;
	return checkPropTypes_1;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var factoryWithTypeCheckers;
var hasRequiredFactoryWithTypeCheckers;

function requireFactoryWithTypeCheckers () {
	if (hasRequiredFactoryWithTypeCheckers) return factoryWithTypeCheckers;
	hasRequiredFactoryWithTypeCheckers = 1;

	var ReactIs = requireReactIs();
	var assign = requireObjectAssign();

	var ReactPropTypesSecret = requireReactPropTypesSecret();
	var has = requireHas();
	var checkPropTypes = requireCheckPropTypes();

	var printWarning = function() {};

	if (process.env.NODE_ENV !== 'production') {
	  printWarning = function(text) {
	    var message = 'Warning: ' + text;
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };
	}

	function emptyFunctionThatReturnsNull() {
	  return null;
	}

	factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
	  /* global Symbol */
	  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

	  /**
	   * Returns the iterator method function contained on the iterable object.
	   *
	   * Be sure to invoke the function with the iterable as context:
	   *
	   *     var iteratorFn = getIteratorFn(myIterable);
	   *     if (iteratorFn) {
	   *       var iterator = iteratorFn.call(myIterable);
	   *       ...
	   *     }
	   *
	   * @param {?object} maybeIterable
	   * @return {?function}
	   */
	  function getIteratorFn(maybeIterable) {
	    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }

	  /**
	   * Collection of methods that allow declaration and validation of props that are
	   * supplied to React components. Example usage:
	   *
	   *   var Props = require('ReactPropTypes');
	   *   var MyArticle = React.createClass({
	   *     propTypes: {
	   *       // An optional string prop named "description".
	   *       description: Props.string,
	   *
	   *       // A required enum prop named "category".
	   *       category: Props.oneOf(['News','Photos']).isRequired,
	   *
	   *       // A prop named "dialog" that requires an instance of Dialog.
	   *       dialog: Props.instanceOf(Dialog).isRequired
	   *     },
	   *     render: function() { ... }
	   *   });
	   *
	   * A more formal specification of how these methods are used:
	   *
	   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
	   *   decl := ReactPropTypes.{type}(.isRequired)?
	   *
	   * Each and every declaration produces a function with the same signature. This
	   * allows the creation of custom validation functions. For example:
	   *
	   *  var MyLink = React.createClass({
	   *    propTypes: {
	   *      // An optional string or URI prop named "href".
	   *      href: function(props, propName, componentName) {
	   *        var propValue = props[propName];
	   *        if (propValue != null && typeof propValue !== 'string' &&
	   *            !(propValue instanceof URI)) {
	   *          return new Error(
	   *            'Expected a string or an URI for ' + propName + ' in ' +
	   *            componentName
	   *          );
	   *        }
	   *      }
	   *    },
	   *    render: function() {...}
	   *  });
	   *
	   * @internal
	   */

	  var ANONYMOUS = '<<anonymous>>';

	  // Important!
	  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
	  var ReactPropTypes = {
	    array: createPrimitiveTypeChecker('array'),
	    bigint: createPrimitiveTypeChecker('bigint'),
	    bool: createPrimitiveTypeChecker('boolean'),
	    func: createPrimitiveTypeChecker('function'),
	    number: createPrimitiveTypeChecker('number'),
	    object: createPrimitiveTypeChecker('object'),
	    string: createPrimitiveTypeChecker('string'),
	    symbol: createPrimitiveTypeChecker('symbol'),

	    any: createAnyTypeChecker(),
	    arrayOf: createArrayOfTypeChecker,
	    element: createElementTypeChecker(),
	    elementType: createElementTypeTypeChecker(),
	    instanceOf: createInstanceTypeChecker,
	    node: createNodeChecker(),
	    objectOf: createObjectOfTypeChecker,
	    oneOf: createEnumTypeChecker,
	    oneOfType: createUnionTypeChecker,
	    shape: createShapeTypeChecker,
	    exact: createStrictShapeTypeChecker,
	  };

	  /**
	   * inlined Object.is polyfill to avoid requiring consumers ship their own
	   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	   */
	  /*eslint-disable no-self-compare*/
	  function is(x, y) {
	    // SameValue algorithm
	    if (x === y) {
	      // Steps 1-5, 7-10
	      // Steps 6.b-6.e: +0 != -0
	      return x !== 0 || 1 / x === 1 / y;
	    } else {
	      // Step 6.a: NaN == NaN
	      return x !== x && y !== y;
	    }
	  }
	  /*eslint-enable no-self-compare*/

	  /**
	   * We use an Error-like object for backward compatibility as people may call
	   * PropTypes directly and inspect their output. However, we don't use real
	   * Errors anymore. We don't inspect their stack anyway, and creating them
	   * is prohibitively expensive if they are created too often, such as what
	   * happens in oneOfType() for any type before the one that matched.
	   */
	  function PropTypeError(message, data) {
	    this.message = message;
	    this.data = data && typeof data === 'object' ? data: {};
	    this.stack = '';
	  }
	  // Make `instanceof Error` still work for returned errors.
	  PropTypeError.prototype = Error.prototype;

	  function createChainableTypeChecker(validate) {
	    if (process.env.NODE_ENV !== 'production') {
	      var manualPropTypeCallCache = {};
	      var manualPropTypeWarningCount = 0;
	    }
	    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
	      componentName = componentName || ANONYMOUS;
	      propFullName = propFullName || propName;

	      if (secret !== ReactPropTypesSecret) {
	        if (throwOnDirectAccess) {
	          // New behavior only for users of `prop-types` package
	          var err = new Error(
	            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	            'Use `PropTypes.checkPropTypes()` to call them. ' +
	            'Read more at http://fb.me/use-check-prop-types'
	          );
	          err.name = 'Invariant Violation';
	          throw err;
	        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
	          // Old behavior for people using React.PropTypes
	          var cacheKey = componentName + ':' + propName;
	          if (
	            !manualPropTypeCallCache[cacheKey] &&
	            // Avoid spamming the console because they are often not actionable except for lib authors
	            manualPropTypeWarningCount < 3
	          ) {
	            printWarning(
	              'You are manually calling a React.PropTypes validation ' +
	              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
	              'and will throw in the standalone `prop-types` package. ' +
	              'You may be seeing this warning due to a third-party PropTypes ' +
	              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
	            );
	            manualPropTypeCallCache[cacheKey] = true;
	            manualPropTypeWarningCount++;
	          }
	        }
	      }
	      if (props[propName] == null) {
	        if (isRequired) {
	          if (props[propName] === null) {
	            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
	          }
	          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
	        }
	        return null;
	      } else {
	        return validate(props, propName, componentName, location, propFullName);
	      }
	    }

	    var chainedCheckType = checkType.bind(null, false);
	    chainedCheckType.isRequired = checkType.bind(null, true);

	    return chainedCheckType;
	  }

	  function createPrimitiveTypeChecker(expectedType) {
	    function validate(props, propName, componentName, location, propFullName, secret) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== expectedType) {
	        // `propValue` being instance of, say, date/regexp, pass the 'object'
	        // check, but we can offer a more precise error message here rather than
	        // 'of type `object`'.
	        var preciseType = getPreciseType(propValue);

	        return new PropTypeError(
	          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
	          {expectedType: expectedType}
	        );
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createAnyTypeChecker() {
	    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
	  }

	  function createArrayOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
	      }
	      var propValue = props[propName];
	      if (!Array.isArray(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
	      }
	      for (var i = 0; i < propValue.length; i++) {
	        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createElementTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!isValidElement(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createElementTypeTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!ReactIs.isValidElementType(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createInstanceTypeChecker(expectedClass) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!(props[propName] instanceof expectedClass)) {
	        var expectedClassName = expectedClass.name || ANONYMOUS;
	        var actualClassName = getClassName(props[propName]);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createEnumTypeChecker(expectedValues) {
	    if (!Array.isArray(expectedValues)) {
	      if (process.env.NODE_ENV !== 'production') {
	        if (arguments.length > 1) {
	          printWarning(
	            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
	            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
	          );
	        } else {
	          printWarning('Invalid argument supplied to oneOf, expected an array.');
	        }
	      }
	      return emptyFunctionThatReturnsNull;
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      for (var i = 0; i < expectedValues.length; i++) {
	        if (is(propValue, expectedValues[i])) {
	          return null;
	        }
	      }

	      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
	        var type = getPreciseType(value);
	        if (type === 'symbol') {
	          return String(value);
	        }
	        return value;
	      });
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createObjectOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
	      }
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
	      }
	      for (var key in propValue) {
	        if (has(propValue, key)) {
	          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	          if (error instanceof Error) {
	            return error;
	          }
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createUnionTypeChecker(arrayOfTypeCheckers) {
	    if (!Array.isArray(arrayOfTypeCheckers)) {
	      process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
	      return emptyFunctionThatReturnsNull;
	    }

	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (typeof checker !== 'function') {
	        printWarning(
	          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
	          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
	        );
	        return emptyFunctionThatReturnsNull;
	      }
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      var expectedTypes = [];
	      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	        var checker = arrayOfTypeCheckers[i];
	        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
	        if (checkerResult == null) {
	          return null;
	        }
	        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
	          expectedTypes.push(checkerResult.data.expectedType);
	        }
	      }
	      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createNodeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!isNode(props[propName])) {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function invalidValidatorError(componentName, location, propFullName, key, type) {
	    return new PropTypeError(
	      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
	      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
	    );
	  }

	  function createShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      for (var key in shapeTypes) {
	        var checker = shapeTypes[key];
	        if (typeof checker !== 'function') {
	          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createStrictShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      // We need to check all keys in case some are required but missing from props.
	      var allKeys = assign({}, props[propName], shapeTypes);
	      for (var key in allKeys) {
	        var checker = shapeTypes[key];
	        if (has(shapeTypes, key) && typeof checker !== 'function') {
	          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
	        }
	        if (!checker) {
	          return new PropTypeError(
	            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
	            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
	            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
	          );
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }

	    return createChainableTypeChecker(validate);
	  }

	  function isNode(propValue) {
	    switch (typeof propValue) {
	      case 'number':
	      case 'string':
	      case 'undefined':
	        return true;
	      case 'boolean':
	        return !propValue;
	      case 'object':
	        if (Array.isArray(propValue)) {
	          return propValue.every(isNode);
	        }
	        if (propValue === null || isValidElement(propValue)) {
	          return true;
	        }

	        var iteratorFn = getIteratorFn(propValue);
	        if (iteratorFn) {
	          var iterator = iteratorFn.call(propValue);
	          var step;
	          if (iteratorFn !== propValue.entries) {
	            while (!(step = iterator.next()).done) {
	              if (!isNode(step.value)) {
	                return false;
	              }
	            }
	          } else {
	            // Iterator will provide entry [k,v] tuples rather than values.
	            while (!(step = iterator.next()).done) {
	              var entry = step.value;
	              if (entry) {
	                if (!isNode(entry[1])) {
	                  return false;
	                }
	              }
	            }
	          }
	        } else {
	          return false;
	        }

	        return true;
	      default:
	        return false;
	    }
	  }

	  function isSymbol(propType, propValue) {
	    // Native Symbol.
	    if (propType === 'symbol') {
	      return true;
	    }

	    // falsy value can't be a Symbol
	    if (!propValue) {
	      return false;
	    }

	    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
	    if (propValue['@@toStringTag'] === 'Symbol') {
	      return true;
	    }

	    // Fallback for non-spec compliant Symbols which are polyfilled.
	    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
	      return true;
	    }

	    return false;
	  }

	  // Equivalent of `typeof` but with special handling for array and regexp.
	  function getPropType(propValue) {
	    var propType = typeof propValue;
	    if (Array.isArray(propValue)) {
	      return 'array';
	    }
	    if (propValue instanceof RegExp) {
	      // Old webkits (at least until Android 4.0) return 'function' rather than
	      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	      // passes PropTypes.object.
	      return 'object';
	    }
	    if (isSymbol(propType, propValue)) {
	      return 'symbol';
	    }
	    return propType;
	  }

	  // This handles more types than `getPropType`. Only used for error messages.
	  // See `createPrimitiveTypeChecker`.
	  function getPreciseType(propValue) {
	    if (typeof propValue === 'undefined' || propValue === null) {
	      return '' + propValue;
	    }
	    var propType = getPropType(propValue);
	    if (propType === 'object') {
	      if (propValue instanceof Date) {
	        return 'date';
	      } else if (propValue instanceof RegExp) {
	        return 'regexp';
	      }
	    }
	    return propType;
	  }

	  // Returns a string that is postfixed to a warning about an invalid type.
	  // For example, "undefined" or "of type array"
	  function getPostfixForTypeWarning(value) {
	    var type = getPreciseType(value);
	    switch (type) {
	      case 'array':
	      case 'object':
	        return 'an ' + type;
	      case 'boolean':
	      case 'date':
	      case 'regexp':
	        return 'a ' + type;
	      default:
	        return type;
	    }
	  }

	  // Returns class name of the object, if any.
	  function getClassName(propValue) {
	    if (!propValue.constructor || !propValue.constructor.name) {
	      return ANONYMOUS;
	    }
	    return propValue.constructor.name;
	  }

	  ReactPropTypes.checkPropTypes = checkPropTypes;
	  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};
	return factoryWithTypeCheckers;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var factoryWithThrowingShims;
var hasRequiredFactoryWithThrowingShims;

function requireFactoryWithThrowingShims () {
	if (hasRequiredFactoryWithThrowingShims) return factoryWithThrowingShims;
	hasRequiredFactoryWithThrowingShims = 1;

	var ReactPropTypesSecret = requireReactPropTypesSecret();

	function emptyFunction() {}
	function emptyFunctionWithReset() {}
	emptyFunctionWithReset.resetWarningCache = emptyFunction;

	factoryWithThrowingShims = function() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === ReactPropTypesSecret) {
	      // It is still safe when called from React.
	      return;
	    }
	    var err = new Error(
	      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	      'Use PropTypes.checkPropTypes() to call them. ' +
	      'Read more at http://fb.me/use-check-prop-types'
	    );
	    err.name = 'Invariant Violation';
	    throw err;
	  }	  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  }	  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
	    array: shim,
	    bigint: shim,
	    bool: shim,
	    func: shim,
	    number: shim,
	    object: shim,
	    string: shim,
	    symbol: shim,

	    any: shim,
	    arrayOf: getShim,
	    element: shim,
	    elementType: shim,
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim,
	    exact: getShim,

	    checkPropTypes: emptyFunctionWithReset,
	    resetWarningCache: emptyFunction
	  };

	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};
	return factoryWithThrowingShims;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var ReactIs = requireReactIs();

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  propTypes.exports = requireFactoryWithTypeCheckers()(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  propTypes.exports = requireFactoryWithThrowingShims()();
}

var propTypesExports = propTypes.exports;
var PropTypes = /*@__PURE__*/getDefaultExportFromCjs(propTypesExports);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const COMMON_MIME_TYPES = new Map([
    // https://github.com/guzzle/psr7/blob/2d9260799e713f1c475d3c5fdc3d6561ff7441b2/src/MimeType.php
    ['1km', 'application/vnd.1000minds.decision-model+xml'],
    ['3dml', 'text/vnd.in3d.3dml'],
    ['3ds', 'image/x-3ds'],
    ['3g2', 'video/3gpp2'],
    ['3gp', 'video/3gp'],
    ['3gpp', 'video/3gpp'],
    ['3mf', 'model/3mf'],
    ['7z', 'application/x-7z-compressed'],
    ['7zip', 'application/x-7z-compressed'],
    ['123', 'application/vnd.lotus-1-2-3'],
    ['aab', 'application/x-authorware-bin'],
    ['aac', 'audio/x-acc'],
    ['aam', 'application/x-authorware-map'],
    ['aas', 'application/x-authorware-seg'],
    ['abw', 'application/x-abiword'],
    ['ac', 'application/vnd.nokia.n-gage.ac+xml'],
    ['ac3', 'audio/ac3'],
    ['acc', 'application/vnd.americandynamics.acc'],
    ['ace', 'application/x-ace-compressed'],
    ['acu', 'application/vnd.acucobol'],
    ['acutc', 'application/vnd.acucorp'],
    ['adp', 'audio/adpcm'],
    ['aep', 'application/vnd.audiograph'],
    ['afm', 'application/x-font-type1'],
    ['afp', 'application/vnd.ibm.modcap'],
    ['ahead', 'application/vnd.ahead.space'],
    ['ai', 'application/pdf'],
    ['aif', 'audio/x-aiff'],
    ['aifc', 'audio/x-aiff'],
    ['aiff', 'audio/x-aiff'],
    ['air', 'application/vnd.adobe.air-application-installer-package+zip'],
    ['ait', 'application/vnd.dvb.ait'],
    ['ami', 'application/vnd.amiga.ami'],
    ['amr', 'audio/amr'],
    ['apk', 'application/vnd.android.package-archive'],
    ['apng', 'image/apng'],
    ['appcache', 'text/cache-manifest'],
    ['application', 'application/x-ms-application'],
    ['apr', 'application/vnd.lotus-approach'],
    ['arc', 'application/x-freearc'],
    ['arj', 'application/x-arj'],
    ['asc', 'application/pgp-signature'],
    ['asf', 'video/x-ms-asf'],
    ['asm', 'text/x-asm'],
    ['aso', 'application/vnd.accpac.simply.aso'],
    ['asx', 'video/x-ms-asf'],
    ['atc', 'application/vnd.acucorp'],
    ['atom', 'application/atom+xml'],
    ['atomcat', 'application/atomcat+xml'],
    ['atomdeleted', 'application/atomdeleted+xml'],
    ['atomsvc', 'application/atomsvc+xml'],
    ['atx', 'application/vnd.antix.game-component'],
    ['au', 'audio/x-au'],
    ['avi', 'video/x-msvideo'],
    ['avif', 'image/avif'],
    ['aw', 'application/applixware'],
    ['azf', 'application/vnd.airzip.filesecure.azf'],
    ['azs', 'application/vnd.airzip.filesecure.azs'],
    ['azv', 'image/vnd.airzip.accelerator.azv'],
    ['azw', 'application/vnd.amazon.ebook'],
    ['b16', 'image/vnd.pco.b16'],
    ['bat', 'application/x-msdownload'],
    ['bcpio', 'application/x-bcpio'],
    ['bdf', 'application/x-font-bdf'],
    ['bdm', 'application/vnd.syncml.dm+wbxml'],
    ['bdoc', 'application/x-bdoc'],
    ['bed', 'application/vnd.realvnc.bed'],
    ['bh2', 'application/vnd.fujitsu.oasysprs'],
    ['bin', 'application/octet-stream'],
    ['blb', 'application/x-blorb'],
    ['blorb', 'application/x-blorb'],
    ['bmi', 'application/vnd.bmi'],
    ['bmml', 'application/vnd.balsamiq.bmml+xml'],
    ['bmp', 'image/bmp'],
    ['book', 'application/vnd.framemaker'],
    ['box', 'application/vnd.previewsystems.box'],
    ['boz', 'application/x-bzip2'],
    ['bpk', 'application/octet-stream'],
    ['bpmn', 'application/octet-stream'],
    ['bsp', 'model/vnd.valve.source.compiled-map'],
    ['btif', 'image/prs.btif'],
    ['buffer', 'application/octet-stream'],
    ['bz', 'application/x-bzip'],
    ['bz2', 'application/x-bzip2'],
    ['c', 'text/x-c'],
    ['c4d', 'application/vnd.clonk.c4group'],
    ['c4f', 'application/vnd.clonk.c4group'],
    ['c4g', 'application/vnd.clonk.c4group'],
    ['c4p', 'application/vnd.clonk.c4group'],
    ['c4u', 'application/vnd.clonk.c4group'],
    ['c11amc', 'application/vnd.cluetrust.cartomobile-config'],
    ['c11amz', 'application/vnd.cluetrust.cartomobile-config-pkg'],
    ['cab', 'application/vnd.ms-cab-compressed'],
    ['caf', 'audio/x-caf'],
    ['cap', 'application/vnd.tcpdump.pcap'],
    ['car', 'application/vnd.curl.car'],
    ['cat', 'application/vnd.ms-pki.seccat'],
    ['cb7', 'application/x-cbr'],
    ['cba', 'application/x-cbr'],
    ['cbr', 'application/x-cbr'],
    ['cbt', 'application/x-cbr'],
    ['cbz', 'application/x-cbr'],
    ['cc', 'text/x-c'],
    ['cco', 'application/x-cocoa'],
    ['cct', 'application/x-director'],
    ['ccxml', 'application/ccxml+xml'],
    ['cdbcmsg', 'application/vnd.contact.cmsg'],
    ['cda', 'application/x-cdf'],
    ['cdf', 'application/x-netcdf'],
    ['cdfx', 'application/cdfx+xml'],
    ['cdkey', 'application/vnd.mediastation.cdkey'],
    ['cdmia', 'application/cdmi-capability'],
    ['cdmic', 'application/cdmi-container'],
    ['cdmid', 'application/cdmi-domain'],
    ['cdmio', 'application/cdmi-object'],
    ['cdmiq', 'application/cdmi-queue'],
    ['cdr', 'application/cdr'],
    ['cdx', 'chemical/x-cdx'],
    ['cdxml', 'application/vnd.chemdraw+xml'],
    ['cdy', 'application/vnd.cinderella'],
    ['cer', 'application/pkix-cert'],
    ['cfs', 'application/x-cfs-compressed'],
    ['cgm', 'image/cgm'],
    ['chat', 'application/x-chat'],
    ['chm', 'application/vnd.ms-htmlhelp'],
    ['chrt', 'application/vnd.kde.kchart'],
    ['cif', 'chemical/x-cif'],
    ['cii', 'application/vnd.anser-web-certificate-issue-initiation'],
    ['cil', 'application/vnd.ms-artgalry'],
    ['cjs', 'application/node'],
    ['cla', 'application/vnd.claymore'],
    ['class', 'application/octet-stream'],
    ['clkk', 'application/vnd.crick.clicker.keyboard'],
    ['clkp', 'application/vnd.crick.clicker.palette'],
    ['clkt', 'application/vnd.crick.clicker.template'],
    ['clkw', 'application/vnd.crick.clicker.wordbank'],
    ['clkx', 'application/vnd.crick.clicker'],
    ['clp', 'application/x-msclip'],
    ['cmc', 'application/vnd.cosmocaller'],
    ['cmdf', 'chemical/x-cmdf'],
    ['cml', 'chemical/x-cml'],
    ['cmp', 'application/vnd.yellowriver-custom-menu'],
    ['cmx', 'image/x-cmx'],
    ['cod', 'application/vnd.rim.cod'],
    ['coffee', 'text/coffeescript'],
    ['com', 'application/x-msdownload'],
    ['conf', 'text/plain'],
    ['cpio', 'application/x-cpio'],
    ['cpp', 'text/x-c'],
    ['cpt', 'application/mac-compactpro'],
    ['crd', 'application/x-mscardfile'],
    ['crl', 'application/pkix-crl'],
    ['crt', 'application/x-x509-ca-cert'],
    ['crx', 'application/x-chrome-extension'],
    ['cryptonote', 'application/vnd.rig.cryptonote'],
    ['csh', 'application/x-csh'],
    ['csl', 'application/vnd.citationstyles.style+xml'],
    ['csml', 'chemical/x-csml'],
    ['csp', 'application/vnd.commonspace'],
    ['csr', 'application/octet-stream'],
    ['css', 'text/css'],
    ['cst', 'application/x-director'],
    ['csv', 'text/csv'],
    ['cu', 'application/cu-seeme'],
    ['curl', 'text/vnd.curl'],
    ['cww', 'application/prs.cww'],
    ['cxt', 'application/x-director'],
    ['cxx', 'text/x-c'],
    ['dae', 'model/vnd.collada+xml'],
    ['daf', 'application/vnd.mobius.daf'],
    ['dart', 'application/vnd.dart'],
    ['dataless', 'application/vnd.fdsn.seed'],
    ['davmount', 'application/davmount+xml'],
    ['dbf', 'application/vnd.dbf'],
    ['dbk', 'application/docbook+xml'],
    ['dcr', 'application/x-director'],
    ['dcurl', 'text/vnd.curl.dcurl'],
    ['dd2', 'application/vnd.oma.dd2+xml'],
    ['ddd', 'application/vnd.fujixerox.ddd'],
    ['ddf', 'application/vnd.syncml.dmddf+xml'],
    ['dds', 'image/vnd.ms-dds'],
    ['deb', 'application/x-debian-package'],
    ['def', 'text/plain'],
    ['deploy', 'application/octet-stream'],
    ['der', 'application/x-x509-ca-cert'],
    ['dfac', 'application/vnd.dreamfactory'],
    ['dgc', 'application/x-dgc-compressed'],
    ['dic', 'text/x-c'],
    ['dir', 'application/x-director'],
    ['dis', 'application/vnd.mobius.dis'],
    ['disposition-notification', 'message/disposition-notification'],
    ['dist', 'application/octet-stream'],
    ['distz', 'application/octet-stream'],
    ['djv', 'image/vnd.djvu'],
    ['djvu', 'image/vnd.djvu'],
    ['dll', 'application/octet-stream'],
    ['dmg', 'application/x-apple-diskimage'],
    ['dmn', 'application/octet-stream'],
    ['dmp', 'application/vnd.tcpdump.pcap'],
    ['dms', 'application/octet-stream'],
    ['dna', 'application/vnd.dna'],
    ['doc', 'application/msword'],
    ['docm', 'application/vnd.ms-word.template.macroEnabled.12'],
    ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['dot', 'application/msword'],
    ['dotm', 'application/vnd.ms-word.template.macroEnabled.12'],
    ['dotx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.template'],
    ['dp', 'application/vnd.osgi.dp'],
    ['dpg', 'application/vnd.dpgraph'],
    ['dra', 'audio/vnd.dra'],
    ['drle', 'image/dicom-rle'],
    ['dsc', 'text/prs.lines.tag'],
    ['dssc', 'application/dssc+der'],
    ['dtb', 'application/x-dtbook+xml'],
    ['dtd', 'application/xml-dtd'],
    ['dts', 'audio/vnd.dts'],
    ['dtshd', 'audio/vnd.dts.hd'],
    ['dump', 'application/octet-stream'],
    ['dvb', 'video/vnd.dvb.file'],
    ['dvi', 'application/x-dvi'],
    ['dwd', 'application/atsc-dwd+xml'],
    ['dwf', 'model/vnd.dwf'],
    ['dwg', 'image/vnd.dwg'],
    ['dxf', 'image/vnd.dxf'],
    ['dxp', 'application/vnd.spotfire.dxp'],
    ['dxr', 'application/x-director'],
    ['ear', 'application/java-archive'],
    ['ecelp4800', 'audio/vnd.nuera.ecelp4800'],
    ['ecelp7470', 'audio/vnd.nuera.ecelp7470'],
    ['ecelp9600', 'audio/vnd.nuera.ecelp9600'],
    ['ecma', 'application/ecmascript'],
    ['edm', 'application/vnd.novadigm.edm'],
    ['edx', 'application/vnd.novadigm.edx'],
    ['efif', 'application/vnd.picsel'],
    ['ei6', 'application/vnd.pg.osasli'],
    ['elc', 'application/octet-stream'],
    ['emf', 'image/emf'],
    ['eml', 'message/rfc822'],
    ['emma', 'application/emma+xml'],
    ['emotionml', 'application/emotionml+xml'],
    ['emz', 'application/x-msmetafile'],
    ['eol', 'audio/vnd.digital-winds'],
    ['eot', 'application/vnd.ms-fontobject'],
    ['eps', 'application/postscript'],
    ['epub', 'application/epub+zip'],
    ['es', 'application/ecmascript'],
    ['es3', 'application/vnd.eszigno3+xml'],
    ['esa', 'application/vnd.osgi.subsystem'],
    ['esf', 'application/vnd.epson.esf'],
    ['et3', 'application/vnd.eszigno3+xml'],
    ['etx', 'text/x-setext'],
    ['eva', 'application/x-eva'],
    ['evy', 'application/x-envoy'],
    ['exe', 'application/octet-stream'],
    ['exi', 'application/exi'],
    ['exp', 'application/express'],
    ['exr', 'image/aces'],
    ['ext', 'application/vnd.novadigm.ext'],
    ['ez', 'application/andrew-inset'],
    ['ez2', 'application/vnd.ezpix-album'],
    ['ez3', 'application/vnd.ezpix-package'],
    ['f', 'text/x-fortran'],
    ['f4v', 'video/mp4'],
    ['f77', 'text/x-fortran'],
    ['f90', 'text/x-fortran'],
    ['fbs', 'image/vnd.fastbidsheet'],
    ['fcdt', 'application/vnd.adobe.formscentral.fcdt'],
    ['fcs', 'application/vnd.isac.fcs'],
    ['fdf', 'application/vnd.fdf'],
    ['fdt', 'application/fdt+xml'],
    ['fe_launch', 'application/vnd.denovo.fcselayout-link'],
    ['fg5', 'application/vnd.fujitsu.oasysgp'],
    ['fgd', 'application/x-director'],
    ['fh', 'image/x-freehand'],
    ['fh4', 'image/x-freehand'],
    ['fh5', 'image/x-freehand'],
    ['fh7', 'image/x-freehand'],
    ['fhc', 'image/x-freehand'],
    ['fig', 'application/x-xfig'],
    ['fits', 'image/fits'],
    ['flac', 'audio/x-flac'],
    ['fli', 'video/x-fli'],
    ['flo', 'application/vnd.micrografx.flo'],
    ['flv', 'video/x-flv'],
    ['flw', 'application/vnd.kde.kivio'],
    ['flx', 'text/vnd.fmi.flexstor'],
    ['fly', 'text/vnd.fly'],
    ['fm', 'application/vnd.framemaker'],
    ['fnc', 'application/vnd.frogans.fnc'],
    ['fo', 'application/vnd.software602.filler.form+xml'],
    ['for', 'text/x-fortran'],
    ['fpx', 'image/vnd.fpx'],
    ['frame', 'application/vnd.framemaker'],
    ['fsc', 'application/vnd.fsc.weblaunch'],
    ['fst', 'image/vnd.fst'],
    ['ftc', 'application/vnd.fluxtime.clip'],
    ['fti', 'application/vnd.anser-web-funds-transfer-initiation'],
    ['fvt', 'video/vnd.fvt'],
    ['fxp', 'application/vnd.adobe.fxp'],
    ['fxpl', 'application/vnd.adobe.fxp'],
    ['fzs', 'application/vnd.fuzzysheet'],
    ['g2w', 'application/vnd.geoplan'],
    ['g3', 'image/g3fax'],
    ['g3w', 'application/vnd.geospace'],
    ['gac', 'application/vnd.groove-account'],
    ['gam', 'application/x-tads'],
    ['gbr', 'application/rpki-ghostbusters'],
    ['gca', 'application/x-gca-compressed'],
    ['gdl', 'model/vnd.gdl'],
    ['gdoc', 'application/vnd.google-apps.document'],
    ['geo', 'application/vnd.dynageo'],
    ['geojson', 'application/geo+json'],
    ['gex', 'application/vnd.geometry-explorer'],
    ['ggb', 'application/vnd.geogebra.file'],
    ['ggt', 'application/vnd.geogebra.tool'],
    ['ghf', 'application/vnd.groove-help'],
    ['gif', 'image/gif'],
    ['gim', 'application/vnd.groove-identity-message'],
    ['glb', 'model/gltf-binary'],
    ['gltf', 'model/gltf+json'],
    ['gml', 'application/gml+xml'],
    ['gmx', 'application/vnd.gmx'],
    ['gnumeric', 'application/x-gnumeric'],
    ['gpg', 'application/gpg-keys'],
    ['gph', 'application/vnd.flographit'],
    ['gpx', 'application/gpx+xml'],
    ['gqf', 'application/vnd.grafeq'],
    ['gqs', 'application/vnd.grafeq'],
    ['gram', 'application/srgs'],
    ['gramps', 'application/x-gramps-xml'],
    ['gre', 'application/vnd.geometry-explorer'],
    ['grv', 'application/vnd.groove-injector'],
    ['grxml', 'application/srgs+xml'],
    ['gsf', 'application/x-font-ghostscript'],
    ['gsheet', 'application/vnd.google-apps.spreadsheet'],
    ['gslides', 'application/vnd.google-apps.presentation'],
    ['gtar', 'application/x-gtar'],
    ['gtm', 'application/vnd.groove-tool-message'],
    ['gtw', 'model/vnd.gtw'],
    ['gv', 'text/vnd.graphviz'],
    ['gxf', 'application/gxf'],
    ['gxt', 'application/vnd.geonext'],
    ['gz', 'application/gzip'],
    ['gzip', 'application/gzip'],
    ['h', 'text/x-c'],
    ['h261', 'video/h261'],
    ['h263', 'video/h263'],
    ['h264', 'video/h264'],
    ['hal', 'application/vnd.hal+xml'],
    ['hbci', 'application/vnd.hbci'],
    ['hbs', 'text/x-handlebars-template'],
    ['hdd', 'application/x-virtualbox-hdd'],
    ['hdf', 'application/x-hdf'],
    ['heic', 'image/heic'],
    ['heics', 'image/heic-sequence'],
    ['heif', 'image/heif'],
    ['heifs', 'image/heif-sequence'],
    ['hej2', 'image/hej2k'],
    ['held', 'application/atsc-held+xml'],
    ['hh', 'text/x-c'],
    ['hjson', 'application/hjson'],
    ['hlp', 'application/winhlp'],
    ['hpgl', 'application/vnd.hp-hpgl'],
    ['hpid', 'application/vnd.hp-hpid'],
    ['hps', 'application/vnd.hp-hps'],
    ['hqx', 'application/mac-binhex40'],
    ['hsj2', 'image/hsj2'],
    ['htc', 'text/x-component'],
    ['htke', 'application/vnd.kenameaapp'],
    ['htm', 'text/html'],
    ['html', 'text/html'],
    ['hvd', 'application/vnd.yamaha.hv-dic'],
    ['hvp', 'application/vnd.yamaha.hv-voice'],
    ['hvs', 'application/vnd.yamaha.hv-script'],
    ['i2g', 'application/vnd.intergeo'],
    ['icc', 'application/vnd.iccprofile'],
    ['ice', 'x-conference/x-cooltalk'],
    ['icm', 'application/vnd.iccprofile'],
    ['ico', 'image/x-icon'],
    ['ics', 'text/calendar'],
    ['ief', 'image/ief'],
    ['ifb', 'text/calendar'],
    ['ifm', 'application/vnd.shana.informed.formdata'],
    ['iges', 'model/iges'],
    ['igl', 'application/vnd.igloader'],
    ['igm', 'application/vnd.insors.igm'],
    ['igs', 'model/iges'],
    ['igx', 'application/vnd.micrografx.igx'],
    ['iif', 'application/vnd.shana.informed.interchange'],
    ['img', 'application/octet-stream'],
    ['imp', 'application/vnd.accpac.simply.imp'],
    ['ims', 'application/vnd.ms-ims'],
    ['in', 'text/plain'],
    ['ini', 'text/plain'],
    ['ink', 'application/inkml+xml'],
    ['inkml', 'application/inkml+xml'],
    ['install', 'application/x-install-instructions'],
    ['iota', 'application/vnd.astraea-software.iota'],
    ['ipfix', 'application/ipfix'],
    ['ipk', 'application/vnd.shana.informed.package'],
    ['irm', 'application/vnd.ibm.rights-management'],
    ['irp', 'application/vnd.irepository.package+xml'],
    ['iso', 'application/x-iso9660-image'],
    ['itp', 'application/vnd.shana.informed.formtemplate'],
    ['its', 'application/its+xml'],
    ['ivp', 'application/vnd.immervision-ivp'],
    ['ivu', 'application/vnd.immervision-ivu'],
    ['jad', 'text/vnd.sun.j2me.app-descriptor'],
    ['jade', 'text/jade'],
    ['jam', 'application/vnd.jam'],
    ['jar', 'application/java-archive'],
    ['jardiff', 'application/x-java-archive-diff'],
    ['java', 'text/x-java-source'],
    ['jhc', 'image/jphc'],
    ['jisp', 'application/vnd.jisp'],
    ['jls', 'image/jls'],
    ['jlt', 'application/vnd.hp-jlyt'],
    ['jng', 'image/x-jng'],
    ['jnlp', 'application/x-java-jnlp-file'],
    ['joda', 'application/vnd.joost.joda-archive'],
    ['jp2', 'image/jp2'],
    ['jpe', 'image/jpeg'],
    ['jpeg', 'image/jpeg'],
    ['jpf', 'image/jpx'],
    ['jpg', 'image/jpeg'],
    ['jpg2', 'image/jp2'],
    ['jpgm', 'video/jpm'],
    ['jpgv', 'video/jpeg'],
    ['jph', 'image/jph'],
    ['jpm', 'video/jpm'],
    ['jpx', 'image/jpx'],
    ['js', 'application/javascript'],
    ['json', 'application/json'],
    ['json5', 'application/json5'],
    ['jsonld', 'application/ld+json'],
    // https://jsonlines.org/
    ['jsonl', 'application/jsonl'],
    ['jsonml', 'application/jsonml+json'],
    ['jsx', 'text/jsx'],
    ['jxr', 'image/jxr'],
    ['jxra', 'image/jxra'],
    ['jxrs', 'image/jxrs'],
    ['jxs', 'image/jxs'],
    ['jxsc', 'image/jxsc'],
    ['jxsi', 'image/jxsi'],
    ['jxss', 'image/jxss'],
    ['kar', 'audio/midi'],
    ['karbon', 'application/vnd.kde.karbon'],
    ['kdb', 'application/octet-stream'],
    ['kdbx', 'application/x-keepass2'],
    ['key', 'application/x-iwork-keynote-sffkey'],
    ['kfo', 'application/vnd.kde.kformula'],
    ['kia', 'application/vnd.kidspiration'],
    ['kml', 'application/vnd.google-earth.kml+xml'],
    ['kmz', 'application/vnd.google-earth.kmz'],
    ['kne', 'application/vnd.kinar'],
    ['knp', 'application/vnd.kinar'],
    ['kon', 'application/vnd.kde.kontour'],
    ['kpr', 'application/vnd.kde.kpresenter'],
    ['kpt', 'application/vnd.kde.kpresenter'],
    ['kpxx', 'application/vnd.ds-keypoint'],
    ['ksp', 'application/vnd.kde.kspread'],
    ['ktr', 'application/vnd.kahootz'],
    ['ktx', 'image/ktx'],
    ['ktx2', 'image/ktx2'],
    ['ktz', 'application/vnd.kahootz'],
    ['kwd', 'application/vnd.kde.kword'],
    ['kwt', 'application/vnd.kde.kword'],
    ['lasxml', 'application/vnd.las.las+xml'],
    ['latex', 'application/x-latex'],
    ['lbd', 'application/vnd.llamagraphics.life-balance.desktop'],
    ['lbe', 'application/vnd.llamagraphics.life-balance.exchange+xml'],
    ['les', 'application/vnd.hhe.lesson-player'],
    ['less', 'text/less'],
    ['lgr', 'application/lgr+xml'],
    ['lha', 'application/octet-stream'],
    ['link66', 'application/vnd.route66.link66+xml'],
    ['list', 'text/plain'],
    ['list3820', 'application/vnd.ibm.modcap'],
    ['listafp', 'application/vnd.ibm.modcap'],
    ['litcoffee', 'text/coffeescript'],
    ['lnk', 'application/x-ms-shortcut'],
    ['log', 'text/plain'],
    ['lostxml', 'application/lost+xml'],
    ['lrf', 'application/octet-stream'],
    ['lrm', 'application/vnd.ms-lrm'],
    ['ltf', 'application/vnd.frogans.ltf'],
    ['lua', 'text/x-lua'],
    ['luac', 'application/x-lua-bytecode'],
    ['lvp', 'audio/vnd.lucent.voice'],
    ['lwp', 'application/vnd.lotus-wordpro'],
    ['lzh', 'application/octet-stream'],
    ['m1v', 'video/mpeg'],
    ['m2a', 'audio/mpeg'],
    ['m2v', 'video/mpeg'],
    ['m3a', 'audio/mpeg'],
    ['m3u', 'text/plain'],
    ['m3u8', 'application/vnd.apple.mpegurl'],
    ['m4a', 'audio/x-m4a'],
    ['m4p', 'application/mp4'],
    ['m4s', 'video/iso.segment'],
    ['m4u', 'application/vnd.mpegurl'],
    ['m4v', 'video/x-m4v'],
    ['m13', 'application/x-msmediaview'],
    ['m14', 'application/x-msmediaview'],
    ['m21', 'application/mp21'],
    ['ma', 'application/mathematica'],
    ['mads', 'application/mads+xml'],
    ['maei', 'application/mmt-aei+xml'],
    ['mag', 'application/vnd.ecowin.chart'],
    ['maker', 'application/vnd.framemaker'],
    ['man', 'text/troff'],
    ['manifest', 'text/cache-manifest'],
    ['map', 'application/json'],
    ['mar', 'application/octet-stream'],
    ['markdown', 'text/markdown'],
    ['mathml', 'application/mathml+xml'],
    ['mb', 'application/mathematica'],
    ['mbk', 'application/vnd.mobius.mbk'],
    ['mbox', 'application/mbox'],
    ['mc1', 'application/vnd.medcalcdata'],
    ['mcd', 'application/vnd.mcd'],
    ['mcurl', 'text/vnd.curl.mcurl'],
    ['md', 'text/markdown'],
    ['mdb', 'application/x-msaccess'],
    ['mdi', 'image/vnd.ms-modi'],
    ['mdx', 'text/mdx'],
    ['me', 'text/troff'],
    ['mesh', 'model/mesh'],
    ['meta4', 'application/metalink4+xml'],
    ['metalink', 'application/metalink+xml'],
    ['mets', 'application/mets+xml'],
    ['mfm', 'application/vnd.mfmp'],
    ['mft', 'application/rpki-manifest'],
    ['mgp', 'application/vnd.osgeo.mapguide.package'],
    ['mgz', 'application/vnd.proteus.magazine'],
    ['mid', 'audio/midi'],
    ['midi', 'audio/midi'],
    ['mie', 'application/x-mie'],
    ['mif', 'application/vnd.mif'],
    ['mime', 'message/rfc822'],
    ['mj2', 'video/mj2'],
    ['mjp2', 'video/mj2'],
    ['mjs', 'application/javascript'],
    ['mk3d', 'video/x-matroska'],
    ['mka', 'audio/x-matroska'],
    ['mkd', 'text/x-markdown'],
    ['mks', 'video/x-matroska'],
    ['mkv', 'video/x-matroska'],
    ['mlp', 'application/vnd.dolby.mlp'],
    ['mmd', 'application/vnd.chipnuts.karaoke-mmd'],
    ['mmf', 'application/vnd.smaf'],
    ['mml', 'text/mathml'],
    ['mmr', 'image/vnd.fujixerox.edmics-mmr'],
    ['mng', 'video/x-mng'],
    ['mny', 'application/x-msmoney'],
    ['mobi', 'application/x-mobipocket-ebook'],
    ['mods', 'application/mods+xml'],
    ['mov', 'video/quicktime'],
    ['movie', 'video/x-sgi-movie'],
    ['mp2', 'audio/mpeg'],
    ['mp2a', 'audio/mpeg'],
    ['mp3', 'audio/mpeg'],
    ['mp4', 'video/mp4'],
    ['mp4a', 'audio/mp4'],
    ['mp4s', 'application/mp4'],
    ['mp4v', 'video/mp4'],
    ['mp21', 'application/mp21'],
    ['mpc', 'application/vnd.mophun.certificate'],
    ['mpd', 'application/dash+xml'],
    ['mpe', 'video/mpeg'],
    ['mpeg', 'video/mpeg'],
    ['mpg', 'video/mpeg'],
    ['mpg4', 'video/mp4'],
    ['mpga', 'audio/mpeg'],
    ['mpkg', 'application/vnd.apple.installer+xml'],
    ['mpm', 'application/vnd.blueice.multipass'],
    ['mpn', 'application/vnd.mophun.application'],
    ['mpp', 'application/vnd.ms-project'],
    ['mpt', 'application/vnd.ms-project'],
    ['mpy', 'application/vnd.ibm.minipay'],
    ['mqy', 'application/vnd.mobius.mqy'],
    ['mrc', 'application/marc'],
    ['mrcx', 'application/marcxml+xml'],
    ['ms', 'text/troff'],
    ['mscml', 'application/mediaservercontrol+xml'],
    ['mseed', 'application/vnd.fdsn.mseed'],
    ['mseq', 'application/vnd.mseq'],
    ['msf', 'application/vnd.epson.msf'],
    ['msg', 'application/vnd.ms-outlook'],
    ['msh', 'model/mesh'],
    ['msi', 'application/x-msdownload'],
    ['msl', 'application/vnd.mobius.msl'],
    ['msm', 'application/octet-stream'],
    ['msp', 'application/octet-stream'],
    ['msty', 'application/vnd.muvee.style'],
    ['mtl', 'model/mtl'],
    ['mts', 'model/vnd.mts'],
    ['mus', 'application/vnd.musician'],
    ['musd', 'application/mmt-usd+xml'],
    ['musicxml', 'application/vnd.recordare.musicxml+xml'],
    ['mvb', 'application/x-msmediaview'],
    ['mvt', 'application/vnd.mapbox-vector-tile'],
    ['mwf', 'application/vnd.mfer'],
    ['mxf', 'application/mxf'],
    ['mxl', 'application/vnd.recordare.musicxml'],
    ['mxmf', 'audio/mobile-xmf'],
    ['mxml', 'application/xv+xml'],
    ['mxs', 'application/vnd.triscape.mxs'],
    ['mxu', 'video/vnd.mpegurl'],
    ['n-gage', 'application/vnd.nokia.n-gage.symbian.install'],
    ['n3', 'text/n3'],
    ['nb', 'application/mathematica'],
    ['nbp', 'application/vnd.wolfram.player'],
    ['nc', 'application/x-netcdf'],
    ['ncx', 'application/x-dtbncx+xml'],
    ['nfo', 'text/x-nfo'],
    ['ngdat', 'application/vnd.nokia.n-gage.data'],
    ['nitf', 'application/vnd.nitf'],
    ['nlu', 'application/vnd.neurolanguage.nlu'],
    ['nml', 'application/vnd.enliven'],
    ['nnd', 'application/vnd.noblenet-directory'],
    ['nns', 'application/vnd.noblenet-sealer'],
    ['nnw', 'application/vnd.noblenet-web'],
    ['npx', 'image/vnd.net-fpx'],
    ['nq', 'application/n-quads'],
    ['nsc', 'application/x-conference'],
    ['nsf', 'application/vnd.lotus-notes'],
    ['nt', 'application/n-triples'],
    ['ntf', 'application/vnd.nitf'],
    ['numbers', 'application/x-iwork-numbers-sffnumbers'],
    ['nzb', 'application/x-nzb'],
    ['oa2', 'application/vnd.fujitsu.oasys2'],
    ['oa3', 'application/vnd.fujitsu.oasys3'],
    ['oas', 'application/vnd.fujitsu.oasys'],
    ['obd', 'application/x-msbinder'],
    ['obgx', 'application/vnd.openblox.game+xml'],
    ['obj', 'model/obj'],
    ['oda', 'application/oda'],
    ['odb', 'application/vnd.oasis.opendocument.database'],
    ['odc', 'application/vnd.oasis.opendocument.chart'],
    ['odf', 'application/vnd.oasis.opendocument.formula'],
    ['odft', 'application/vnd.oasis.opendocument.formula-template'],
    ['odg', 'application/vnd.oasis.opendocument.graphics'],
    ['odi', 'application/vnd.oasis.opendocument.image'],
    ['odm', 'application/vnd.oasis.opendocument.text-master'],
    ['odp', 'application/vnd.oasis.opendocument.presentation'],
    ['ods', 'application/vnd.oasis.opendocument.spreadsheet'],
    ['odt', 'application/vnd.oasis.opendocument.text'],
    ['oga', 'audio/ogg'],
    ['ogex', 'model/vnd.opengex'],
    ['ogg', 'audio/ogg'],
    ['ogv', 'video/ogg'],
    ['ogx', 'application/ogg'],
    ['omdoc', 'application/omdoc+xml'],
    ['onepkg', 'application/onenote'],
    ['onetmp', 'application/onenote'],
    ['onetoc', 'application/onenote'],
    ['onetoc2', 'application/onenote'],
    ['opf', 'application/oebps-package+xml'],
    ['opml', 'text/x-opml'],
    ['oprc', 'application/vnd.palm'],
    ['opus', 'audio/ogg'],
    ['org', 'text/x-org'],
    ['osf', 'application/vnd.yamaha.openscoreformat'],
    ['osfpvg', 'application/vnd.yamaha.openscoreformat.osfpvg+xml'],
    ['osm', 'application/vnd.openstreetmap.data+xml'],
    ['otc', 'application/vnd.oasis.opendocument.chart-template'],
    ['otf', 'font/otf'],
    ['otg', 'application/vnd.oasis.opendocument.graphics-template'],
    ['oth', 'application/vnd.oasis.opendocument.text-web'],
    ['oti', 'application/vnd.oasis.opendocument.image-template'],
    ['otp', 'application/vnd.oasis.opendocument.presentation-template'],
    ['ots', 'application/vnd.oasis.opendocument.spreadsheet-template'],
    ['ott', 'application/vnd.oasis.opendocument.text-template'],
    ['ova', 'application/x-virtualbox-ova'],
    ['ovf', 'application/x-virtualbox-ovf'],
    ['owl', 'application/rdf+xml'],
    ['oxps', 'application/oxps'],
    ['oxt', 'application/vnd.openofficeorg.extension'],
    ['p', 'text/x-pascal'],
    ['p7a', 'application/x-pkcs7-signature'],
    ['p7b', 'application/x-pkcs7-certificates'],
    ['p7c', 'application/pkcs7-mime'],
    ['p7m', 'application/pkcs7-mime'],
    ['p7r', 'application/x-pkcs7-certreqresp'],
    ['p7s', 'application/pkcs7-signature'],
    ['p8', 'application/pkcs8'],
    ['p10', 'application/x-pkcs10'],
    ['p12', 'application/x-pkcs12'],
    ['pac', 'application/x-ns-proxy-autoconfig'],
    ['pages', 'application/x-iwork-pages-sffpages'],
    ['pas', 'text/x-pascal'],
    ['paw', 'application/vnd.pawaafile'],
    ['pbd', 'application/vnd.powerbuilder6'],
    ['pbm', 'image/x-portable-bitmap'],
    ['pcap', 'application/vnd.tcpdump.pcap'],
    ['pcf', 'application/x-font-pcf'],
    ['pcl', 'application/vnd.hp-pcl'],
    ['pclxl', 'application/vnd.hp-pclxl'],
    ['pct', 'image/x-pict'],
    ['pcurl', 'application/vnd.curl.pcurl'],
    ['pcx', 'image/x-pcx'],
    ['pdb', 'application/x-pilot'],
    ['pde', 'text/x-processing'],
    ['pdf', 'application/pdf'],
    ['pem', 'application/x-x509-user-cert'],
    ['pfa', 'application/x-font-type1'],
    ['pfb', 'application/x-font-type1'],
    ['pfm', 'application/x-font-type1'],
    ['pfr', 'application/font-tdpfr'],
    ['pfx', 'application/x-pkcs12'],
    ['pgm', 'image/x-portable-graymap'],
    ['pgn', 'application/x-chess-pgn'],
    ['pgp', 'application/pgp'],
    ['php', 'application/x-httpd-php'],
    ['php3', 'application/x-httpd-php'],
    ['php4', 'application/x-httpd-php'],
    ['phps', 'application/x-httpd-php-source'],
    ['phtml', 'application/x-httpd-php'],
    ['pic', 'image/x-pict'],
    ['pkg', 'application/octet-stream'],
    ['pki', 'application/pkixcmp'],
    ['pkipath', 'application/pkix-pkipath'],
    ['pkpass', 'application/vnd.apple.pkpass'],
    ['pl', 'application/x-perl'],
    ['plb', 'application/vnd.3gpp.pic-bw-large'],
    ['plc', 'application/vnd.mobius.plc'],
    ['plf', 'application/vnd.pocketlearn'],
    ['pls', 'application/pls+xml'],
    ['pm', 'application/x-perl'],
    ['pml', 'application/vnd.ctc-posml'],
    ['png', 'image/png'],
    ['pnm', 'image/x-portable-anymap'],
    ['portpkg', 'application/vnd.macports.portpkg'],
    ['pot', 'application/vnd.ms-powerpoint'],
    ['potm', 'application/vnd.ms-powerpoint.presentation.macroEnabled.12'],
    ['potx', 'application/vnd.openxmlformats-officedocument.presentationml.template'],
    ['ppa', 'application/vnd.ms-powerpoint'],
    ['ppam', 'application/vnd.ms-powerpoint.addin.macroEnabled.12'],
    ['ppd', 'application/vnd.cups-ppd'],
    ['ppm', 'image/x-portable-pixmap'],
    ['pps', 'application/vnd.ms-powerpoint'],
    ['ppsm', 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'],
    ['ppsx', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'],
    ['ppt', 'application/powerpoint'],
    ['pptm', 'application/vnd.ms-powerpoint.presentation.macroEnabled.12'],
    ['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    ['pqa', 'application/vnd.palm'],
    ['prc', 'application/x-pilot'],
    ['pre', 'application/vnd.lotus-freelance'],
    ['prf', 'application/pics-rules'],
    ['provx', 'application/provenance+xml'],
    ['ps', 'application/postscript'],
    ['psb', 'application/vnd.3gpp.pic-bw-small'],
    ['psd', 'application/x-photoshop'],
    ['psf', 'application/x-font-linux-psf'],
    ['pskcxml', 'application/pskc+xml'],
    ['pti', 'image/prs.pti'],
    ['ptid', 'application/vnd.pvi.ptid1'],
    ['pub', 'application/x-mspublisher'],
    ['pvb', 'application/vnd.3gpp.pic-bw-var'],
    ['pwn', 'application/vnd.3m.post-it-notes'],
    ['pya', 'audio/vnd.ms-playready.media.pya'],
    ['pyv', 'video/vnd.ms-playready.media.pyv'],
    ['qam', 'application/vnd.epson.quickanime'],
    ['qbo', 'application/vnd.intu.qbo'],
    ['qfx', 'application/vnd.intu.qfx'],
    ['qps', 'application/vnd.publishare-delta-tree'],
    ['qt', 'video/quicktime'],
    ['qwd', 'application/vnd.quark.quarkxpress'],
    ['qwt', 'application/vnd.quark.quarkxpress'],
    ['qxb', 'application/vnd.quark.quarkxpress'],
    ['qxd', 'application/vnd.quark.quarkxpress'],
    ['qxl', 'application/vnd.quark.quarkxpress'],
    ['qxt', 'application/vnd.quark.quarkxpress'],
    ['ra', 'audio/x-realaudio'],
    ['ram', 'audio/x-pn-realaudio'],
    ['raml', 'application/raml+yaml'],
    ['rapd', 'application/route-apd+xml'],
    ['rar', 'application/x-rar'],
    ['ras', 'image/x-cmu-raster'],
    ['rcprofile', 'application/vnd.ipunplugged.rcprofile'],
    ['rdf', 'application/rdf+xml'],
    ['rdz', 'application/vnd.data-vision.rdz'],
    ['relo', 'application/p2p-overlay+xml'],
    ['rep', 'application/vnd.businessobjects'],
    ['res', 'application/x-dtbresource+xml'],
    ['rgb', 'image/x-rgb'],
    ['rif', 'application/reginfo+xml'],
    ['rip', 'audio/vnd.rip'],
    ['ris', 'application/x-research-info-systems'],
    ['rl', 'application/resource-lists+xml'],
    ['rlc', 'image/vnd.fujixerox.edmics-rlc'],
    ['rld', 'application/resource-lists-diff+xml'],
    ['rm', 'audio/x-pn-realaudio'],
    ['rmi', 'audio/midi'],
    ['rmp', 'audio/x-pn-realaudio-plugin'],
    ['rms', 'application/vnd.jcp.javame.midlet-rms'],
    ['rmvb', 'application/vnd.rn-realmedia-vbr'],
    ['rnc', 'application/relax-ng-compact-syntax'],
    ['rng', 'application/xml'],
    ['roa', 'application/rpki-roa'],
    ['roff', 'text/troff'],
    ['rp9', 'application/vnd.cloanto.rp9'],
    ['rpm', 'audio/x-pn-realaudio-plugin'],
    ['rpss', 'application/vnd.nokia.radio-presets'],
    ['rpst', 'application/vnd.nokia.radio-preset'],
    ['rq', 'application/sparql-query'],
    ['rs', 'application/rls-services+xml'],
    ['rsa', 'application/x-pkcs7'],
    ['rsat', 'application/atsc-rsat+xml'],
    ['rsd', 'application/rsd+xml'],
    ['rsheet', 'application/urc-ressheet+xml'],
    ['rss', 'application/rss+xml'],
    ['rtf', 'text/rtf'],
    ['rtx', 'text/richtext'],
    ['run', 'application/x-makeself'],
    ['rusd', 'application/route-usd+xml'],
    ['rv', 'video/vnd.rn-realvideo'],
    ['s', 'text/x-asm'],
    ['s3m', 'audio/s3m'],
    ['saf', 'application/vnd.yamaha.smaf-audio'],
    ['sass', 'text/x-sass'],
    ['sbml', 'application/sbml+xml'],
    ['sc', 'application/vnd.ibm.secure-container'],
    ['scd', 'application/x-msschedule'],
    ['scm', 'application/vnd.lotus-screencam'],
    ['scq', 'application/scvp-cv-request'],
    ['scs', 'application/scvp-cv-response'],
    ['scss', 'text/x-scss'],
    ['scurl', 'text/vnd.curl.scurl'],
    ['sda', 'application/vnd.stardivision.draw'],
    ['sdc', 'application/vnd.stardivision.calc'],
    ['sdd', 'application/vnd.stardivision.impress'],
    ['sdkd', 'application/vnd.solent.sdkm+xml'],
    ['sdkm', 'application/vnd.solent.sdkm+xml'],
    ['sdp', 'application/sdp'],
    ['sdw', 'application/vnd.stardivision.writer'],
    ['sea', 'application/octet-stream'],
    ['see', 'application/vnd.seemail'],
    ['seed', 'application/vnd.fdsn.seed'],
    ['sema', 'application/vnd.sema'],
    ['semd', 'application/vnd.semd'],
    ['semf', 'application/vnd.semf'],
    ['senmlx', 'application/senml+xml'],
    ['sensmlx', 'application/sensml+xml'],
    ['ser', 'application/java-serialized-object'],
    ['setpay', 'application/set-payment-initiation'],
    ['setreg', 'application/set-registration-initiation'],
    ['sfd-hdstx', 'application/vnd.hydrostatix.sof-data'],
    ['sfs', 'application/vnd.spotfire.sfs'],
    ['sfv', 'text/x-sfv'],
    ['sgi', 'image/sgi'],
    ['sgl', 'application/vnd.stardivision.writer-global'],
    ['sgm', 'text/sgml'],
    ['sgml', 'text/sgml'],
    ['sh', 'application/x-sh'],
    ['shar', 'application/x-shar'],
    ['shex', 'text/shex'],
    ['shf', 'application/shf+xml'],
    ['shtml', 'text/html'],
    ['sid', 'image/x-mrsid-image'],
    ['sieve', 'application/sieve'],
    ['sig', 'application/pgp-signature'],
    ['sil', 'audio/silk'],
    ['silo', 'model/mesh'],
    ['sis', 'application/vnd.symbian.install'],
    ['sisx', 'application/vnd.symbian.install'],
    ['sit', 'application/x-stuffit'],
    ['sitx', 'application/x-stuffitx'],
    ['siv', 'application/sieve'],
    ['skd', 'application/vnd.koan'],
    ['skm', 'application/vnd.koan'],
    ['skp', 'application/vnd.koan'],
    ['skt', 'application/vnd.koan'],
    ['sldm', 'application/vnd.ms-powerpoint.slide.macroenabled.12'],
    ['sldx', 'application/vnd.openxmlformats-officedocument.presentationml.slide'],
    ['slim', 'text/slim'],
    ['slm', 'text/slim'],
    ['sls', 'application/route-s-tsid+xml'],
    ['slt', 'application/vnd.epson.salt'],
    ['sm', 'application/vnd.stepmania.stepchart'],
    ['smf', 'application/vnd.stardivision.math'],
    ['smi', 'application/smil'],
    ['smil', 'application/smil'],
    ['smv', 'video/x-smv'],
    ['smzip', 'application/vnd.stepmania.package'],
    ['snd', 'audio/basic'],
    ['snf', 'application/x-font-snf'],
    ['so', 'application/octet-stream'],
    ['spc', 'application/x-pkcs7-certificates'],
    ['spdx', 'text/spdx'],
    ['spf', 'application/vnd.yamaha.smaf-phrase'],
    ['spl', 'application/x-futuresplash'],
    ['spot', 'text/vnd.in3d.spot'],
    ['spp', 'application/scvp-vp-response'],
    ['spq', 'application/scvp-vp-request'],
    ['spx', 'audio/ogg'],
    ['sql', 'application/x-sql'],
    ['src', 'application/x-wais-source'],
    ['srt', 'application/x-subrip'],
    ['sru', 'application/sru+xml'],
    ['srx', 'application/sparql-results+xml'],
    ['ssdl', 'application/ssdl+xml'],
    ['sse', 'application/vnd.kodak-descriptor'],
    ['ssf', 'application/vnd.epson.ssf'],
    ['ssml', 'application/ssml+xml'],
    ['sst', 'application/octet-stream'],
    ['st', 'application/vnd.sailingtracker.track'],
    ['stc', 'application/vnd.sun.xml.calc.template'],
    ['std', 'application/vnd.sun.xml.draw.template'],
    ['stf', 'application/vnd.wt.stf'],
    ['sti', 'application/vnd.sun.xml.impress.template'],
    ['stk', 'application/hyperstudio'],
    ['stl', 'model/stl'],
    ['stpx', 'model/step+xml'],
    ['stpxz', 'model/step-xml+zip'],
    ['stpz', 'model/step+zip'],
    ['str', 'application/vnd.pg.format'],
    ['stw', 'application/vnd.sun.xml.writer.template'],
    ['styl', 'text/stylus'],
    ['stylus', 'text/stylus'],
    ['sub', 'text/vnd.dvb.subtitle'],
    ['sus', 'application/vnd.sus-calendar'],
    ['susp', 'application/vnd.sus-calendar'],
    ['sv4cpio', 'application/x-sv4cpio'],
    ['sv4crc', 'application/x-sv4crc'],
    ['svc', 'application/vnd.dvb.service'],
    ['svd', 'application/vnd.svd'],
    ['svg', 'image/svg+xml'],
    ['svgz', 'image/svg+xml'],
    ['swa', 'application/x-director'],
    ['swf', 'application/x-shockwave-flash'],
    ['swi', 'application/vnd.aristanetworks.swi'],
    ['swidtag', 'application/swid+xml'],
    ['sxc', 'application/vnd.sun.xml.calc'],
    ['sxd', 'application/vnd.sun.xml.draw'],
    ['sxg', 'application/vnd.sun.xml.writer.global'],
    ['sxi', 'application/vnd.sun.xml.impress'],
    ['sxm', 'application/vnd.sun.xml.math'],
    ['sxw', 'application/vnd.sun.xml.writer'],
    ['t', 'text/troff'],
    ['t3', 'application/x-t3vm-image'],
    ['t38', 'image/t38'],
    ['taglet', 'application/vnd.mynfc'],
    ['tao', 'application/vnd.tao.intent-module-archive'],
    ['tap', 'image/vnd.tencent.tap'],
    ['tar', 'application/x-tar'],
    ['tcap', 'application/vnd.3gpp2.tcap'],
    ['tcl', 'application/x-tcl'],
    ['td', 'application/urc-targetdesc+xml'],
    ['teacher', 'application/vnd.smart.teacher'],
    ['tei', 'application/tei+xml'],
    ['teicorpus', 'application/tei+xml'],
    ['tex', 'application/x-tex'],
    ['texi', 'application/x-texinfo'],
    ['texinfo', 'application/x-texinfo'],
    ['text', 'text/plain'],
    ['tfi', 'application/thraud+xml'],
    ['tfm', 'application/x-tex-tfm'],
    ['tfx', 'image/tiff-fx'],
    ['tga', 'image/x-tga'],
    ['tgz', 'application/x-tar'],
    ['thmx', 'application/vnd.ms-officetheme'],
    ['tif', 'image/tiff'],
    ['tiff', 'image/tiff'],
    ['tk', 'application/x-tcl'],
    ['tmo', 'application/vnd.tmobile-livetv'],
    ['toml', 'application/toml'],
    ['torrent', 'application/x-bittorrent'],
    ['tpl', 'application/vnd.groove-tool-template'],
    ['tpt', 'application/vnd.trid.tpt'],
    ['tr', 'text/troff'],
    ['tra', 'application/vnd.trueapp'],
    ['trig', 'application/trig'],
    ['trm', 'application/x-msterminal'],
    ['ts', 'video/mp2t'],
    ['tsd', 'application/timestamped-data'],
    ['tsv', 'text/tab-separated-values'],
    ['ttc', 'font/collection'],
    ['ttf', 'font/ttf'],
    ['ttl', 'text/turtle'],
    ['ttml', 'application/ttml+xml'],
    ['twd', 'application/vnd.simtech-mindmapper'],
    ['twds', 'application/vnd.simtech-mindmapper'],
    ['txd', 'application/vnd.genomatix.tuxedo'],
    ['txf', 'application/vnd.mobius.txf'],
    ['txt', 'text/plain'],
    ['u8dsn', 'message/global-delivery-status'],
    ['u8hdr', 'message/global-headers'],
    ['u8mdn', 'message/global-disposition-notification'],
    ['u8msg', 'message/global'],
    ['u32', 'application/x-authorware-bin'],
    ['ubj', 'application/ubjson'],
    ['udeb', 'application/x-debian-package'],
    ['ufd', 'application/vnd.ufdl'],
    ['ufdl', 'application/vnd.ufdl'],
    ['ulx', 'application/x-glulx'],
    ['umj', 'application/vnd.umajin'],
    ['unityweb', 'application/vnd.unity'],
    ['uoml', 'application/vnd.uoml+xml'],
    ['uri', 'text/uri-list'],
    ['uris', 'text/uri-list'],
    ['urls', 'text/uri-list'],
    ['usdz', 'model/vnd.usdz+zip'],
    ['ustar', 'application/x-ustar'],
    ['utz', 'application/vnd.uiq.theme'],
    ['uu', 'text/x-uuencode'],
    ['uva', 'audio/vnd.dece.audio'],
    ['uvd', 'application/vnd.dece.data'],
    ['uvf', 'application/vnd.dece.data'],
    ['uvg', 'image/vnd.dece.graphic'],
    ['uvh', 'video/vnd.dece.hd'],
    ['uvi', 'image/vnd.dece.graphic'],
    ['uvm', 'video/vnd.dece.mobile'],
    ['uvp', 'video/vnd.dece.pd'],
    ['uvs', 'video/vnd.dece.sd'],
    ['uvt', 'application/vnd.dece.ttml+xml'],
    ['uvu', 'video/vnd.uvvu.mp4'],
    ['uvv', 'video/vnd.dece.video'],
    ['uvva', 'audio/vnd.dece.audio'],
    ['uvvd', 'application/vnd.dece.data'],
    ['uvvf', 'application/vnd.dece.data'],
    ['uvvg', 'image/vnd.dece.graphic'],
    ['uvvh', 'video/vnd.dece.hd'],
    ['uvvi', 'image/vnd.dece.graphic'],
    ['uvvm', 'video/vnd.dece.mobile'],
    ['uvvp', 'video/vnd.dece.pd'],
    ['uvvs', 'video/vnd.dece.sd'],
    ['uvvt', 'application/vnd.dece.ttml+xml'],
    ['uvvu', 'video/vnd.uvvu.mp4'],
    ['uvvv', 'video/vnd.dece.video'],
    ['uvvx', 'application/vnd.dece.unspecified'],
    ['uvvz', 'application/vnd.dece.zip'],
    ['uvx', 'application/vnd.dece.unspecified'],
    ['uvz', 'application/vnd.dece.zip'],
    ['vbox', 'application/x-virtualbox-vbox'],
    ['vbox-extpack', 'application/x-virtualbox-vbox-extpack'],
    ['vcard', 'text/vcard'],
    ['vcd', 'application/x-cdlink'],
    ['vcf', 'text/x-vcard'],
    ['vcg', 'application/vnd.groove-vcard'],
    ['vcs', 'text/x-vcalendar'],
    ['vcx', 'application/vnd.vcx'],
    ['vdi', 'application/x-virtualbox-vdi'],
    ['vds', 'model/vnd.sap.vds'],
    ['vhd', 'application/x-virtualbox-vhd'],
    ['vis', 'application/vnd.visionary'],
    ['viv', 'video/vnd.vivo'],
    ['vlc', 'application/videolan'],
    ['vmdk', 'application/x-virtualbox-vmdk'],
    ['vob', 'video/x-ms-vob'],
    ['vor', 'application/vnd.stardivision.writer'],
    ['vox', 'application/x-authorware-bin'],
    ['vrml', 'model/vrml'],
    ['vsd', 'application/vnd.visio'],
    ['vsf', 'application/vnd.vsf'],
    ['vss', 'application/vnd.visio'],
    ['vst', 'application/vnd.visio'],
    ['vsw', 'application/vnd.visio'],
    ['vtf', 'image/vnd.valve.source.texture'],
    ['vtt', 'text/vtt'],
    ['vtu', 'model/vnd.vtu'],
    ['vxml', 'application/voicexml+xml'],
    ['w3d', 'application/x-director'],
    ['wad', 'application/x-doom'],
    ['wadl', 'application/vnd.sun.wadl+xml'],
    ['war', 'application/java-archive'],
    ['wasm', 'application/wasm'],
    ['wav', 'audio/x-wav'],
    ['wax', 'audio/x-ms-wax'],
    ['wbmp', 'image/vnd.wap.wbmp'],
    ['wbs', 'application/vnd.criticaltools.wbs+xml'],
    ['wbxml', 'application/wbxml'],
    ['wcm', 'application/vnd.ms-works'],
    ['wdb', 'application/vnd.ms-works'],
    ['wdp', 'image/vnd.ms-photo'],
    ['weba', 'audio/webm'],
    ['webapp', 'application/x-web-app-manifest+json'],
    ['webm', 'video/webm'],
    ['webmanifest', 'application/manifest+json'],
    ['webp', 'image/webp'],
    ['wg', 'application/vnd.pmi.widget'],
    ['wgt', 'application/widget'],
    ['wks', 'application/vnd.ms-works'],
    ['wm', 'video/x-ms-wm'],
    ['wma', 'audio/x-ms-wma'],
    ['wmd', 'application/x-ms-wmd'],
    ['wmf', 'image/wmf'],
    ['wml', 'text/vnd.wap.wml'],
    ['wmlc', 'application/wmlc'],
    ['wmls', 'text/vnd.wap.wmlscript'],
    ['wmlsc', 'application/vnd.wap.wmlscriptc'],
    ['wmv', 'video/x-ms-wmv'],
    ['wmx', 'video/x-ms-wmx'],
    ['wmz', 'application/x-msmetafile'],
    ['woff', 'font/woff'],
    ['woff2', 'font/woff2'],
    ['word', 'application/msword'],
    ['wpd', 'application/vnd.wordperfect'],
    ['wpl', 'application/vnd.ms-wpl'],
    ['wps', 'application/vnd.ms-works'],
    ['wqd', 'application/vnd.wqd'],
    ['wri', 'application/x-mswrite'],
    ['wrl', 'model/vrml'],
    ['wsc', 'message/vnd.wfa.wsc'],
    ['wsdl', 'application/wsdl+xml'],
    ['wspolicy', 'application/wspolicy+xml'],
    ['wtb', 'application/vnd.webturbo'],
    ['wvx', 'video/x-ms-wvx'],
    ['x3d', 'model/x3d+xml'],
    ['x3db', 'model/x3d+fastinfoset'],
    ['x3dbz', 'model/x3d+binary'],
    ['x3dv', 'model/x3d-vrml'],
    ['x3dvz', 'model/x3d+vrml'],
    ['x3dz', 'model/x3d+xml'],
    ['x32', 'application/x-authorware-bin'],
    ['x_b', 'model/vnd.parasolid.transmit.binary'],
    ['x_t', 'model/vnd.parasolid.transmit.text'],
    ['xaml', 'application/xaml+xml'],
    ['xap', 'application/x-silverlight-app'],
    ['xar', 'application/vnd.xara'],
    ['xav', 'application/xcap-att+xml'],
    ['xbap', 'application/x-ms-xbap'],
    ['xbd', 'application/vnd.fujixerox.docuworks.binder'],
    ['xbm', 'image/x-xbitmap'],
    ['xca', 'application/xcap-caps+xml'],
    ['xcs', 'application/calendar+xml'],
    ['xdf', 'application/xcap-diff+xml'],
    ['xdm', 'application/vnd.syncml.dm+xml'],
    ['xdp', 'application/vnd.adobe.xdp+xml'],
    ['xdssc', 'application/dssc+xml'],
    ['xdw', 'application/vnd.fujixerox.docuworks'],
    ['xel', 'application/xcap-el+xml'],
    ['xenc', 'application/xenc+xml'],
    ['xer', 'application/patch-ops-error+xml'],
    ['xfdf', 'application/vnd.adobe.xfdf'],
    ['xfdl', 'application/vnd.xfdl'],
    ['xht', 'application/xhtml+xml'],
    ['xhtml', 'application/xhtml+xml'],
    ['xhvml', 'application/xv+xml'],
    ['xif', 'image/vnd.xiff'],
    ['xl', 'application/excel'],
    ['xla', 'application/vnd.ms-excel'],
    ['xlam', 'application/vnd.ms-excel.addin.macroEnabled.12'],
    ['xlc', 'application/vnd.ms-excel'],
    ['xlf', 'application/xliff+xml'],
    ['xlm', 'application/vnd.ms-excel'],
    ['xls', 'application/vnd.ms-excel'],
    ['xlsb', 'application/vnd.ms-excel.sheet.binary.macroEnabled.12'],
    ['xlsm', 'application/vnd.ms-excel.sheet.macroEnabled.12'],
    ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ['xlt', 'application/vnd.ms-excel'],
    ['xltm', 'application/vnd.ms-excel.template.macroEnabled.12'],
    ['xltx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.template'],
    ['xlw', 'application/vnd.ms-excel'],
    ['xm', 'audio/xm'],
    ['xml', 'application/xml'],
    ['xns', 'application/xcap-ns+xml'],
    ['xo', 'application/vnd.olpc-sugar'],
    ['xop', 'application/xop+xml'],
    ['xpi', 'application/x-xpinstall'],
    ['xpl', 'application/xproc+xml'],
    ['xpm', 'image/x-xpixmap'],
    ['xpr', 'application/vnd.is-xpr'],
    ['xps', 'application/vnd.ms-xpsdocument'],
    ['xpw', 'application/vnd.intercon.formnet'],
    ['xpx', 'application/vnd.intercon.formnet'],
    ['xsd', 'application/xml'],
    ['xsl', 'application/xml'],
    ['xslt', 'application/xslt+xml'],
    ['xsm', 'application/vnd.syncml+xml'],
    ['xspf', 'application/xspf+xml'],
    ['xul', 'application/vnd.mozilla.xul+xml'],
    ['xvm', 'application/xv+xml'],
    ['xvml', 'application/xv+xml'],
    ['xwd', 'image/x-xwindowdump'],
    ['xyz', 'chemical/x-xyz'],
    ['xz', 'application/x-xz'],
    ['yaml', 'text/yaml'],
    ['yang', 'application/yang'],
    ['yin', 'application/yin+xml'],
    ['yml', 'text/yaml'],
    ['ymp', 'text/x-suse-ymp'],
    ['z', 'application/x-compress'],
    ['z1', 'application/x-zmachine'],
    ['z2', 'application/x-zmachine'],
    ['z3', 'application/x-zmachine'],
    ['z4', 'application/x-zmachine'],
    ['z5', 'application/x-zmachine'],
    ['z6', 'application/x-zmachine'],
    ['z7', 'application/x-zmachine'],
    ['z8', 'application/x-zmachine'],
    ['zaz', 'application/vnd.zzazz.deck+xml'],
    ['zip', 'application/zip'],
    ['zir', 'application/vnd.zul'],
    ['zirz', 'application/vnd.zul'],
    ['zmm', 'application/vnd.handheld-entertainment+xml'],
    ['zsh', 'text/x-scriptzsh']
]);
function toFileWithPath(file, path, h) {
    const f = withMimeType(file);
    const { webkitRelativePath } = file;
    const p = typeof path === 'string'
        ? path
        // If <input webkitdirectory> is set,
        // the File will have a {webkitRelativePath} property
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory
        : typeof webkitRelativePath === 'string' && webkitRelativePath.length > 0
            ? webkitRelativePath
            : `./${file.name}`;
    if (typeof f.path !== 'string') { // on electron, path is already set to the absolute path
        setObjProp(f, 'path', p);
    }
    // Always populate a relative path so that even electron apps have access to a relativePath value
    setObjProp(f, 'relativePath', p);
    return f;
}
function withMimeType(file) {
    const { name } = file;
    const hasExtension = name && name.lastIndexOf('.') !== -1;
    if (hasExtension && !file.type) {
        const ext = name.split('.')
            .pop().toLowerCase();
        const type = COMMON_MIME_TYPES.get(ext);
        if (type) {
            Object.defineProperty(file, 'type', {
                value: type,
                writable: false,
                configurable: false,
                enumerable: true
            });
        }
    }
    return file;
}
function setObjProp(f, key, value) {
    Object.defineProperty(f, key, {
        value,
        writable: false,
        configurable: false,
        enumerable: true
    });
}

const FILES_TO_IGNORE = [
    // Thumbnail cache files for macOS and Windows
    '.DS_Store', // macOs
    'Thumbs.db' // Windows
];
/**
 * Convert a DragEvent's DataTrasfer object to a list of File objects
 * NOTE: If some of the items are folders,
 * everything will be flattened and placed in the same list but the paths will be kept as a {path} property.
 *
 * EXPERIMENTAL: A list of https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle objects can also be passed as an arg
 * and a list of File objects will be returned.
 *
 * @param evt
 */
function fromEvent(evt) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isObject(evt) && isDataTransfer(evt.dataTransfer)) {
            return getDataTransferFiles(evt.dataTransfer, evt.type);
        }
        else if (isChangeEvt(evt)) {
            return getInputFiles(evt);
        }
        else if (Array.isArray(evt) && evt.every(item => 'getFile' in item && typeof item.getFile === 'function')) {
            return getFsHandleFiles(evt);
        }
        return [];
    });
}
function isDataTransfer(value) {
    return isObject(value);
}
function isChangeEvt(value) {
    return isObject(value) && isObject(value.target);
}
function isObject(v) {
    return typeof v === 'object' && v !== null;
}
function getInputFiles(evt) {
    return fromList(evt.target.files).map(file => toFileWithPath(file));
}
// Ee expect each handle to be https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle
function getFsHandleFiles(handles) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield Promise.all(handles.map(h => h.getFile()));
        return files.map(file => toFileWithPath(file));
    });
}
function getDataTransferFiles(dt, type) {
    return __awaiter(this, void 0, void 0, function* () {
        // IE11 does not support dataTransfer.items
        // See https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/items#Browser_compatibility
        if (dt.items) {
            const items = fromList(dt.items)
                .filter(item => item.kind === 'file');
            // According to https://html.spec.whatwg.org/multipage/dnd.html#dndevents,
            // only 'dragstart' and 'drop' has access to the data (source node)
            if (type !== 'drop') {
                return items;
            }
            const files = yield Promise.all(items.map(toFilePromises));
            return noIgnoredFiles(flatten(files));
        }
        return noIgnoredFiles(fromList(dt.files)
            .map(file => toFileWithPath(file)));
    });
}
function noIgnoredFiles(files) {
    return files.filter(file => FILES_TO_IGNORE.indexOf(file.name) === -1);
}
// IE11 does not support Array.from()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Browser_compatibility
// https://developer.mozilla.org/en-US/docs/Web/API/FileList
// https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItemList
function fromList(items) {
    if (items === null) {
        return [];
    }
    const files = [];
    // tslint:disable: prefer-for-of
    for (let i = 0; i < items.length; i++) {
        const file = items[i];
        files.push(file);
    }
    return files;
}
// https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem
function toFilePromises(item) {
    if (typeof item.webkitGetAsEntry !== 'function') {
        return fromDataTransferItem(item);
    }
    const entry = item.webkitGetAsEntry();
    // Safari supports dropping an image node from a different window and can be retrieved using
    // the DataTransferItem.getAsFile() API
    // NOTE: FileSystemEntry.file() throws if trying to get the file
    if (entry && entry.isDirectory) {
        return fromDirEntry(entry);
    }
    return fromDataTransferItem(item, entry);
}
function flatten(items) {
    return items.reduce((acc, files) => [
        ...acc,
        ...(Array.isArray(files) ? flatten(files) : [files])
    ], []);
}
function fromDataTransferItem(item, entry) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // Check if we're in a secure context; due to a bug in Chrome (as far as we know)
        // the browser crashes when calling this API (yet to be confirmed as a consistent behaviour).
        //
        // See:
        // - https://issues.chromium.org/issues/40186242
        // - https://github.com/react-dropzone/react-dropzone/issues/1397
        if (globalThis.isSecureContext && typeof item.getAsFileSystemHandle === 'function') {
            const h = yield item.getAsFileSystemHandle();
            if (h === null) {
                throw new Error(`${item} is not a File`);
            }
            // It seems that the handle can be `undefined` (see https://github.com/react-dropzone/file-selector/issues/120),
            // so we check if it isn't; if it is, the code path continues to the next API (`getAsFile`).
            if (h !== undefined) {
                const file = yield h.getFile();
                file.handle = h;
                return toFileWithPath(file);
            }
        }
        const file = item.getAsFile();
        if (!file) {
            throw new Error(`${item} is not a File`);
        }
        const fwp = toFileWithPath(file, (_a = entry === null || entry === void 0 ? void 0 : entry.fullPath) !== null && _a !== void 0 ? _a : undefined);
        return fwp;
    });
}
// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry
function fromEntry(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        return entry.isDirectory ? fromDirEntry(entry) : fromFileEntry(entry);
    });
}
// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry
function fromDirEntry(entry) {
    const reader = entry.createReader();
    return new Promise((resolve, reject) => {
        const entries = [];
        function readEntries() {
            // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry/createReader
            // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries
            reader.readEntries((batch) => __awaiter(this, void 0, void 0, function* () {
                if (!batch.length) {
                    // Done reading directory
                    try {
                        const files = yield Promise.all(entries);
                        resolve(files);
                    }
                    catch (err) {
                        reject(err);
                    }
                }
                else {
                    const items = Promise.all(batch.map(fromEntry));
                    entries.push(items);
                    // Continue reading
                    readEntries();
                }
            }), (err) => {
                reject(err);
            });
        }
        readEntries();
    });
}
// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileEntry
function fromFileEntry(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            entry.file((file) => {
                const fwp = toFileWithPath(file, entry.fullPath);
                resolve(fwp);
            }, (err) => {
                reject(err);
            });
        });
    });
}

var _default = function (file, acceptedFiles) {
  if (file && acceptedFiles) {
    var acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(',');

    if (acceptedFilesArray.length === 0) {
      return true;
    }

    var fileName = file.name || '';
    var mimeType = (file.type || '').toLowerCase();
    var baseMimeType = mimeType.replace(/\/.*$/, '');
    return acceptedFilesArray.some(function (type) {
      var validType = type.trim().toLowerCase();

      if (validType.charAt(0) === '.') {
        return fileName.toLowerCase().endsWith(validType);
      } else if (validType.endsWith('/*')) {
        // This is something like a image/* mime type
        return baseMimeType === validType.replace(/\/.*$/, '');
      }

      return mimeType === validType;
    });
  }

  return true;
};

function _toConsumableArray$1(arr) { return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread$1(); }

function _nonIterableSpread$1() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray$1(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles$1(arr) { if (Array.isArray(arr)) return _arrayLikeToArray$1(arr); }

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty$2(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray$1(arr, i) { return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1(); }

function _nonIterableRest$1() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit$1(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles$1(arr) { if (Array.isArray(arr)) return arr; }
var accepts = typeof _default === "function" ? _default : _default.default; // Error codes

var FILE_INVALID_TYPE = "file-invalid-type";
var FILE_TOO_LARGE = "file-too-large";
var FILE_TOO_SMALL = "file-too-small";
var TOO_MANY_FILES = "too-many-files";
/**
 *
 * @param {string} accept
 */

var getInvalidTypeRejectionErr = function getInvalidTypeRejectionErr() {
  var accept = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var acceptArr = accept.split(",");
  var msg = acceptArr.length > 1 ? "one of ".concat(acceptArr.join(", ")) : acceptArr[0];
  return {
    code: FILE_INVALID_TYPE,
    message: "File type must be ".concat(msg)
  };
};
var getTooLargeRejectionErr = function getTooLargeRejectionErr(maxSize) {
  return {
    code: FILE_TOO_LARGE,
    message: "File is larger than ".concat(maxSize, " ").concat(maxSize === 1 ? "byte" : "bytes")
  };
};
var getTooSmallRejectionErr = function getTooSmallRejectionErr(minSize) {
  return {
    code: FILE_TOO_SMALL,
    message: "File is smaller than ".concat(minSize, " ").concat(minSize === 1 ? "byte" : "bytes")
  };
};
var TOO_MANY_FILES_REJECTION = {
  code: TOO_MANY_FILES,
  message: "Too many files"
};
/**
 * Check if the given file is a DataTransferItem with an empty type.
 *
 * During drag events, browsers may return DataTransferItem objects instead of File objects.
 * Some browsers (e.g., Chrome) return an empty MIME type for certain file types (like .md files)
 * on DataTransferItem during drag events, even though the type is correctly set during drop.
 *
 * This function detects such cases by checking for:
 * 1. Empty type string
 * 2. Presence of getAsFile method (indicates it's a DataTransferItem, not a File)
 *
 * We accept these during drag to provide proper UI feedback, while maintaining
 * strict validation during drop when real File objects are available.
 *
 * @param {File | DataTransferItem} file
 * @returns {boolean}
 */

function isDataTransferItemWithEmptyType(file) {
  return file.type === "" && typeof file.getAsFile === "function";
}
/**
 * Check if file is accepted.
 *
 * Firefox versions prior to 53 return a bogus MIME type for every file drag,
 * so dragovers with that MIME type will always be accepted.
 *
 * Chrome/other browsers may return an empty MIME type for files during drag events,
 * so we accept those as well (we'll validate properly on drop).
 *
 * @param {File} file
 * @param {string} accept
 * @returns
 */

function fileAccepted(file, accept) {
  var isAcceptable = file.type === "application/x-moz-file" || accepts(file, accept) || isDataTransferItemWithEmptyType(file);
  return [isAcceptable, isAcceptable ? null : getInvalidTypeRejectionErr(accept)];
}
function fileMatchSize(file, minSize, maxSize) {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize)) {
      if (file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
      if (file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];
    } else if (isDefined(minSize) && file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];else if (isDefined(maxSize) && file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
  }

  return [true, null];
}

function isDefined(value) {
  return value !== undefined && value !== null;
}
/**
 *
 * @param {object} options
 * @param {File[]} options.files
 * @param {string} [options.accept]
 * @param {number} [options.minSize]
 * @param {number} [options.maxSize]
 * @param {boolean} [options.multiple]
 * @param {number} [options.maxFiles]
 * @param {(f: File) => FileError|FileError[]|null} [options.validator]
 * @returns
 */


function allFilesAccepted(_ref) {
  var files = _ref.files,
      accept = _ref.accept,
      minSize = _ref.minSize,
      maxSize = _ref.maxSize,
      multiple = _ref.multiple,
      maxFiles = _ref.maxFiles,
      validator = _ref.validator;

  if (!multiple && files.length > 1 || multiple && maxFiles >= 1 && files.length > maxFiles) {
    return false;
  }

  return files.every(function (file) {
    var _fileAccepted = fileAccepted(file, accept),
        _fileAccepted2 = _slicedToArray$1(_fileAccepted, 1),
        accepted = _fileAccepted2[0];

    var _fileMatchSize = fileMatchSize(file, minSize, maxSize),
        _fileMatchSize2 = _slicedToArray$1(_fileMatchSize, 1),
        sizeMatch = _fileMatchSize2[0];

    var customErrors = validator ? validator(file) : null;
    return accepted && sizeMatch && !customErrors;
  });
} // React's synthetic events has event.isPropagationStopped,
// but to remain compatibility with other libs (Preact) fall back
// to check event.cancelBubble

function isPropagationStopped(event) {
  if (typeof event.isPropagationStopped === "function") {
    return event.isPropagationStopped();
  } else if (typeof event.cancelBubble !== "undefined") {
    return event.cancelBubble;
  }

  return false;
}
function isEvtWithFiles(event) {
  if (!event.dataTransfer) {
    return !!event.target && !!event.target.files;
  } // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#file


  return Array.prototype.some.call(event.dataTransfer.types, function (type) {
    return type === "Files" || type === "application/x-moz-file";
  });
}

function onDocumentDragOver(event) {
  event.preventDefault();
}

function isIe(userAgent) {
  return userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1;
}

function isEdge(userAgent) {
  return userAgent.indexOf("Edge/") !== -1;
}

function isIeOrEdge() {
  var userAgent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.navigator.userAgent;
  return isIe(userAgent) || isEdge(userAgent);
}
/**
 * This is intended to be used to compose event handlers
 * They are executed in order until one of them calls `event.isPropagationStopped()`.
 * Note that the check is done on the first invoke too,
 * meaning that if propagation was stopped before invoking the fns,
 * no handlers will be executed.
 *
 * @param {Function} fns the event hanlder functions
 * @return {Function} the event handler to add to an element
 */

function composeEventHandlers() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (event) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return fns.some(function (fn) {
      if (!isPropagationStopped(event) && fn) {
        fn.apply(void 0, [event].concat(args));
      }

      return isPropagationStopped(event);
    });
  };
}
/**
 * canUseFileSystemAccessAPI checks if the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
 * is supported by the browser.
 * @returns {boolean}
 */

function canUseFileSystemAccessAPI() {
  return "showOpenFilePicker" in window;
}
/**
 * Convert the `{accept}` dropzone prop to the
 * `{types}` option for https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker
 *
 * @param {AcceptProp} accept
 * @returns {{accept: string[]}[]}
 */

function pickerOptionsFromAccept(accept) {
  if (isDefined(accept)) {
    var acceptForPicker = Object.entries(accept).filter(function (_ref2) {
      var _ref3 = _slicedToArray$1(_ref2, 2),
          mimeType = _ref3[0],
          ext = _ref3[1];

      var ok = true;

      if (!isMIMEType(mimeType)) {
        console.warn("Skipped \"".concat(mimeType, "\" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types."));
        ok = false;
      }

      if (!Array.isArray(ext) || !ext.every(isExt)) {
        console.warn("Skipped \"".concat(mimeType, "\" because an invalid file extension was provided."));
        ok = false;
      }

      return ok;
    }).reduce(function (agg, _ref4) {
      var _ref5 = _slicedToArray$1(_ref4, 2),
          mimeType = _ref5[0],
          ext = _ref5[1];

      return _objectSpread$2(_objectSpread$2({}, agg), {}, _defineProperty$2({}, mimeType, ext));
    }, {});
    return [{
      // description is required due to https://crbug.com/1264708
      description: "Files",
      accept: acceptForPicker
    }];
  }

  return accept;
}
/**
 * Convert the `{accept}` dropzone prop to an array of MIME types/extensions.
 * @param {AcceptProp} accept
 * @returns {string}
 */

function acceptPropAsAcceptAttr(accept) {
  if (isDefined(accept)) {
    return Object.entries(accept).reduce(function (a, _ref6) {
      var _ref7 = _slicedToArray$1(_ref6, 2),
          mimeType = _ref7[0],
          ext = _ref7[1];

      return [].concat(_toConsumableArray$1(a), [mimeType], _toConsumableArray$1(ext));
    }, []) // Silently discard invalid entries as pickerOptionsFromAccept warns about these
    .filter(function (v) {
      return isMIMEType(v) || isExt(v);
    }).join(",");
  }

  return undefined;
}
/**
 * Check if v is an exception caused by aborting a request (e.g window.showOpenFilePicker()).
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/DOMException.
 * @param {any} v
 * @returns {boolean} True if v is an abort exception.
 */

function isAbort(v) {
  return v instanceof DOMException && (v.name === "AbortError" || v.code === v.ABORT_ERR);
}
/**
 * Check if v is a security error.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/DOMException.
 * @param {any} v
 * @returns {boolean} True if v is a security error.
 */

function isSecurityError(v) {
  return v instanceof DOMException && (v.name === "SecurityError" || v.code === v.SECURITY_ERR);
}
/**
 * Check if v is a MIME type string.
 *
 * See accepted format: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers.
 *
 * @param {string} v
 */

function isMIMEType(v) {
  return v === "audio/*" || v === "video/*" || v === "image/*" || v === "text/*" || v === "application/*" || /\w+\/[-+.\w]+/g.test(v);
}
/**
 * Check if v is a file extension.
 * @param {string} v
 */

function isExt(v) {
  return /^.*\.[\w]+$/.test(v);
}
/**
 * @typedef {Object.<string, string[]>} AcceptProp
 */

/**
 * @typedef {object} FileError
 * @property {string} message
 * @property {ErrorCode|string} code
 */

/**
 * @typedef {"file-invalid-type"|"file-too-large"|"file-too-small"|"too-many-files"} ErrorCode
 */

var _excluded$1 = ["children"],
    _excluded2 = ["open"],
    _excluded3 = ["refKey", "role", "onKeyDown", "onFocus", "onBlur", "onClick", "onDragEnter", "onDragOver", "onDragLeave", "onDrop"],
    _excluded4 = ["refKey", "onChange", "onClick"];

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties$1(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$1(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose$1(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
/**
 * Convenience wrapper component for the `useDropzone` hook
 *
 * ```jsx
 * <Dropzone>
 *   {({getRootProps, getInputProps}) => (
 *     <div {...getRootProps()}>
 *       <input {...getInputProps()} />
 *       <p>Drag 'n' drop some files here, or click to select files</p>
 *     </div>
 *   )}
 * </Dropzone>
 * ```
 */

var Dropzone = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var children = _ref.children,
      params = _objectWithoutProperties$1(_ref, _excluded$1);

  var _useDropzone = useDropzone(params),
      open = _useDropzone.open,
      props = _objectWithoutProperties$1(_useDropzone, _excluded2);

  React.useImperativeHandle(ref, function () {
    return {
      open: open
    };
  }, [open]); // TODO: Figure out why react-styleguidist cannot create docs if we don't return a jsx element

  return /*#__PURE__*/React.createElement(React.Fragment, null, children(_objectSpread$1(_objectSpread$1({}, props), {}, {
    open: open
  })));
});
Dropzone.displayName = "Dropzone"; // Add default props for react-docgen

var defaultProps = {
  disabled: false,
  getFilesFromEvent: fromEvent,
  maxSize: Infinity,
  minSize: 0,
  multiple: true,
  maxFiles: 0,
  preventDropOnDocument: true,
  noClick: false,
  noKeyboard: false,
  noDrag: false,
  noDragEventsBubbling: false,
  validator: null,
  useFsAccessApi: false,
  autoFocus: false
};
Dropzone.defaultProps = defaultProps;
Dropzone.propTypes = {
  /**
   * Render function that exposes the dropzone state and prop getter fns
   *
   * @param {object} params
   * @param {Function} params.getRootProps Returns the props you should apply to the root drop container you render
   * @param {Function} params.getInputProps Returns the props you should apply to hidden file input you render
   * @param {Function} params.open Open the native file selection dialog
   * @param {boolean} params.isFocused Dropzone area is in focus
   * @param {boolean} params.isFileDialogActive File dialog is opened
   * @param {boolean} params.isDragActive Active drag is in progress
   * @param {boolean} params.isDragAccept Dragged files are accepted
   * @param {boolean} params.isDragReject True only during an active drag when some dragged files would be rejected. After drop, this resets to false. Use fileRejections for post-drop errors.
   * @param {boolean} params.isDragGlobal Files are being dragged anywhere on the document
   * @param {File[]} params.acceptedFiles Accepted files
   * @param {FileRejection[]} params.fileRejections Rejected files and why they were rejected. This persists after drop and is the source of truth for post-drop rejections.
   */
  children: PropTypes.func,

  /**
   * Set accepted file types.
   * Checkout https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker types option for more information.
   * Keep in mind that mime type determination is not reliable across platforms. CSV files,
   * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
   * Windows. In some cases there might not be a mime type set at all (https://github.com/react-dropzone/react-dropzone/issues/276).
   */
  accept: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),

  /**
   * Allow drag 'n' drop (or selection from the file dialog) of multiple files
   */
  multiple: PropTypes.bool,

  /**
   * If false, allow dropped items to take over the current browser window
   */
  preventDropOnDocument: PropTypes.bool,

  /**
   * If true, disables click to open the native file selection dialog
   */
  noClick: PropTypes.bool,

  /**
   * If true, disables SPACE/ENTER to open the native file selection dialog.
   * Note that it also stops tracking the focus state.
   */
  noKeyboard: PropTypes.bool,

  /**
   * If true, disables drag 'n' drop
   */
  noDrag: PropTypes.bool,

  /**
   * If true, stops drag event propagation to parents
   */
  noDragEventsBubbling: PropTypes.bool,

  /**
   * Minimum file size (in bytes)
   */
  minSize: PropTypes.number,

  /**
   * Maximum file size (in bytes)
   */
  maxSize: PropTypes.number,

  /**
   * Maximum accepted number of files
   * The default value is 0 which means there is no limitation to how many files are accepted.
   */
  maxFiles: PropTypes.number,

  /**
   * Enable/disable the dropzone
   */
  disabled: PropTypes.bool,

  /**
   * Use this to provide a custom file aggregator
   *
   * @param {(DragEvent|Event|Array<FileSystemFileHandle>)} event A drag event or input change event (if files were selected via the file dialog)
   */
  getFilesFromEvent: PropTypes.func,

  /**
   * Cb for when closing the file dialog with no selection
   */
  onFileDialogCancel: PropTypes.func,

  /**
   * Cb for when opening the file dialog
   */
  onFileDialogOpen: PropTypes.func,

  /**
   * Set to true to use the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
   * to open the file picker instead of using an `<input type="file">` click event.
   */
  useFsAccessApi: PropTypes.bool,

  /**
   * Set to true to focus the root element on render
   */
  autoFocus: PropTypes.bool,

  /**
   * Cb for when the `dragenter` event occurs.
   *
   * @param {DragEvent} event
   */
  onDragEnter: PropTypes.func,

  /**
   * Cb for when the `dragleave` event occurs
   *
   * @param {DragEvent} event
   */
  onDragLeave: PropTypes.func,

  /**
   * Cb for when the `dragover` event occurs
   *
   * @param {DragEvent} event
   */
  onDragOver: PropTypes.func,

  /**
   * Cb for when the `drop` event occurs.
   * Note that this callback is invoked after the `getFilesFromEvent` callback is done.
   *
   * Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
   * `accept` must be a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) or a valid file extension.
   * If `multiple` is set to false and additional files are dropped,
   * all files besides the first will be rejected.
   * Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
   *
   * Note that the `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
   * If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
   *
   * `onDrop` will provide you with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which you can then process and send to a server.
   * For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:
   *
   * ```js
   * function onDrop(acceptedFiles) {
   *   const req = request.post('/upload')
   *   acceptedFiles.forEach(file => {
   *     req.attach(file.name, file)
   *   })
   *   req.end(callback)
   * }
   * ```
   *
   * @param {File[]} acceptedFiles
   * @param {FileRejection[]} fileRejections
   * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
   */
  onDrop: PropTypes.func,

  /**
   * Cb for when the `drop` event occurs.
   * Note that if no files are accepted, this callback is not invoked.
   *
   * @param {File[]} files
   * @param {(DragEvent|Event)} event
   */
  onDropAccepted: PropTypes.func,

  /**
   * Cb for when the `drop` event occurs.
   * Note that if no files are rejected, this callback is not invoked.
   *
   * @param {FileRejection[]} fileRejections
   * @param {(DragEvent|Event)} event
   */
  onDropRejected: PropTypes.func,

  /**
   * Cb for when there's some error from any of the promises.
   *
   * @param {Error} error
   */
  onError: PropTypes.func,

  /**
   * Custom validation function. It must return null if there's no errors.
   * @param {File} file
   * @returns {FileError|FileError[]|null}
   */
  validator: PropTypes.func
};
/**
 * A function that is invoked for the `dragenter`,
 * `dragover` and `dragleave` events.
 * It is not invoked if the items are not files (such as link, text, etc.).
 *
 * @callback dragCb
 * @param {DragEvent} event
 */

/**
 * A function that is invoked for the `drop` or input change event.
 * It is not invoked if the items are not files (such as link, text, etc.).
 *
 * @callback dropCb
 * @param {File[]} acceptedFiles List of accepted files
 * @param {FileRejection[]} fileRejections List of rejected files and why they were rejected. This is the authoritative source for post-drop file rejections.
 * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
 */

/**
 * A function that is invoked for the `drop` or input change event.
 * It is not invoked if the items are files (such as link, text, etc.).
 *
 * @callback dropAcceptedCb
 * @param {File[]} files List of accepted files that meet the given criteria
 * (`accept`, `multiple`, `minSize`, `maxSize`)
 * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
 */

/**
 * A function that is invoked for the `drop` or input change event.
 *
 * @callback dropRejectedCb
 * @param {File[]} files List of rejected files that do not meet the given criteria
 * (`accept`, `multiple`, `minSize`, `maxSize`)
 * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
 */

/**
 * A function that is used aggregate files,
 * in a asynchronous fashion, from drag or input change events.
 *
 * @callback getFilesFromEvent
 * @param {(DragEvent|Event|Array<FileSystemFileHandle>)} event A drag event or input change event (if files were selected via the file dialog)
 * @returns {(File[]|Promise<File[]>)}
 */

/**
 * An object with the current dropzone state.
 *
 * @typedef {object} DropzoneState
 * @property {boolean} isFocused Dropzone area is in focus
 * @property {boolean} isFileDialogActive File dialog is opened
 * @property {boolean} isDragActive Active drag is in progress
 * @property {boolean} isDragAccept Dragged files are accepted
 * @property {boolean} isDragReject True only during an active drag when some dragged files would be rejected. After drop, this resets to false. Use fileRejections for post-drop errors.
 * @property {boolean} isDragGlobal Files are being dragged anywhere on the document
 * @property {File[]} acceptedFiles Accepted files
 * @property {FileRejection[]} fileRejections Rejected files and why they were rejected. This persists after drop and is the source of truth for post-drop rejections.
 */

/**
 * An object with the dropzone methods.
 *
 * @typedef {object} DropzoneMethods
 * @property {Function} getRootProps Returns the props you should apply to the root drop container you render
 * @property {Function} getInputProps Returns the props you should apply to hidden file input you render
 * @property {Function} open Open the native file selection dialog
 */

var initialState = {
  isFocused: false,
  isFileDialogActive: false,
  isDragActive: false,
  isDragAccept: false,
  isDragReject: false,
  isDragGlobal: false,
  acceptedFiles: [],
  fileRejections: []
};
/**
 * A React hook that creates a drag 'n' drop area.
 *
 * ```jsx
 * function MyDropzone(props) {
 *   const {getRootProps, getInputProps} = useDropzone({
 *     onDrop: acceptedFiles => {
 *       // do something with the File objects, e.g. upload to some server
 *     }
 *   });
 *   return (
 *     <div {...getRootProps()}>
 *       <input {...getInputProps()} />
 *       <p>Drag and drop some files here, or click to select files</p>
 *     </div>
 *   )
 * }
 * ```
 *
 * @function useDropzone
 *
 * @param {object} props
 * @param {import("./utils").AcceptProp} [props.accept] Set accepted file types.
 * Checkout https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker types option for more information.
 * Keep in mind that mime type determination is not reliable across platforms. CSV files,
 * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
 * Windows. In some cases there might not be a mime type set at all (https://github.com/react-dropzone/react-dropzone/issues/276).
 * @param {boolean} [props.multiple=true] Allow drag 'n' drop (or selection from the file dialog) of multiple files
 * @param {boolean} [props.preventDropOnDocument=true] If false, allow dropped items to take over the current browser window
 * @param {boolean} [props.noClick=false] If true, disables click to open the native file selection dialog
 * @param {boolean} [props.noKeyboard=false] If true, disables SPACE/ENTER to open the native file selection dialog.
 * Note that it also stops tracking the focus state.
 * @param {boolean} [props.noDrag=false] If true, disables drag 'n' drop
 * @param {boolean} [props.noDragEventsBubbling=false] If true, stops drag event propagation to parents
 * @param {number} [props.minSize=0] Minimum file size (in bytes)
 * @param {number} [props.maxSize=Infinity] Maximum file size (in bytes)
 * @param {boolean} [props.disabled=false] Enable/disable the dropzone
 * @param {getFilesFromEvent} [props.getFilesFromEvent] Use this to provide a custom file aggregator
 * @param {Function} [props.onFileDialogCancel] Cb for when closing the file dialog with no selection
 * @param {boolean} [props.useFsAccessApi] Set to true to use the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
 * to open the file picker instead of using an `<input type="file">` click event.
 * @param {boolean} autoFocus Set to true to auto focus the root element.
 * @param {Function} [props.onFileDialogOpen] Cb for when opening the file dialog
 * @param {dragCb} [props.onDragEnter] Cb for when the `dragenter` event occurs.
 * @param {dragCb} [props.onDragLeave] Cb for when the `dragleave` event occurs
 * @param {dragCb} [props.onDragOver] Cb for when the `dragover` event occurs
 * @param {dropCb} [props.onDrop] Cb for when the `drop` event occurs.
 * Note that this callback is invoked after the `getFilesFromEvent` callback is done.
 *
 * Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
 * `accept` must be an object with keys as a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) and the value an array of file extensions (optional).
 * If `multiple` is set to false and additional files are dropped,
 * all files besides the first will be rejected.
 * Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
 *
 * Note that the `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
 * If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
 *
 * The second parameter (fileRejections) is the authoritative list of rejected files after a drop.
 * Use this parameter or the fileRejections state property to handle post-drop file rejections,
 * as isDragReject only indicates rejection state during active drag operations.
 *
 * `onDrop` will provide you with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which you can then process and send to a server.
 * For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:
 *
 * ```js
 * function onDrop(acceptedFiles) {
 *   const req = request.post('/upload')
 *   acceptedFiles.forEach(file => {
 *     req.attach(file.name, file)
 *   })
 *   req.end(callback)
 * }
 * ```
 * @param {dropAcceptedCb} [props.onDropAccepted]
 * @param {dropRejectedCb} [props.onDropRejected]
 * @param {(error: Error) => void} [props.onError]
 *
 * @returns {DropzoneState & DropzoneMethods}
 */

function useDropzone() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _defaultProps$props = _objectSpread$1(_objectSpread$1({}, defaultProps), props),
      accept = _defaultProps$props.accept,
      disabled = _defaultProps$props.disabled,
      getFilesFromEvent = _defaultProps$props.getFilesFromEvent,
      maxSize = _defaultProps$props.maxSize,
      minSize = _defaultProps$props.minSize,
      multiple = _defaultProps$props.multiple,
      maxFiles = _defaultProps$props.maxFiles,
      onDragEnter = _defaultProps$props.onDragEnter,
      onDragLeave = _defaultProps$props.onDragLeave,
      onDragOver = _defaultProps$props.onDragOver,
      onDrop = _defaultProps$props.onDrop,
      onDropAccepted = _defaultProps$props.onDropAccepted,
      onDropRejected = _defaultProps$props.onDropRejected,
      onFileDialogCancel = _defaultProps$props.onFileDialogCancel,
      onFileDialogOpen = _defaultProps$props.onFileDialogOpen,
      useFsAccessApi = _defaultProps$props.useFsAccessApi,
      autoFocus = _defaultProps$props.autoFocus,
      preventDropOnDocument = _defaultProps$props.preventDropOnDocument,
      noClick = _defaultProps$props.noClick,
      noKeyboard = _defaultProps$props.noKeyboard,
      noDrag = _defaultProps$props.noDrag,
      noDragEventsBubbling = _defaultProps$props.noDragEventsBubbling,
      onError = _defaultProps$props.onError,
      validator = _defaultProps$props.validator;

  var acceptAttr = React.useMemo(function () {
    return acceptPropAsAcceptAttr(accept);
  }, [accept]);
  var pickerTypes = React.useMemo(function () {
    return pickerOptionsFromAccept(accept);
  }, [accept]);
  var onFileDialogOpenCb = React.useMemo(function () {
    return typeof onFileDialogOpen === "function" ? onFileDialogOpen : noop;
  }, [onFileDialogOpen]);
  var onFileDialogCancelCb = React.useMemo(function () {
    return typeof onFileDialogCancel === "function" ? onFileDialogCancel : noop;
  }, [onFileDialogCancel]);
  /**
   * @constant
   * @type {React.MutableRefObject<HTMLElement>}
   */

  var rootRef = React.useRef(null);
  var inputRef = React.useRef(null);

  var _useReducer = React.useReducer(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var isFocused = state.isFocused,
      isFileDialogActive = state.isFileDialogActive;
  var fsAccessApiWorksRef = React.useRef(typeof window !== "undefined" && window.isSecureContext && useFsAccessApi && canUseFileSystemAccessAPI()); // Update file dialog active state when the window is focused on

  var onWindowFocus = function onWindowFocus() {
    // Execute the timeout only if the file dialog is opened in the browser
    if (!fsAccessApiWorksRef.current && isFileDialogActive) {
      setTimeout(function () {
        if (inputRef.current) {
          var files = inputRef.current.files;

          if (!files.length) {
            dispatch({
              type: "closeDialog"
            });
            onFileDialogCancelCb();
          }
        }
      }, 300);
    }
  };

  React.useEffect(function () {
    window.addEventListener("focus", onWindowFocus, false);
    return function () {
      window.removeEventListener("focus", onWindowFocus, false);
    };
  }, [inputRef, isFileDialogActive, onFileDialogCancelCb, fsAccessApiWorksRef]);
  var dragTargetsRef = React.useRef([]);
  var globalDragTargetsRef = React.useRef([]);

  var onDocumentDrop = function onDocumentDrop(event) {
    if (rootRef.current && rootRef.current.contains(event.target)) {
      // If we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
      return;
    }

    event.preventDefault();
    dragTargetsRef.current = [];
  };

  React.useEffect(function () {
    if (preventDropOnDocument) {
      document.addEventListener("dragover", onDocumentDragOver, false);
      document.addEventListener("drop", onDocumentDrop, false);
    }

    return function () {
      if (preventDropOnDocument) {
        document.removeEventListener("dragover", onDocumentDragOver);
        document.removeEventListener("drop", onDocumentDrop);
      }
    };
  }, [rootRef, preventDropOnDocument]); // Track global drag state for document-level drag events

  React.useEffect(function () {
    var onDocumentDragEnter = function onDocumentDragEnter(event) {
      globalDragTargetsRef.current = [].concat(_toConsumableArray(globalDragTargetsRef.current), [event.target]);

      if (isEvtWithFiles(event)) {
        dispatch({
          isDragGlobal: true,
          type: "setDragGlobal"
        });
      }
    };

    var onDocumentDragLeave = function onDocumentDragLeave(event) {
      // Only deactivate once we've left all children
      globalDragTargetsRef.current = globalDragTargetsRef.current.filter(function (el) {
        return el !== event.target && el !== null;
      });

      if (globalDragTargetsRef.current.length > 0) {
        return;
      }

      dispatch({
        isDragGlobal: false,
        type: "setDragGlobal"
      });
    };

    var onDocumentDragEnd = function onDocumentDragEnd() {
      globalDragTargetsRef.current = [];
      dispatch({
        isDragGlobal: false,
        type: "setDragGlobal"
      });
    };

    var onDocumentDropGlobal = function onDocumentDropGlobal() {
      globalDragTargetsRef.current = [];
      dispatch({
        isDragGlobal: false,
        type: "setDragGlobal"
      });
    };

    document.addEventListener("dragenter", onDocumentDragEnter, false);
    document.addEventListener("dragleave", onDocumentDragLeave, false);
    document.addEventListener("dragend", onDocumentDragEnd, false);
    document.addEventListener("drop", onDocumentDropGlobal, false);
    return function () {
      document.removeEventListener("dragenter", onDocumentDragEnter);
      document.removeEventListener("dragleave", onDocumentDragLeave);
      document.removeEventListener("dragend", onDocumentDragEnd);
      document.removeEventListener("drop", onDocumentDropGlobal);
    };
  }, [rootRef]); // Auto focus the root when autoFocus is true

  React.useEffect(function () {
    if (!disabled && autoFocus && rootRef.current) {
      rootRef.current.focus();
    }

    return function () {};
  }, [rootRef, autoFocus, disabled]);
  var onErrCb = React.useCallback(function (e) {
    if (onError) {
      onError(e);
    } else {
      // Let the user know something's gone wrong if they haven't provided the onError cb.
      console.error(e);
    }
  }, [onError]);
  var onDragEnterCb = React.useCallback(function (event) {
    event.preventDefault(); // Persist here because we need the event later after getFilesFromEvent() is done

    event.persist();
    stopPropagation(event);
    dragTargetsRef.current = [].concat(_toConsumableArray(dragTargetsRef.current), [event.target]);

    if (isEvtWithFiles(event)) {
      Promise.resolve(getFilesFromEvent(event)).then(function (files) {
        if (isPropagationStopped(event) && !noDragEventsBubbling) {
          return;
        }

        var fileCount = files.length;
        var isDragAccept = fileCount > 0 && allFilesAccepted({
          files: files,
          accept: acceptAttr,
          minSize: minSize,
          maxSize: maxSize,
          multiple: multiple,
          maxFiles: maxFiles,
          validator: validator
        });
        var isDragReject = fileCount > 0 && !isDragAccept;
        dispatch({
          isDragAccept: isDragAccept,
          isDragReject: isDragReject,
          isDragActive: true,
          type: "setDraggedFiles"
        });

        if (onDragEnter) {
          onDragEnter(event);
        }
      }).catch(function (e) {
        return onErrCb(e);
      });
    }
  }, [getFilesFromEvent, onDragEnter, onErrCb, noDragEventsBubbling, acceptAttr, minSize, maxSize, multiple, maxFiles, validator]);
  var onDragOverCb = React.useCallback(function (event) {
    event.preventDefault();
    event.persist();
    stopPropagation(event);
    var hasFiles = isEvtWithFiles(event);

    if (hasFiles && event.dataTransfer) {
      try {
        event.dataTransfer.dropEffect = "copy";
      } catch (_unused) {}
      /* eslint-disable-line no-empty */

    }

    if (hasFiles && onDragOver) {
      onDragOver(event);
    }

    return false;
  }, [onDragOver, noDragEventsBubbling]);
  var onDragLeaveCb = React.useCallback(function (event) {
    event.preventDefault();
    event.persist();
    stopPropagation(event); // Only deactivate once the dropzone and all children have been left

    var targets = dragTargetsRef.current.filter(function (target) {
      return rootRef.current && rootRef.current.contains(target);
    }); // Make sure to remove a target present multiple times only once
    // (Firefox may fire dragenter/dragleave multiple times on the same element)

    var targetIdx = targets.indexOf(event.target);

    if (targetIdx !== -1) {
      targets.splice(targetIdx, 1);
    }

    dragTargetsRef.current = targets;

    if (targets.length > 0) {
      return;
    }

    dispatch({
      type: "setDraggedFiles",
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false
    });

    if (isEvtWithFiles(event) && onDragLeave) {
      onDragLeave(event);
    }
  }, [rootRef, onDragLeave, noDragEventsBubbling]);
  var setFiles = React.useCallback(function (files, event) {
    var acceptedFiles = [];
    var fileRejections = [];
    files.forEach(function (file) {
      var _fileAccepted = fileAccepted(file, acceptAttr),
          _fileAccepted2 = _slicedToArray(_fileAccepted, 2),
          accepted = _fileAccepted2[0],
          acceptError = _fileAccepted2[1];

      var _fileMatchSize = fileMatchSize(file, minSize, maxSize),
          _fileMatchSize2 = _slicedToArray(_fileMatchSize, 2),
          sizeMatch = _fileMatchSize2[0],
          sizeError = _fileMatchSize2[1];

      var customErrors = validator ? validator(file) : null;

      if (accepted && sizeMatch && !customErrors) {
        acceptedFiles.push(file);
      } else {
        var errors = [acceptError, sizeError];

        if (customErrors) {
          errors = errors.concat(customErrors);
        }

        fileRejections.push({
          file: file,
          errors: errors.filter(function (e) {
            return e;
          })
        });
      }
    });

    if (!multiple && acceptedFiles.length > 1 || multiple && maxFiles >= 1 && acceptedFiles.length > maxFiles) {
      // Reject everything and empty accepted files
      acceptedFiles.forEach(function (file) {
        fileRejections.push({
          file: file,
          errors: [TOO_MANY_FILES_REJECTION]
        });
      });
      acceptedFiles.splice(0);
    }

    dispatch({
      acceptedFiles: acceptedFiles,
      fileRejections: fileRejections,
      type: "setFiles"
    });

    if (onDrop) {
      onDrop(acceptedFiles, fileRejections, event);
    }

    if (fileRejections.length > 0 && onDropRejected) {
      onDropRejected(fileRejections, event);
    }

    if (acceptedFiles.length > 0 && onDropAccepted) {
      onDropAccepted(acceptedFiles, event);
    }
  }, [dispatch, multiple, acceptAttr, minSize, maxSize, maxFiles, onDrop, onDropAccepted, onDropRejected, validator]);
  var onDropCb = React.useCallback(function (event) {
    event.preventDefault(); // Persist here because we need the event later after getFilesFromEvent() is done

    event.persist();
    stopPropagation(event);
    dragTargetsRef.current = [];

    if (isEvtWithFiles(event)) {
      Promise.resolve(getFilesFromEvent(event)).then(function (files) {
        if (isPropagationStopped(event) && !noDragEventsBubbling) {
          return;
        }

        setFiles(files, event);
      }).catch(function (e) {
        return onErrCb(e);
      });
    }

    dispatch({
      type: "reset"
    });
  }, [getFilesFromEvent, setFiles, onErrCb, noDragEventsBubbling]); // Fn for opening the file dialog programmatically

  var openFileDialog = React.useCallback(function () {
    // No point to use FS access APIs if context is not secure
    // https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts#feature_detection
    if (fsAccessApiWorksRef.current) {
      dispatch({
        type: "openDialog"
      });
      onFileDialogOpenCb(); // https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker

      var opts = {
        multiple: multiple,
        types: pickerTypes
      };
      window.showOpenFilePicker(opts).then(function (handles) {
        return getFilesFromEvent(handles);
      }).then(function (files) {
        setFiles(files, null);
        dispatch({
          type: "closeDialog"
        });
      }).catch(function (e) {
        // AbortError means the user canceled
        if (isAbort(e)) {
          onFileDialogCancelCb(e);
          dispatch({
            type: "closeDialog"
          });
        } else if (isSecurityError(e)) {
          fsAccessApiWorksRef.current = false; // CORS, so cannot use this API
          // Try using the input

          if (inputRef.current) {
            inputRef.current.value = null;
            inputRef.current.click();
          } else {
            onErrCb(new Error("Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."));
          }
        } else {
          onErrCb(e);
        }
      });
      return;
    }

    if (inputRef.current) {
      dispatch({
        type: "openDialog"
      });
      onFileDialogOpenCb();
      inputRef.current.value = null;
      inputRef.current.click();
    }
  }, [dispatch, onFileDialogOpenCb, onFileDialogCancelCb, useFsAccessApi, setFiles, onErrCb, pickerTypes, multiple]); // Cb to open the file dialog when SPACE/ENTER occurs on the dropzone

  var onKeyDownCb = React.useCallback(function (event) {
    // Ignore keyboard events bubbling up the DOM tree
    if (!rootRef.current || !rootRef.current.isEqualNode(event.target)) {
      return;
    }

    if (event.key === " " || event.key === "Enter" || event.keyCode === 32 || event.keyCode === 13) {
      event.preventDefault();
      openFileDialog();
    }
  }, [rootRef, openFileDialog]); // Update focus state for the dropzone

  var onFocusCb = React.useCallback(function () {
    dispatch({
      type: "focus"
    });
  }, []);
  var onBlurCb = React.useCallback(function () {
    dispatch({
      type: "blur"
    });
  }, []); // Cb to open the file dialog when click occurs on the dropzone

  var onClickCb = React.useCallback(function () {
    if (noClick) {
      return;
    } // In IE11/Edge the file-browser dialog is blocking, therefore, use setTimeout()
    // to ensure React can handle state changes
    // See: https://github.com/react-dropzone/react-dropzone/issues/450


    if (isIeOrEdge()) {
      setTimeout(openFileDialog, 0);
    } else {
      openFileDialog();
    }
  }, [noClick, openFileDialog]);

  var composeHandler = function composeHandler(fn) {
    return disabled ? null : fn;
  };

  var composeKeyboardHandler = function composeKeyboardHandler(fn) {
    return noKeyboard ? null : composeHandler(fn);
  };

  var composeDragHandler = function composeDragHandler(fn) {
    return noDrag ? null : composeHandler(fn);
  };

  var stopPropagation = function stopPropagation(event) {
    if (noDragEventsBubbling) {
      event.stopPropagation();
    }
  };

  var getRootProps = React.useMemo(function () {
    return function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$refKey = _ref2.refKey,
          refKey = _ref2$refKey === void 0 ? "ref" : _ref2$refKey,
          role = _ref2.role,
          onKeyDown = _ref2.onKeyDown,
          onFocus = _ref2.onFocus,
          onBlur = _ref2.onBlur,
          onClick = _ref2.onClick,
          onDragEnter = _ref2.onDragEnter,
          onDragOver = _ref2.onDragOver,
          onDragLeave = _ref2.onDragLeave,
          onDrop = _ref2.onDrop,
          rest = _objectWithoutProperties$1(_ref2, _excluded3);

      return _objectSpread$1(_objectSpread$1(_defineProperty$1({
        onKeyDown: composeKeyboardHandler(composeEventHandlers(onKeyDown, onKeyDownCb)),
        onFocus: composeKeyboardHandler(composeEventHandlers(onFocus, onFocusCb)),
        onBlur: composeKeyboardHandler(composeEventHandlers(onBlur, onBlurCb)),
        onClick: composeHandler(composeEventHandlers(onClick, onClickCb)),
        onDragEnter: composeDragHandler(composeEventHandlers(onDragEnter, onDragEnterCb)),
        onDragOver: composeDragHandler(composeEventHandlers(onDragOver, onDragOverCb)),
        onDragLeave: composeDragHandler(composeEventHandlers(onDragLeave, onDragLeaveCb)),
        onDrop: composeDragHandler(composeEventHandlers(onDrop, onDropCb)),
        role: typeof role === "string" && role !== "" ? role : "presentation"
      }, refKey, rootRef), !disabled && !noKeyboard ? {
        tabIndex: 0
      } : {}), rest);
    };
  }, [rootRef, onKeyDownCb, onFocusCb, onBlurCb, onClickCb, onDragEnterCb, onDragOverCb, onDragLeaveCb, onDropCb, noKeyboard, noDrag, disabled]);
  var onInputElementClick = React.useCallback(function (event) {
    event.stopPropagation();
  }, []);
  var getInputProps = React.useMemo(function () {
    return function () {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$refKey = _ref3.refKey,
          refKey = _ref3$refKey === void 0 ? "ref" : _ref3$refKey,
          onChange = _ref3.onChange,
          onClick = _ref3.onClick,
          rest = _objectWithoutProperties$1(_ref3, _excluded4);

      var inputProps = _defineProperty$1({
        accept: acceptAttr,
        multiple: multiple,
        type: "file",
        style: {
          border: 0,
          clip: "rect(0, 0, 0, 0)",
          clipPath: "inset(50%)",
          height: "1px",
          margin: "0 -1px -1px 0",
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          width: "1px",
          whiteSpace: "nowrap"
        },
        onChange: composeHandler(composeEventHandlers(onChange, onDropCb)),
        onClick: composeHandler(composeEventHandlers(onClick, onInputElementClick)),
        tabIndex: -1
      }, refKey, inputRef);

      return _objectSpread$1(_objectSpread$1({}, inputProps), rest);
    };
  }, [inputRef, accept, multiple, onDropCb, disabled]);
  return _objectSpread$1(_objectSpread$1({}, state), {}, {
    isFocused: isFocused && !disabled,
    getRootProps: getRootProps,
    getInputProps: getInputProps,
    rootRef: rootRef,
    inputRef: inputRef,
    open: composeHandler(openFileDialog)
  });
}
/**
 * @param {DropzoneState} state
 * @param {{type: string} & DropzoneState} action
 * @returns {DropzoneState}
 */

function reducer(state, action) {
  /* istanbul ignore next */
  switch (action.type) {
    case "focus":
      return _objectSpread$1(_objectSpread$1({}, state), {}, {
        isFocused: true
      });

    case "blur":
      return _objectSpread$1(_objectSpread$1({}, state), {}, {
        isFocused: false
      });

    case "openDialog":
      return _objectSpread$1(_objectSpread$1({}, initialState), {}, {
        isFileDialogActive: true
      });

    case "closeDialog":
      return _objectSpread$1(_objectSpread$1({}, state), {}, {
        isFileDialogActive: false
      });

    case "setDraggedFiles":
      return _objectSpread$1(_objectSpread$1({}, state), {}, {
        isDragActive: action.isDragActive,
        isDragAccept: action.isDragAccept,
        isDragReject: action.isDragReject
      });

    case "setFiles":
      return _objectSpread$1(_objectSpread$1({}, state), {}, {
        acceptedFiles: action.acceptedFiles,
        fileRejections: action.fileRejections,
        isDragReject: false
      });

    case "setDragGlobal":
      return _objectSpread$1(_objectSpread$1({}, state), {}, {
        isDragGlobal: action.isDragGlobal
      });

    case "reset":
      return _objectSpread$1({}, initialState);

    default:
      return state;
  }
}

function noop() {}

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
}function FaPlus (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"},"child":[]}]})(props);
}function FaSearch (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"},"child":[]}]})(props);
}function FaTimes (props) {
  return GenIcon({"attr":{"viewBox":"0 0 352 512"},"child":[{"tag":"path","attr":{"d":"M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"},"child":[]}]})(props);
}function FaTrash (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"},"child":[]}]})(props);
}function FaUpload (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"},"child":[]}]})(props);
}

const DragDropFile = ({ onFileChange, acceptedFileFormats }) => {
    const [file, setFile] = React.useState(null);
    const onDrop = React.useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            onFileChange(acceptedFiles[0]);
        }
    }, [onFileChange]);
    const accept = acceptedFileFormats && acceptedFileFormats.length > 0
        ? acceptedFileFormats.reduce((acc, format) => {
            acc[format] = [];
            return acc;
        }, {})
        : undefined;
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept,
    });
    const removeFile = () => {
        setFile(null);
        onFileChange(null);
    };
    const viewFile = () => {
        if (file) {
            const url = URL.createObjectURL(file);
            window.open(url, '_blank');
        }
    };
    return (jsxRuntime.jsxs(DropzoneContainer, { ...getRootProps(), "$isDragActive": isDragActive, children: [jsxRuntime.jsx("input", { ...getInputProps() }), jsxRuntime.jsxs(DropzoneContent, { children: [jsxRuntime.jsx(IconWrapper$3, { children: jsxRuntime.jsx(FaUpload, {}) }), jsxRuntime.jsx("p", { children: "Clique ou arraste arquivos aqui." }), acceptedFileFormats && acceptedFileFormats.length > 0 && (jsxRuntime.jsxs("p", { children: ["Formatos aceitos: ", acceptedFileFormats.join(', ')] }))] }), file && (jsxRuntime.jsxs(FileInfoContainer, { children: [jsxRuntime.jsx(FileName, { children: file.name }), jsxRuntime.jsxs(ButtonContainer, { children: [jsxRuntime.jsx(FileActionButton, { onClick: (e) => { e.stopPropagation(); viewFile(); }, children: jsxRuntime.jsx(FaEye, {}) }), jsxRuntime.jsx(FileActionButton, { onClick: (e) => { e.stopPropagation(); removeFile(); }, children: jsxRuntime.jsx(FaTrash, {}) })] })] }))] }));
};
const DropzoneContainer = styled.div `
  width: 100%;
  padding: 20px 10px;
  text-align: center;
  cursor: pointer;
  border: 2px dashed ${({ theme, $isDragActive }) => $isDragActive ? getVariantColor(theme, 'info') : theme.colors.tertiary};
  border-radius: 6px;
  background: ${({ theme, $isDragActive }) => $isDragActive ? getVariantColor(theme, 'info') : 'transparent'};
  color: ${({ theme }) => theme.colors.white};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => getVariantColor(theme, 'info')};
    background: ${({ theme }) => getVariantColor(theme, 'tertiary')};
  }
`;
const DropzoneContent = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;
const IconWrapper$3 = styled.div `
  font-size: 32px;
  margin-bottom: 4px;
`;
const FileInfoContainer = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 4px;
`;
const FileName = styled.span `
  color: ${({ theme }) => getVariantColor(theme, 'info')};
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const ButtonContainer = styled.div `
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`;
const FileActionButton = styled.button `
  padding: 6px 8px;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 50%;
  cursor: pointer;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const Button = ({ variant, description, width, height, icon, hint, disabled, disabledHover, style, ...props }) => {
    return (jsxRuntime.jsxs(StyledButton, { "$variant": variant, "$width": width, "$height": height, "$hasDescription": !!description, "$customStyle": style, title: hint, disabled: disabled, "$disabledHover": disabledHover, ...props, children: [icon && jsxRuntime.jsx(IconWrapper$2, { children: icon }), description && jsxRuntime.jsx(Description, { children: description })] }));
};
const getButtonVariantStyles = (variant, theme) => {
    if (!variant)
        return '';
    return styled.css `
    background-color: ${getVariantColor(theme, variant)};
    color: ${theme.colors.white};
  `;
};
const StyledButton = styled.button `
  box-sizing: border-box;
  border: ${({ $hasDescription, theme }) => ($hasDescription ? `1px solid ${theme.colors.gray}` : 'none')};
  border-radius: 6px;
  padding: ${({ $hasDescription }) => ($hasDescription ? '8px 16px' : '0')};
  font-size: 0.95em;
  font-weight: 600;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  outline: none;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  opacity: ${props => (props.disabled ? '0.3' : '1')};
  width: ${props => props.$width || 'auto'};
  height: ${props => props.$height || 'auto'};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: ${props => (props.$disabledHover ? '1' : '0.85')};
  }

  ${({ $variant, theme }) => getButtonVariantStyles($variant, theme)}

  ${props => props.$customStyle && styled.css `${convertReactStyleToCSSObject(props.$customStyle)}`}
`;
const IconWrapper$2 = styled.span `
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Description = styled.span `
  margin-left: 8px;
`;

const Modal = ({ isOpen, title, content, onClose, variant = 'warning', actions, showCloseButton = true, closeButtonSize = '20px', modalWidth = '500px', maxWidth, modalHeight = 'auto', icon = jsxRuntime.jsx(FaExclamationTriangle, {}) }) => {
    if (!isOpen)
        return null;
    return (jsxRuntime.jsx(ModalOverlay, { onClick: onClose, children: jsxRuntime.jsxs(ModalContainer, { onClick: (e) => e.stopPropagation(), "$width": modalWidth, "$maxWidth": maxWidth, "$height": modalHeight, children: [jsxRuntime.jsxs(ModalHeader, { "$variant": variant, children: [jsxRuntime.jsxs(HeaderLeft, { children: [icon && jsxRuntime.jsx(IconWrapper$1, { children: icon }), jsxRuntime.jsx(ModalTitle, { children: title })] }), showCloseButton && (jsxRuntime.jsx(Button, { width: closeButtonSize, height: closeButtonSize, style: {
                                backgroundColor: 'transparent',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }, icon: jsxRuntime.jsx(FaTimes, {}), hint: "Fechar", onClick: onClose }))] }), jsxRuntime.jsx(ModalContent, { children: content }), actions && jsxRuntime.jsx(ModalActions, { children: actions })] }) }));
};
const ModalOverlay = styled.div `
  z-index: 1000;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;
const ModalContainer = styled.div `
  width: ${({ $width }) => $width};
  max-width: ${({ $maxWidth }) => $maxWidth ?? '90%'};
  height: ${({ $height }) => $height};
  max-height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  box-shadow: 0 0 5px 5px ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const ModalHeader = styled.div `
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ $variant, theme }) => getVariantColor(theme, $variant)};
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
const IconWrapper$1 = styled.span `
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
  min-height: 0;
  overflow-y: auto;
  overflow-wrap: break-word;
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
    const renderButton = (label, variant, onClick, props) => (jsxRuntime.jsx(Button, { variant: variant, width: "100px", height: "30px", style: defaultButtonStyle, description: label, onClick: onClick, ...props }));
    return (jsxRuntime.jsx(Modal, { isOpen: isOpen, variant: variantPrimary, title: title, content: content, modalWidth: modalWidth, maxWidth: "85%", onClose: onClose, showCloseButton: false, actions: jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [renderButton(cancelLabel, variantSecondary, onClose, cancelButtonProps), renderButton(confirmLabel, variantPrimary, () => {
                    onConfirm();
                    onClose();
                }, confirmButtonProps)] }) }));
};

const Container$1 = ({ children, height, width, maxWidth, margin, padding, backgroundColor, variantColor, style, }) => (jsxRuntime.jsx(StyledContainer, { "$height": height, "$width": width, "$maxWidth": maxWidth, "$margin": margin, "$padding": padding, "$backgroundColor": backgroundColor, "$variantColor": variantColor, style: style, children: children }));
const StyledContainer = styled.div `
  box-sizing: border-box;
  height: ${({ $height }) => $height || 'auto'};
  width: ${({ $width }) => $width || '100%'};
  margin: ${({ $margin }) => $margin || '0'};
  padding: ${({ $padding }) => $padding || '0'};
  max-width: ${({ $maxWidth }) => $maxWidth || 'none'};

  background-color: ${({ theme, $variantColor, $backgroundColor }) => $variantColor ? theme.colors[$variantColor] : $backgroundColor};
`;

const FieldValue = ({ type, value = '', variant, description, hint, editable = true, width, maxWidth, maxHeight, minValue, maxValue, inputWidth, inline, options, icon, padding, placeholder, maxDecimalPlaces = 2, maxIntegerDigits = 8, onUpdate, onKeyDown, }) => {
    const displayValue = formatFieldValueToString(type, value);
    const handleChange = (event) => {
        if (!onUpdate)
            return;
        let val = event.target.value;
        switch (type) {
            case 'NUMBER':
                val = formatNumericInputWithLimits(val, maxIntegerDigits, maxDecimalPlaces, minValue, maxValue);
                break;
            case 'BOOLEAN':
                val = val === 'true';
                break;
            case 'DATE':
                val = parseDateStringToDate(val);
                break;
        }
        onUpdate(val);
    };
    const renderInput = () => (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [icon && jsxRuntime.jsx(Icon, { children: icon }), jsxRuntime.jsx(StyledInput, { type: editable ? type : 'string', readOnly: !editable, disabled: !editable, value: displayValue, onChange: handleChange, onKeyDown: onKeyDown, placeholder: placeholder, "$inputWidth": inputWidth, "$inline": inline, "$variant": variant, "$editable": editable })] }));
    const renderSelect = () => (jsxRuntime.jsxs(StyledSelect, { value: displayValue, onChange: handleChange, disabled: !editable, "$inputWidth": inputWidth, "$inline": inline, "$variant": variant, "$editable": editable, children: [type === 'SELECT' && jsxRuntime.jsx("option", { value: "", children: placeholder || 'Selecione...' }), type === 'SELECT'
                ? options?.map(opt => jsxRuntime.jsx("option", { value: opt.key, children: opt.value }, opt.key))
                : (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("option", { value: "true", children: "Sim" }), jsxRuntime.jsx("option", { value: "false", children: "N\u00E3o" })] }))] }));
    return (jsxRuntime.jsxs(FieldWrapper$2, { "$width": width, "$maxWidth": maxWidth, "$maxHeight": maxHeight, "$inline": inline, "$padding": padding, children: [description && jsxRuntime.jsx(Label$1, { title: hint, children: description }), type === 'SELECT' || type === 'BOOLEAN' ? renderSelect() : renderInput()] }));
};
const FieldWrapper$2 = styled.div `
  box-sizing: border-box;
  width: ${({ $width }) => $width || '100%'};
  max-width: ${({ $maxWidth }) => $maxWidth || '100%'};
  max-height: ${({ $maxHeight }) => $maxHeight || 'none'};
  height: 100%;
  min-height: 36px;
  padding: ${({ $padding }) => $padding || '5px'};
  display: flex;
  flex-direction: ${({ $inline }) => ($inline ? 'row' : 'column')};
  align-items: ${({ $inline }) => ($inline ? 'center' : 'stretch')};
`;
const Label$1 = styled.span `
  color: ${({ theme }) => theme.colors.quaternary};
  font-weight: bold;
  font-size: 15px;
  height: 100%;
  display: flex;
  align-items: center;
`;
const StyledInput = styled.input `
  box-sizing: border-box;
  width: ${({ $inputWidth }) => $inputWidth || '100%'};
  font-size: 15px;
  height: 100%;
  min-height: 26px;
  outline: none;
  background-color: transparent;
  margin-left: ${({ $inline }) => ($inline ? '5px' : '0')};
  cursor: ${({ $editable }) => ($editable === false ? 'not-allowed' : 'pointer')};

  &[type=number]::-webkit-outer-spin-button,
  &[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(100%);
  }

  ${({ $variant, theme }) => $variant &&
    styled.css `
      color: ${getVariantColor(theme, $variant)};
    `}
`;
const StyledSelect = styled.select `
  width: ${({ $inputWidth }) => $inputWidth || '100%'};
  font-size: 15px;
  height: 100%;
  min-height: 26px;
  outline: none;
  background-color: transparent;
  margin-left: ${({ $inline }) => ($inline ? '5px' : '0')};
  cursor: ${({ $editable }) => ($editable === false ? 'not-allowed' : 'pointer')};

  ${({ $variant, theme }) => $variant &&
    styled.css `
      color: ${getVariantColor(theme, $variant)};
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

const FieldTextArea = React.memo(({ value = '', variant, description, hint, editable = true, width, maxWidth, maxLength = 500, minRows = 1, inline, padding, placeholder, onUpdate, }) => {
    const textareaRef = React.useRef(null);
    React.useEffect(() => {
        const el = textareaRef.current;
        if (!el)
            return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);
    const handleChange = (event) => {
        if (!onUpdate)
            return;
        onUpdate(event.target.value);
    };
    return (jsxRuntime.jsxs(FieldWrapper$1, { "$width": width, "$maxWidth": maxWidth, "$inline": inline, "$padding": padding, children: [description && jsxRuntime.jsx(Label, { title: hint, children: description }), jsxRuntime.jsx(StyledTextArea, { ref: textareaRef, value: value, onChange: handleChange, readOnly: !editable, disabled: !editable, maxLength: maxLength, placeholder: placeholder, rows: minRows, "$variant": variant, "$editable": editable, "$inline": inline })] }));
});
const FieldWrapper$1 = styled.div `
  box-sizing: border-box;
  width: ${({ $width }) => $width || '100%'};
  max-width: ${({ $maxWidth }) => $maxWidth || '100%'};
  height: auto;
  padding: ${({ $padding }) => $padding || '5px'};
  display: flex;
  flex-direction: ${({ $inline }) => ($inline ? 'row' : 'column')};
  align-items: ${({ $inline }) => ($inline ? 'flex-start' : 'stretch')};
`;
const Label = styled.span `
  color: ${({ theme }) => theme.colors.quaternary};
  font-weight: bold;
  font-size: 15px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-right: 5px;
`;
const StyledTextArea = styled.textarea `
  box-sizing: border-box;
  width: 100%;
  font-size: 15px;
  outline: none;
  background-color: transparent;
  margin-left: ${({ $inline }) => ($inline ? '5px' : '0')};
  cursor: ${({ $editable }) => ($editable === false ? 'not-allowed' : 'text')};
  resize: ${({ $editable }) => ($editable === false ? 'none' : 'vertical')};
  overflow: hidden;
  min-height: 25px;
  line-height: 1.4;
  font-family: inherit;
  padding: 4px;

  ${({ $variant, theme }) => $variant &&
    styled.css `
      color: ${getVariantColor(theme, $variant)};
    `}
`;

const ImagePicker = ({ imageUrl, onChange, size = '150px', borderColor, isLoading = false, icon, }) => {
    const fileInputRef = React.useRef(null);
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
    return (jsxRuntime.jsxs(Container, { "$size": size, children: [jsxRuntime.jsx(Avatar, { src: imageUrl || '/default-profile-image.png', alt: "Profile", "$borderColor": borderColor, "$isLoading": isLoading }), isLoading && jsxRuntime.jsx(Spinner$1, {}), jsxRuntime.jsx(CameraButton, { onClick: handleImageClick, "$borderColor": borderColor, disabled: isLoading, "aria-label": "Upload image", children: icon }), jsxRuntime.jsx("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: "image/*", style: { display: 'none' } })] }));
};
const Container = styled.div `
  position: relative;
  width: ${props => props.$size};
  height: ${props => props.$size};
  margin: 0 auto;
`;
const Avatar = styled.img `
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${props => props.$borderColor || props.theme.colors.quaternary};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.$isLoading ? 0.7 : 1};
`;
const spin$1 = styled.keyframes `
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
`;
const Spinner$1 = styled.div `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid ${props => props.theme.colors.quaternary};
  border-radius: 50%;
  animation: ${spin$1} 1s linear infinite;
`;
const CameraButton = styled.button `
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${props => props.$borderColor || props.theme.colors.quaternary};
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
    const [shouldDisplay, setShouldDisplay] = React.useState(false);
    const theme = styled.useTheme();
    React.useEffect(() => {
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
    return (jsxRuntime.jsx(Container$1, { width: "100vw", height: "100vh", backgroundColor: "transparent", style: {
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        }, children: jsxRuntime.jsx("div", { dangerouslySetInnerHTML: { __html: svgContent } }) }));
};

const Panel = ({ title, children, footer, width, maxWidth, padding, actionButton, style, transparent = false }) => {
    return (jsxRuntime.jsxs(Container$1, { width: width || '100%', maxWidth: maxWidth, padding: padding, margin: "auto", backgroundColor: "transparent", style: style, children: [(title || actionButton) && (jsxRuntime.jsxs(Title, { children: [jsxRuntime.jsx(TitleContent, { children: title }), actionButton && jsxRuntime.jsx(ActionContainer, { children: actionButton })] })), jsxRuntime.jsxs(Container$1, { width: "100%", variantColor: transparent ? undefined : "secondary", backgroundColor: transparent ? "transparent" : undefined, margin: "20px 0 0 0", style: transparent ?
                    {} :
                    {
                        boxShadow: '0 0 2px',
                        borderRadius: '5px',
                    }, children: [jsxRuntime.jsx(Body, { children: children }), footer && jsxRuntime.jsx(Footer, { children: footer })] })] }));
};
const Title = styled.div `
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
`;
const TitleContent = styled.div `
  min-width: 0;
  flex: 1;
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

const Stack = ({ children, width, height, direction = 'row', divider, style, alignCenter, alignRight, justifyCenter, justifyBetween, gap, wrap }) => {
    return (jsxRuntime.jsx(StackContainer, { "$direction": direction, "$divider": divider, "$gap": gap, "$width": width, "$height": height, "$alignCenter": alignCenter, "$alignRight": alignRight, "$justifyCenter": justifyCenter, "$justifyBetween": justifyBetween, "$wrap": wrap, style: style, children: children }));
};
const StackContainer = styled.div `
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || 'auto'};

  ${({ $divider, $direction }) => $divider === 'x' && $direction === 'row'
    ? styled.css `
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 1fr;
        `
    : styled.css `
          display: flex;
          flex-direction: ${$direction};
          flex-wrap: nowrap;
        `}

  ${({ $wrap, $direction }) => $wrap && $direction === 'row' && 'flex-wrap: wrap;'}

  ${({ $alignCenter }) => $alignCenter && 'align-items: center;'}
  ${({ $alignRight }) => $alignRight && 'align-items: flex-end;'}
  ${({ $justifyCenter }) => $justifyCenter && 'justify-content: center;'}
  ${({ $justifyBetween }) => $justifyBetween && 'justify-content: space-between;'}

  ${({ $gap }) => $gap && `gap: ${$gap};`}

  ${({ $divider, $direction, theme }) => $divider &&
    styled.css `
      > * + * {
        ${(() => {
        const color = theme.colors.gray;
        if ($direction === 'row') {
            if ($divider === 'left' || $divider === 'x')
                return `border-left: 1px solid ${color};`;
            if ($divider === 'right')
                return `border-right: 1px solid ${color};`;
        }
        if ($direction === 'column') {
            if ($divider === 'top' || $divider === 'y')
                return `border-top: 1px solid ${color};`;
            if ($divider === 'bottom')
                return `border-bottom: 1px solid ${color};`;
        }
        return '';
    })()}
      }
    `}
`;

const UI_TEXT = {
    pt: { selectPlaceholder: 'Selecione...', addHint: 'Adicionar' },
    en: { selectPlaceholder: 'Select...', addHint: 'Add' },
};
const SearchFilterRSQL = ({ fields, onSearch, locale = 'pt' }) => {
    const text = UI_TEXT[locale];
    const [selectedField, setSelectedField] = React.useState(null);
    const [selectedOperator, setSelectedOperator] = React.useState(null);
    const [searchValue, setSearchValue] = React.useState(null);
    const [filters, setFilters] = React.useState([]);
    React.useEffect(() => {
        if (!searchValue && selectedField) {
            const type = selectedField.type.toUpperCase();
            if (type === 'DATE')
                setSearchValue(formatDateToYMDString(new Date()));
            if (type === 'BOOLEAN')
                setSearchValue('true');
        }
    }, [selectedField]);
    const resetState = () => {
        setSelectedField(null);
        setSelectedOperator(null);
        setSearchValue(null);
    };
    const formatDate = (value) => {
        if (value instanceof Date)
            return formatDateToYMDString(value);
        const parsed = parseDateStringToDate(value);
        return parsed ? formatDateToYMDString(parsed) : '';
    };
    const getFormattedValue = (f) => {
        const field = fields.find(fd => fd.name === f.field);
        if (!field)
            return f.value;
        switch (f.type) {
            case 'BOOLEAN':
                return formatBooleanToSimNao(f.value);
            case 'SELECT':
                return field.type === 'SELECT'
                    ? field.options.find(opt => opt.key === f.value)?.value || f.value
                    : f.value;
            case 'DATE':
                return formatIsoDateToBrDate(f.value);
            default:
                return f.value;
        }
    };
    const buildRsqlString = (filters) => filters
        .map(({ field, operator, value }) => {
        let formattedOperator = operator;
        if (formattedOperator === 'LIKE')
            formattedOperator = '=ilike=';
        else if (!formattedOperator.includes('='))
            formattedOperator = `=${formattedOperator}=`;
        return `${field}${formattedOperator}${value}`;
    })
        .join(';');
    const handleFieldChange = (fieldName) => {
        const field = fields.find(f => f.name === fieldName);
        if (!field)
            return resetState();
        setSelectedField(field);
        setSelectedOperator(getOperators(field.type, locale)[0]);
        setSearchValue(null);
    };
    const isDuplicateFilter = (newFilter) => filters.some(f => f.field === newFilter.field && f.operator === newFilter.operator && f.value === newFilter.value);
    const handleAdd = () => {
        if (!selectedField || !selectedOperator || searchValue === null)
            return;
        const valueFormatted = selectedField.type === 'DATE' ? formatDate(searchValue) : String(searchValue);
        const newFilter = {
            field: selectedField.name,
            operator: selectedOperator.symbol,
            operadorDescr: selectedOperator.name,
            value: valueFormatted,
            type: selectedField.type
        };
        if (isDuplicateFilter(newFilter)) {
            resetState();
            return;
        }
        const updatedFilters = [...filters, newFilter];
        setFilters(updatedFilters);
        onSearch(buildRsqlString(updatedFilters));
        resetState();
    };
    const handleRemove = (index) => {
        const updated = filters.filter((_, i) => i !== index);
        setFilters(updated);
        onSearch(buildRsqlString(updated));
    };
    const isAddButtonDisabled = () => {
        if (!selectedField || !selectedOperator)
            return true;
        if (selectedField.type === 'DATE') {
            if (!searchValue)
                return true;
            const date = parseDateStringToDate(formatDate(searchValue));
            return !date || isNaN(date.getTime());
        }
        return searchValue === null || searchValue === '';
    };
    return (jsxRuntime.jsx(Container$1, { children: jsxRuntime.jsxs(Stack, { direction: "column", divider: "top", children: [jsxRuntime.jsxs(FilterFieldsRow, { children: [jsxRuntime.jsx(FieldValue, { type: "SELECT", value: selectedField?.name || '', options: fields.map(({ name, label }) => ({ key: name, value: label })), onUpdate: handleFieldChange, editable: true, placeholder: text.selectPlaceholder }), jsxRuntime.jsx(FieldValue, { type: "SELECT", value: selectedOperator?.name || '', options: selectedField
                                ? getOperators(selectedField.type, locale).map(({ name }) => ({ key: name, value: name }))
                                : [], onUpdate: (val) => {
                                const op = selectedField && getOperators(selectedField.type, locale).find(o => o.name === val);
                                if (op)
                                    setSelectedOperator(op);
                            }, editable: !!selectedField, placeholder: text.selectPlaceholder }), jsxRuntime.jsx(FieldValue, { type: selectedField?.type || 'STRING', value: searchValue || '', onUpdate: setSearchValue, editable: !!selectedOperator, options: selectedField?.type === 'SELECT' ? selectedField.options : undefined, onKeyDown: (e) => e.key === 'Enter' && handleAdd(), placeholder: text.selectPlaceholder }), jsxRuntime.jsx(Button, { icon: jsxRuntime.jsx(FaPlus, {}), onClick: handleAdd, hint: text.addHint, variant: "success", width: "36px", height: "36px", disabled: isAddButtonDisabled(), style: { borderRadius: '0 5px 0 0', flexShrink: 0 } })] }), filters.length > 0 ? (jsxRuntime.jsx(Tags, { children: filters.map((f, i) => (jsxRuntime.jsxs(Tag, { children: [jsxRuntime.jsxs("span", { children: [fields.find(fd => fd.name === f.field)?.label, " ", f.operadorDescr, " ", getFormattedValue(f)] }), jsxRuntime.jsx(Button, { icon: jsxRuntime.jsx(FaTimes, {}), onClick: () => handleRemove(i), variant: "warning", height: "20px", width: "20px", style: {
                                    borderRadius: '50%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    display: 'flex'
                                } })] }, i))) })) : (jsxRuntime.jsx(EmptyTags, {}))] }) }));
};
const FILTER_ROW_STACK_BREAKPOINT = '700px';
const FilterFieldsRow = styled.div `
  display: flex;
  flex-wrap: nowrap;

  > * + * {
    border-left: 1px solid ${({ theme }) => theme.colors.gray};
  }

  @media (max-width: ${FILTER_ROW_STACK_BREAKPOINT}) {
    flex-wrap: wrap;

    > *:nth-child(1),
    > *:nth-child(2) {
      flex: 1 1 50%;
      min-width: 0;
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
    }

    > *:nth-child(3) {
      flex: 1 1 0;
      min-width: 0;
      border-left: none;
    }

    > *:nth-child(4) {
      flex: 0 0 auto;
      border-radius: 0;
    }
  }
`;
const Tags = styled.div `
  background-color: ${({ theme }) => theme.colors.tertiary};
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
const EmptyTags = styled.div `
  background-color: ${({ theme }) => theme.colors.tertiary};
`;
const Tag = styled.div `
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 5px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const usePaginationState = (page) => {
    const [currentPageIndex, setCurrentPageIndex] = React.useState(page.number);
    React.useEffect(() => {
        setCurrentPageIndex(page.number);
    }, [page.number]);
    return React.useMemo(() => ({
        isFirstPage: currentPageIndex === 0,
        isLastPage: currentPageIndex === page.totalPages - 1,
        currentPage: currentPageIndex,
        totalPages: page.totalPages,
        pageSize: page.size,
    }), [currentPageIndex, page.totalPages, page.size]);
};
const useNavigationHandlers = (loadPage, state) => {
    const { currentPage, totalPages, pageSize } = state;
    return React.useMemo(() => ({
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
    return (jsxRuntime.jsxs(StyledPaginationControls, { children: [jsxRuntime.jsx(ControlItem, { onClick: goToFirst, "$disabled": isFirstPage, children: jsxRuntime.jsx(FaAngleDoubleLeft, {}) }), jsxRuntime.jsx(ControlItem, { onClick: goToPrevious, "$disabled": isFirstPage, children: jsxRuntime.jsx(FaAngleLeft, {}) }), jsxRuntime.jsxs(PageIndicator, { children: [currentPage + 1, " / ", totalPages] }), jsxRuntime.jsx(ControlItem, { onClick: goToNext, "$disabled": isLastPage, children: jsxRuntime.jsx(FaAngleRight, {}) }), jsxRuntime.jsx(ControlItem, { onClick: goToLast, "$disabled": isLastPage, children: jsxRuntime.jsx(FaAngleDoubleRight, {}) })] }));
};
const SearchPagination = ({ page, height, width, loadPage }) => {
    const state = usePaginationState(page);
    const handlers = useNavigationHandlers(loadPage, state);
    return (jsxRuntime.jsx(Container$1, { height: height, width: width, backgroundColor: "transparent", children: jsxRuntime.jsx(Stack, { direction: "row", alignCenter: true, justifyCenter: true, gap: "10px", children: jsxRuntime.jsx(PaginationControls, { state: state, handlers: handlers }) }) }));
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
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? '0.2' : '1'};

  &:hover {
    color: ${({ theme, $disabled }) => $disabled ? theme.colors.white : theme.colors.gray};
  }
`;
const PageIndicator = styled.span `
  margin: 0 8px;
  user-select: none;
`;

const SearchSelectField = ({ label, placeholder, fetchOptions, onSelect, value, loadAllOnFocus = true, disabled = false }) => {
    const [query, setQuery] = React.useState(value?.value || '');
    const [options, setOptions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const containerRef = React.useRef(null);
    const selectedRef = React.useRef(value || null);
    React.useEffect(() => {
        selectedRef.current = value || null;
        setQuery(value?.value || '');
    }, [value]);
    const loadOptions = React.useCallback(async (searchQuery) => {
        setLoading(true);
        try {
            const result = await fetchOptions(searchQuery, 0);
            setOptions(result);
        }
        catch {
            setOptions([]);
        }
        finally {
            setLoading(false);
        }
    }, [fetchOptions]);
    React.useEffect(() => {
        if (!showDropdown)
            return;
        const timeout = setTimeout(() => {
            if (query || loadAllOnFocus)
                loadOptions(query);
        }, 300);
        return () => clearTimeout(timeout);
    }, [query, showDropdown, loadAllOnFocus, loadOptions]);
    const handleFocus = () => {
        if (disabled)
            return;
        setShowDropdown(true);
    };
    const handleBlur = (e) => {
        if (!containerRef.current?.contains(e.relatedTarget)) {
            const selectedKeyNum = Number(selectedRef.current?.key || 0);
            if (!selectedRef.current || selectedKeyNum <= 0) {
                clearSelection();
            }
            else {
                setShowDropdown(false);
            }
        }
    };
    const handleSelect = (option) => {
        setQuery(option.value);
        selectedRef.current = option;
        onSelect(option);
        setShowDropdown(false);
    };
    const clearSelection = () => {
        setQuery('');
        selectedRef.current = null;
        onSelect(undefined);
        setOptions([]);
        setShowDropdown(false);
    };
    const handleQueryChange = (val) => {
        if (disabled)
            return;
        setQuery(val);
        if (selectedRef.current && val !== selectedRef.current.value) {
            selectedRef.current = null;
        }
    };
    const renderIcon = () => {
        if (loading)
            return jsxRuntime.jsx(Spinner, {});
        if (selectedRef.current)
            return (jsxRuntime.jsx(ClearIcon, { onClick: (e) => {
                    e.stopPropagation();
                    clearSelection();
                }, children: jsxRuntime.jsx(FaTimes, {}) }));
        return jsxRuntime.jsx(SearchIcon, { children: jsxRuntime.jsx(FaSearch, {}) });
    };
    return (jsxRuntime.jsxs(Wrapper, { ref: containerRef, tabIndex: -1, onBlur: handleBlur, children: [jsxRuntime.jsxs(FieldWrapper, { onClick: handleFocus, children: [jsxRuntime.jsx(FieldValue, { description: label, type: "STRING", value: query, placeholder: placeholder || 'Digite para pesquisar...', editable: !disabled, onUpdate: handleQueryChange }), jsxRuntime.jsx(IconWrapper, { children: renderIcon() })] }), showDropdown && (jsxRuntime.jsx(Dropdown, { children: loading ? (jsxRuntime.jsx(DropdownItem, { "$disabled": true, children: jsxRuntime.jsx(Spinner, {}) })) : options.length > 0 ? (options.map(option => (jsxRuntime.jsx(DropdownItem, { onClick: () => handleSelect(option), children: option.value }, option.key)))) : (jsxRuntime.jsx(DropdownItem, { "$disabled": true, children: "Nenhum resultado" })) }))] }));
};
const Wrapper = styled.div `
  position: relative;
  width: 100%;
  outline: none;
`;
const FieldWrapper = styled.div `
  position: relative;
  display: flex;
  align-items: center;
  cursor: text;
`;
const IconWrapper = styled.div `
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
`;
const SearchIcon = styled.div `
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
`;
const ClearIcon = styled.div `
  color: ${({ theme }) => theme.colors.tertiary};
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.red};
  }
`;
const spin = styled.keyframes `
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
const Spinner = styled.div `
  border: 2px solid ${({ theme }) => theme.colors.tertiary};
  border-top: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: ${spin} 1s linear infinite;
`;
const Dropdown = styled.div `
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.quaternary};
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  max-height: 250px;
  overflow-y: auto;
`;
const DropdownItem = styled.div `
  padding: 10px;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.tertiary};
  &:hover {
    background-color: ${({ theme, $disabled }) => $disabled ? theme.colors.secondary : theme.colors.tertiary};
  }
`;

function buildSearchSelectAdapter({ searchOptions, mapToOption, mapFromOption, value, onUpdate, pageSize = 10, }) {
    const fetchOptions = async (query, page) => {
        const data = await searchOptions(query, page, pageSize);
        return data.map(mapToOption);
    };
    const onSelect = (selected) => {
        const newValue = selected ? mapFromOption(selected) : undefined;
        onUpdate(newValue);
    };
    const optionValue = value ? mapToOption(value) : undefined;
    return { fetchOptions, onSelect, optionValue };
}

const DEFAULT_STACK_BELOW = '700px';
const stackLabelFor = (column) => column.stackLabel ?? (typeof column.header === 'string' ? column.header : undefined);
const Column = ({}) => null;
const COMMON_BUTTON_STYLES = {
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    height: '25px',
    width: '25px',
};
const TableActions = ({ onView, onEdit, onDelete, visible, customActions, stackBelow = DEFAULT_STACK_BELOW, }) => (jsxRuntime.jsx(ActionsContainer, { children: jsxRuntime.jsxs(ActionsWrapper, { "$visible": visible, "$stackBelow": stackBelow, children: [customActions && (jsxRuntime.jsx(CustomActionWrapper, { children: customActions() })), onView && (jsxRuntime.jsx(Button, { onClick: onView, variant: "success", icon: jsxRuntime.jsx(FaEye, {}), hint: "Visualizar", style: COMMON_BUTTON_STYLES })), onEdit && (jsxRuntime.jsx(Button, { variant: "info", icon: jsxRuntime.jsx(FaEdit, {}), onClick: onEdit, style: COMMON_BUTTON_STYLES })), onDelete && (jsxRuntime.jsx(Button, { variant: "warning", icon: jsxRuntime.jsx(FaTrash, {}), onClick: onDelete, style: COMMON_BUTTON_STYLES }))] }) }));
const isPagedResponse = (values) => typeof values === 'object' && values !== null && 'content' in values;
const getTableData = (values) => isPagedResponse(values) ? values.content || [] : values;
const TableHeader = ({ columns, stackBelow }) => (jsxRuntime.jsx("thead", { children: jsxRuntime.jsx(TableHeadRow, { "$stackBelow": stackBelow, children: columns.map((column, index) => {
            if (!React.isValidElement(column))
                return null;
            const { header, titleAlign = 'center' } = column.props;
            return (jsxRuntime.jsx(TableHeadColumn, { children: jsxRuntime.jsx(TableColumnTitle, { align: titleAlign, children: header }) }, index));
        }) }) }));
const TableBody = ({ data, columns, messageEmpty, keyExtractor, onClickRow, rowSelected, onView, onEdit, onDelete, customActions, hoveredRowIndex, onRowHover, rowHeight, clickableRows, rowClickHint, stackBelow, }) => {
    if (data.length === 0) {
        return (jsxRuntime.jsx("tbody", { children: jsxRuntime.jsx("tr", { children: jsxRuntime.jsx("td", { colSpan: columns.length + 1, children: jsxRuntime.jsx(EmptyMessage, { children: messageEmpty }) }) }) }));
    }
    return (jsxRuntime.jsx("tbody", { children: data.map((item, index) => (jsxRuntime.jsxs(TableRow, { onClick: () => onClickRow?.(item, index), onMouseEnter: () => onRowHover(index), onMouseLeave: () => onRowHover(null), "$clickable": !!clickableRows, "$stackBelow": stackBelow, title: clickableRows ? rowClickHint : undefined, children: [columns.map((column, columnIndex) => {
                    if (!React.isValidElement(column))
                        return null;
                    const columnProps = column.props;
                    const { value, width, align, wrap } = columnProps;
                    const isSelected = rowSelected?.(item) ?? false;
                    return (jsxRuntime.jsx(TableColumn, { "$isSelected": isSelected, "$width": width, "$align": align, "$rowHeight": rowHeight, "$wrap": wrap, "$stackBelow": stackBelow, "data-label": stackLabelFor(columnProps), children: jsxRuntime.jsx(TruncatedContent, { "$wrap": wrap, children: value(item, index) }) }, columnIndex));
                }), jsxRuntime.jsx(ActionColumn, { "$stackBelow": stackBelow, children: jsxRuntime.jsx(TableActions, { onView: onView ? () => onView(item) : undefined, onEdit: onEdit ? () => onEdit(item) : undefined, onDelete: onDelete ? () => onDelete(item) : undefined, visible: hoveredRowIndex === index, customActions: customActions ? () => customActions(item) : undefined, stackBelow: stackBelow }) })] }, keyExtractor(item, index)))) }));
};
const TablePagination = ({ values, loadPage }) => {
    if (!loadPage || !isPagedResponse(values) || values.totalElements <= 0) {
        return null;
    }
    return (jsxRuntime.jsx(SearchPagination, { height: "35px", page: values, loadPage: loadPage }));
};
const Table = ({ values, columns, messageEmpty, keyExtractor, onClickRow, rowSelected, loadPage, onView, onEdit, onDelete, customActions, rowHeight, clickableRows, rowClickHint, stackBelow = DEFAULT_STACK_BELOW, }) => {
    const [hoveredRowIndex, setHoveredRowIndex] = React.useState(null);
    const tableData = React.useMemo(() => getTableData(values), [values]);
    const isEmpty = tableData.length === 0;
    if (isEmpty) {
        return (jsxRuntime.jsx(Container$1, { backgroundColor: "transparent", width: "100%", children: jsxRuntime.jsx(EmptyMessage, { children: messageEmpty }) }));
    }
    return (jsxRuntime.jsxs(Container$1, { backgroundColor: "transparent", width: "100%", children: [jsxRuntime.jsx(TableContainer, { children: jsxRuntime.jsxs(StyledTable, { children: [jsxRuntime.jsx(TableHeader, { columns: columns, stackBelow: stackBelow }), jsxRuntime.jsx(TableBody, { data: tableData, columns: columns, messageEmpty: messageEmpty, keyExtractor: keyExtractor, onClickRow: onClickRow, rowSelected: rowSelected, onView: onView, onEdit: onEdit, onDelete: onDelete, customActions: customActions, hoveredRowIndex: hoveredRowIndex, onRowHover: setHoveredRowIndex, rowHeight: rowHeight, clickableRows: clickableRows, rowClickHint: rowClickHint, stackBelow: stackBelow })] }) }), jsxRuntime.jsx(TablePagination, { values: values, loadPage: loadPage })] }));
};
const TableContainer = styled.div `
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;
const EmptyMessage = styled.div `
  padding: 10px;
`;
const StyledTable = styled.table `
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;
const TableHeadRow = styled.tr `
  border-bottom: 2px solid ${({ theme }) => theme.colors.quaternary};

  @media (max-width: ${({ $stackBelow }) => $stackBelow}) {
    display: none;
  }
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
  height: ${({ $rowHeight }) => $rowHeight || '35px'};
  text-align: ${({ $align }) => $align || 'left'};
  vertical-align: middle;
  border-left: 1px solid ${({ theme }) => theme.colors.gray};
  position: relative;
  white-space: ${({ $wrap }) => ($wrap ? 'normal' : 'nowrap')};
  overflow: hidden;
  text-overflow: ${({ $wrap }) => ($wrap ? 'clip' : 'ellipsis')};
  max-width: ${({ $width }) => $width || 'auto'};
  width: ${({ $width }) => $width || 'auto'};
  padding: 0 5px;
  display: table-cell;

  &:first-child::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 5px;
    background-color: ${({ theme, $isSelected }) => $isSelected ? theme.colors.quaternary : 'transparent'};
  }

  &:first-child {
    border-left: none;
  }

  @media (max-width: ${({ $stackBelow }) => $stackBelow}) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 6px;
    width: 100%;
    max-width: 100%;
    height: auto;
    white-space: normal;
    text-overflow: clip;
    border-left: none;
    padding: 3px 12px;

    & > div {
      width: auto;
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
    }

    &[data-label]::before,
    &:first-child[data-label]::before {
      content: attr(data-label) ':';
      position: static;
      width: auto;
      flex-shrink: 0;
      background: none;
      display: inline;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: ${({ theme }) => theme.colors.quaternary};
    }
  }
`;
const TruncatedContent = styled.div `
  white-space: ${({ $wrap }) => ($wrap ? 'normal' : 'nowrap')};
  overflow: hidden;
  text-overflow: ${({ $wrap }) => ($wrap ? 'clip' : 'ellipsis')};
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
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  }

  @media (max-width: ${({ $stackBelow }) => $stackBelow}) {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 6px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray};

    &:last-child {
      border-bottom: none;
    }
  }
`;
const ActionColumn = styled.td `
  position: sticky;
  right: 0;
  padding: 2px;
  z-index: 2;

  @media (max-width: ${({ $stackBelow }) => $stackBelow}) {
    position: static;
    display: block;
    width: 100%;
  }
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
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  pointer-events: ${({ $visible }) => $visible ? 'auto' : 'none'};
  transition: opacity 0.2s ease-in-out;

  @media (max-width: ${({ $stackBelow }) => $stackBelow}) {
    position: static;
    justify-content: flex-start;
    opacity: 1;
    pointer-events: auto;
  }
`;
const CustomActionWrapper = styled.div `
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  align-items: center;
`;

const Tabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = React.useState(0);
    const handleTabClick = (index) => {
        setActiveTab(index);
    };
    return (jsxRuntime.jsxs(Container$1, { width: '100%', backgroundColor: 'transparent', children: [jsxRuntime.jsx(TabList, { children: tabs.map((tab, index) => (jsxRuntime.jsx(TabButton, { "$active": index === activeTab, onClick: () => handleTabClick(index), children: tab.label }, index))) }), jsxRuntime.jsx(TabContent, { children: tabs[activeTab]?.content })] }));
};
const TabList = styled.div `
  display: flex;
  border-bottom: 2px solid ${({ theme }) => theme.colors.quaternary};
`;
const TabButton = styled.button `
  flex: 1;
  padding: 10px 0px;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  transition: background-color 0.3s, border-right-color 0.3s;

  &:not(:last-child) {
    border-right: 2px solid ${({ theme }) => theme.colors.tertiary};
  }

  &:first-child {
    border-top-left-radius: 5px;
  }

  &:last-child {
    border-top-right-radius: 5px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }

  ${({ $active, theme }) => $active &&
    `
    cursor: default;
    background-color: ${theme.colors.tertiary};
    border-right-color: transparent;
  `}
`;
const TabContent = styled.div `
  padding: 16px;
`;

const DEFAULT_THEME_SYSTEM = {
    title: 'DEFAULT_THEME_SYSTEM',
    colors: {
        primary: '#282a36',
        secondary: '#44475a',
        tertiary: '#6272a4',
        quaternary: '#bd93f9',
        white: '#f8f8f2',
        black: '#000000',
        gray: '#999999',
        success: '#32cd80',
        info: '#5ad4e6',
        warning: '#ff944d',
    },
};

const defaultRenderSvg = (theme) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <circle cx="256" cy="256" r="256" fill="${theme.colors.quaternary}" />
  </svg>
`;
const ThemeFavicon = ({ renderSvg }) => {
    const theme = styled.useTheme() || DEFAULT_THEME_SYSTEM;
    const svgContent = renderSvg ? renderSvg(theme) : defaultRenderSvg(theme);
    React.useEffect(() => {
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

const ThemeSelector = ({ themes, currentTheme, onThemeChange, }) => {
    return (jsxRuntime.jsx(ThemeGrid, { children: themes.map((theme) => (jsxRuntime.jsxs(ThemeItem, { "$isSelected": theme.id === currentTheme, onClick: () => onThemeChange(theme.id), "$borderColor": theme.quaternaryColor, children: [jsxRuntime.jsx(ThemeName, { children: theme.title }), jsxRuntime.jsxs(ColorPalette, { children: [jsxRuntime.jsx(ColorBlock, { "$color": theme.primaryColor }), jsxRuntime.jsx(ColorBlock, { "$color": theme.secondaryColor }), jsxRuntime.jsx(ColorBlock, { "$color": theme.tertiaryColor }), jsxRuntime.jsx(ColorBlock, { "$color": theme.quaternaryColor })] })] }, theme.title))) }));
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
  border: 2px solid ${props => props.$isSelected ? props.$borderColor : 'transparent'};

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
  background-color: ${props => props.$color};
`;

const iconMap = {
    success: jsxRuntime.jsx(FaCheckCircle, {}),
    info: jsxRuntime.jsx(FaInfoCircle, {}),
    error: jsxRuntime.jsx(FaExclamationCircle, {}),
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
    return (jsxRuntime.jsx(ToastContainer, { children: jsxRuntime.jsxs(ToastCard, { "$variant": variant, children: [jsxRuntime.jsx(ToastIcon, { "$variant": variant, children: icon }), jsxRuntime.jsx(ToastMessage, { children: message }), jsxRuntime.jsx(CloseButton, { "$variant": variant, onClick: onClose })] }) }));
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
  color: ${({ theme, $variant }) => theme.colors[$variant]};
  border-left: 5px solid ${({ theme, $variant }) => theme.colors[$variant]};
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
const CloseButtonBase = ({ $variant, ...props }) => (jsxRuntime.jsx("button", { ...props, children: jsxRuntime.jsx(FaTimes, {}) }));
const CloseButton = styled(CloseButtonBase) `
  background: none;
  border: none;
  color: ${({ theme, $variant }) => theme.colors[$variant]};
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

const HighlightBox = ({ variant = 'info', width = '100%', height = '100%', bordered = false, style, children, }) => {
    return (jsxRuntime.jsx(CenterWrapper, { children: jsxRuntime.jsx(Box, { "$variant": variant, "$width": width, "$height": height, "$bordered": bordered, style: style, children: children }) }));
};
const CenterWrapper = styled.div `
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
const Box = styled.div `
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};

  border-radius: 50px;
  background-color: transparent;
  font-weight: bold;
  text-align: center;

  color: ${({ theme, $variant }) => getVariantColor(theme, $variant)};

  ${({ $bordered, theme, $variant }) => $bordered &&
    styled.css `
      border: 1px solid ${getVariantColor(theme, $variant)};
    `}
`;

const Breadcrumb = ({ items, LinkComponent = null }) => {
    if (!items.length)
        return null;
    return (jsxRuntime.jsx(BreadcrumbContainer, { children: items.map((item, index) => (jsxRuntime.jsx("span", { children: item.path && LinkComponent && index < items.length - 1 ? (jsxRuntime.jsx(LinkComponent, { to: item.path, children: item.label })) : (jsxRuntime.jsx("strong", { children: item.label })) }, item.path ?? item.label))) }));
};
const BreadcrumbContainer = styled.nav `
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px;
  font-size: 13px;

  max-width: 100%;
  min-width: 0;

  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;

  -webkit-overflow-scrolling: touch;

  width: 100%;
  max-width: 100%;
  flex: 1;
  min-width: 0;

  span {
    display: inline-flex;
    align-items: center;
    min-width: 0;
  }

  a,
  strong {
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.tertiary};
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.quaternary};
      color: ${({ theme }) => theme.colors.black};
    }
  }

  strong {
    color: ${({ theme }) => theme.colors.quaternary};
  }

  span:not(:last-child)::after {
    content: "›";
    margin: 0 6px;
    color: ${({ theme }) => theme.colors.quaternary};
    flex-shrink: 0;
  }
`;

const ToggleSwitch = ({ optionA, optionB, value, width, maxWidth, onChange }) => (jsxRuntime.jsx(ToggleSwitchContainer, { "$width": width, "$maxWidth": maxWidth, children: [optionA, optionB].map((opt) => (jsxRuntime.jsx(ToggleButtonStyled, { type: "button", "$active": value === opt.value, onClick: () => onChange(opt.value), children: opt.label }, opt.value))) }));
const ToggleSwitchContainer = styled.div `
  box-sizing: border-box;
  display: inline-flex;
  width: ${({ $width }) => $width || "auto"};
  max-width: ${({ $maxWidth }) => $maxWidth || "100%"};
  gap: 2px;
  padding: 3px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.primary};
`;
const ToggleButtonStyled = styled.button `
  box-sizing: border-box;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  white-space: nowrap;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ theme, $active }) => ($active ? theme.colors.white : theme.colors.tertiary)};
  background-color: ${({ theme, $active }) => ($active ? getVariantColor(theme, "quaternary") : "transparent")};
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme, $active }) => ($active ? getVariantColor(theme, "quaternary") : theme.colors.secondary)};
  }
`;

const SummaryCard = ({ label, value, variant }) => (jsxRuntime.jsxs(Card, { "$variant": variant, children: [jsxRuntime.jsx(CardLabel, { children: label }), jsxRuntime.jsx(CardValue, { "$variant": variant, children: value })] }));
const Card = styled.div `
  flex: 1;
  min-width: 180px;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid ${({ theme, $variant }) => getVariantColor(theme, $variant)};
  background: ${({ theme }) => theme.colors.primary};
`;
const CardLabel = styled.div `
  font-size: 12px;
  color: ${({ theme }) => theme.colors.tertiary};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const CardValue = styled.div `
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme, $variant }) => getVariantColor(theme, $variant)};
`;

//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// qrcode
//---------------------------------------------------------------------

/**
 * qrcode
 * @param typeNumber 1 to 40
 * @param errorCorrectionLevel 'L','M','Q','H'
 */
const qrcode = function(typeNumber, errorCorrectionLevel) {

  const PAD0 = 0xEC;
  const PAD1 = 0x11;

  let _typeNumber = typeNumber;
  const _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
  let _modules = null;
  let _moduleCount = 0;
  let _dataCache = null;
  const _dataList = [];

  const _this = {};

  const makeImpl = function(test, maskPattern) {

    _moduleCount = _typeNumber * 4 + 17;
    _modules = function(moduleCount) {
      const modules = new Array(moduleCount);
      for (let row = 0; row < moduleCount; row += 1) {
        modules[row] = new Array(moduleCount);
        for (let col = 0; col < moduleCount; col += 1) {
          modules[row][col] = null;
        }
      }
      return modules;
    }(_moduleCount);

    setupPositionProbePattern(0, 0);
    setupPositionProbePattern(_moduleCount - 7, 0);
    setupPositionProbePattern(0, _moduleCount - 7);
    setupPositionAdjustPattern();
    setupTimingPattern();
    setupTypeInfo(test, maskPattern);

    if (_typeNumber >= 7) {
      setupTypeNumber(test);
    }

    if (_dataCache == null) {
      _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
    }

    mapData(_dataCache, maskPattern);
  };

  const setupPositionProbePattern = function(row, col) {

    for (let r = -1; r <= 7; r += 1) {

      if (row + r <= -1 || _moduleCount <= row + r) continue;

      for (let c = -1; c <= 7; c += 1) {

        if (col + c <= -1 || _moduleCount <= col + c) continue;

        if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
            || (0 <= c && c <= 6 && (r == 0 || r == 6) )
            || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
          _modules[row + r][col + c] = true;
        } else {
          _modules[row + r][col + c] = false;
        }
      }
    }
  };

  const getBestMaskPattern = function() {

    let minLostPoint = 0;
    let pattern = 0;

    for (let i = 0; i < 8; i += 1) {

      makeImpl(true, i);

      const lostPoint = QRUtil.getLostPoint(_this);

      if (i == 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i;
      }
    }

    return pattern;
  };

  const setupTimingPattern = function() {

    for (let r = 8; r < _moduleCount - 8; r += 1) {
      if (_modules[r][6] != null) {
        continue;
      }
      _modules[r][6] = (r % 2 == 0);
    }

    for (let c = 8; c < _moduleCount - 8; c += 1) {
      if (_modules[6][c] != null) {
        continue;
      }
      _modules[6][c] = (c % 2 == 0);
    }
  };

  const setupPositionAdjustPattern = function() {

    const pos = QRUtil.getPatternPosition(_typeNumber);

    for (let i = 0; i < pos.length; i += 1) {

      for (let j = 0; j < pos.length; j += 1) {

        const row = pos[i];
        const col = pos[j];

        if (_modules[row][col] != null) {
          continue;
        }

        for (let r = -2; r <= 2; r += 1) {

          for (let c = -2; c <= 2; c += 1) {

            if (r == -2 || r == 2 || c == -2 || c == 2
                || (r == 0 && c == 0) ) {
              _modules[row + r][col + c] = true;
            } else {
              _modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  };

  const setupTypeNumber = function(test) {

    const bits = QRUtil.getBCHTypeNumber(_typeNumber);

    for (let i = 0; i < 18; i += 1) {
      const mod = (!test && ( (bits >> i) & 1) == 1);
      _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
    }

    for (let i = 0; i < 18; i += 1) {
      const mod = (!test && ( (bits >> i) & 1) == 1);
      _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  };

  const setupTypeInfo = function(test, maskPattern) {

    const data = (_errorCorrectionLevel << 3) | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);

    // vertical
    for (let i = 0; i < 15; i += 1) {

      const mod = (!test && ( (bits >> i) & 1) == 1);

      if (i < 6) {
        _modules[i][8] = mod;
      } else if (i < 8) {
        _modules[i + 1][8] = mod;
      } else {
        _modules[_moduleCount - 15 + i][8] = mod;
      }
    }

    // horizontal
    for (let i = 0; i < 15; i += 1) {

      const mod = (!test && ( (bits >> i) & 1) == 1);

      if (i < 8) {
        _modules[8][_moduleCount - i - 1] = mod;
      } else if (i < 9) {
        _modules[8][15 - i - 1 + 1] = mod;
      } else {
        _modules[8][15 - i - 1] = mod;
      }
    }

    // fixed module
    _modules[_moduleCount - 8][8] = (!test);
  };

  const mapData = function(data, maskPattern) {

    let inc = -1;
    let row = _moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    const maskFunc = QRUtil.getMaskFunction(maskPattern);

    for (let col = _moduleCount - 1; col > 0; col -= 2) {

      if (col == 6) col -= 1;

      while (true) {

        for (let c = 0; c < 2; c += 1) {

          if (_modules[row][col - c] == null) {

            let dark = false;

            if (byteIndex < data.length) {
              dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
            }

            const mask = maskFunc(row, col - c);

            if (mask) {
              dark = !dark;
            }

            _modules[row][col - c] = dark;
            bitIndex -= 1;

            if (bitIndex == -1) {
              byteIndex += 1;
              bitIndex = 7;
            }
          }
        }

        row += inc;

        if (row < 0 || _moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  };

  const createBytes = function(buffer, rsBlocks) {

    let offset = 0;

    let maxDcCount = 0;
    let maxEcCount = 0;

    const dcdata = new Array(rsBlocks.length);
    const ecdata = new Array(rsBlocks.length);

    for (let r = 0; r < rsBlocks.length; r += 1) {

      const dcCount = rsBlocks[r].dataCount;
      const ecCount = rsBlocks[r].totalCount - dcCount;

      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);

      dcdata[r] = new Array(dcCount);

      for (let i = 0; i < dcdata[r].length; i += 1) {
        dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
      }
      offset += dcCount;

      const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      const rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

      const modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (let i = 0; i < ecdata[r].length; i += 1) {
        const modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
      }
    }

    let totalCodeCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalCodeCount += rsBlocks[i].totalCount;
    }

    const data = new Array(totalCodeCount);
    let index = 0;

    for (let i = 0; i < maxDcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < dcdata[r].length) {
          data[index] = dcdata[r][i];
          index += 1;
        }
      }
    }

    for (let i = 0; i < maxEcCount; i += 1) {
      for (let r = 0; r < rsBlocks.length; r += 1) {
        if (i < ecdata[r].length) {
          data[index] = ecdata[r][i];
          index += 1;
        }
      }
    }

    return data;
  };

  const createData = function(typeNumber, errorCorrectionLevel, dataList) {

    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

    const buffer = qrBitBuffer();

    for (let i = 0; i < dataList.length; i += 1) {
      const data = dataList[i];
      buffer.put(data.getMode(), 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
      data.write(buffer);
    }

    // calc num max data.
    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 1) {
      totalDataCount += rsBlocks[i].dataCount;
    }

    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw 'code length overflow. ('
        + buffer.getLengthInBits()
        + '>'
        + totalDataCount * 8
        + ')';
    }

    // end code
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }

    // padding
    while (buffer.getLengthInBits() % 8 != 0) {
      buffer.putBit(false);
    }

    // padding
    while (true) {

      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD0, 8);

      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD1, 8);
    }

    return createBytes(buffer, rsBlocks);
  };

  _this.addData = function(data, mode) {

    mode = mode || 'Byte';

    let newData = null;

    switch(mode) {
    case 'Numeric' :
      newData = qrNumber(data);
      break;
    case 'Alphanumeric' :
      newData = qrAlphaNum(data);
      break;
    case 'Byte' :
      newData = qr8BitByte(data);
      break;
    case 'Kanji' :
      newData = qrKanji(data);
      break;
    default :
      throw 'mode:' + mode;
    }

    _dataList.push(newData);
    _dataCache = null;
  };

  _this.isDark = function(row, col) {
    if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
      throw row + ',' + col;
    }
    return _modules[row][col];
  };

  _this.getModuleCount = function() {
    return _moduleCount;
  };

  _this.make = function() {
    if (_typeNumber < 1) {
      let typeNumber = 1;

      for (; typeNumber < 40; typeNumber++) {
        const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
        const buffer = qrBitBuffer();

        for (let i = 0; i < _dataList.length; i++) {
          const data = _dataList[i];
          buffer.put(data.getMode(), 4);
          buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
          data.write(buffer);
        }

        let totalDataCount = 0;
        for (let i = 0; i < rsBlocks.length; i++) {
          totalDataCount += rsBlocks[i].dataCount;
        }

        if (buffer.getLengthInBits() <= totalDataCount * 8) {
          break;
        }
      }

      _typeNumber = typeNumber;
    }

    makeImpl(false, getBestMaskPattern() );
  };

  _this.createTableTag = function(cellSize, margin) {

    cellSize = cellSize || 2;
    margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

    let qrHtml = '';

    qrHtml += '<table style="';
    qrHtml += ' border-width: 0px; border-style: none;';
    qrHtml += ' border-collapse: collapse;';
    qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
    qrHtml += '">';
    qrHtml += '<tbody>';

    for (let r = 0; r < _this.getModuleCount(); r += 1) {

      qrHtml += '<tr>';

      for (let c = 0; c < _this.getModuleCount(); c += 1) {
        qrHtml += '<td style="';
        qrHtml += ' border-width: 0px; border-style: none;';
        qrHtml += ' border-collapse: collapse;';
        qrHtml += ' padding: 0px; margin: 0px;';
        qrHtml += ' width: ' + cellSize + 'px;';
        qrHtml += ' height: ' + cellSize + 'px;';
        qrHtml += ' background-color: ';
        qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
        qrHtml += ';';
        qrHtml += '"/>';
      }

      qrHtml += '</tr>';
    }

    qrHtml += '</tbody>';
    qrHtml += '</table>';

    return qrHtml;
  };

  _this.createSvgTag = function(cellSize, margin, alt, title) {

    let opts = {};
    if (typeof arguments[0] == 'object') {
      // Called by options.
      opts = arguments[0];
      // overwrite cellSize and margin.
      cellSize = opts.cellSize;
      margin = opts.margin;
      alt = opts.alt;
      title = opts.title;
    }

    cellSize = cellSize || 2;
    margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

    // Compose alt property surrogate
    alt = (typeof alt === 'string') ? {text: alt} : alt || {};
    alt.text = alt.text || null;
    alt.id = (alt.text) ? alt.id || 'qrcode-description' : null;

    // Compose title property surrogate
    title = (typeof title === 'string') ? {text: title} : title || {};
    title.text = title.text || null;
    title.id = (title.text) ? title.id || 'qrcode-title' : null;

    const size = _this.getModuleCount() * cellSize + margin * 2;
    let c, mc, r, mr, qrSvg='', rect;

    rect = 'l' + cellSize + ',0 0,' + cellSize +
      ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

    qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
    qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
    qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
    qrSvg += ' preserveAspectRatio="xMinYMin meet"';
    qrSvg += (title.text || alt.text) ? ' role="img" aria-labelledby="' +
        escapeXml([title.id, alt.id].join(' ').trim() ) + '"' : '';
    qrSvg += '>';
    qrSvg += (title.text) ? '<title id="' + escapeXml(title.id) + '">' +
        escapeXml(title.text) + '</title>' : '';
    qrSvg += (alt.text) ? '<description id="' + escapeXml(alt.id) + '">' +
        escapeXml(alt.text) + '</description>' : '';
    qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
    qrSvg += '<path d="';

    for (r = 0; r < _this.getModuleCount(); r += 1) {
      mr = r * cellSize + margin;
      for (c = 0; c < _this.getModuleCount(); c += 1) {
        if (_this.isDark(r, c) ) {
          mc = c*cellSize+margin;
          qrSvg += 'M' + mc + ',' + mr + rect;
        }
      }
    }

    qrSvg += '" stroke="transparent" fill="black"/>';
    qrSvg += '</svg>';

    return qrSvg;
  };

  _this.createDataURL = function(cellSize, margin) {

    cellSize = cellSize || 2;
    margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;

    return createDataURL(size, size, function(x, y) {
      if (min <= x && x < max && min <= y && y < max) {
        const c = Math.floor( (x - min) / cellSize);
        const r = Math.floor( (y - min) / cellSize);
        return _this.isDark(r, c)? 0 : 1;
      } else {
        return 1;
      }
    } );
  };

  _this.createImgTag = function(cellSize, margin, alt) {

    cellSize = cellSize || 2;
    margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

    const size = _this.getModuleCount() * cellSize + margin * 2;

    let img = '';
    img += '<img';
    img += '\u0020src="';
    img += _this.createDataURL(cellSize, margin);
    img += '"';
    img += '\u0020width="';
    img += size;
    img += '"';
    img += '\u0020height="';
    img += size;
    img += '"';
    if (alt) {
      img += '\u0020alt="';
      img += escapeXml(alt);
      img += '"';
    }
    img += '/>';

    return img;
  };

  const escapeXml = function(s) {
    let escaped = '';
    for (let i = 0; i < s.length; i += 1) {
      const c = s.charAt(i);
      switch(c) {
      case '<': escaped += '&lt;'; break;
      case '>': escaped += '&gt;'; break;
      case '&': escaped += '&amp;'; break;
      case '"': escaped += '&quot;'; break;
      default : escaped += c; break;
      }
    }
    return escaped;
  };

  const _createHalfASCII = function(margin) {
    const cellSize = 1;
    margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;

    let y, x, r1, r2, p;

    const blocks = {
      '██': '█',
      '█ ': '▀',
      ' █': '▄',
      '  ': ' '
    };

    const blocksLastLineNoMargin = {
      '██': '▀',
      '█ ': '▀',
      ' █': ' ',
      '  ': ' '
    };

    let ascii = '';
    for (y = 0; y < size; y += 2) {
      r1 = Math.floor((y - min) / cellSize);
      r2 = Math.floor((y + 1 - min) / cellSize);
      for (x = 0; x < size; x += 1) {
        p = '█';

        if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
          p = ' ';
        }

        if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
          p += ' ';
        }
        else {
          p += '█';
        }

        // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
        ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
      }

      ascii += '\n';
    }

    if (size % 2 && margin > 0) {
      return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
    }

    return ascii.substring(0, ascii.length-1);
  };

  _this.createASCII = function(cellSize, margin) {
    cellSize = cellSize || 1;

    if (cellSize < 2) {
      return _createHalfASCII(margin);
    }

    cellSize -= 1;
    margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

    const size = _this.getModuleCount() * cellSize + margin * 2;
    const min = margin;
    const max = size - margin;

    let y, x, r, p;

    const white = Array(cellSize+1).join('██');
    const black = Array(cellSize+1).join('  ');

    let ascii = '';
    let line = '';
    for (y = 0; y < size; y += 1) {
      r = Math.floor( (y - min) / cellSize);
      line = '';
      for (x = 0; x < size; x += 1) {
        p = 1;

        if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
          p = 0;
        }

        // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
        line += p ? white : black;
      }

      for (r = 0; r < cellSize; r += 1) {
        ascii += line + '\n';
      }
    }

    return ascii.substring(0, ascii.length-1);
  };

  _this.renderTo2dContext = function(context, cellSize) {
    cellSize = cellSize || 2;
    const length = _this.getModuleCount();
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
        context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  };

  return _this;
};

//---------------------------------------------------------------------
// qrcode.stringToBytes
//---------------------------------------------------------------------

qrcode.stringToBytes = function(s) {
  const bytes = [];
  for (let i = 0; i < s.length; i += 1) {
    const c = s.charCodeAt(i);
    bytes.push(c & 0xff);
  }
  return bytes;
};

//---------------------------------------------------------------------
// qrcode.createStringToBytes
//---------------------------------------------------------------------

/**
 * @param unicodeData base64 string of byte array.
 * [16bit Unicode],[16bit Bytes], ...
 * @param numChars
 */
qrcode.createStringToBytes = function(unicodeData, numChars) {

  // create conversion map.

  const unicodeMap = function() {

    const bin = base64DecodeInputStream(unicodeData);
    const read = function() {
      const b = bin.read();
      if (b == -1) throw 'eof';
      return b;
    };

    let count = 0;
    const unicodeMap = {};
    while (true) {
      const b0 = bin.read();
      if (b0 == -1) break;
      const b1 = read();
      const b2 = read();
      const b3 = read();
      const k = String.fromCharCode( (b0 << 8) | b1);
      const v = (b2 << 8) | b3;
      unicodeMap[k] = v;
      count += 1;
    }
    if (count != numChars) {
      throw count + ' != ' + numChars;
    }

    return unicodeMap;
  }();

  const unknownChar = '?'.charCodeAt(0);

  return function(s) {
    const bytes = [];
    for (let i = 0; i < s.length; i += 1) {
      const c = s.charCodeAt(i);
      if (c < 128) {
        bytes.push(c);
      } else {
        const b = unicodeMap[s.charAt(i)];
        if (typeof b == 'number') {
          if ( (b & 0xff) == b) {
            // 1byte
            bytes.push(b);
          } else {
            // 2bytes
            bytes.push(b >>> 8);
            bytes.push(b & 0xff);
          }
        } else {
          bytes.push(unknownChar);
        }
      }
    }
    return bytes;
  };
};

//---------------------------------------------------------------------
// QRMode
//---------------------------------------------------------------------

const QRMode = {
  MODE_NUMBER :    1 << 0,
  MODE_ALPHA_NUM : 1 << 1,
  MODE_8BIT_BYTE : 1 << 2,
  MODE_KANJI :     1 << 3
};

//---------------------------------------------------------------------
// QRErrorCorrectionLevel
//---------------------------------------------------------------------

const QRErrorCorrectionLevel = {
  L : 1,
  M : 0,
  Q : 3,
  H : 2
};

//---------------------------------------------------------------------
// QRMaskPattern
//---------------------------------------------------------------------

const QRMaskPattern = {
  PATTERN000 : 0,
  PATTERN001 : 1,
  PATTERN010 : 2,
  PATTERN011 : 3,
  PATTERN100 : 4,
  PATTERN101 : 5,
  PATTERN110 : 6,
  PATTERN111 : 7
};

//---------------------------------------------------------------------
// QRUtil
//---------------------------------------------------------------------

const QRUtil = function() {

  const PATTERN_POSITION_TABLE = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
  ];
  const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
  const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
  const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

  const _this = {};

  const getBCHDigit = function(data) {
    let digit = 0;
    while (data != 0) {
      digit += 1;
      data >>>= 1;
    }
    return digit;
  };

  _this.getBCHTypeInfo = function(data) {
    let d = data << 10;
    while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
      d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
    }
    return ( (data << 10) | d) ^ G15_MASK;
  };

  _this.getBCHTypeNumber = function(data) {
    let d = data << 12;
    while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
      d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
    }
    return (data << 12) | d;
  };

  _this.getPatternPosition = function(typeNumber) {
    return PATTERN_POSITION_TABLE[typeNumber - 1];
  };

  _this.getMaskFunction = function(maskPattern) {

    switch (maskPattern) {

    case QRMaskPattern.PATTERN000 :
      return function(i, j) { return (i + j) % 2 == 0; };
    case QRMaskPattern.PATTERN001 :
      return function(i, j) { return i % 2 == 0; };
    case QRMaskPattern.PATTERN010 :
      return function(i, j) { return j % 3 == 0; };
    case QRMaskPattern.PATTERN011 :
      return function(i, j) { return (i + j) % 3 == 0; };
    case QRMaskPattern.PATTERN100 :
      return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
    case QRMaskPattern.PATTERN101 :
      return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
    case QRMaskPattern.PATTERN110 :
      return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
    case QRMaskPattern.PATTERN111 :
      return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

    default :
      throw 'bad maskPattern:' + maskPattern;
    }
  };

  _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
    let a = qrPolynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i += 1) {
      a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
    }
    return a;
  };

  _this.getLengthInBits = function(mode, type) {

    if (1 <= type && type < 10) {

      // 1 - 9

      switch(mode) {
      case QRMode.MODE_NUMBER    : return 10;
      case QRMode.MODE_ALPHA_NUM : return 9;
      case QRMode.MODE_8BIT_BYTE : return 8;
      case QRMode.MODE_KANJI     : return 8;
      default :
        throw 'mode:' + mode;
      }

    } else if (type < 27) {

      // 10 - 26

      switch(mode) {
      case QRMode.MODE_NUMBER    : return 12;
      case QRMode.MODE_ALPHA_NUM : return 11;
      case QRMode.MODE_8BIT_BYTE : return 16;
      case QRMode.MODE_KANJI     : return 10;
      default :
        throw 'mode:' + mode;
      }

    } else if (type < 41) {

      // 27 - 40

      switch(mode) {
      case QRMode.MODE_NUMBER    : return 14;
      case QRMode.MODE_ALPHA_NUM : return 13;
      case QRMode.MODE_8BIT_BYTE : return 16;
      case QRMode.MODE_KANJI     : return 12;
      default :
        throw 'mode:' + mode;
      }

    } else {
      throw 'type:' + type;
    }
  };

  _this.getLostPoint = function(qrcode) {

    const moduleCount = qrcode.getModuleCount();

    let lostPoint = 0;

    // LEVEL1

    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {

        let sameCount = 0;
        const dark = qrcode.isDark(row, col);

        for (let r = -1; r <= 1; r += 1) {

          if (row + r < 0 || moduleCount <= row + r) {
            continue;
          }

          for (let c = -1; c <= 1; c += 1) {

            if (col + c < 0 || moduleCount <= col + c) {
              continue;
            }

            if (r == 0 && c == 0) {
              continue;
            }

            if (dark == qrcode.isDark(row + r, col + c) ) {
              sameCount += 1;
            }
          }
        }

        if (sameCount > 5) {
          lostPoint += (3 + sameCount - 5);
        }
      }
    }
    // LEVEL2

    for (let row = 0; row < moduleCount - 1; row += 1) {
      for (let col = 0; col < moduleCount - 1; col += 1) {
        let count = 0;
        if (qrcode.isDark(row, col) ) count += 1;
        if (qrcode.isDark(row + 1, col) ) count += 1;
        if (qrcode.isDark(row, col + 1) ) count += 1;
        if (qrcode.isDark(row + 1, col + 1) ) count += 1;
        if (count == 0 || count == 4) {
          lostPoint += 3;
        }
      }
    }

    // LEVEL3

    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount - 6; col += 1) {
        if (qrcode.isDark(row, col)
            && !qrcode.isDark(row, col + 1)
            &&  qrcode.isDark(row, col + 2)
            &&  qrcode.isDark(row, col + 3)
            &&  qrcode.isDark(row, col + 4)
            && !qrcode.isDark(row, col + 5)
            &&  qrcode.isDark(row, col + 6) ) {
          lostPoint += 40;
        }
      }
    }

    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount - 6; row += 1) {
        if (qrcode.isDark(row, col)
            && !qrcode.isDark(row + 1, col)
            &&  qrcode.isDark(row + 2, col)
            &&  qrcode.isDark(row + 3, col)
            &&  qrcode.isDark(row + 4, col)
            && !qrcode.isDark(row + 5, col)
            &&  qrcode.isDark(row + 6, col) ) {
          lostPoint += 40;
        }
      }
    }

    // LEVEL4

    let darkCount = 0;

    for (let col = 0; col < moduleCount; col += 1) {
      for (let row = 0; row < moduleCount; row += 1) {
        if (qrcode.isDark(row, col) ) {
          darkCount += 1;
        }
      }
    }

    const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;

    return lostPoint;
  };

  return _this;
}();

//---------------------------------------------------------------------
// QRMath
//---------------------------------------------------------------------

const QRMath = function() {

  const EXP_TABLE = new Array(256);
  const LOG_TABLE = new Array(256);

  // initialize tables
  for (let i = 0; i < 8; i += 1) {
    EXP_TABLE[i] = 1 << i;
  }
  for (let i = 8; i < 256; i += 1) {
    EXP_TABLE[i] = EXP_TABLE[i - 4]
      ^ EXP_TABLE[i - 5]
      ^ EXP_TABLE[i - 6]
      ^ EXP_TABLE[i - 8];
  }
  for (let i = 0; i < 255; i += 1) {
    LOG_TABLE[EXP_TABLE[i] ] = i;
  }

  const _this = {};

  _this.glog = function(n) {

    if (n < 1) {
      throw 'glog(' + n + ')';
    }

    return LOG_TABLE[n];
  };

  _this.gexp = function(n) {

    while (n < 0) {
      n += 255;
    }

    while (n >= 256) {
      n -= 255;
    }

    return EXP_TABLE[n];
  };

  return _this;
}();

//---------------------------------------------------------------------
// qrPolynomial
//---------------------------------------------------------------------

const qrPolynomial = function(num, shift) {

  if (typeof num.length == 'undefined') {
    throw num.length + '/' + shift;
  }

  const _num = function() {
    let offset = 0;
    while (offset < num.length && num[offset] == 0) {
      offset += 1;
    }
    const _num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i += 1) {
      _num[i] = num[i + offset];
    }
    return _num;
  }();

  const _this = {};

  _this.getAt = function(index) {
    return _num[index];
  };

  _this.getLength = function() {
    return _num.length;
  };

  _this.multiply = function(e) {

    const num = new Array(_this.getLength() + e.getLength() - 1);

    for (let i = 0; i < _this.getLength(); i += 1) {
      for (let j = 0; j < e.getLength(); j += 1) {
        num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
      }
    }

    return qrPolynomial(num, 0);
  };

  _this.mod = function(e) {

    if (_this.getLength() - e.getLength() < 0) {
      return _this;
    }

    const ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

    const num = new Array(_this.getLength() );
    for (let i = 0; i < _this.getLength(); i += 1) {
      num[i] = _this.getAt(i);
    }

    for (let i = 0; i < e.getLength(); i += 1) {
      num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
    }

    // recursive call
    return qrPolynomial(num, 0).mod(e);
  };

  return _this;
};

//---------------------------------------------------------------------
// QRRSBlock
//---------------------------------------------------------------------

const QRRSBlock = function() {

  const RS_BLOCK_TABLE = [

    // L
    // M
    // Q
    // H

    // 1
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],

    // 2
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],

    // 3
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],

    // 4
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],

    // 5
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],

    // 6
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],

    // 7
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],

    // 8
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],

    // 9
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],

    // 10
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],

    // 11
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],

    // 12
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],

    // 13
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],

    // 14
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],

    // 15
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12, 7, 37, 13],

    // 16
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],

    // 17
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1, 75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],

    // 18
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],

    // 19
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],

    // 20
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16],

    // 21
    [4, 144, 116, 4, 145, 117],
    [17, 68, 42],
    [17, 50, 22, 6, 51, 23],
    [19, 46, 16, 6, 47, 17],

    // 22
    [2, 139, 111, 7, 140, 112],
    [17, 74, 46],
    [7, 54, 24, 16, 55, 25],
    [34, 37, 13],

    // 23
    [4, 151, 121, 5, 152, 122],
    [4, 75, 47, 14, 76, 48],
    [11, 54, 24, 14, 55, 25],
    [16, 45, 15, 14, 46, 16],

    // 24
    [6, 147, 117, 4, 148, 118],
    [6, 73, 45, 14, 74, 46],
    [11, 54, 24, 16, 55, 25],
    [30, 46, 16, 2, 47, 17],

    // 25
    [8, 132, 106, 4, 133, 107],
    [8, 75, 47, 13, 76, 48],
    [7, 54, 24, 22, 55, 25],
    [22, 45, 15, 13, 46, 16],

    // 26
    [10, 142, 114, 2, 143, 115],
    [19, 74, 46, 4, 75, 47],
    [28, 50, 22, 6, 51, 23],
    [33, 46, 16, 4, 47, 17],

    // 27
    [8, 152, 122, 4, 153, 123],
    [22, 73, 45, 3, 74, 46],
    [8, 53, 23, 26, 54, 24],
    [12, 45, 15, 28, 46, 16],

    // 28
    [3, 147, 117, 10, 148, 118],
    [3, 73, 45, 23, 74, 46],
    [4, 54, 24, 31, 55, 25],
    [11, 45, 15, 31, 46, 16],

    // 29
    [7, 146, 116, 7, 147, 117],
    [21, 73, 45, 7, 74, 46],
    [1, 53, 23, 37, 54, 24],
    [19, 45, 15, 26, 46, 16],

    // 30
    [5, 145, 115, 10, 146, 116],
    [19, 75, 47, 10, 76, 48],
    [15, 54, 24, 25, 55, 25],
    [23, 45, 15, 25, 46, 16],

    // 31
    [13, 145, 115, 3, 146, 116],
    [2, 74, 46, 29, 75, 47],
    [42, 54, 24, 1, 55, 25],
    [23, 45, 15, 28, 46, 16],

    // 32
    [17, 145, 115],
    [10, 74, 46, 23, 75, 47],
    [10, 54, 24, 35, 55, 25],
    [19, 45, 15, 35, 46, 16],

    // 33
    [17, 145, 115, 1, 146, 116],
    [14, 74, 46, 21, 75, 47],
    [29, 54, 24, 19, 55, 25],
    [11, 45, 15, 46, 46, 16],

    // 34
    [13, 145, 115, 6, 146, 116],
    [14, 74, 46, 23, 75, 47],
    [44, 54, 24, 7, 55, 25],
    [59, 46, 16, 1, 47, 17],

    // 35
    [12, 151, 121, 7, 152, 122],
    [12, 75, 47, 26, 76, 48],
    [39, 54, 24, 14, 55, 25],
    [22, 45, 15, 41, 46, 16],

    // 36
    [6, 151, 121, 14, 152, 122],
    [6, 75, 47, 34, 76, 48],
    [46, 54, 24, 10, 55, 25],
    [2, 45, 15, 64, 46, 16],

    // 37
    [17, 152, 122, 4, 153, 123],
    [29, 74, 46, 14, 75, 47],
    [49, 54, 24, 10, 55, 25],
    [24, 45, 15, 46, 46, 16],

    // 38
    [4, 152, 122, 18, 153, 123],
    [13, 74, 46, 32, 75, 47],
    [48, 54, 24, 14, 55, 25],
    [42, 45, 15, 32, 46, 16],

    // 39
    [20, 147, 117, 4, 148, 118],
    [40, 75, 47, 7, 76, 48],
    [43, 54, 24, 22, 55, 25],
    [10, 45, 15, 67, 46, 16],

    // 40
    [19, 148, 118, 6, 149, 119],
    [18, 75, 47, 31, 76, 48],
    [34, 54, 24, 34, 55, 25],
    [20, 45, 15, 61, 46, 16]
  ];

  const qrRSBlock = function(totalCount, dataCount) {
    const _this = {};
    _this.totalCount = totalCount;
    _this.dataCount = dataCount;
    return _this;
  };

  const _this = {};

  const getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

    switch(errorCorrectionLevel) {
    case QRErrorCorrectionLevel.L :
      return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
    case QRErrorCorrectionLevel.M :
      return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
    case QRErrorCorrectionLevel.Q :
      return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
    case QRErrorCorrectionLevel.H :
      return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
    default :
      return undefined;
    }
  };

  _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

    const rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

    if (typeof rsBlock == 'undefined') {
      throw 'bad rs block @ typeNumber:' + typeNumber +
          '/errorCorrectionLevel:' + errorCorrectionLevel;
    }

    const length = rsBlock.length / 3;

    const list = [];

    for (let i = 0; i < length; i += 1) {

      const count = rsBlock[i * 3 + 0];
      const totalCount = rsBlock[i * 3 + 1];
      const dataCount = rsBlock[i * 3 + 2];

      for (let j = 0; j < count; j += 1) {
        list.push(qrRSBlock(totalCount, dataCount) );
      }
    }

    return list;
  };

  return _this;
}();

//---------------------------------------------------------------------
// qrBitBuffer
//---------------------------------------------------------------------

const qrBitBuffer = function() {

  const _buffer = [];
  let _length = 0;

  const _this = {};

  _this.getBuffer = function() {
    return _buffer;
  };

  _this.getAt = function(index) {
    const bufIndex = Math.floor(index / 8);
    return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
  };

  _this.put = function(num, length) {
    for (let i = 0; i < length; i += 1) {
      _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
    }
  };

  _this.getLengthInBits = function() {
    return _length;
  };

  _this.putBit = function(bit) {

    const bufIndex = Math.floor(_length / 8);
    if (_buffer.length <= bufIndex) {
      _buffer.push(0);
    }

    if (bit) {
      _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
    }

    _length += 1;
  };

  return _this;
};

//---------------------------------------------------------------------
// qrNumber
//---------------------------------------------------------------------

const qrNumber = function(data) {

  const _mode = QRMode.MODE_NUMBER;
  const _data = data;

  const _this = {};

  _this.getMode = function() {
    return _mode;
  };

  _this.getLength = function(buffer) {
    return _data.length;
  };

  _this.write = function(buffer) {

    const data = _data;

    let i = 0;

    while (i + 2 < data.length) {
      buffer.put(strToNum(data.substring(i, i + 3) ), 10);
      i += 3;
    }

    if (i < data.length) {
      if (data.length - i == 1) {
        buffer.put(strToNum(data.substring(i, i + 1) ), 4);
      } else if (data.length - i == 2) {
        buffer.put(strToNum(data.substring(i, i + 2) ), 7);
      }
    }
  };

  const strToNum = function(s) {
    let num = 0;
    for (let i = 0; i < s.length; i += 1) {
      num = num * 10 + chatToNum(s.charAt(i) );
    }
    return num;
  };

  const chatToNum = function(c) {
    if ('0' <= c && c <= '9') {
      return c.charCodeAt(0) - '0'.charCodeAt(0);
    }
    throw 'illegal char :' + c;
  };

  return _this;
};

//---------------------------------------------------------------------
// qrAlphaNum
//---------------------------------------------------------------------

const qrAlphaNum = function(data) {

  const _mode = QRMode.MODE_ALPHA_NUM;
  const _data = data;

  const _this = {};

  _this.getMode = function() {
    return _mode;
  };

  _this.getLength = function(buffer) {
    return _data.length;
  };

  _this.write = function(buffer) {

    const s = _data;

    let i = 0;

    while (i + 1 < s.length) {
      buffer.put(
        getCode(s.charAt(i) ) * 45 +
        getCode(s.charAt(i + 1) ), 11);
      i += 2;
    }

    if (i < s.length) {
      buffer.put(getCode(s.charAt(i) ), 6);
    }
  };

  const getCode = function(c) {

    if ('0' <= c && c <= '9') {
      return c.charCodeAt(0) - '0'.charCodeAt(0);
    } else if ('A' <= c && c <= 'Z') {
      return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    } else {
      switch (c) {
      case '\u0020' : return 36;
      case '$' : return 37;
      case '%' : return 38;
      case '*' : return 39;
      case '+' : return 40;
      case '-' : return 41;
      case '.' : return 42;
      case '/' : return 43;
      case ':' : return 44;
      default :
        throw 'illegal char :' + c;
      }
    }
  };

  return _this;
};

//---------------------------------------------------------------------
// qr8BitByte
//---------------------------------------------------------------------

const qr8BitByte = function(data) {

  const _mode = QRMode.MODE_8BIT_BYTE;
  const _bytes = qrcode.stringToBytes(data);

  const _this = {};

  _this.getMode = function() {
    return _mode;
  };

  _this.getLength = function(buffer) {
    return _bytes.length;
  };

  _this.write = function(buffer) {
    for (let i = 0; i < _bytes.length; i += 1) {
      buffer.put(_bytes[i], 8);
    }
  };

  return _this;
};

//---------------------------------------------------------------------
// qrKanji
//---------------------------------------------------------------------

const qrKanji = function(data) {

  const _mode = QRMode.MODE_KANJI;

  const stringToBytes = qrcode.stringToBytes;
  !function(c, code) {
    // self test for sjis support.
    const test = stringToBytes(c);
    if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
      throw 'sjis not supported.';
    }
  }('\u53cb', 0x9746);

  const _bytes = stringToBytes(data);

  const _this = {};

  _this.getMode = function() {
    return _mode;
  };

  _this.getLength = function(buffer) {
    return ~~(_bytes.length / 2);
  };

  _this.write = function(buffer) {

    const data = _bytes;

    let i = 0;

    while (i + 1 < data.length) {

      let c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

      if (0x8140 <= c && c <= 0x9FFC) {
        c -= 0x8140;
      } else if (0xE040 <= c && c <= 0xEBBF) {
        c -= 0xC140;
      } else {
        throw 'illegal char at ' + (i + 1) + '/' + c;
      }

      c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

      buffer.put(c, 13);

      i += 2;
    }

    if (i < data.length) {
      throw 'illegal char at ' + (i + 1);
    }
  };

  return _this;
};

//=====================================================================
// GIF Support etc.
//

//---------------------------------------------------------------------
// byteArrayOutputStream
//---------------------------------------------------------------------

const byteArrayOutputStream = function() {

  const _bytes = [];

  const _this = {};

  _this.writeByte = function(b) {
    _bytes.push(b & 0xff);
  };

  _this.writeShort = function(i) {
    _this.writeByte(i);
    _this.writeByte(i >>> 8);
  };

  _this.writeBytes = function(b, off, len) {
    off = off || 0;
    len = len || b.length;
    for (let i = 0; i < len; i += 1) {
      _this.writeByte(b[i + off]);
    }
  };

  _this.writeString = function(s) {
    for (let i = 0; i < s.length; i += 1) {
      _this.writeByte(s.charCodeAt(i) );
    }
  };

  _this.toByteArray = function() {
    return _bytes;
  };

  _this.toString = function() {
    let s = '';
    s += '[';
    for (let i = 0; i < _bytes.length; i += 1) {
      if (i > 0) {
        s += ',';
      }
      s += _bytes[i];
    }
    s += ']';
    return s;
  };

  return _this;
};

//---------------------------------------------------------------------
// base64EncodeOutputStream
//---------------------------------------------------------------------

const base64EncodeOutputStream = function() {

  let _buffer = 0;
  let _buflen = 0;
  let _length = 0;
  let _base64 = '';

  const _this = {};

  const writeEncoded = function(b) {
    _base64 += String.fromCharCode(encode(b & 0x3f) );
  };

  const encode = function(n) {
    if (n < 0) {
      throw 'n:' + n;
    } else if (n < 26) {
      return 0x41 + n;
    } else if (n < 52) {
      return 0x61 + (n - 26);
    } else if (n < 62) {
      return 0x30 + (n - 52);
    } else if (n == 62) {
      return 0x2b;
    } else if (n == 63) {
      return 0x2f;
    } else {
      throw 'n:' + n;
    }
  };

  _this.writeByte = function(n) {

    _buffer = (_buffer << 8) | (n & 0xff);
    _buflen += 8;
    _length += 1;

    while (_buflen >= 6) {
      writeEncoded(_buffer >>> (_buflen - 6) );
      _buflen -= 6;
    }
  };

  _this.flush = function() {

    if (_buflen > 0) {
      writeEncoded(_buffer << (6 - _buflen) );
      _buffer = 0;
      _buflen = 0;
    }

    if (_length % 3 != 0) {
      // padding
      const padlen = 3 - _length % 3;
      for (let i = 0; i < padlen; i += 1) {
        _base64 += '=';
      }
    }
  };

  _this.toString = function() {
    return _base64;
  };

  return _this;
};

//---------------------------------------------------------------------
// base64DecodeInputStream
//---------------------------------------------------------------------

const base64DecodeInputStream = function(str) {

  const _str = str;
  let _pos = 0;
  let _buffer = 0;
  let _buflen = 0;

  const _this = {};

  _this.read = function() {

    while (_buflen < 8) {

      if (_pos >= _str.length) {
        if (_buflen == 0) {
          return -1;
        }
        throw 'unexpected end of file./' + _buflen;
      }

      const c = _str.charAt(_pos);
      _pos += 1;

      if (c == '=') {
        _buflen = 0;
        return -1;
      } else if (c.match(/^\s$/) ) {
        // ignore if whitespace.
        continue;
      }

      _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
      _buflen += 6;
    }

    const n = (_buffer >>> (_buflen - 8) ) & 0xff;
    _buflen -= 8;
    return n;
  };

  const decode = function(c) {
    if (0x41 <= c && c <= 0x5a) {
      return c - 0x41;
    } else if (0x61 <= c && c <= 0x7a) {
      return c - 0x61 + 26;
    } else if (0x30 <= c && c <= 0x39) {
      return c - 0x30 + 52;
    } else if (c == 0x2b) {
      return 62;
    } else if (c == 0x2f) {
      return 63;
    } else {
      throw 'c:' + c;
    }
  };

  return _this;
};

//---------------------------------------------------------------------
// gifImage (B/W)
//---------------------------------------------------------------------

const gifImage = function(width, height) {

  const _width = width;
  const _height = height;
  const _data = new Array(width * height);

  const _this = {};

  _this.setPixel = function(x, y, pixel) {
    _data[y * _width + x] = pixel;
  };

  _this.write = function(out) {

    //---------------------------------
    // GIF Signature

    out.writeString('GIF87a');

    //---------------------------------
    // Screen Descriptor

    out.writeShort(_width);
    out.writeShort(_height);

    out.writeByte(0x80); // 2bit
    out.writeByte(0);
    out.writeByte(0);

    //---------------------------------
    // Global Color Map

    // black
    out.writeByte(0x00);
    out.writeByte(0x00);
    out.writeByte(0x00);

    // white
    out.writeByte(0xff);
    out.writeByte(0xff);
    out.writeByte(0xff);

    //---------------------------------
    // Image Descriptor

    out.writeString(',');
    out.writeShort(0);
    out.writeShort(0);
    out.writeShort(_width);
    out.writeShort(_height);
    out.writeByte(0);

    //---------------------------------
    // Local Color Map

    //---------------------------------
    // Raster Data

    const lzwMinCodeSize = 2;
    const raster = getLZWRaster(lzwMinCodeSize);

    out.writeByte(lzwMinCodeSize);

    let offset = 0;

    while (raster.length - offset > 255) {
      out.writeByte(255);
      out.writeBytes(raster, offset, 255);
      offset += 255;
    }

    out.writeByte(raster.length - offset);
    out.writeBytes(raster, offset, raster.length - offset);
    out.writeByte(0x00);

    //---------------------------------
    // GIF Terminator
    out.writeString(';');
  };

  const bitOutputStream = function(out) {

    const _out = out;
    let _bitLength = 0;
    let _bitBuffer = 0;

    const _this = {};

    _this.write = function(data, length) {

      if ( (data >>> length) != 0) {
        throw 'length over';
      }

      while (_bitLength + length >= 8) {
        _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
        length -= (8 - _bitLength);
        data >>>= (8 - _bitLength);
        _bitBuffer = 0;
        _bitLength = 0;
      }

      _bitBuffer = (data << _bitLength) | _bitBuffer;
      _bitLength = _bitLength + length;
    };

    _this.flush = function() {
      if (_bitLength > 0) {
        _out.writeByte(_bitBuffer);
      }
    };

    return _this;
  };

  const getLZWRaster = function(lzwMinCodeSize) {

    const clearCode = 1 << lzwMinCodeSize;
    const endCode = (1 << lzwMinCodeSize) + 1;
    let bitLength = lzwMinCodeSize + 1;

    // Setup LZWTable
    const table = lzwTable();

    for (let i = 0; i < clearCode; i += 1) {
      table.add(String.fromCharCode(i) );
    }
    table.add(String.fromCharCode(clearCode) );
    table.add(String.fromCharCode(endCode) );

    const byteOut = byteArrayOutputStream();
    const bitOut = bitOutputStream(byteOut);

    // clear code
    bitOut.write(clearCode, bitLength);

    let dataIndex = 0;

    let s = String.fromCharCode(_data[dataIndex]);
    dataIndex += 1;

    while (dataIndex < _data.length) {

      const c = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      if (table.contains(s + c) ) {

        s = s + c;

      } else {

        bitOut.write(table.indexOf(s), bitLength);

        if (table.size() < 0xfff) {

          if (table.size() == (1 << bitLength) ) {
            bitLength += 1;
          }

          table.add(s + c);
        }

        s = c;
      }
    }

    bitOut.write(table.indexOf(s), bitLength);

    // end code
    bitOut.write(endCode, bitLength);

    bitOut.flush();

    return byteOut.toByteArray();
  };

  const lzwTable = function() {

    const _map = {};
    let _size = 0;

    const _this = {};

    _this.add = function(key) {
      if (_this.contains(key) ) {
        throw 'dup key:' + key;
      }
      _map[key] = _size;
      _size += 1;
    };

    _this.size = function() {
      return _size;
    };

    _this.indexOf = function(key) {
      return _map[key];
    };

    _this.contains = function(key) {
      return typeof _map[key] != 'undefined';
    };

    return _this;
  };

  return _this;
};

const createDataURL = function(width, height, getPixel) {
  const gif = gifImage(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      gif.setPixel(x, y, getPixel(x, y) );
    }
  }

  const b = byteArrayOutputStream();
  gif.write(b);

  const base64 = base64EncodeOutputStream();
  const bytes = b.toByteArray();
  for (let i = 0; i < bytes.length; i += 1) {
    base64.writeByte(bytes[i]);
  }
  base64.flush();

  return 'data:image/gif;base64,' + base64;
};

qrcode.stringToBytes;

const QrCode = ({ value, size = 256, errorCorrectionLevel = 'M' }) => {
    const svg = React.useMemo(() => {
        const qr = qrcode(0, errorCorrectionLevel);
        qr.addData(value);
        qr.make();
        return qr.createSvgTag({ scalable: true });
    }, [value, errorCorrectionLevel]);
    return (jsxRuntime.jsx("div", { style: { width: size, height: size }, dangerouslySetInnerHTML: { __html: svg } }));
};

const useConfirmModal = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [title, setTitle] = React.useState('Confirmação');
    const [content, setContent] = React.useState(jsxRuntime.jsx("p", { children: "Deseja realmente executar esta a\u00E7\u00E3o?" }));
    const [resolver, setResolver] = React.useState(() => () => { });
    const confirm = React.useCallback((newTitle, newContent) => {
        setTitle(newTitle);
        setContent(newContent);
        setIsOpen(true);
        return new Promise((resolve) => {
            setResolver(() => resolve);
        });
    }, []);
    const handleClose = React.useCallback((value) => {
        setIsOpen(false);
        resolver(value);
    }, [resolver]);
    const ConfirmModalComponent = React.useMemo(() => (jsxRuntime.jsx(ConfirmModal, { isOpen: isOpen, title: title, content: content, onClose: () => handleClose(false), onConfirm: () => handleClose(true) })), [isOpen, title, content, handleClose]);
    return { confirm, ConfirmModalComponent };
};

const useCopyFeedback = ({ successMessage = 'Copiado!', errorMessage = 'Falha ao copiar', durationMs = 2500, } = {}) => {
    const [toastOk, setToastOk] = React.useState(null);
    const timeoutRef = React.useRef();
    const copy = React.useCallback(async (text) => {
        const ok = await copyToClipboard(text);
        setToastOk(ok);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setToastOk(null), durationMs);
        return ok;
    }, [durationMs]);
    React.useEffect(() => () => clearTimeout(timeoutRef.current), []);
    const CopyFeedbackToast = toastOk === null ? null : (jsxRuntime.jsx(ToastNotification, { type: toastOk ? 'success' : 'error', message: toastOk ? successMessage : errorMessage, onClose: () => setToastOk(null) }));
    return { copy, CopyFeedbackToast };
};

const ContextMessage = React.createContext(undefined);
let idCounter = 0;
const ContextMessageProvider = ({ children }) => {
    const [messages, setMessages] = React.useState([]);
    const addMessage = React.useCallback((type, message) => {
        const id = idCounter++;
        setMessages(prev => [...prev, { id, type, message }]);
        setTimeout(() => removeMessage(id), 5000);
    }, []);
    const removeMessage = React.useCallback((id) => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
    }, []);
    const showError = React.useCallback((message) => addMessage('error', message), [addMessage]);
    const showSuccess = React.useCallback((message) => addMessage('success', message), [addMessage]);
    const showInfo = React.useCallback((message) => addMessage('info', message), [addMessage]);
    const showErrorWithLog = React.useCallback((messageText, error) => {
        console.error(messageText, error);
        addMessage('error', `${messageText} Consulte o log para mais detalhes!`);
    }, [addMessage]);
    return (jsxRuntime.jsxs(ContextMessage.Provider, { value: { showError, showErrorWithLog, showSuccess, showInfo }, children: [children, messages.map(msg => (jsxRuntime.jsx(ToastNotification, { type: msg.type, message: msg.message, onClose: () => removeMessage(msg.id) }, msg.id)))] }));
};
const useMessage = () => {
    const context = React.useContext(ContextMessage);
    if (!context)
        throw new Error('useMessage must be used within a ContextMessageProvider');
    return context;
};

exports.ActionButton = ActionButton;
exports.BOOLEAN_OPERATORS = BOOLEAN_OPERATORS;
exports.Breadcrumb = Breadcrumb;
exports.Button = Button;
exports.CloseButton = CloseButton;
exports.Column = Column;
exports.ConfirmModal = ConfirmModal;
exports.Container = Container$1;
exports.ContextMessageProvider = ContextMessageProvider;
exports.DATE_OPERATORS = DATE_OPERATORS;
exports.DEFAULT_THEME_SYSTEM = DEFAULT_THEME_SYSTEM;
exports.DragDropFile = DragDropFile;
exports.FieldTextArea = FieldTextArea;
exports.FieldValue = FieldValue;
exports.HighlightBox = HighlightBox;
exports.ImagePicker = ImagePicker;
exports.Loading = Loading;
exports.Modal = Modal;
exports.NUMBER_OPERATORS = NUMBER_OPERATORS;
exports.OPERATORS = OPERATORS;
exports.PAGE_SIZE_COMPACT = PAGE_SIZE_COMPACT;
exports.PAGE_SIZE_DEFAULT = PAGE_SIZE_DEFAULT;
exports.Panel = Panel;
exports.QrCode = QrCode;
exports.SELECT_OPERATORS = SELECT_OPERATORS;
exports.STRING_OPERATORS = STRING_OPERATORS;
exports.SearchFilterRSQL = SearchFilterRSQL;
exports.SearchPagination = SearchPagination;
exports.SearchSelectField = SearchSelectField;
exports.Stack = Stack;
exports.SummaryCard = SummaryCard;
exports.Table = Table;
exports.Tabs = Tabs;
exports.ThemeFavicon = ThemeFavicon;
exports.ThemeSelector = ThemeSelector;
exports.ToastCard = ToastCard;
exports.ToastContainer = ToastContainer;
exports.ToastIcon = ToastIcon;
exports.ToastMessage = ToastMessage;
exports.ToastNotification = ToastNotification;
exports.ToggleSwitch = ToggleSwitch;
exports.buildSearchSelectAdapter = buildSearchSelectAdapter;
exports.convertReactStyleToCSSObject = convertReactStyleToCSSObject;
exports.copyToClipboard = copyToClipboard;
exports.formatBooleanToSimNao = formatBooleanToSimNao;
exports.formatDateTimeToBrString = formatDateTimeToBrString;
exports.formatDateToBrString = formatDateToBrString;
exports.formatDateToYMDString = formatDateToYMDString;
exports.formatDateToYMString = formatDateToYMString;
exports.formatFieldValueToString = formatFieldValueToString;
exports.formatIsoDateToBrDate = formatIsoDateToBrDate;
exports.formatNumericInputWithLimits = formatNumericInputWithLimits;
exports.getOperators = getOperators;
exports.getVariantColor = getVariantColor;
exports.isDateValid = isDateValid;
exports.parseDateStringToDate = parseDateStringToDate;
exports.parseShortStringToDateTime = parseShortStringToDateTime;
exports.useConfirmModal = useConfirmModal;
exports.useCopyFeedback = useCopyFeedback;
exports.useMessage = useMessage;
//# sourceMappingURL=index.js.map
