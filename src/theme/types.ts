import { ColorPartial } from "@mui/material/styles/createPalette";
import { TypographyStyleOptions } from "@mui/material/styles/createTypography";

declare module '@mui/material/styles' {
  interface Theme {
    fonts: {
      base: {
        lineHeight: number;
      };
      componentTitle: {
        fontSize: string;
      };
      sidebarLink: {
        fontSize: string;
      };
      button: {
        fontSize: string;
      };
    };
  }
  interface ThemeOptions {
    fonts?: {
      base?: {
        lineHeight?: number;
      };
      componentTitle?: {
        fontSize?: string;
      };
      sidebarLink?: {
        fontSize?: string;
      };
      button: {
        fontSize: string;
      };
    };
  }
  interface BreakpointOverrides {
    xxl: true;
  }

  interface Palette {
    button?: Palette['primary'];
    neutral?: ColorPartial;
  }

  interface PaletteOptions {
    button?: PaletteOptions['primary'];
    neutral?: ColorPartial;
  }

  interface PaletteColor {
    contact?: string;
    background?: SimplePaletteColorOptions;
    border?: SimplePaletteColorOptions;
    hover?: string;
  }

  interface SimplePaletteColorOptions {
    contact?: string;
    background?: SimplePaletteColorOptions;
    border?: SimplePaletteColorOptions;
    hover?: string;
  }

  interface TypographyVariants {
    body3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true;
  }
}

export {};
