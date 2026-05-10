import type { Metadata } from "next";

interface PropsType {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Historical Reports - Wish and Cook",
  description: "Automated Kitchen Assistant Software",
};

export default function ReportsLayout({ children }: PropsType) {
  return <>{children}</>;
}
