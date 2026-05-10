import type { Metadata } from "next";

interface PropsType {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Shop Settings - Wish and Cook",
  description: "Intelligent Kitchen Software",
};

export default function ShopSettingsLayout({ children }: PropsType) {
  return <>{children}</>;
}
