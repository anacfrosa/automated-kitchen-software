import { Box } from "@mui/material";
import type { Metadata } from "next";

interface PropsType {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Purchases - Wish and Cook",
  description: "Automated Kitchen Assistant Software",
};

export default function PurchasesLayout({ children }: PropsType) {
  return (
    <Box display="flex" flexDirection="column" gap={3} mb={1}>
      {children}
    </Box>
  );
}
