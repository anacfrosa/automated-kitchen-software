"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import { useRouter } from "next/navigation";
import { Paper } from "@mui/material";
import StandardDialog from "@wac/components/dialog/StandardDialog";
import { useEffect, useState } from "react";
import { Inventory } from "@wac/types/inventory";
import {
  getInventoryById,
  updateInventory,
} from "@wac/utils/api/inventory.api";
import {
  getDispenserById,
  updateDispenserById,
} from "@wac/utils/api/dispensers.api";
import { ReadDispenser } from "@wac/types/dispenser";
import { auxiliary } from "@wac/styles/palette";
import Loading from "@wac/components/Loading";
import {
  convertToStandardUnit,
  getDispenserMaxCapacity,
  getStandardUnit,
} from "@wac/lib/common";
import RefillByInventory from "@wac/components/dispensers/refill-by-inventory/RefillByInventory";
import ConfirmDialog from "@wac/components/dialog/ConfirmDialog";
import { CheckFillFields } from "@wac/components/dispensers/utils";

interface PropsType {
  params: {
    lng: string;
    dispenserId: string;
    inventoryId: string;
    quantity?: number[]; // Unit: kg
  };
}

export default function FillByDispenserAndInventoryPage({
  params: { dispenserId, inventoryId, lng, quantity },
}: PropsType) {
  const { t } = useTranslation(lng, "dispensers");

  const router = useRouter();

  const requiredQty = quantity != undefined ? Number(quantity[0]) : 0;
  //console.log(requiredQty);

  // Handle Dialog
  const [openDialog, setOpenDialog] = useState(true);
  // Handle popup to confirm refilling dispenser
  const [confirmRefill, setConfirmRefill] = useState(false);
  const [quantityFields, setQuantityFields] = useState({
    quantity: 0,
    measureUnit: "",
  });
  const [validFields, setValidFields] = useState({
    valid: true,
    error: "",
  });
  const [inventoryInfo, setInventoryInfo] = useState<Inventory | undefined>();
  const [dispenserInfo, setDispenserInfo] = useState<
    ReadDispenser | undefined
  >();

  const alertCancelDialog = {
    title:
      t("cancelAlerts.title") + " " + `${dispenserInfo?.number.toString()}?`,
    content:
      t("cancelAlerts.content") + " " + `${dispenserInfo?.number.toString()}.`,
  };

  // Get inventory information
  const {
    data: inventoryData,
    isLoading: isInventoryLoading,
    isError: isInventoryError,
  } = getInventoryById(lng, inventoryId);

  // Get dispenser information
  const {
    dispenser: dispenserData,
    isLoading: isDispenserLoading,
    isError: isDispenserError,
  } = getDispenserById(lng, dispenserId);

  const handleFieldsValidation = () => {
    let valid = false;
    let error = "";
    if (inventoryInfo !== undefined && dispenserInfo != undefined) {
      const dispVolume = dispenserInfo.volume;
      const ingrDensity = inventoryInfo.purchaseInfo.ingredient.density;

      ({ valid, error } = CheckFillFields(
        getDispenserMaxCapacity(dispVolume, ingrDensity),
        {
          quantity: inventoryInfo.quantity.current,
          measureUnit: inventoryInfo.quantity.measureUnit,
        },
        quantityFields,
        {
          quantity: dispenserInfo.quantity.current,
          measureUnit: dispenserInfo.quantity.measureUnit,
        }
      ));
    }
    setValidFields({ valid, error });
    //console.log({ valid, error });

    if (valid)
      // if valid fields (quantity and measure unit)
      setConfirmRefill(true);
  };

  // Handle refill submission (Add to dispenser, Remove from inventory)
  const handleSubmitAction = async (event: boolean) => {
    if (event) {
      // Update inventory information
      await updateInventory(inventoryId, {
        quantityOut: Number(
          convertToStandardUnit(
            quantityFields.quantity,
            quantityFields.measureUnit
          )
        ),
        measureUnit: getStandardUnit(quantityFields.measureUnit), // standard unit
      });

      // Update dispenser information with one lot
      await updateDispenserById(
        dispenserId,
        {
          quantityIn: convertToStandardUnit(
            quantityFields.quantity,
            quantityFields.measureUnit
          ),
          measureUnit: getStandardUnit(quantityFields.measureUnit),
        },
        "refill"
      );

      router.push(`/${lng}/maintenance/storage/dispensers`);
    }
    setConfirmRefill(false);
  };

  const handleCloseDialog = () => {
    //router.push(`/${lng}/maintenance/storage/dispensers`);
    router.back();
    setOpenDialog(false);
  };

  const handleQuantityFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setQuantityFields((prevFilters) => ({
      ...prevFilters,
      [name]:
        name === "measureUnit"
          ? value
          : Number.isNaN(parseFloat(value))
          ? ""
          : parseFloat(value),
    }));

    setValidFields({ valid: true, error: "" });
  };

  useEffect(() => {
    if (!isInventoryLoading && !isInventoryError && inventoryData) {
      setInventoryInfo(inventoryData);
    }
  }, [isInventoryLoading, isInventoryError]);

  useEffect(() => {
    if (!isDispenserLoading && !isDispenserError && dispenserData) {
      setDispenserInfo(dispenserData);
    }
  }, [isDispenserLoading, isDispenserError]);

  return (
    <>
      <StandardDialog
        lng={lng}
        open={openDialog}
        title={t("add.refill")}
        closeDialog={handleCloseDialog}
        alertCancelDialog={alertCancelDialog}
        submitAction={handleFieldsValidation}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            minHeight: "460px",
            maxHeight: "400px",
            borderRadius: "10px",
            overflowY: "auto",
          }}
        >
          {inventoryInfo == undefined || dispenserInfo == undefined ? (
            <Loading />
          ) : (
            <RefillByInventory
              lng={lng}
              validFields={validFields}
              quantityFields={quantityFields}
              onQuantityFieldsChange={handleQuantityFieldChange}
              quantityRequired={requiredQty}
              inventoryInfo={inventoryInfo}
              dispenserInfo={dispenserInfo}
            />
          )}
        </Paper>
      </StandardDialog>

      {/* Alert to confirm fill list  */}
      <ConfirmDialog
        alertTitle={
          t("addAlerts.title") + " " + `${dispenserInfo?.number.toString()} ?`
        }
        alertContent={
          t("addAlerts.content1") +
          " " +
          quantityFields.quantity +
          " " +
          quantityFields.measureUnit +
          " " +
          t("addAlerts.content2") +
          " " +
          `${inventoryInfo?.purchaseInfo.ingredient.name}` +
          " " +
          t("addAlerts.content3") +
          " " +
          `${dispenserInfo?.number}.`
        }
        open={confirmRefill}
        handleClose={() => setConfirmRefill(false)}
        action1={t("yes")}
        action2={t("no")}
        handleAction={handleSubmitAction}
      />
    </>
  );
}
