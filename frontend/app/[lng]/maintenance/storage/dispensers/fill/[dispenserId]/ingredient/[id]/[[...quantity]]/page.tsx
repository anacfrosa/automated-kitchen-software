"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import { FillDetails, FillStatus, ReadDispenser } from "@wac/types/dispenser";
import { useEffect, useState } from "react";
import StandardDialog from "@wac/components/dialog/StandardDialog";
import ConfirmDialog from "@wac/components/dialog/ConfirmDialog";
import AlertDialog from "@wac/components/dialog/AlertDialog";
import { convertToGrams, getDispenserMaxCapacity } from "@wac/lib/common";
import { getDispenserById } from "@wac/utils/api/dispensers.api";
import { useRouter } from "next/navigation";
import {
  fillOneDispenser,
  ValidFields,
} from "@wac/components/dispensers/fill-dispenser/utils";
import SelectInventory from "@wac/components/dispensers/fill-dispenser/SelectInventory";
import { InventoryListAdded } from "@wac/components/dispensers/InventoryListAdded";
import { Paper } from "@mui/material";
import Loading from "@wac/components/Loading";
import { Ingredient } from "@wac/lib/interfaces/ingredient.interface";
import { getIngredientById } from "@wac/lib/api/ingredients.api";

interface PropsType {
  params: {
    lng: string;
    id: string; // ingredientId
    dispenserId: string;
    quantity?: number[]; // Unit: kg
  };
}

export default function FillByIngredientPage({
  params: { lng, id, dispenserId, quantity },
}: PropsType) {
  const { t } = useTranslation(lng, "dispensers");
  const router = useRouter();

  console.log(id);
  console.log(dispenserId);

  const requiredQty = quantity != undefined ? Number(quantity[0]) : 0;
  //console.log(requiredQty);

  const [dispenserInfo, setDispenserInfo] = useState<
    ReadDispenser | undefined
  >();
  const [ingredientInfo, setIngredientInfo] = useState<
    Ingredient | undefined
  >();

  // Handle Dialog
  const [openDialog, setOpenDialog] = useState(true);
  // When true, we receive the fill dispenser information from 'FillDispenser'
  const [sendFillDetails, setSendFillDetails] = useState(false);
  const [fillDetails, setFillDetails] = useState<FillDetails[]>([]);
  // Handle submit alert to confirm the addition of ingredient in dispenser
  const [confirmFilling, setConfirmFilling] = useState(false);
  // Check if edit fields action is still active before confirming the fill
  const [editAlert, setEditAlert] = useState(false);
  const [allValid, setAllValid] = useState({
    status: true,
    error: "",
  });

  const alertCancelDialog = {
    title:
      t("cancelAlerts.title") + " " + `${dispenserInfo?.number.toString()}?`,
    content:
      t("cancelAlerts.content") + " " + `${dispenserInfo?.number.toString()}.`,
  };

  // Get dispenser information
  const {
    dispenser: dispenserData,
    isLoading: isDispenserLoading,
    isError: isDispenserError,
  } = getDispenserById(lng, dispenserId);

  const {
    ingredient,
    isLoading: isIngrLoading,
    isError: isIngrError,
  } = getIngredientById(lng, id);

  // Callback function to receive the updated list of ingredients received
  const handleFillInfoChange = (list: FillDetails[], editStatus: boolean) => {
    if (!editStatus) {
      setFillDetails(list);
      setSendFillDetails(false);
      handleFieldsValidation(list);
      //setConfirmFilling(true);
    } else {
      setEditAlert(true);
      setSendFillDetails(false);
    }
  };

  const handleFieldsValidation = (list: FillDetails[]) => {
    let allValid = true;
    let finalQuantityValid = true;
    const errors: string[] = [];

    if (list.length !== 0) {
      const ingrDensity = list[0].ingredient.density;
      let totalQuantity = 0;
      for (const item of list) {
        totalQuantity += Number(
          convertToGrams(item.confirmQuantity, item.confirmUnit)
        );
        const dispVolume = dispenserInfo ? dispenserInfo.volume : 0;
        const { valid, error } = ValidFields(
          getDispenserMaxCapacity(dispVolume, ingrDensity),
          {
            quantity: item.quantityAvailable.quantity,
            measureUnit: item.quantityAvailable.unit,
          },
          {
            quantity: item.confirmQuantity,
            measureUnit: item.confirmUnit,
          }
        );

        if (!valid) {
          // Check individual errors
          allValid = false;
          errors.push(`Lot ${item.lotNumber}: ${error}`);
        }
      }
      if (totalQuantity == 0) finalQuantityValid = false;
      //console.log(totalQuantity);
    }

    if (!allValid) {
      // Individual Errors
      setAllValid({ status: false, error: errors.join(" ") });
    } else if (!finalQuantityValid) {
      setAllValid({ status: false, error: "Please, insert a valid quantity." });
    } else {
      setConfirmFilling(true);
    }
  };

  const handleSubmitAction = async (event: boolean) => {
    if (event && dispenserInfo != undefined) {
      await fillOneDispenser(dispenserInfo.id, fillDetails);

      router.push(`/${lng}/maintenance/storage/dispensers`);
    }
    setConfirmFilling(false);
  };

  const handleCloseDialog = () => {
    router.push(`/${lng}/maintenance/storage/dispensers`);
    setOpenDialog(false);
  };

  useEffect(() => {
    if (!isDispenserLoading && !isDispenserError && dispenserData) {
      setDispenserInfo(dispenserData);
    }
  }, [isDispenserLoading, isDispenserError]);

  useEffect(() => {
    if (!isIngrLoading && !isIngrError && ingredient) {
      setIngredientInfo(ingredient);
    }
  }, [isIngrLoading, isIngrError]);

  return (
    <>
      <StandardDialog
        open={openDialog}
        lng={lng}
        title={t("add.fill")}
        containerWidth={"lg"}
        closeDialog={handleCloseDialog}
        alertCancelDialog={alertCancelDialog}
        submitAction={() => setSendFillDetails(true)}
      >
        {ingredientInfo == undefined || dispenserInfo == undefined ? (
          <Loading />
        ) : (
          <SelectInventory
            lng={lng}
            quantityRequired={requiredQty}
            dispenser={dispenserInfo}
            ingredient={ingredientInfo}
            sendFillDetails={sendFillDetails}
            onSend={handleFillInfoChange}
          />
        )}
      </StandardDialog>

      {/* Alert to confirm fill list  */}
      <ConfirmDialog
        alertTitle={
          t("fillAlerts.title1") +
          `${fillDetails[0]?.ingredient.name}` +
          t("fillAlerts.title2") +
          `${dispenserInfo?.number.toString()}?`
        }
        alertContent={InventoryListAdded(fillDetails)}
        open={confirmFilling}
        handleClose={() => setConfirmFilling(false)}
        action1={t("yes")}
        action2={t("no")}
        handleAction={handleSubmitAction}
      />

      {/* Alert that the edit fields are active  */}
      <AlertDialog
        alertTitle={t("editAlert.title")}
        alertContent={t("editAlert.content")}
        open={editAlert}
        handleClose={() => setEditAlert(false)}
        handleAction={() => setEditAlert(false)}
      />

      {/* Alert for the confirm fields  */}
      <AlertDialog
        alertTitle={t("confirmAlert.title")}
        alertContent={allValid.error}
        open={!allValid.status}
        handleClose={() => setAllValid({ status: true, error: "" })}
        handleAction={() => setAllValid({ status: true, error: "" })}
      />
    </>
  );
}
