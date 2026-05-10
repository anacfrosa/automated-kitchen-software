"use client";
import { useTranslation } from "@wac/app/i18n/client";
import * as React from "react";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import InventoryTable from "@wac/components/inventory/inventory-table/InventoryTable";
import Box from "@mui/material/Box";
import { getInventoryByShop } from "@wac/utils/api/inventory.api";
import { SHOPID } from "@wac/lib/api/shops.api";
import SuccessAlert from "@wac/components/alerts/SuccessAlert";
import { Inventory } from "@wac/types/inventory";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import NewInventory from "@wac/components/inventory/new-inventory/NewInventory";
import { useEffect, useState } from "react";
import AlertDialog from "@wac/components/dialog/AlertDialog";

interface PropsType {
  params: { lng: string };
}

export default function InventoryPage({ params: { lng } }: PropsType) {
  const { t } = useTranslation(lng, "inventory");

  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<string>("");
  // State to handle inventory reception dialog
  const [newInventory, setNewInventory] = React.useState(false);

  const [inventoryList, setInventoryList] = React.useState<Inventory[]>([]);

  // Handle success alert when reception list is added to inventory of ingredients
  const [successAlert, setSuccessAlert] = React.useState(false);

  // Fetching inventory
  const { inventory, isLoading, isError, mutate } = getInventoryByShop(
    lng,
    SHOPID
  );

  // Handle Inventory Reception Dialog
  const handleNewInventory = (event: boolean) => {
    if (currentRole == "manager") {
      setUnauthorized(true);
    } else {
      setUnauthorized(false);
      setNewInventory(event);
    }
  };

  const handleSuccessAlertChange = (event: boolean) => {
    setSuccessAlert(event);
  };

  useEffect(() => {
    if (!isLoading && !isError) {
      setInventoryList(inventory);
    }
  }, [inventory, isLoading, isError]);

  useEffect(() => {
    if (successAlert) {
      mutate();
    }
  }, [successAlert]);

  useEffect(() => {
    // Get the current role from local storage
    const role = localStorage.getItem("selectedRole");
    if (role) {
      setCurrentRole(role);
    }
  }, []);

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
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">{t("title")}</Typography>
          <ContainedButton
            startIcon={<AddIcon fontSize="small" />}
            buttonSize="small"
            icon={true}
            onClick={() => handleNewInventory(true)}
          >
            {t("buttons.newInventory")}
          </ContainedButton>
        </Stack>
      </Paper>

      <NewInventory
        lng={lng}
        newInventory={newInventory}
        onNewInventory={handleNewInventory}
        onSucessAlert={handleSuccessAlertChange}
      />

      {/* Table with the Inventory of ingredients  */}
      <Box component="div" marginTop={3} marginBottom={3}>
        <InventoryTable
          lng={lng}
          invIsLoading={isLoading}
          inventoryList={inventoryList}
        />
      </Box>

      <SuccessAlert
        lng={lng}
        open={successAlert}
        onSuccessAlertChange={handleSuccessAlertChange}
        alertText={t("alerts.newInventory")}
      />

      <AlertDialog
        alertTitle={t("alerts.unauthorized.title")}
        alertContent={t("alerts.unauthorized.content")}
        open={unauthorized}
        handleClose={() => setUnauthorized(false)}
        handleAction={() => setUnauthorized(false)}
      />
    </>
  );
}
