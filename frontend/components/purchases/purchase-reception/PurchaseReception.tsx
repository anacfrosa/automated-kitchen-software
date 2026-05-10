"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import {
  ReadPurchase,
  ReadPurchaseItem,
} from "@wac/lib/interfaces/purchases.interface";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import IngredientsList from "@wac/components/lists/IngredientsList";
import ReceptionIngredientForm from "./ReceptionIngredientForm";
import { FormValuesType } from "./utils";
import AlertDialog from "@wac/components/dialog/AlertDialog";

interface PropsType {
  lng: string;
  validReception: boolean;
  purchaseInfo: ReadPurchase | undefined;
  sendReceptionList: boolean;
  onSend: (list: FormValuesType[]) => void;
}

export default function InventoryReception(props: PropsType) {
  const { t } = useTranslation(props.lng, "purchases");

  const [alertNonConform, setAlertNonConform] = useState(!props.validReception);

  // List of ingredients id to show the Purchased Ingredients List
  const [ingredientIDList, setIngredientIDList] = useState<string[]>([]);
  const [selectedPurchaseItemId, setPurchaseItemId] = useState<string>("");
  const [formValues, setFormValues] = useState<FormValuesType[]>([]);

  const handleSelectIngredientChange = (ingredientId: string) => {
    // Set purchase item id based on the selected ingredient id
    if (props.purchaseInfo !== undefined) {
      const foundPurchaseItem = props.purchaseInfo.purchaseItems.find(
        (item) => item.ingredient.id === ingredientId
      );
      if (foundPurchaseItem) {
        setPurchaseItemId(foundPurchaseItem.id);
      }
    }
  };

  // Initialize ingredients List
  useEffect(() => {
    if (props.purchaseInfo !== undefined) {
      // Get all the ingredients id from the purchase list
      const newIngredientIds = props.purchaseInfo.purchaseItems.map(
        (item: ReadPurchaseItem) => item.ingredient.id
      );
      setIngredientIDList(newIngredientIds);
    }
  }, [props.purchaseInfo]);

  // Initialize Form values for each ingredient
  useEffect(() => {
    if (props.purchaseInfo !== undefined) {
      const initializeFormValues = props.purchaseInfo.purchaseItems.map(
        (item: ReadPurchaseItem) => ({
          [item.id]: {
            ingredient: item.ingredient.name,
            lotNumber: 0,
            quantity: item.quantity,
            measureUnit: item.measureUnit,
            expiryDate: null,
            expiryTime: null,
            isAccepted: item.isAccepted,
          },
        })
      );
      setFormValues(initializeFormValues);
    }
  }, [props.purchaseInfo]);

  // Send all the purchase reception information to be submitted
  useEffect(() => {
    if (formValues.length !== 0 && props.sendReceptionList) {
      props.onSend(formValues);
    }
  }, [formValues, props.sendReceptionList]);

  return (
    <>
      <AlertDialog
        alertTitle={t("alertNonConform.title")}
        alertContent={t("alertNonConform.content")}
        open={alertNonConform}
        handleClose={() => setAlertNonConform(false)}
        handleAction={() => setAlertNonConform(false)}
      />
      <Box sx={{ display: "flex", flexDirection: "row", gap: "50px" }}>
        <IngredientsList
          lng={props.lng}
          ingredientIdList={ingredientIDList}
          onSelectIngredient={handleSelectIngredientChange}
        />

        <Box sx={{ width: "100%" }}>
          <ReceptionIngredientForm
            lng={props.lng}
            validReception={props.validReception}
            purchaseInfo={props.purchaseInfo}
            formValues={formValues}
            setFormValues={setFormValues}
            selectedPurchaseItemId={selectedPurchaseItemId}
          />
        </Box>
      </Box>
    </>
  );
}
