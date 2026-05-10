"use client";
import { useTranslation } from "@wac/app/i18n/client";
import {
  Box,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import Grid from "@mui/material/Unstable_Grid2";
import { Fragment } from "react";
import { auxiliary } from "@wac/styles/palette";
import {
  ReadPurchase,
  ReadPurchaseItem,
} from "@wac/lib/interfaces/purchases.interface";
import EuroIcon from "@mui/icons-material/Euro";
import PurchaseItemValues from "./PurchaseItemValues";

interface PropsType {
  lng: string;
  purchaseInfo: ReadPurchase;
}

export default function PurchaseList({ lng, purchaseInfo }: PropsType) {
  const { t } = useTranslation(lng, "purchases");

  console.log(purchaseInfo);
  return (
    <>
      {/* Ingredients List */}
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          borderRadius: "10px",
          p: 2,
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={12}>
            <TypographyTitle variant={"body2"}>
              {t("details.ingrsList.title")}
            </TypographyTitle>
          </Grid>
          <Grid xs={12}>
            <Divider />
          </Grid>
          <Grid xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <TypographyTitle sx={{ flex: "1" }} variant={"body2"}>
                {t("details.ingrsList.ingr")}
              </TypographyTitle>
              <Stack
                direction={"row"}
                sx={{ flex: "3", justifyContent: "space-between" }}
              >
                <TypographyTitle
                  sx={{ flex: "1", textAlign: "right" }}
                  variant={"body2"}
                  component="div"
                >
                  {t("details.ingrsList.isAccepted")}
                </TypographyTitle>
                <TypographyTitle
                  sx={{ flex: "1", textAlign: "right" }}
                  variant={"body2"}
                  component="div"
                >
                  {t("details.ingrsList.lot")}
                </TypographyTitle>
                <TypographyTitle
                  sx={{ flex: "1", textAlign: "right" }}
                  variant={"body2"}
                >
                  {t("details.ingrsList.quantity")}
                </TypographyTitle>
                <TypographyTitle
                  sx={{ flex: "1", textAlign: "right" }}
                  variant={"body2"}
                  component="div"
                >
                  <Stack
                    direction="row"
                    gap={1}
                    alignItems={"center"}
                    justifyContent="flex-end"
                  >
                    {t("details.ingrsList.pricePerKg")}{" "}
                    <EuroIcon sx={{ fontSize: "13px" }} />
                  </Stack>
                </TypographyTitle>
                <TypographyTitle
                  sx={{ flex: "1", textAlign: "right" }}
                  variant={"body2"}
                  component="div"
                >
                  <Stack
                    direction="row"
                    gap={1}
                    alignItems={"center"}
                    justifyContent="flex-end"
                  >
                    {t("details.ingrsList.cost")}{" "}
                    <EuroIcon sx={{ fontSize: "13px" }} />
                  </Stack>
                </TypographyTitle>
              </Stack>
            </Stack>
          </Grid>

          {purchaseInfo.purchaseItems.map((item: ReadPurchaseItem, index) => (
            <Fragment key={index}>
              <Grid xs={12}>
                <PurchaseItemValues
                  lng={lng}
                  purchaseItem={item}
                  received={purchaseInfo.status === "Delivered"}
                />
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
            </Fragment>
          ))}

          {/* Total Cost */}
          <Grid xs={12} bgcolor={auxiliary.lighter} borderRadius={"10px"}>
            <Stack direction={"row"} gap={5} justifyContent="flex-end">
              <TypographyTitle variant={"body2"}>
                {t("details.ingrsList.total")}
              </TypographyTitle>

              <Stack
                direction="row"
                gap={1}
                alignItems={"center"}
                justifyContent="flex-end"
              >
                <Typography
                  sx={{ flex: "1", textAlign: "right" }}
                  variant={"body2"}
                  component="div"
                >
                  {purchaseInfo.totalCost == 0 ? "--" : purchaseInfo.totalCost}
                </Typography>
                {purchaseInfo.totalCost != 0 && (
                  <EuroIcon sx={{ fontSize: "13px" }} />
                )}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
