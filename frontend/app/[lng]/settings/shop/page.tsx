"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import { MenuItem, Stack, Typography } from "@mui/material";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import Grid from "@mui/material/Unstable_Grid2";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import CircleIcon from "@mui/icons-material/Circle";
import theme from "@wac/styles/theme";
import { useState } from "react";
import { SHOPID } from "@wac/lib/api/shops.api";
import { getDispenserByShop } from "@wac/utils/api/dispensers.api";
import { ReadDispenser } from "@wac/types/dispenser";
import Loading from "@wac/components/Loading";

interface PropsType {
  params: { lng: string };
}

export const shopList = [
  {
    value: "wac1",
    label: "1 - Aveiro, Portugal",
  },
];

export default function ShopSettingsPage({ params: { lng } }: PropsType) {
  const { t } = useTranslation(lng, "settings");

  const [DryDispensers, setDryDispensers] = useState(0);
  const [FridgeDispensers, setFridgeDispensers] = useState(0);

  const { dispensers, isLoading, isError } = getDispenserByShop(lng, SHOPID);

  React.useEffect(() => {
    if (!isError && !isLoading && dispensers) {
      const DryNumber = dispensers.filter(
        (dispenser: ReadDispenser) => dispenser.storage === "Dry"
      ).length;

      setDryDispensers(DryNumber);

      const FridgeNumber = dispensers.filter(
        (dispenser: ReadDispenser) => dispenser.storage === "Fridge"
      ).length;

      setFridgeDispensers(FridgeNumber);
    }
  }, [isLoading, isError, dispensers]);

  return (
    <Stack direction="column">
      <TypographyTitle variant="subtitle1">{t("shop.title")}</TypographyTitle>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {!isError && !isLoading ? (
          <>
            <Grid xs={12}>
              <CustomTextField
                select
                label={t("sidebar.shop")}
                name="shop"
                value={"wac1"}
                variant="outlined"
                size="small"
                fullWidth
              >
                {shopList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid xs={12} md={3}>
              <Stack direction={"column"} gap={1.2}>
                <TypographyTitle variant="body2">
                  {t("shop.status")}
                </TypographyTitle>
                <Stack direction="row" alignItems={"center"} gap={1}>
                  <CircleIcon
                    fontSize="small"
                    sx={{ color: theme.palette.primary.main }}
                  />
                  <Typography variant="body2">Active</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid xs={12} md={3}>
              <Stack direction={"column"} gap={1.2}>
                <TypographyTitle variant="body2">
                  {t("shop.country")}
                </TypographyTitle>
                <Typography variant="body2">Portugal</Typography>
              </Stack>
            </Grid>

            <Grid xs={12} md={3}>
              <Stack direction={"column"} gap={1.2}>
                <TypographyTitle variant="body2">
                  {t("shop.city")}
                </TypographyTitle>
                <Typography variant="body2">Aveiro</Typography>
              </Stack>
            </Grid>

            <Grid xs={12} md={3}>
              <Stack direction={"column"} gap={1.2}>
                <TypographyTitle variant="body2">
                  {t("shop.address")}
                </TypographyTitle>
                <Typography variant="body2">
                  Edifício Central, Via do Conhecimento, 3830-352 Ílhavo
                </Typography>
              </Stack>
            </Grid>

            <Grid xs={12} md={3}>
              <Stack direction={"column"} gap={1.2}>
                <TypographyTitle variant="body2">
                  {t("shop.totalDispensers")}
                </TypographyTitle>
                <Typography variant="body2">
                  {DryDispensers + FridgeDispensers}
                </Typography>
              </Stack>
            </Grid>

            <Grid xs={12} md={3}>
              <Stack direction={"column"} gap={1.2}>
                <TypographyTitle variant="body2">
                  {t("shop.dryDispensers")}
                </TypographyTitle>
                <Typography variant="body2">{DryDispensers}</Typography>
              </Stack>
            </Grid>

            <Grid xs={12} md={3}>
              <Stack direction={"column"} gap={1.2}>
                <TypographyTitle variant="body2">
                  {t("shop.fridgeDispensers")}
                </TypographyTitle>
                <Typography variant="body2">{FridgeDispensers}</Typography>
              </Stack>
            </Grid>
          </>
        ) : (
          <Loading customHeight="70vh"></Loading>
        )}
      </Grid>
    </Stack>
  );
}
