"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Arrow from "@mui/icons-material/ArrowBack";
import theme, { jost } from "@wac/styles/theme";
import RemovalReason from "@wac/components/inventory/inventory-removal/RemovalReason";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import { useEffect, useState } from "react";
import { Inventory } from "@wac/types/inventory";
import {
  getInventoryById,
  updateInventory,
} from "@wac/utils/api/inventory.api";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import { convertToStandardUnit, validRemoveField } from "@wac/lib/common";
import { removalFieldsType } from "@wac/components/inventory/inventory-removal/utils";
import AlertDialog from "@wac/components/dialog/AlertDialog";
import ConfirmDialog from "@wac/components/dialog/ConfirmDialog";
import { useRouter } from "next/navigation";
import { createWastage } from "@wac/lib/api/wastage.api";
import { SHOPID } from "@wac/lib/api/shops.api";

interface PropsType {
  params: { id: string; lng: string };
}

export default function InventoryRemovalById({
  params: { id, lng },
}: PropsType) {
  const { t } = useTranslation(lng, "inventory");

  const route = useRouter();
  // Get the information of the inventory by his id
  const [inventory, setInventory] = useState<Inventory>();
  const [removalfield, setRemovalField] = useState<removalFieldsType>({
    quantity: 0,
    measureUnit: "kg",
  });
  // Handle invalid remove field (empty, or too much)
  const [openAlertInvalidField, setOpenAlertInvalidField] = useState(false);
  //Handle confirm remove action
  const [openAlertRemove, setOpenAlertRemove] = useState(false);

  const { data, isLoading, isError } = getInventoryById(lng, id);

  const handleRemovalFieldsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setRemovalField((prevState) => ({
      ...prevState,
      [name]: name === "measureUnit" ? value : parseFloat(value),
    }));
  };

  // const handleAlertRemoveAction = (event: boolean) => {
  //   setOpenAlertRemoveAction(event);
  // };

  const handleRemoveAction = () => {
    const current = {
      quantity: inventory ? inventory.quantity.current : 0,
      measureUnit: inventory ? inventory.quantity.measureUnit : "g",
    };
    if (!validRemoveField(current, removalfield)) {
      setOpenAlertInvalidField(true);
    } else {
      setOpenAlertRemove(true);
    }
  };

  const handleRemoveIngredient = (event: boolean) => {
    if (event) {
      const quantityToRemove = removalfield.quantity;
      const measureUnitToRemove = removalfield.measureUnit;
      // Update inventory table
      const updatedInventory = {
        quantityOut: convertToStandardUnit(
          quantityToRemove,
          measureUnitToRemove
        ),
        measureUnit: "kg", // convert to standard unit DB
      };
      updateInventory(id, updatedInventory);

      // Add quantity removed to waste table

      if (inventory != undefined) {
        const today = new Date();
        createWastage({
          shopId: SHOPID,
          ingredientId: inventory.purchaseInfo.ingredient.id,
          quantity: convertToStandardUnit(
            quantityToRemove,
            measureUnitToRemove
          ),
          day: today.getDate(),
          month: today.getMonth() + 1,
          year: today.getFullYear(),
        });
      }

      //route.push(`/${lng}/maintenance/storage/inventory`);
      route.back();
    }

    setOpenAlertRemove(false);
  };

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setInventory(data);
    }
  }, [isLoading, isError, data]);

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
        <IconButton
          href={`/${lng}/maintenance/storage/inventory/details/${id}`}
        >
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
              onClick={handleRemoveAction}
              buttonSize="small"
              colorType="secondary"
            >
              {t("remove.removebttn")}
            </ContainedButton>
          </Stack>

          <Divider />

          <RemovalReason
            lng={lng}
            inventory={inventory}
            removalfields={removalfield}
            onRemovalFieldsChange={handleRemovalFieldsChange}
          />
        </Paper>
      </Box>

      {/* Confirm remove action */}
      <ConfirmDialog
        alertTitle={t("alerts.confirmremove.title")}
        alertContent={
          t("alerts.confirmremove.content1") +
          `${removalfield.quantity} ${removalfield.measureUnit}` +
          t("alerts.confirmremove.content2") +
          `${inventory?.purchaseInfo.ingredient.name}` +
          t("alerts.confirmremove.content3")
        }
        open={openAlertRemove}
        handleClose={() => setOpenAlertRemove(false)}
        action1={t("buttons.yes")}
        action2={t("buttons.no")}
        handleAction={handleRemoveIngredient}
      />

      {/* Send Empty fields alert */}
      <AlertDialog
        alertTitle={t("alerts.invalidremove.title")}
        alertContent={t("alerts.invalidremove.content")}
        open={openAlertInvalidField}
        handleClose={() => setOpenAlertInvalidField(false)}
        handleAction={() => setOpenAlertInvalidField(false)}
      />
    </>
  );
}
