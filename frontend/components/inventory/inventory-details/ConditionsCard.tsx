import React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Inventory } from "@wac/types/inventory";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import { fDateDDMMYYYYTime } from "@wac/lib/format-date";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Paper } from "@mui/material";

export default function ConditionsCard({
  data,
  lng,
}: {
  data: Inventory;
  lng: string;
}) {
  const { t } = useTranslation(lng, "inventory");
  return (
    <Grid
      container
      xs={12}
      md={4}
      spacing={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        mr: 1,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          flexGrow: 1,
          width: "100%",
          p: 1,
          borderRadius: "10px",
        }}
      >
        <Grid xs={12}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <TypographyTitle variant="body2">
              {t("info.recDate")}
            </TypographyTitle>
            <Typography variant="body2">
              {fDateDDMMYYYYTime({
                datetime: data.purchaseInfo.receptionDate,
              })}
            </Typography>
          </Stack>
        </Grid>

        <Grid xs={12}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <TypographyTitle variant="body2">
              {t("info.temperature")}
            </TypographyTitle>
            <Typography variant="body2">1.1ºC</Typography>
          </Stack>
        </Grid>

        <Grid xs={12}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <TypographyTitle variant="body2">
              {t("info.humidity")}
            </TypographyTitle>
            <Typography variant="body2">50%</Typography>
          </Stack>
        </Grid>
      </Paper>
    </Grid>
  );
}
