import type { Metadata } from "next";

interface PropsType {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Inventory - Wish and Cook",
  description: "Automated Kitchen Assistant Software",
};

export default function IngredientsLayout({ children }: PropsType) {
  return (
    <>{children}</>
  );
}
