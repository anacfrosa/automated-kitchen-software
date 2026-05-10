"use client";
import * as React from "react";
import { Box } from "@mui/material";

interface ScrollbarProps {
  children: React.ReactNode;
}

export default function Scrollbar({ children }: ScrollbarProps) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        overflowX: "hidden",
        maxHeight: "100vh",
        "&::-webkit-scrollbar": { width: "10px", borderRadius: "8px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#c1c1c1",
          borderRadius: "8px",
          width: "5px",
        },
        "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
      }}
    >
      {children}
    </Box>
  );
}
