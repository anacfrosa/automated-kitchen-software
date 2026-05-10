import { Box } from "@mui/material";
import type { Metadata } from "next";

interface PropsType {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Dispensers - Wish and Cook",
  description: "Automated Kitchen Assistant Software",
};

export default function DispensersLayout({ children }: PropsType) {
  return (
    <Box display="flex" flexDirection="column" gap={3.5} mb={2}>
      {children}
    </Box>
  );
}
