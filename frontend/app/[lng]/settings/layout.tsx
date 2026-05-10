import { dir } from "i18next";
import type { Metadata } from "next";
import { Box, Paper } from "@mui/material";
import SettingOptions from "@wac/components/settings/SettingOptions";
import { languages } from "@wac/app/i18n/settings";

interface PropsType {
  children: React.ReactNode;
  params: { lng: string };
}

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
  title: "Settings - Wish and Cook",
  description: "Smart Kitchen Software",
};

export default function SettingsLayout({
  children,
  params: { lng },
}: PropsType) {
  return (
    <Paper
      dir={dir(lng)}
      elevation={1}
      sx={{
        p: 2,
        mt: 4,
        minHeight: "75vh",
        minWidth: "700px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "row",
        gap: 5,
      }}
    >
      <SettingOptions lng={lng} />

      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>{children}</Box>
    </Paper>
  );
}
