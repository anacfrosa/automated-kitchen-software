import type { Metadata } from "next";

interface PropsType {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Account Settings - Wish and Cook",
  description: "Intelligent Kitchen Software",
};

export default function AccountSettingsLayout({ children }: PropsType) {
  return <>{children}</>;
}
