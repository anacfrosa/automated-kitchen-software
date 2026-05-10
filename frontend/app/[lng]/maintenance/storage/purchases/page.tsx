"use client";
import { useTranslation } from "@wac/app/i18n/client";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import PurchasesTable from "@wac/components/purchases/purchases-table/PurchasesTable";

interface PropsType {
  params: { lng: string };
}

export default function PurchasesPage({ params: { lng } }: PropsType) {
  const { t } = useTranslation(lng, "purchases");

  return (
    <>
      {/* First Layer */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: "10px",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Typography variant="h6">{t("title")}</Typography>
          <ContainedButton
            startIcon={<AddIcon fontSize="small" />}
            buttonSize={"small"}
            icon={true}
            href={`/${lng}/maintenance/storage/purchases/new`}
          >
            {t("buttons.register")}
          </ContainedButton>
        </Stack>
      </Paper>

      {/* Second Layer */}
      <PurchasesTable lng={lng} />
    </>
  );
}
