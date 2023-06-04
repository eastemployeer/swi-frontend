/* eslint-disable @typescript-eslint/naming-convention */
import { experimental_extendTheme as extendTheme,
         createTheme } from '@mui/material/styles';

export const cssVarsTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#4285F4',
          dark: '#E45A2E',
          light: '#E76D45',
          background: {
            main: '#ED9174',
            light: '#F9DAD1',
          },
          border: {
            main: '#ED9174',
            light: '#F6C8B9',
          },
          hover: '#F3B6A2',
        },
        secondary: {
          main: '#f8f9fa',
        },
        warning: {
          main: '#F9DA70',
        },
        success: {
          main: '#10B26E',
        },
        common: {
          black: "#0F1017",
          white: "#FFFFFF",
        },
        neutral: {
          800: "#0F1017",
          700: "#27282E",
          600: "#3F4045",
          500: "#57585D",
          400: "#6F7074",
          300: "#B7B7B9",
          200: "#E7E7E8",
          100: "#FFFFFF",
        },
      },
    },
  },
});

const baseTheme = createTheme({
  typography: {
    fontFamily: '"arial" , sans-serif',
    h1: {
      fontSize: "70px",
      fontWeight: 600,
    },
    h2: {
      fontSize: "56px",
      fontWeight: 500,
    },
    h3: {
      fontSize: "44px",
      fontWeight: 700,
    },
    h4: {
      fontSize: "36px",
      fontWeight: 500,
    },
    h5: {
      fontSize: "28px",
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: "20px",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "19px",
      fontWeight: 400,
    },
    body1: {
      fontSize: "16px",
      fontWeight: 500,
    },
    body2: {
      fontSize: "16px",
      fontWeight: 400,
    },
    body3: {
      fontSize: "14px",
    },
    caption: {
      fontSize: "13px",
      color: "#5F6368",
    },
    button: {
      lineHeight: 1.5,
      letterSpacing: 0,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 1920,
    },
  },
  fonts: {
    base: {
      lineHeight: 1.5,
    },
    componentTitle: {
      fontSize: '18px',
    },
    sidebarLink: {
      fontSize: '12px',
    },
    button: {
      fontSize: '1rem',
    },
  },
});

export const theme = createTheme(baseTheme, {
  components: {
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: baseTheme.palette.common.white,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: baseTheme.fonts.button.fontSize,
          backgroundColor: baseTheme.palette.common.white,
          borderRadius: '24px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: baseTheme.fonts.button.fontSize,
          boxShadow: "0px 2px 5px 1px rgba(64, 60, 67, 0.16)",
          borderRadius: '4px',
          padding: '8px 16px',
        },
        outlinedPrimary: {
          backgroundColor: baseTheme.palette.common.white,
        },
        outlinedSecondary: {
          borderColor: baseTheme.palette.secondary.main,
        },
        containedPrimary: {
          borderColor: baseTheme.palette.primary.main,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          backgroundColor: baseTheme.palette.common.white,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: baseTheme.palette.common.white,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#DADCE0",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          paddingLeft: "5px",
          paddingRight: "5px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "outline": `1px solid transparent`,
          '&.MuiTableRow-hover:hover': {
            outline: `1px solid ${baseTheme.palette.primary.main}`,
            cursor: 'pointer',
          },
        },
      },
    },
  },
});
