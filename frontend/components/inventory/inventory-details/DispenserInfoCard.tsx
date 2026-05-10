import React, { useEffect, useState } from "react";
import { useTranslation } from "@wac/app/i18n/client";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import Grid from "@mui/material/Unstable_Grid2";
import { IconButton, Paper, Tooltip } from "@mui/material";
import { ReadDispenser } from "@wac/types/dispenser";
import { getDispenserById } from "@wac/utils/api/dispensers.api";
import { DisplayQuantity } from "@wac/lib/common";
import { fDateDDMMYYYYTime } from "@wac/lib/format-date";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import RefillIcon from "@mui/icons-material/Autorenew";
import { primary, secondary } from "@wac/styles/palette";
import { useRouter } from "next/navigation";

interface PropsType {
  lng: string;
  currentRole: string;
  onUnauthorizedChange: (event: boolean) => void;
  dispenserInfo: ReadDispenser;
  inventoryId: string;
  onQtyAvailableChange: (event: boolean) => void;
  inventoryQty: number;
}

export default function DispenserInfoCard({
  lng,
  currentRole,
  onUnauthorizedChange,
  dispenserInfo,
  inventoryId,
  onQtyAvailableChange,
  inventoryQty,
}: PropsType) {
  const { t } = useTranslation(lng, "inventory");
  const router = useRouter();

  const checkRemoveAccess = () => {
    if (currentRole == "manager") {
      onUnauthorizedChange(true);
    } else {
      onUnauthorizedChange(false);
      router.push(
        `/${lng}/maintenance/storage/dispensers/remove/${dispenserInfo.id}`
      );
    }
  };

  const checkRefillAccess = () => {
    if (currentRole == "manager") {
      onUnauthorizedChange(true);
    } else {
      onUnauthorizedChange(false);

      if (inventoryQty == 0) {
        onQtyAvailableChange(false);
      } else {
        onQtyAvailableChange(true);
        router.push(
          `/${lng}/maintenance/storage/dispensers/refill/${dispenserInfo.id}/${inventoryId}`
        );
      }
    }
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: "10px",
      }}
    >
      <Grid container spacing={1}>
        <Grid xs={12}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Stack direction={"row"} gap={2} alignItems={"center"}>
              <TypographyTitle variant="body1">
                {t("info.dispCard.number")}
              </TypographyTitle>
              <Typography variant="body1">{dispenserInfo.number}</Typography>
            </Stack>

            <Stack direction={"row"} gap={1}>
              <Tooltip title={t("info.dispCard.refillbttn")}>
                <IconButton
                  onClick={checkRefillAccess}
                  sx={{ color: primary.dark }}
                >
                  <RefillIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("info.dispCard.cleanbttn")}>
                <IconButton
                  onClick={checkRemoveAccess}
                  sx={{ color: secondary.dark }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Grid>

        <Grid xs={12} md={12}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <TypographyTitle variant="body2">
              {t("info.dispCard.storage")}
            </TypographyTitle>
            <Typography variant="body2">{dispenserInfo.storage}</Typography>
          </Stack>
        </Grid>

        <Grid xs={12} md={12}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <TypographyTitle variant="body2">
              {t("info.dispCard.qty")}
            </TypographyTitle>
            <Typography variant="body2">
              {DisplayQuantity(
                dispenserInfo.quantity.current,
                dispenserInfo.quantity.measureUnit
              )}
            </Typography>
          </Stack>
        </Grid>

        <Grid xs={12} md={12}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <TypographyTitle variant="body2">
              {t("info.dispCard.secExpiryDate")}
            </TypographyTitle>
            <Typography variant="body2">
              {dispenserInfo !== undefined && dispenserInfo.expiryDate !== null
                ? fDateDDMMYYYYTime({
                    datetime: dispenserInfo.expiryDate,
                  })
                : "--"}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}
