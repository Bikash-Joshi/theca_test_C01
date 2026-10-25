"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: "#24231f", contrastText: "#f8f7f4" },
    secondary: { main: "#d8c8ad" },
    background: { default: "#f8f7f4", paper: "#ffffff" },
    text: { primary: "#24231f", secondary: "#77746d" },
    divider: "rgba(36, 35, 31, 0.14)",
  },
  shape: { borderRadius: 2 },
  typography: {
    fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
    h1: {
      fontFamily: "var(--font-playfair), Georgia, serif",
      fontWeight: 400,
      lineHeight: 1.05,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: "var(--font-playfair), Georgia, serif",
      fontWeight: 400,
      lineHeight: 1.15,
      letterSpacing: "-0.01em",
    },
    h3: { fontFamily: "var(--font-playfair), Georgia, serif", fontWeight: 500 },
    h5: { fontFamily: "var(--font-playfair), Georgia, serif", fontWeight: 500 },
    h6: { fontFamily: "var(--font-playfair), Georgia, serif", fontWeight: 500 },
    overline: { letterSpacing: "0.22em", fontSize: 12, fontWeight: 500 },
    button: { textTransform: "none", letterSpacing: "0.04em", fontWeight: 500 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 0, padding: "14px 28px" } },
    },
    MuiTextField: { defaultProps: { variant: "outlined", fullWidth: true } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 0 } } },
  },
});

export default theme;
