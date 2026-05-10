import React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import { usePathname } from "next/navigation";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { LinearProgressWithLabel } from "@wac/components/linear-progress/LinearProgress";
import { fDateDDMMYYYYTime } from "@wac/lib/format-date";
import { Inventory } from "@wac/types/inventory";
import { DisplayQuantity, convertToGrams } from "@wac/lib/common";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import Grid from "@mui/material/Unstable_Grid2";
import { Paper } from "@mui/material";

export default function QuantityInfoCard({
  lng,
  data,
}: {
  lng: string;
  data: Inventory;
}) {
  const { t } = useTranslation(lng, "inventory");
  return (
    <Grid
      container
      xs={12}
      md={4}
      spacing={2}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <Paper
        variant="outlined"
        sx={{
          //display: "flex",
          flexGrow: 1,
          width: "100%",
          p: 1,
          borderRadius: "10px",
        }}
      >
        <Grid xs={12}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <TypographyTitle variant="body2">{t("info.lot")}</TypographyTitle>
            <Typography variant="body2">{data.lotNumber}</Typography>
          </Stack>
        </Grid>

        <Grid xs={12}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <TypographyTitle variant="body2">
              {t("info.available")}
            </TypographyTitle>
            <Typography variant="body2">
              {DisplayQuantity(
                data.quantity.current,
                data.quantity.measureUnit
              )}
            </Typography>
          </Stack>
        </Grid>

        <Grid xs={12}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <TypographyTitle variant="body2">
              {t("info.primaryDate")}
            </TypographyTitle>
            <Typography variant="body2">
              {fDateDDMMYYYYTime({
                datetime: data.expiryDate,
              })}
            </Typography>
          </Stack>
        </Grid>
      </Paper>
    </Grid>
  );
}
