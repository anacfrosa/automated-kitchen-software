"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import { getInventoryById } from "@wac/utils/api/inventory.api";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import Arrow from "@mui/icons-material/ArrowBack";
import Grid from "@mui/material/Unstable_Grid2";
import IngredientInfoCard from "@wac/components/inventory/inventory-details/IngredientInfoCard";
import DispenserInfoCard from "@wac/components/inventory/inventory-details/DispenserInfoCard";
import ConditionsCard from "@wac/components/inventory/inventory-details/ConditionsCard";
import { useEffect, useState } from "react";
import { Inventory } from "@wac/types/inventory";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import QuantityInfoCard from "@wac/components/inventory/inventory-details/QuantityInfoCard";
import StatusBox from "@wac/components/StatusBox";
import Loading from "@wac/components/Loading";
import { assignDispenser } from "@wac/lib/common";
import { ReadDispenser } from "@wac/types/dispenser";
import { SHOPID } from "@wac/lib/api/shops.api";
import { getDispenserByShop } from "@wac/utils/api/dispensers.api";
import { useRouter } from "next/navigation";
import AlertDialog from "@wac/components/dialog/AlertDialog";
import theme from "@wac/styles/theme";

interface PropsType {
  params: { id: string; lng: string };
}

export default function InventoryDetails({ params: { id, lng } }: PropsType) {
  const { t } = useTranslation(lng, "inventory");
  const router = useRouter();

  const inventoryId = id;
  let dispenserId = "";

  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<string>("");

  const [inventoryInfo, setInventoryInfo] = useState<Inventory | undefined>();
  const [dispsList, setDispsList] = useState<ReadDispenser[] | undefined>();
  const [dispsAvailabel, setDispsAvailabel] = useState<boolean>(true);
  const [qtyAvailable, setQtyAvailable] = useState<boolean>(true);

  // Get inventory information
  const { data, isLoading, isError } = getInventoryById(lng, id);
  // Get the list of dispenser by shop id
  const {
    dispensers: dispensers,
    isLoading: isDispsLoading,
    isError: isDispsError,
  } = getDispenserByShop(lng, SHOPID);

  const checkAvailableQuantity = () => {
    const quantityAvailable: number = Number(inventoryInfo?.quantity.current);
    if (quantityAvailable == 0) {
      setQtyAvailable(false);
    } else {
      setQtyAvailable(true);
      handleAssignDispenser();
    }
  };

  const handleAssignDispenser = () => {
    if (dispsList != undefined && inventoryInfo != undefined) {
      // Assign a dispenser based on the ingredient shelf life
      dispenserId = assignDispenser(
        dispsList,
        inventoryInfo.purchaseInfo.ingredient
      );

      if (dispenserId == "") {
        setDispsAvailabel(false);
      } else {
        router.push(
          `/${lng}/maintenance/storage/dispensers/fill/${dispenserId}/${inventoryId}`
        );
      }
    }
  };

  const checkRemoveAccess = () => {
    if (currentRole == "manager") {
      setUnauthorized(true);
    } else {
      setUnauthorized(false);

      const quantityAvailable: number = Number(inventoryInfo?.quantity.current);
      if (quantityAvailable == 0) {
        setQtyAvailable(false);
      } else {
        setQtyAvailable(true);
        router.push(`/${lng}/maintenance/storage/inventory/remove/${data.id}`);
      }
    }
  };

  const checkAddDispenserAccess = () => {
    if (currentRole == "manager") {
      setUnauthorized(true);
    } else {
      setUnauthorized(false);
      checkAvailableQuantity();
    }
  };

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setInventoryInfo(data);
    }
  }, [isLoading, isError]);

  useEffect(() => {
    if (!isDispsLoading && !isDispsError && dispensers) {
      setDispsList(dispensers);
    }
  }, [isDispsLoading, isDispsError]);

  useEffect(() => {
    // Get the current role from local storage
    const role = localStorage.getItem("selectedRole");
    if (role) {
      setCurrentRole(role);
    }
  }, []);

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
        <IconButton href={`/${lng}/maintenance/storage/inventory`}>
          <Arrow fontSize="medium" />
        </IconButton>

        <Stack direction="column" gap={3} width={"100%"}>
          {/*********** Inventory Information ***********/}
          <Paper
            elevation={1}
            sx={{
              flexGrow: 2,
              borderRadius: "10px",
              p: 2,
            }}
          >
            {inventoryInfo !== undefined ? (
              <>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  sx={{ mb: 3 }}
                >
                  <TypographyTitle variant="body1">
                    {t("info.title")}
                  </TypographyTitle>

                  <ContainedButton
                    onClick={checkRemoveAccess}
                    colorType="secondary"
                    buttonSize="small"
                  >
                    {t("info.removeBttn")}
                  </ContainedButton>
                </Stack>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    width: "100%",
                    gap: 4,
                    ml: 1,
                    mr: 1,
                    mb: 2,
                  }}
                >
                  <IngredientInfoCard lng={lng} data={inventoryInfo} />

                  <QuantityInfoCard lng={lng} data={inventoryInfo} />

                  <ConditionsCard lng={lng} data={inventoryInfo} />
                </Box>
              </>
            ) : (
              <Loading customHeight="30vh" />
            )}
          </Paper>

          {/* *********** Dispensers Informatio ************* */}

          <Paper
            elevation={1}
            sx={{
              flexGrow: 2,
              borderRadius: "10px",
              p: 2,
            }}
          >
            {inventoryInfo !== undefined ? (
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack direction={"row"} gap={3}>
                      <Box>
                        <TypographyTitle variant="body1" noWrap>
                          {t("info.dispCard.title")}
                        </TypographyTitle>
                      </Box>
                    </Stack>

                    <Box>
                      <ContainedButton
                        buttonSize="small"
                        icon
                        onClick={checkAddDispenserAccess}
                      >
                        {t("info.dispCard.addbttn")}
                      </ContainedButton>
                    </Box>
                  </Stack>
                </Grid>

                {inventoryInfo.dispensers.length !== 0 ? (
                  <>
                    {inventoryInfo.dispensers.map((dispenser, index) => (
                      <Grid xs={12} md={6} key={index}>
                        <DispenserInfoCard
                          lng={lng}
                          currentRole={currentRole}
                          onUnauthorizedChange={setUnauthorized}
                          dispenserInfo={dispenser}
                          inventoryId={inventoryId}
                          inventoryQty={Number(inventoryInfo.quantity.current)}
                          onQtyAvailableChange={setQtyAvailable}
                        />
                      </Grid>
                    ))}
                  </>
                ) : (
                  <Grid xs={12}>
                    <Paper
                      elevation={0}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: "10px",
                        minHeight: "20vh",
                      }}
                    >
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        height={"15vh"}
                      >
                        <Typography variant="body1">
                          {t("info.dispCard.empty")}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Loading customHeight="35vh" />
            )}
          </Paper>
        </Stack>
      </Box>

      <AlertDialog
        alertTitle={t("alerts.nofreedisp.title")}
        alertContent={t("alerts.nofreedisp.content")}
        open={!dispsAvailabel}
        handleClose={() => setDispsAvailabel(true)}
        handleAction={() => setDispsAvailabel(true)}
      />

      <AlertDialog
        alertTitle={t("alerts.noqty.title")}
        alertContent={t("alerts.noqty.content")}
        open={!qtyAvailable}
        handleClose={() => setQtyAvailable(true)}
        handleAction={() => setQtyAvailable(true)}
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
