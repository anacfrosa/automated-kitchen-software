import { dir } from "i18next";
import type { Metadata } from "next";
import { languages } from "@wac/app/i18n/settings";
import ThemeRegistry from "@wac/styles/ThemeRegistry";
import HomeLayout from "../../components/layout/HomeLayout";

interface PropsType {
  children: React.ReactNode;
  params: { lng: string };
}

export const metadata: Metadata = {
  title: "Home - Wish and Cook",
  description: "Automated Kitchen Assistant Software",
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function RootLayout({ children, params: { lng } }: PropsType) {
  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning={true}>
      <ThemeRegistry lng={lng}>
        {/* <AppWrapper> */}
        <HomeLayout lng={lng} children={children} />
        {/* </AppWrapper> */}
      </ThemeRegistry>
    </html>
  );
}
