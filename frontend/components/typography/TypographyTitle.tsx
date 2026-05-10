"use client";
import * as React from "react";
import { Typography, TypographyProps } from "@mui/material";
import { jost } from "@wac/styles/theme";
import { auxiliary } from "@wac/styles/palette";

interface PropsType extends TypographyProps {
  children: React.ReactNode;
  color?: string;
}

export default function TypographyTitle({
  children,
  color,
  ...props
}: PropsType) {
  return (
    <Typography
      fontWeight={600}
      fontFamily={jost.style.fontFamily}
      color={color ? color : auxiliary.darker}
      {...props}
    >
      {children}
    </Typography>
  );
}
