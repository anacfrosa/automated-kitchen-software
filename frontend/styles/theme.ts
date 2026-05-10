"use client";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { Jost, Nunito } from "next/font/google";
import { primary, secondary } from "./palette";

// Global styles

/****
 *  Main Palette:   Orange -  #eba607 // Green - #9abe26    // 93ce28
 *  Secondary Colours Palette: #c3dc7d (green)
 *  Font-Family Jost :  titles, headers and graphic captions
 *  Font-Family Nunito : Text bodies should always be aligned to the
 *                        left without justification or hyphenisation.
 */

export const jost = Jost({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

let theme = createTheme({
  palette: {
    primary: {
      main: primary.main,
      light: primary.light,
      dark: primary.dark,
      contrastText: primary.contrastText,
    },
    // for secondary interface elements.
    secondary: {
      main: secondary.main,
      light: secondary.light,
      dark: secondary.dark,
      contrastText: secondary.contrastText,
    },
  },
  typography: {
    fontFamily: nunito.style.fontFamily,
    h1: {
      fontFamily: jost.style.fontFamily,
      fontWeight: 700,
      fontSize: "66px",
    },
    h2: {
      fontFamily: jost.style.fontFamily,
      fontWeight: 700,
      fontSize: "55px",
    },
    h3: {
      fontFamily: jost.style.fontFamily,
      fontWeight: 700,
      fontSize: "45px",
    },
    h4: {
      fontFamily: jost.style.fontFamily,
      fontWeight: 700,
      fontSize: "35px",
    },
    h5: {
      fontFamily: jost.style.fontFamily,
      fontWeight: 700,
      fontSize: "28px",
    },
    h6: {
      fontFamily: jost.style.fontFamily,
      fontWeight: 700,
      fontSize: "21px",
    },
    subtitle1: {
      fontFamily: nunito.style.fontFamily,
      fontWeight: 700,
      fontSize: "19px",
    },
    subtitle2: {
      fontFamily: nunito.style.fontFamily,
      fontWeight: 700,
      fontSize: "17px",
    },
    body1: {
      fontFamily: nunito.style.fontFamily,
      fontWeight: 400,
      fontSize: "16px",
    },
    body2: {
      fontFamily: nunito.style.fontFamily,
      fontWeight: 400,
      fontSize: "14px",
    },
  },
  components: {
    MuiButton: {
      // Style Button
      styleOverrides: {
        root: {
          fontFamily: jost.style.fontFamily,
          fontWeight: 700,
          borderRadius: "12px",
          "&.MuiButton-contained": {
            color: "#FFFFFF",
          },
          // "&.MuiButton-outlined": {
          //   color: primary.main,
          //   backgroundColor: "#FFFFFF",
          //   "&:hover": {
          //     backgroundColor: "#FFFFFF",
          //   },
          // },
        },
      },
    },
    MuiLink: {
      // Style Link reference
      styleOverrides: {
        root: {
          color: "#191e19",
        },
      },
    },
    // MuiAlert: {
    //   styleOverrides: {
    //     root: ({ ownerState }) => ({
    //       ...(ownerState.severity === "info" && {
    //         backgroundColor: "#60a5fa",
    //       }),
    //     }),
    //   },
    // },
    // MuiMenuItem: {
    //   // Style Language Changer
    //   styleOverrides: {
    //     root: {
    //       "&.Mui-selected": {
    //         backgroundColor: "9abe26",
    //         //"&.Mui-focusVisible": { background: "orange" }
    //       },
    //     },
    //   },
    // },
  },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme);

export default theme;
