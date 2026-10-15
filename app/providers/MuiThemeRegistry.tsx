"use client";

import { createTheme, ThemeProvider, ThemeOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import React from 'react';
import { colors, radius } from '@/app/lib/design-tokens';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.neutral,
    },
    error: {
      main: colors.danger,
    },
    warning: {
      main: colors.warning,
    },
    success: {
      main: colors.success,
    },
    info: {
      main: colors.info,
    },
    background: {
      default: '#fafafa', // zinc-50
    },
    text: {
      primary: '#09090b', // zinc-950
      secondary: '#71717a', // zinc-500
    },
  },
  shape: {
    borderRadius: radius.control,
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.control,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: colors.primaryHover,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#ffffff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e4e4e7', // zinc-200
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d4d4d8', // zinc-300
          },
        },
      },
    },
  },
};

const lightTheme = createTheme(themeOptions);

export default function MuiThemeRegistry({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const currentTheme = React.useMemo(() => {
    if (!isDark) return lightTheme;
    return createTheme({
      ...themeOptions,
      palette: {
        ...themeOptions.palette,
        mode: 'dark',
        background: { default: '#09090b', paper: '#18181b' }, // zinc-950, zinc-900
        text: { primary: '#fafafa', secondary: '#a1a1aa' }, // zinc-50, zinc-400
      },
      components: {
        ...themeOptions.components,
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              backgroundColor: '#18181b', // zinc-900
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3f3f46', // zinc-600
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#52525b', // zinc-500
              },
            },
          },
        },
      }
    });
  }, [isDark]);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
