import { red, blue, lightBlue, yellow, green } from '@material-ui/core/colors';
const white = '#FFF';
const black = '#000';

export default {
  type: 'dark',
  common: {
    black,
    white,
    commonBackground: '#111625',
    contrastText: white,
    neutral: '#E4E7EB',
    muted: '#94a3b8'
  },
  default: {
    light: 'rgba(0, 198, 255, 0.08)',
    main: '#00C6FF',
    dark: '#0c101c',
    logoBg: '#131b2e',
    border: 'rgba(255, 255, 255, 0.08)',
    contrastText: white
  },
  primary: {
    light: '#56CCF2',
    main: '#00C6FF',
    dark: '#0072FF',
    contrastText: white
  },
  secondary: {
    light: '#FF0080',
    main: '#7928CA',
    dark: '#4C1D95',
    contrastText: white
  },
  success: {
    light: '#4ade80',
    main: '#10b981',
    dark: '#059669',
    contrastText: white
  },
  info: {
    light: '#67e8f9',
    main: '#06b6d4',
    dark: '#0e7490',
    contrastText: white
  },
  warning: {
    light: '#fde047',
    main: '#f59e0b',
    dark: '#d97706',
    contrastText: white
  },
  danger: {
    light: '#f87171',
    main: '#ef4444',
    dark: '#dc2626',
    contrastText: white
  },
  background: {
    paper: '#111625',
    default: '#0a0e17',
    dark: '#070a10'
  },
  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
    link: '#00C6FF'
  },
  border: 'rgba(255, 255, 255, 0.08)',
  borderShadow: 'rgba(0, 0, 0, 0.5)',
  divider: 'rgba(255, 255, 255, 0.08)',
  oxfordBlue: '#0c101c',
  prussianBlue: '#0f172a',
  darkCerulean: '#1e293b',
  pewterBlue: '#94a3b8',
  isabelline: '#f8fafc'
};
