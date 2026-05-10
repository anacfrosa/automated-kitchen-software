import { Box } from "@mui/material";
import type { Metadata } from "next";

interface PropsType {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Ingredients - Wish and Cook",
  description: "Automated Kitchen Assistant Software",
};

export default function IngredientsLayout({ children }: PropsType) {
  return (
    <Box component={"div"} width={"100%"} sx={{ pt: 4 }}>
      {children}
    </Box>
  );
}
