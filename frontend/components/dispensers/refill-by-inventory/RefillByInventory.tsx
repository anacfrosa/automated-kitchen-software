"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import { Divider, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import theme from "@wac/styles/theme";
import SelectMeasureUnitInput from "@wac/components/inputs/SelectUnitInput";
import { Inventory } from "@wac/types/inventory";
import { ReadDispenser } from "@wac/types/dispenser";
import {
  DisplayQuantity,
  DisplayRequiredQty,
  getDispenserMaxCapacity,
} from "@wac/lib/common";
import TypographyError from "@wac/components/typography/TypographyError";
import { CalculateQuantityToAdd } from "../utils";

interface PropsType {
  lng: string;
  inventoryInfo: Inventory;
  dispenserInfo: ReadDispenser;
  quantityRequired: number;
  quantityFields: {
    quantity: number;
    measureUnit: string;
  };
  onQuantityFieldsChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validFields: { valid: boolean; error: string };
}

export default function RefillByInventory({
  inventoryInfo,
  dispenserInfo,
  quantityRequired,
  quantityFields,
  onQuantityFieldsChange,
  validFields,
  lng,
}: PropsType) {
  const { t } = useTranslation(lng, "dispensers");

  const dispVolume = dispenserInfo.volume;
  const ingrDensity = inventoryInfo.purchaseInfo.ingredient.density;

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack direction={"column"} gap={3} mr={3}>
          <Stack direction={"row"} gap={3}>
            <TypographyTitle variant="body2">{t("add.number")}</TypographyTitle>
            <Typography variant="body2">{dispenserInfo.number}</Typography>
          </Stack>
          <Stack direction={"row"} gap={3}>
            <TypographyTitle variant="body2">
              {t("add.storage")}
            </TypographyTitle>
            <Typography variant="body2">{dispenserInfo.storage}</Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid xs={12} md={4}>
        <Stack direction={"column"} gap={3}>
          <Stack direction={"row"} gap={3}>
            <TypographyTitle variant="body2">
              {t("add.ingredient")}
            </TypographyTitle>
            <Typography variant="body2">
              {inventoryInfo.purchaseInfo.ingredient.name}
            </Typography>
          </Stack>
          <Stack direction={"row"} gap={3}>
            <TypographyTitle variant="body2">{t("add.lot")}</TypographyTitle>
            <Typography variant="body2">{inventoryInfo.lotNumber}</Typography>
          </Stack>
        </Stack>
      </Grid>

      <Grid xs={12} md={4}>
        <Stack direction={"column"} gap={3}>
          <Stack direction={"row"} gap={3}>
            {/* Generated quantity to add */}
            <TypographyTitle variant="body2">
              {t("add.qtyStorage")}
            </TypographyTitle>
            <Typography variant="body2">
              {DisplayQuantity(
                inventoryInfo.quantity.current,
                inventoryInfo.quantity.measureUnit
              )}
            </Typography>
          </Stack>

          <Stack direction={"row"} gap={3}>
            {/* Quantity inside the dispenser */}
            <TypographyTitle variant="body2">
              {t("add.qtyDisp")}
            </TypographyTitle>
            <Typography variant="body2">
              {DisplayQuantity(
                dispenserInfo.quantity.current,
                dispenserInfo.quantity.measureUnit
              )}
            </Typography>
          </Stack>
        </Stack>
      </Grid>

      <Grid xs={12}>
        <Divider />
      </Grid>

      {quantityRequired !== 0 && (
        <Grid xs={12} md={4}>
          <Stack direction={"row"} gap={3}>
            <TypographyTitle
              variant="body2"
              color={theme.palette.secondary.main}
            >
              {t("add.requiredQty")}
            </TypographyTitle>
            <Typography variant="body2">
              {DisplayRequiredQty(quantityRequired)}
            </Typography>
          </Stack>
        </Grid>
      )}

      <Grid xs={12} md={4}>
        <Stack direction={"row"} gap={3}>
          {/* Max Dispenser Capacity */}
          <TypographyTitle variant="body2">{t("add.maxCap")}</TypographyTitle>
          <Typography variant="body2">
            {getDispenserMaxCapacity(dispVolume, ingrDensity) / 1000 + " kg"}
          </Typography>
        </Stack>
      </Grid>

      {quantityRequired !== 0 && (
        <Grid xs={12}>
          <Stack direction={"column"} justifyContent={"space-between"}>
            <TypographyTitle variant="body2" sx={{ mb: 2 }}>
              {t("add.qtyToAdd")}
            </TypographyTitle>
            <CustomTextField
              value={CalculateQuantityToAdd(
                {
                  quantity: inventoryInfo.quantity.current,
                  measureUnit: inventoryInfo.quantity.measureUnit,
                },
                {
                  quantity: quantityRequired,
                  measureUnit: "kg",
                }
              )}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Stack>
        </Grid>
      )}

      <Grid xs={12}>
        <Stack direction={"column"} justifyContent={"space-between"}>
          <TypographyTitle variant="body2" sx={{ mb: 2 }}>
            {quantityRequired !== 0 ? t("add.confirmQty") : t("add.qtyToAdd")}
          </TypographyTitle>

          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <CustomTextField
              error={!validFields.valid}
              type="number"
              name="quantity"
              label={t("add.quantity")}
              value={
                quantityFields.quantity == 0 ? "" : quantityFields.quantity
              }
              onChange={(event: any) => onQuantityFieldsChange(event)}
              variant="outlined"
              size="small"
              fullWidth
            />

            <SelectMeasureUnitInput
              lng={lng}
              value={quantityFields.measureUnit}
              onChange={(event: any) => onQuantityFieldsChange(event)}
              error={!validFields.valid}
            />
          </Stack>
        </Stack>
      </Grid>
      {!validFields.valid && (
        <TypographyError ml={2}>{validFields.error}</TypographyError>
      )}
    </Grid>
  );
}
