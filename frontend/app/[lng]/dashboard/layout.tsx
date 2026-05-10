import Sidebar from "@wac/components/sidebar/Sidebar";
import type { Metadata } from "next";

interface PropsType {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Dashboard - Wish and Cook",
  description: "Automated Kitchen Assistant Software",
};

export default function DashboardLayout({ children }: PropsType) {
  return <>{children}</>;
}
