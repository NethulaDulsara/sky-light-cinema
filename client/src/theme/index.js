// @ts-nocheck
import { createMuiTheme } from '@material-ui/core/styles';
import paletteDark from './paletteDark';
import typography from './typography';

const theme = createMuiTheme({
  palette: paletteDark,
  typography,
  zIndex: {
    appBar: 1200,
    drawer: 1100
  },
  topBar: {
    height: '64px'
  },
  overrides: {
    MuiDialog: {
      paper: {
        backgroundColor: '#111625',
        backgroundImage: 'linear-gradient(145deg, rgba(25, 33, 52, 0.95) 0%, rgba(13, 18, 30, 0.98) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 198, 255, 0.1)',
        backdropFilter: 'blur(24px)'
      }
    },
    MuiDialogTitle: {
      root: {
        padding: '24px 28px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        '& h2': {
          fontSize: '1.25rem',
          fontWeight: 700,
          letterSpacing: '0.5px',
          color: '#ffffff'
        }
      }
    },
    MuiDialogContent: {
      root: {
        padding: '28px !important'
      }
    },
    MuiDialogActions: {
      root: {
        padding: '18px 28px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        transition: 'all 0.25s ease',
        '& $notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.12)'
        },
        '&:hover $notchedOutline': {
          borderColor: 'rgba(0, 198, 255, 0.5)'
        },
        '&.Mui-focused $notchedOutline': {
          borderColor: '#00C6FF',
          borderWidth: 1.5,
          boxShadow: '0 0 15px rgba(0, 198, 255, 0.2)'
        }
      },
      input: {
        color: '#f8fafc',
        fontWeight: 500,
        fontSize: '14px'
      }
    },
    MuiInputLabel: {
      root: {
        color: '#94a3b8',
        fontWeight: 500,
        '&.Mui-focused': {
          color: '#00C6FF'
        }
      }
    },
    MuiSelect: {
      select: {
        '&:focus': {
          backgroundColor: 'transparent'
        }
      },
      icon: {
        color: '#94a3b8'
      }
    },
    MuiMenu: {
      paper: {
        backgroundColor: '#111625 !important',
        backgroundImage: 'linear-gradient(145deg, #161e31 0%, #0d121f 100%) !important',
        border: '1px solid rgba(255, 255, 255, 0.1) !important',
        borderRadius: '14px !important',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.7) !important'
      }
    },
    MuiMenuItem: {
      root: {
        borderRadius: 8,
        margin: '3px 8px',
        color: '#e2e8f0',
        fontWeight: 500,
        '&:hover': {
          backgroundColor: 'rgba(0, 198, 255, 0.12)',
          color: '#00C6FF'
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(0, 198, 255, 0.2) !important',
          color: '#00C6FF !important',
          fontWeight: 700
        }
      }
    },
    MuiButton: {
      root: {
        borderRadius: 10,
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.4px',
        padding: '8px 22px',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      },
      containedPrimary: {
        background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(0, 198, 255, 0.35)',
        '&:hover': {
          background: 'linear-gradient(135deg, #1ad2ff 0%, #1a82ff 100%)',
          boxShadow: '0 6px 20px rgba(0, 198, 255, 0.55)',
          transform: 'translateY(-1px)'
        }
      },
      containedSecondary: {
        background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(255, 65, 108, 0.35)',
        '&:hover': {
          background: 'linear-gradient(135deg, #ff577d 0%, #ff5d40 100%)',
          boxShadow: '0 6px 20px rgba(255, 65, 108, 0.55)',
          transform: 'translateY(-1px)'
        }
      }
    },
    MuiTableCell: {
      root: {
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        color: '#cbd5e1',
        padding: '16px 20px',
        fontSize: '13px'
      },
      head: {
        backgroundColor: 'rgba(15, 22, 38, 0.95)',
        color: '#94a3b8',
        fontWeight: 700,
        textTransform: 'uppercase',
        fontSize: '11px',
        letterSpacing: '1px'
      }
    },
    MuiTableRow: {
      root: {
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.03) !important'
        }
      }
    },
    MuiCard: {
      root: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 16,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(12px)'
      }
    }
  }
});

export default theme;
