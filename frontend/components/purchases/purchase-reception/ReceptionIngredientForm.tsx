"use client";
import { useTranslation } from "@wac/app/i18n/client";
import { Box, Divider, InputLabel, Paper, Switch } from "@mui/material";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import Grid from "@mui/material/Unstable_Grid2";
import React, { useEffect, useState } from "react";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import { getCurrentDateTime } from "@wac/lib/format-date";
import { ReadPurchase } from "@wac/lib/interfaces/purchases.interface";
import "dayjs/locale/pt";
import SelectMeasureUnitInput from "@wac/components/inputs/SelectUnitInput";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import DatePickerInput from "@wac/components/inputs/DatePickerInput";
import { Stack } from "@mui/system";
import TimePickerInput from "@wac/components/inputs/TimePickerInput";
import { FormValuesType, ingredientDetails } from "./utils";
import theme from "@wac/styles/theme";

interface PropsType {
  lng: string;
  validReception: boolean;
  purchaseInfo: ReadPurchase | undefined;
  formValues: FormValuesType[];
  selectedPurchaseItemId: string;
  setFormValues: any;
}

export default function ReceptionIngredientForm(props: PropsType) {
  const { t } = useTranslation(props.lng, "purchases");

  // Current ingredient info selected
  const [ingredientValues, setIngredientValues] = useState<ingredientDetails>();

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    const newFormValues = [...props.formValues];
    const itemId: string = props.selectedPurchaseItemId;

    // Finding the index of the object with the specified itemId
    const itemIndex: number = newFormValues.findIndex((value) =>
      value.hasOwnProperty(itemId)
    );

    if (itemIndex !== -1) {
      switch (name) {
        case "quantity":
          newFormValues[itemIndex][itemId]["quantity"] = parseInt(value, 10);
          break;
        case "lotNumber":
          newFormValues[itemIndex][itemId]["lotNumber"] = parseInt(value, 10);
          break;
        case "measureUnit":
          newFormValues[itemIndex][itemId]["measureUnit"] = value;
          break;
        case "isAccepted":
          newFormValues[itemIndex][itemId]["isAccepted"] = checked;
          break;
      }

      // Updating the state with the modified formValues
      props.setFormValues([...newFormValues]);
    }
  };

  const handleDateFormChange = (name: string, date: Dayjs | null) => {
    const newFormValues = [...props.formValues];
    const itemId: string = props.selectedPurchaseItemId;

    // Finding the index of the object with the specified itemId
    const itemIndex: number = newFormValues.findIndex((value) =>
      value.hasOwnProperty(itemId)
    );

    if (itemIndex !== -1) {
      switch (name) {
        case "expiryDate":
          newFormValues[itemIndex][itemId]["expiryDate"] = date;
          break;
        case "expiryTime":
          newFormValues[itemIndex][itemId]["expiryTime"] = date;
          break;
      }

      // Updating the state with the modified formValues
      props.setFormValues([...newFormValues]);
    }
  };

  // Get the form values of the selected ingredient in the list
  useEffect(() => {
    if (props.selectedPurchaseItemId !== "") {
      const itemDetails = props.formValues.find((value) =>
        value.hasOwnProperty(props.selectedPurchaseItemId)
      ); // Finding the item with the specified id

      setIngredientValues(
        itemDetails ? itemDetails[props.selectedPurchaseItemId] : undefined
      );
    }
  }, [props.selectedPurchaseItemId, props.formValues]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: "10px",
          minHeight: "260px",
        }}
      >
        <TypographyTitle
          variant="body1"
          textAlign={"center"}
          sx={{ p: 1.5, pl: 3 }}
        >
          {t("reception.step3.ingredientDetails")}
        </TypographyTitle>

        <Divider />

        <Box
          component={"form"}
          autoComplete="off"
          sx={{ flexGrow: 2, p: 3, pt: 4 }}
        >
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <CustomTextField
                name="ingredient"
                label={t("reception.step3.fields.ingredient")}
                value={ingredientValues ? ingredientValues.ingredient : ""}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>

            <Grid xs={12} md={4}>
              <CustomTextField
                //disabled
                label={t("reception.step3.fields.supplier")}
                value={
                  props.purchaseInfo !== undefined
                    ? props.purchaseInfo.supplier.name
                    : ""
                }
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>

            <Grid xs={12} md={4}>
              <CustomTextField
                //disabled
                label={t("reception.step3.fields.receptionDate")}
                value={getCurrentDateTime()}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>

            <Grid xs={12}>
              <Divider />
            </Grid>

            {props.selectedPurchaseItemId === "" ? (
              <Grid xs={12}>
                <Box
                  sx={{
                    height: "10vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TypographyTitle
                    variant="body1"
                    color={theme.palette.primary.dark}
                  >
                    {t("reception.step3.message")}
                  </TypographyTitle>
                </Box>
              </Grid>
            ) : (
              <>
                <Grid xs={12} md={4}>
                  <CustomTextField
                    label={t("reception.step3.fields.quantity")}
                    name={"quantity"}
                    type="number"
                    value={ingredientValues ? ingredientValues.quantity : 0}
                    onChange={handleFormChange}
                    inputProps={{ step: 0.01, min: 0.5 }}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} md={4}>
                  <SelectMeasureUnitInput
                    lng={props.lng}
                    value={
                      ingredientValues ? ingredientValues.measureUnit : "kg"
                    }
                    onChange={handleFormChange}
                  />
                </Grid>

                <Grid xs={12} md={4}>
                  <CustomTextField
                    required
                    name="lotNumber"
                    label={t("reception.step3.fields.lotnumber")}
                    type="number"
                    value={
                      ingredientValues
                        ? Number.isNaN(ingredientValues.lotNumber)
                          ? ""
                          : ingredientValues.lotNumber
                        : 0
                    }
                    onChange={handleFormChange}
                    inputProps={{ min: 1 }}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} md={4}>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={props.lng}
                  >
                    <DatePickerInput
                      label={t("reception.step3.fields.expiryDate")}
                      value={
                        ingredientValues ? ingredientValues.expiryDate : null
                      }
                      onChange={(date) =>
                        handleDateFormChange("expiryDate", date)
                      }
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid xs={12} md={4}>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={props.lng}
                  >
                    <TimePickerInput
                      label={t("reception.step3.fields.expiryTime")}
                      ampm={false}
                      value={
                        ingredientValues ? ingredientValues.expiryTime : null
                      }
                      onChange={(date) =>
                        handleDateFormChange("expiryTime", date)
                      }
                    />
                  </LocalizationProvider>
                </Grid>

                {/* Accepted option */}
                {!props.validReception && (
                  <Grid xs={12}>
                    <Stack direction={"row"} gap={3} alignItems={"center"}>
                      <InputLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
                        Accept Ingredient
                      </InputLabel>
                      <Switch
                        inputProps={{ name: "isAccepted" }}
                        checked={
                          ingredientValues ? ingredientValues.isAccepted : false
                        }
                        onChange={handleFormChange}
                      />
                    </Stack>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Box>
      </Paper>
    </>
  );
}
