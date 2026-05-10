"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import DispenserCard from "@wac/components/cards/DispenserCard";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { auxiliary } from "@wac/styles/palette";
import SuccessAlert from "@wac/components/alerts/SuccessAlert";
import { ReadDispenser } from "@wac/types/dispenser";
import { useEffect, useState } from "react";
import DispenserMultipleRemoval from "@wac/components/dispensers/multiple-removal/MultipleRemoval";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import { SHOPID } from "@wac/lib/api/shops.api";
import {
  getDispenserByShop,
  getDispenserByShopAndStorage,
} from "@wac/lib/api/dispensers.api";

interface PropsType {
  params: { lng: string };
}

export default function DispensersPage({ params: { lng } }: PropsType) {
  const { t } = useTranslation(lng, "dispensers");

  const [dryDispensersInfo, setDryDispensersInfo] = useState<ReadDispenser[]>(
    []
  );
  const [fridgeDispensersInfo, setFridgeDispensersInfo] = useState<
    ReadDispenser[]
  >([]);

  // Fetching DRY dispensers by shop
  const {
    dispensers: dryDispensers,
    isLoading: dryLoading,
    isError: dryError,
    mutate: dryMutate,
  } = getDispenserByShopAndStorage(lng, SHOPID, "Dry");

  // Fetching FRIDGE dispensers by shop
  const {
    dispensers: fridgeDispensers,
    isLoading: fridgeLoading,
    isError: fridgeError,
    mutate: fridgeMutate,
  } = getDispenserByShopAndStorage(lng, SHOPID, "Fridge");

  // Handle success alert when reception list is added to inventory of ingredients
  const [successAlert, setSuccessAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const handleSuccessAlertChange = (event: boolean, alertText: string) => {
    setSuccessAlert(event);
    setAlertText(alertText);
  };

  useEffect(() => {
    if (!dryLoading && !dryError && dryDispensers) {
      setDryDispensersInfo(dryDispensers);
    }
  }, [dryLoading, dryError, dryDispensers]);

  useEffect(() => {
    if (!fridgeLoading && !fridgeError && fridgeDispensers) {
      setFridgeDispensersInfo(fridgeDispensers);
    }
  }, [fridgeLoading, fridgeError, fridgeDispensers]);

  useEffect(() => {
    if (successAlert) {
      dryMutate();
      fridgeMutate();
    }
  }, [successAlert]);

  useEffect(() => {
    console.log(dryDispensersInfo);
  }, [dryDispensersInfo]);

  return (
    <>
      {/* Dispensers Title */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: "10px",
        }}
      >
        <Typography variant="h6">{t("title")}</Typography>
      </Paper>

      {/* Dry Dispensers */}
      <Paper sx={{ p: 2, borderRadius: "10px" }}>
        <TypographyTitle variant="body1" sx={{ mb: 2 }}>
          {t("subtitle2")}
        </TypographyTitle>

        {dryDispensersInfo.length !== 0 ? (
          <Grid container spacing={2.5}>
            {dryDispensersInfo.map((dispenser: ReadDispenser) => (
              <Grid key={dispenser.id} xs={6} sm={6} md={3} lg={2}>
                <DispenserCard
                  lng={lng}
                  dispenser={dispenser}
                  onSucessAlert={handleSuccessAlertChange}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              height: "40vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: auxiliary.main }} />
          </Box>
        )}
      </Paper>

      {/* Fridge Dispensers */}
      <Paper sx={{ p: 2, borderRadius: "10px" }}>
        <TypographyTitle variant="body1" sx={{ mb: 2 }}>
          {t("subtitle1")}
        </TypographyTitle>

        {dryDispensersInfo.length !== 0 ? (
          <Grid container spacing={2.5}>
            {fridgeDispensersInfo.map((dispenser: ReadDispenser) => (
              <Grid key={dispenser.id} xs={6} sm={6} md={3} lg={2}>
                <DispenserCard
                  lng={lng}
                  dispenser={dispenser}
                  onSucessAlert={handleSuccessAlertChange}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              height: "40vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: auxiliary.main }} />
          </Box>
        )}
      </Paper>

      {/* Alert when there is some chnage in the dispenser (Fill, Refill, Remove ) */}
      <SuccessAlert
        lng={lng}
        open={successAlert}
        onSuccessAlertChange={handleSuccessAlertChange}
        alertText={alertText}
      />
    </>
  );
}
