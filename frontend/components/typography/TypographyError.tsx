import * as React from "react";
import { Typography, TypographyProps } from "@mui/material";

interface PropsType extends TypographyProps {
  children: React.ReactNode;
}

export default function TypographyError({ children, ...props }: PropsType) {
  return (
    <Typography color="error" fontSize={"14px"} {...props}>
      {children}
    </Typography>
  );
}
