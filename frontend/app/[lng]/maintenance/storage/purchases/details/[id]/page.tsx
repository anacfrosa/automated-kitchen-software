"use client";
import { useTranslation } from "@wac/app/i18n/client";
import { Box, Divider, IconButton, Paper, Stack } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import Grid from "@mui/material/Unstable_Grid2";
import { Fragment, useEffect, useState } from "react";
import { auxiliary } from "@wac/styles/palette";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import StatusBox from "@wac/components/StatusBox";
import PurchaseDatesInfo from "@wac/components/purchases/purchase-details/DatesInfo";
import PurchaseSupplierInfo from "@wac/components/purchases/purchase-details/SupplierInfo";
import ConfirmDialog from "@wac/components/dialog/ConfirmDialog";
import TemporaryAlert from "@wac/components/alerts/TemporaryAlert";
import { getPurchasesById, updatePurchase } from "@wac/lib/api/purchases.api";
import {
  ReadPurchase,
  ReadPurchaseItem,
} from "@wac/lib/interfaces/purchases.interface";
import Loading from "@wac/components/Loading";
import { PurchaseStatus } from "@wac/lib/enums/purchase-status.enum";
import PurchaseList from "@wac/components/purchases/purchase-details/PurchaseList";

interface PropsType {
  params: { id: string; lng: string };
}

export default function PurchaseDetailsPage({
  params: { id, lng },
}: PropsType) {
  const { t } = useTranslation(lng, "purchases");

  // Handle confirm cancel purchase
  const [openConfirmAlert, setOpenConfirmAlert] = useState(false);
  // Temporary Alert to confirm the purchase cancelation
  const [sendCandelAlert, setSendCandelAlert] = useState(false);
  // Store the purchase details selected
  const [purchaseInfo, setPurchaseInfo] = useState<ReadPurchase | undefined>(
    undefined
  );

  const { purchase, isLoading, isError, mutate } = getPurchasesById(lng, id);

  const handleCancelAction = async (event: boolean) => {
    if (event) {
      await updatePurchase(id, { status: PurchaseStatus.CANCELED });
      setSendCandelAlert(true);
    }
    setOpenConfirmAlert(false);
  };

  useEffect(() => {
    if (!isLoading && !isError && purchase) {
      setPurchaseInfo(purchase);
    }
  }, [isLoading, isError, purchase]);

  useEffect(() => {
    if (sendCandelAlert) mutate();
  }, [sendCandelAlert]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        <IconButton href={`/${lng}/maintenance/storage/purchases`}>
          <ArrowBack fontSize="medium" />
        </IconButton>

        <Paper
          elevation={1}
          sx={{
            flexGrow: 2,
            borderRadius: "10px",
            p: 2,
          }}
        >
          {purchaseInfo != undefined ? (
            <>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Stack direction={"row"} gap={3} sx={{ mb: 2 }}>
                  <Box>
                    <TypographyTitle variant="subtitle2" noWrap>
                      {t("details.title")} #
                      {purchaseInfo ? purchaseInfo.number : "0"}
                    </TypographyTitle>
                  </Box>

                  <StatusBox status={purchaseInfo.status}>
                    {t(`status.${purchaseInfo.status}`)}
                  </StatusBox>
                </Stack>

                {purchaseInfo.status.toLowerCase() === "pending" && (
                  <Stack direction={"row"} gap={3} sx={{ mb: 1 }}>
                    <ContainedButton
                      href={`/${lng}/maintenance/storage/purchases/reception/${purchaseInfo.id}`}
                      buttonSize="small"
                      //icon
                    >
                      {t("details.receiveBtt")}
                    </ContainedButton>
                    <ContainedButton
                      onClick={() => setOpenConfirmAlert(true)}
                      buttonSize="small"
                      colorType="secondary"
                    >
                      {t("details.cancelBtt")}
                    </ContainedButton>
                  </Stack>
                )}
              </Box>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  gap: 4,
                }}
              >
                {/* Purchase, Expected Delivery and Reception Dates */}
                <PurchaseDatesInfo lng={lng} purchaseInfo={purchaseInfo} />

                {/* Purchase Supplier information (name, phone, and email) */}
                <PurchaseSupplierInfo lng={lng} purchaseInfo={purchaseInfo} />
              </Box>

              {/* Ingredients List !!!  */}
              <PurchaseList lng={lng} purchaseInfo={purchaseInfo} />
            </>
          ) : (
            <Loading customHeight="70vh"/>
          )}
        </Paper>
      </Box>

      {/* Confirm Alert for the CANCEL PURCHASE action */}
      <ConfirmDialog
        alertTitle={t("details.cancelAlert.title")}
        alertContent={`${t("details.cancelAlert.subtitle")} #${
          purchaseInfo ? purchaseInfo.number : "0"
        }`}
        open={openConfirmAlert}
        handleClose={() => setOpenConfirmAlert(false)}
        action1={t("details.cancelAlert.action1")}
        action2={t("details.cancelAlert.action2")}
        handleAction={handleCancelAction}
      />

      <TemporaryAlert
        open={sendCandelAlert}
        onAlertChange={(event: boolean) => setSendCandelAlert(event)}
        alertText={t("details.cancelAlert.cancelSuccess")}
      />
    </>
  );
}
