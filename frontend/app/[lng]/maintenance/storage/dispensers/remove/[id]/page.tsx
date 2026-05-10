"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import { Box, Divider, IconButton, Paper, Stack } from "@mui/material";
import Arrow from "@mui/icons-material/ArrowBack";
import RemovalReason from "@wac/components/dispensers/dispenser-removal/RemovalReason";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import ConfirmDialog from "@wac/components/dialog/ConfirmDialog";
import { useEffect, useState } from "react";
import { ReadDispenser } from "@wac/types/dispenser";
import {
  findLotsInDispenser,
  getDispenserById,
  updateDispenserById,
} from "@wac/utils/api/dispensers.api";
import { lotNumberList } from "@wac/lib/interfaces/inventory.interface";
import { useRouter } from "next/navigation";
import { SHOPID } from "@wac/lib/api/shops.api";
import { createWastage } from "@wac/lib/api/wastage.api";
import { convertToStandardUnit } from "@wac/lib/common";

interface PropsType {
  params: { id: string; lng: string };
}

export default function DispenserRemoval({ params: { id, lng } }: PropsType) {
  const { t } = useTranslation(lng, "dispensers");

  const route = useRouter();
  // Store selected dispenser information
  const [dispInfo, setDispInfo] = useState<ReadDispenser | undefined>(
    undefined
  );
  // Store all the inventories that are inside the selected dispenser
  const [lotsList, setLotsList] = useState<lotNumberList[]>([]);
  //Handle confirm remove action
  const [openAlertRemove, setOpenAlertRemove] = useState(false);

  // Get current dispenser information
  const { dispenser, isLoading, isError } = getDispenserById(lng, id);
  // Get all the lots that are on this dispenser
  const { lots, isLotsLoading, isLotsError } = findLotsInDispenser(lng, id);

  const handleRemoveIngredient = (event: boolean) => {
    if (event) {
      // Remove ingredient from dispenser
      const updatedDispenser = { isFree: true };
      updateDispenserById(id, updatedDispenser);

      // Add quantity removed to waste table
      if (dispInfo != undefined) {
        const today = new Date();
        createWastage({
          shopId: SHOPID,
          ingredientId: dispInfo.ingredientId.id,
          quantity: convertToStandardUnit(
            dispInfo.quantity.current,
            dispInfo.quantity.measureUnit
          ),
          day: today.getDate(),
          month: today.getMonth() + 1,
          year: today.getFullYear(),
        });
      }

      route.push(`/${lng}/maintenance/storage/dispensers`);
    }

    setOpenAlertRemove(false);
  };

  useEffect(() => {
    if (!isLoading && !isError && dispenser) {
      setDispInfo(dispenser);
    }
  }, [isLoading, isError]);

  useEffect(() => {
    if (!isLotsLoading && !isLotsError && lots) {
      setLotsList(lots);
    }
  }, [isLotsLoading, isLotsError]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 5,
          alignItems: "flex-start",
        }}
      >
        <IconButton href={`/${lng}/maintenance/storage/dispensers`}>
          <Arrow fontSize="medium" />
        </IconButton>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            pl: 4,
            pr: 4,
            width: "100%",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={1}
          >
            <TypographyTitle variant="subtitle2">
              {t("remove.title")}
            </TypographyTitle>
            <ContainedButton
              onClick={() => setOpenAlertRemove(true)}
              buttonSize="small"
              colorType="secondary"
            >
              {t("remove.removeBtt")}
            </ContainedButton>
          </Stack>

          <Divider />

          <RemovalReason
            lng={lng}
            dispenserInfo={dispInfo}
            lotNumbers={lotsList}
          />
        </Paper>
      </Box>

      {/* Confirm remove action */}
      <ConfirmDialog
        alertTitle={t("removeAlerts.title") + ` ${dispInfo?.number} ?`}
        alertContent={
          t("removeAlerts.content1") +
          `${dispInfo?.ingredientId.name}` +
          t("removeAlerts.content2")
        }
        open={openAlertRemove}
        handleClose={() => setOpenAlertRemove(false)}
        action1={t("yes")}
        action2={t("no")}
        handleAction={handleRemoveIngredient}
      />
    </>
  );
}
