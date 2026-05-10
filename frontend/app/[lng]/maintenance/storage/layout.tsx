import { dir } from "i18next";
import type { Metadata } from "next";
import { languages } from "@wac/app/i18n/settings";
import { Box, Container } from "@mui/material";
import StorageNavbar from "@wac/components/navbar/StorageNavbar";

interface PropsType {
  children: React.ReactNode;
  params: { lng: string };
}

export const metadata: Metadata = {
  title: "Storage - Wish and Cook",
  description: "Automated Kitchen Assistant Software",
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function StorageLayout({
  children,
  params: { lng },
}: PropsType) {
  return (
    <Box dir={dir(lng)} sx={{ width: "100%" }}>
      <StorageNavbar lng={lng} />

      {/* <Box component={"div"} width={"100%"} sx={{ pt: 10 }}> */}
      <Box component={"div"} width={"100%"} pt={10}>
        {children}
      </Box>
    </Box>
  );
}
