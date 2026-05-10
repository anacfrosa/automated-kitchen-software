"use client";
import { useTranslation } from "@wac/app/i18n/client";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import Grid from "@mui/material/Unstable_Grid2";
import PurchaseItemForm from "@wac/components/purchases/new-purchase/PurchaseItemForm";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import TypographyError from "@wac/components/typography/TypographyError";
import {
  TotalCost,
  defaultItemValues,
  getCostPerItem,
  getTotalCost,
} from "@wac/components/purchases/new-purchase/utils";
import {
  convertDayjsToISOString,
  convertTofDateTimeISO,
  getCurrentDateTime,
} from "@wac/lib/format-date";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DatePickerInput from "@wac/components/inputs/DatePickerInput";
import TimePickerInput from "@wac/components/inputs/TimePickerInput";

import { SHOPID } from "@wac/lib/api/shops.api";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import AddIcon from "@mui/icons-material/Add";
import SelectSupplierInput from "@wac/components/inputs/SelectSupplier/SelectSupplierInput";
import "dayjs/locale/pt"; // For Portuguese
import { DevTool } from "@hookform/devtools";
import TemporaryAlert from "@wac/components/alerts/TemporaryAlert";

import { useRouter } from "next/navigation";
import { createPurchase, getPurchasesByShop } from "@wac/lib/api/purchases.api";
import {
  CreatePurchase,
  IPurchaseFormValues,
  ReadPurchase,
} from "@wac/lib/interfaces/purchases.interface";
import { sleep } from "@wac/lib/common";

interface PropsType {
  params: { lng: string };
}

export default function NewPurchasePage({ params: { lng } }: PropsType) {
  const { t } = useTranslation(lng, "purchases");
  const router = useRouter();

  const [nextPurchaseNumber, setNextPurchaseNumber] = useState(0);
  const { purchases, isLoading, isError } = getPurchasesByShop(lng, SHOPID);

  const [sendAlert, setSendAlert] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control,
    reset,
  } = useForm<IPurchaseFormValues>({
    defaultValues: {
      supplierId: "",
      purchaseDate: getCurrentDateTime(),
      deliveryDate: null,
      deliveryTime: null,
      status: t("status.Pending"),
      item: [defaultItemValues], // list of ingredients to purchase
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "item",
    control,
    rules: {
      required: t("new.warning"),
    },
  });

  //console.log("Form errors:", errors);

  const handleSubmitPurchase = async (data: IPurchaseFormValues) => {
    try {
      console.log("Form submitted with data:", data);
      const purchase: CreatePurchase = {
        shopId: SHOPID,
        supplierId: data.supplierId,
        purchaseDate: convertTofDateTimeISO({
          date: data.purchaseDate.split(",")[0].trim(), // Split by comma and access the first part (date)
          time: data.purchaseDate.split(",")[1].trim(), // Split by comma and access the second part (time)
        }),
        deliveryDate:
          data.deliveryDate != null
            ? convertDayjsToISOString(data.deliveryDate, data.deliveryTime)
            : null,
        status: "Pending",
        totalCost: Number(getTotalCost(data["item"])),
        purchaseItems: data.item.map((item) => {
          const updatedItem = {
            ...item, // Copy all properties of the item
            cost: getCostPerItem(
              item.quantity,
              item.measureUnit,
              item.unitPrice
            ), // Update the cost property
          };
          return updatedItem;
        }),
      };

      const statusCode: number = await createPurchase(purchase);
      if (statusCode === 201) {
        setSendAlert(true);
        reset();
        await sleep(100); // Wait for 0.1 seconds
        router.push(`/${lng}/maintenance/storage/purchases`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    if (!isLoading && !isError && purchases) {
      if (purchases.length !== 0) {
        const lastPurchaseNumber = Math.max(
          ...purchases.map((purchase: ReadPurchase) => purchase.number)
        );
        setNextPurchaseNumber(lastPurchaseNumber + 1);
      } else {
        setNextPurchaseNumber(1);
      }
    }
  }, [isLoading, isError, purchases]);

  return (
    <>
      {/* <DevTool control={control} /> */}
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
          elevation={0}
          sx={{
            flexGrow: 2,
            borderRadius: "10px",
          }}
        >
          <TypographyTitle
            variant="subtitle1"
            textAlign={"center"}
            sx={{ p: 1.5, pl: 3 }}
          >
            {t("new.title")}
          </TypographyTitle>

          <Divider />

          <Box
            component={"form"}
            onSubmit={handleSubmit(handleSubmitPurchase)}
            autoComplete="off"
            sx={{ p: 3, pt: 4, pb: 4 }}
          >
            <Grid container spacing={2}>
              <Grid xs={12} md={4}>
                <CustomTextField
                  disabled
                  label={t("new.number")}
                  value={`#${nextPurchaseNumber}`}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid xs={12} md={4}>
                <CustomTextField
                  disabled
                  {...register("status")}
                  label={t("new.status")}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid xs={12} md={4}>
                <CustomTextField
                  disabled
                  {...register("purchaseDate")}
                  label={t("new.purchaseDate")}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid xs={12}>
                <Divider />
              </Grid>

              <Grid xs={12} md={4}>
                <Controller
                  name="supplierId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange } }) => (
                    <SelectSupplierInput
                      lng={lng}
                      onChange={onChange}
                      errors={errors}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} md={4}>
                <Controller
                  name="deliveryDate"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale={lng}
                    >
                      <DatePickerInput
                        label={t("new.expectedDate")}
                        value={value}
                        onChange={onChange}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>

              <Grid xs={12} md={4}>
                <Controller
                  name="deliveryTime"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale={lng}
                    >
                      <TimePickerInput
                        label={t("new.expectedTime")}
                        ampm={false}
                        value={value}
                        onChange={onChange}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>

              <Grid xs={12}>
                <TypographyTitle variant="body2">
                  {t("new.ingrsList.title")}
                </TypographyTitle>
                <TypographyError mt={1}>
                  {errors.item?.root?.message}
                </TypographyError>
              </Grid>
            </Grid>

            {fields.map((field, index) => (
              <React.Fragment key={field.id}>
                <PurchaseItemForm
                  lng={lng}
                  control={control}
                  index={index}
                  register={register}
                  watch={watch}
                  remove={remove}
                />
                {index !== fields.length - 1 && <Divider />}
              </React.Fragment>
            ))}

            <Grid container alignItems={"baseline"} mt={1} spacing={2}>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={12} md={8}>
                <Button
                  startIcon={<AddIcon fontSize="small" />}
                  onClick={() => {
                    append(defaultItemValues);
                  }}
                  sx={{ textTransform: "none" }}
                >
                  {t("new.addIngr")}
                </Button>
              </Grid>

              <Grid xs={12} md={2}>
                <TypographyTitle variant="body1" textAlign={"right"}>
                  {t("new.total")}
                </TypographyTitle>
              </Grid>
              <Grid xs={12} md={2}>
                <Typography variant="body2" textAlign={"right"}>
                  <TotalCost control={control}></TotalCost>
                </Typography>
              </Grid>

              <Grid xs={12}>
                <Box
                  display={"flex"}
                  justifyContent={"flex-end"}
                  width={"100%"}
                >
                  <ContainedButton
                    onClick={() => {
                      console.log("Add Purchase button clicked");
                    }}
                    type="submit"
                    buttonSize="small"
                  >
                    {t("buttons.submit")}
                  </ContainedButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      {/* Alerts */}
      <TemporaryAlert
        open={sendAlert}
        onAlertChange={setSendAlert}
        alertText={t("new.success")}
      />
    </>
  );
}
