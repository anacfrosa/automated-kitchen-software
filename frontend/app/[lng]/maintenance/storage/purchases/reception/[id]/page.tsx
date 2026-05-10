"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import { useEffect, useState } from "react";
import StepperDialog from "@wac/components/dialog/stepper-dialog/StepperDialog";
import { useRouter } from "next/navigation";
import PurchaseReception from "@wac/components/purchases/purchase-reception/PurchaseReception";
import {
  FormValuesType,
  insertIngredientsToInventory,
} from "@wac/components/purchases/purchase-reception/utils";
import ConfirmDialog from "@wac/components/dialog/ConfirmDialog";
import TransportCheckTable from "@wac/components/dialog/stepper-dialog/CheckTables/TransportCheckTable";
import FoodCheckTable from "@wac/components/dialog/stepper-dialog/CheckTables/FoodCheckTable";
import {
  CheckStatus,
  RadioValues,
} from "@wac/components/dialog/stepper-dialog/CheckTables/utils";
import AlertDialog from "@wac/components/dialog/AlertDialog";
import { ReceptionList } from "@wac/components/purchases/purchase-reception/ReceptionList";
import { ReadPurchase } from "@wac/lib/interfaces/purchases.interface";
import { getPurchasesById } from "@wac/lib/api/purchases.api";

interface PropsType {
  params: { id: string; lng: string };
}

export default function PurchaseReceptionPage({
  params: { id, lng },
}: PropsType) {
  const { t } = useTranslation(lng, "purchases");
  const router = useRouter();

  const [purchaseInfo, setPurchaseInfo] = useState<ReadPurchase>();
  const { purchase, isLoading, isError } = getPurchasesById(lng, id);

  const stepsLabel = [
    t("reception.step1.title"),
    t("reception.step2.title"),
    t("reception.step3.title"),
  ];
  const alertCancelDialog = {
    title: t("alertCancel.title"),
    content: t("alertCancel.content"),
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

  // Handle Stepper Dialog
  const [receptionActive, setReceptionActive] = useState(true);
  // When true, we receive the reception list from 'PurchaseReception'
  const [sendReceptionList, setSendReceptionList] = useState(false);
  // Store the reception information to be submitted
  const [receptionList, setReceptionList] = useState<FormValuesType[]>([]);
  // Handle alert dialog to confirm the reception of ingredients
  const [submitAlert, setSubmitAlert] = React.useState(false);

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

  const handleCloseDialog = () => {
    router.back(); // Go back to purchases page
    setReceptionActive(false);
  };

  // Callback function to receive the reception list
  const handleSendReceptionList = (list: FormValuesType[]) => {
    setReceptionList(list);
    setSendReceptionList(false);
    setSubmitAlert(true);
  };

  const handleSubmitAction = (event: boolean) => {
    if (event) {
      insertIngredientsToInventory(id, receptionList);
      //handleCloseDialog();
      //onSucessAlert(true);
      router.push(`/${lng}/maintenance/storage/purchases`);
    }
    setSubmitAlert(false);
  };

  const handleMissingValues = () => {
    // Check if the are missing recepion fields in the list
    for (const obj of receptionList) {
      for (const [key, value] of Object.entries(obj)) {
        if (value.isAccepted) {
          // Only check if accepted !
          if (
            value.quantity <= 0 ||
            value.expiryDate == null ||
            value.lotNumber <= 0 ||
            Number.isNaN(value.lotNumber)
          )
            return true;
        }
      }
    }

    return false;
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
    <PurchaseReception
      lng={lng}
      validReception={foodStatus.valid && transportStatus.valid}
      purchaseInfo={purchaseInfo}
      sendReceptionList={sendReceptionList}
      onSend={handleSendReceptionList}
    />,
  ];

  useEffect(() => {
    if (!isLoading && !isError && purchase) {
      setPurchaseInfo(purchase);
    }
  }, [isLoading, isError, purchase]);

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

  return (
    <>
      {/* Purchase Reception Process  */}
      <StepperDialog
        lng={lng}
        title={`${t("reception.title")} #${purchaseInfo?.number}`}
        stepsLabel={stepsLabel}
        steps={stepsComponents}
        openDialog={receptionActive}
        closeDialog={handleCloseDialog}
        alertCancelDialog={alertCancelDialog}
        sendAction={() => setSendReceptionList(true)}
        goToStep2={transportStatus.nextStep}
        goToStep3={foodStatus.nextStep}
      />

      {handleMissingValues() ? (
        <AlertDialog
          alertTitle={t("reception.missFields.title")}
          alertContent={t("reception.missFields.subtitle")}
          open={submitAlert}
          handleClose={() => setSubmitAlert(false)}
          handleAction={() => setSubmitAlert(false)}
        />
      ) : (
        // Confirm accepted and not accepted ingredients
        <ConfirmDialog
          alertTitle={t("reception.confirmList.title")}
          alertContent={ReceptionList(
            foodStatus.valid && transportStatus.valid,
            receptionList
          )}
          open={submitAlert}
          handleClose={() => setSubmitAlert(false)}
          action1={t("reception.confirmList.yes")}
          action2={t("reception.confirmList.no")}
          handleAction={handleSubmitAction}
        />
      )}
    </>
  );
}
