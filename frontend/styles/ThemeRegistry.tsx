"use client";
import * as React from "react";
import { ThemeProvider, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import theme from "./theme";
import { usePathname } from "next/navigation";
import { auxiliary, background, primary } from "./palette";

interface PropsType {
  children: React.ReactNode;
  lng: string;
}

interface BodyProps {
  pathname: string;
  lng: string;
}

const Body = styled("body")<BodyProps>(({ pathname, lng }) => ({
  backgroundColor: background.main,
  //background: background.main,
  //background: pathname != `/${lng}` ? background.main : "white", // #F1F1F1
}));

export default function ThemeRegistry({ children, lng }: PropsType) {
  const pathname = usePathname();
  return (
    <Body pathname={pathname} lng={lng} suppressHydrationWarning={true}>
      {/* <AppRouterCacheProvider options={{ enableCssLayer: true }}> */}
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </Body>
  );
}
