import { Box } from "@mui/material";
import type { Metadata } from "next";

interface PropsType {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Maintenance - Wish and Cook",
  description: "Automated Kitchen Assistant Software",
};

export default function MaintenanceLayout({ children }: PropsType) {
  return <>{children}</>;
}
