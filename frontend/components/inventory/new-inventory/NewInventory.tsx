"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import StepperDialog from "../../dialog/stepper-dialog/StepperDialog";
import AlertDialog from "@wac/components/dialog/AlertDialog";
import InsertIngredients from "./InsertIngredients";
import { InventoryList, submitNewInventory } from "./utils";
import { useEffect, useState } from "react";
import TransportCheckTable from "@wac/components/dialog/stepper-dialog/CheckTables/TransportCheckTable";
import FoodCheckTable from "@wac/components/dialog/stepper-dialog/CheckTables/FoodCheckTable";
import {
  CheckStatus,
  RadioValues,
} from "@wac/components/dialog/stepper-dialog/CheckTables/utils";
import ConfirmDialog from "@wac/components/dialog/ConfirmDialog";
import TypographyTitle from "@wac/components/typography/TypographyTitle";

/**
 * Renders a list of ingredients as bullet points.
 * Each ingredient is represented by a bullet point with its name.
 */
export const NewInventoryList = (inventoryList: InventoryList) => {
  return inventoryList.list.map((item, index) => {
    return (
      <li key={index}>
        {item.ingredientName} ({item.lotNumber}) - {item.quantity}{" "}
        {item.measureUnit}
      </li>
    );
  });
};

interface PropsType {
  lng: string;
  newInventory: boolean;
  onNewInventory: (event: boolean) => void;
  onSucessAlert: (event: boolean) => void;
}

export default function NewInventory({
  lng,
  newInventory,
  onNewInventory,
  onSucessAlert,
}: PropsType) {
  const { t } = useTranslation(lng, "inventory");

  const stepsLabel = [t("new.step1"), t("new.step2"), t("new.step3.title")];
  const alertCancelDialog = {
    title: t("alerts.alertCancel.title"),
    content: t("alerts.alertCancel.content"),
  };

  // Create a state to store the radio button values
  const [transportRadioValues, setTransportRadioValues] =
    React.useState<RadioValues>({
      1: "",
      2: "",
      3: "",
    });
  const [transportStatus, setTransportStatus] = useState<CheckStatus>({
    nextStep: false,
    valid: false,
  });
  const [foodRadioValues, setFoodRadioValues] = React.useState<RadioValues>({
    1: "",
    2: "",
  });
  const [foodStatus, setFoodStatus] = useState<CheckStatus>({
    nextStep: false,
    valid: false,
  });

  // When true, we receive the inventory list from 'InsertIngredients'
  const [sendInventoryList, setSendInventoryList] = useState(false);
  // Update inventory list
  const [inventoryList, setInventoryList] = useState<InventoryList>({
    supplierId: "",
    list: [],
  });
  // Handle submit alert dialog to confirm the reception of ingredients into the inventory
  const [submitAlert, setSubmitAlert] = useState(false);

  // Handler Transport Radio Buttons
  const handleTransportRadioChange = (
    taskId: number,
    value: "conform" | "nonconform" | "cantobserve"
  ) => {
    setTransportRadioValues((prevValues) => ({
      ...prevValues,
      [taskId]: value,
    }));
  };

  // Handler Food Radio Buttons
  const handleFoodRadioChange = (
    taskId: number,
    value: "conform" | "nonconform" | "cantobserve"
  ) => {
    setFoodRadioValues((prevValues) => ({
      ...prevValues,
      [taskId]: value,
    }));
  };

  // Callback function to receive the updated list of ingredients received
  const handleSendInventoryChange = (list: InventoryList) => {
    setInventoryList(list);
    setSendInventoryList(false);
    setSubmitAlert(true);
  };

  const handleSubmitAction = async (event: boolean) => {
    if (event) {
      await submitNewInventory(inventoryList);
      onNewInventory(false);
      onSucessAlert(true);
    }
    setSubmitAlert(false);
  };

  const stepsComponents = [
    <TransportCheckTable
      lng={lng}
      radioValues={transportRadioValues}
      onRadioChange={handleTransportRadioChange}
    />,
    <FoodCheckTable
      lng={lng}
      radioValues={foodRadioValues}
      onRadioChange={handleFoodRadioChange}
    />,
    <InsertIngredients
      lng={lng}
      validReception={foodStatus.valid && transportStatus.valid}
      sendInventory={sendInventoryList}
      onSend={handleSendInventoryChange}
    />,
  ];

  // Check TRANSPORT RADIO VALUES
  useEffect(() => {
    let nextStep: boolean = true;
    let valid: boolean = true;
    Object.entries(transportRadioValues).forEach(([key, value]) => {
      if (value === "") {
        nextStep = false;
      } else {
        if (value !== "conform") valid = false;
      }
    });

    // Call the onTransportStatusChange function if all radio buttons have values
    if (nextStep) {
      setTransportStatus({
        nextStep: true,
        valid: valid,
      });
    }
  }, [transportRadioValues]);

  // Check FOOD RADIO VALUES
  useEffect(() => {
    let nextStep: boolean = true;
    let valid: boolean = true;
    Object.entries(foodRadioValues).forEach(([key, value]) => {
      if (value === "") {
        nextStep = false;
      } else {
        if (value !== "conform") valid = false;
      }
    });

    if (nextStep) {
      setFoodStatus({
        nextStep: true,
        valid: valid,
      });
    }
  }, [foodRadioValues]);

  // useEffect(() => {
  //   console.log(inventoryList);
  // }, [inventoryList]);

  return (
    <>
      {/* Steps for the new reception */}
      <StepperDialog
        lng={lng}
        title={t("new.title")}
        stepsLabel={stepsLabel}
        steps={stepsComponents}
        openDialog={newInventory}
        closeDialog={() => onNewInventory(false)}
        alertCancelDialog={alertCancelDialog}
        sendAction={() => setSendInventoryList(true)}
        goToStep2={transportStatus.nextStep}
        goToStep3={foodStatus.nextStep}
      />

      {/* Check if the list to add is empty, if not accept ingredients */}
      {inventoryList?.list.length === 0 ? (
        <AlertDialog
          alertTitle={t("alerts.listEmpty.title")}
          alertContent={t("alerts.listEmpty.content")}
          open={submitAlert}
          handleClose={() => setSubmitAlert(false)}
          handleAction={() => setSubmitAlert(false)}
        />
      ) : (
        <ConfirmDialog
          alertTitle={t("alerts.confirmInv")}
          alertContent={NewInventoryList(inventoryList)}
          open={submitAlert}
          handleClose={() => setSubmitAlert(false)}
          action1={t("buttons.yes")}
          action2={t("buttons.no")}
          handleAction={handleSubmitAction}
        />
      )}
    </>
  );
}
