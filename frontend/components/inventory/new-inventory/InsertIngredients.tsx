"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Divider, Paper, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import { InventoryList, NewInventory } from "./utils";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import { Ingredient } from "@wac/lib/interfaces/ingredient.interface";
import SelectIngredientUncontrolledInput from "@wac/components/inputs/SelectIngredient/UncontrolledInput";
import OutlinedButton from "@wac/components/buttons/OutlinedButton";
import NewInventoryList from "@wac/components/lists/NewInventoryList";
import { getCurrentDateTime } from "@wac/lib/format-date";
import SelectSupplierUncontrolledInput from "@wac/components/inputs/SelectSupplier/UncontrolledInput";
import { Supplier } from "@wac/lib/interfaces/supplier.interface";
import SelectMeasureUnitInput from "@wac/components/inputs/SelectUnitInput";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import DatePickerInput from "@wac/components/inputs/DatePickerInput";
import TimePickerInput from "@wac/components/inputs/TimePickerInput";
import AlertDialog from "@wac/components/dialog/AlertDialog";

const defaultValues: NewInventory = {
  ingredientId: "",
  ingredientName: "",
  lotNumber: 0,
  quantity: 0,
  measureUnit: "kg",
  expiryDate: null,
  expiryTime: null,
};

interface PropsType {
  lng: string;
  validReception: boolean;
  sendInventory: boolean;
  onSend: (list: InventoryList) => void;
}

export default function InsertIngredients(props: PropsType) {
  const { t } = useTranslation(props.lng, "inventory");

  const [alertNonConform, setAlertNonConform] = useState(!props.validReception);

  // List of ingredients id to show the Purchased Ingredients List
  const [ingredientIDList, setIngredientIDList] = useState<string[]>([]);
  // Selected Ingredient Index from list
  const [selectedIndex, setSelectedIndex] = useState(-1);
  // Store all the ingredient information
  const [inventoryList, setInventoryList] = useState<NewInventory[]>([]);
  // Hold the current form values
  const [formValues, setFormValues] = useState<NewInventory>(defaultValues);
  // Handle the uncontrolled select ingredient input
  const [ingredientInputValue, setIngredientInputValue] =
    React.useState<Ingredient | null>(null);
  // Handle the uncontrolled select supplier input
  const [supplierInputValue, setSupplierInputValue] =
    React.useState<Supplier | null>(null);

  const [editMode, setEditMode] = useState(false);

  const handleSelectIngredientChange = (ingredient: Ingredient) => {
    const index = inventoryList.findIndex(
      (item) => item.ingredientId === ingredient.id
    );
    //Update form values and uncontrolled input
    setIngredientInputValue(ingredient);
    setFormValues(inventoryList[index]);
    // Set to edit Mode
    setEditMode(true);
  };

  // Handle the change of lotNumber, measureUnit and quantity values
  const handleFormChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormValues((prevFilters) => ({
      ...prevFilters,
      [name]:
        name === "measureUnit"
          ? value
          : name === "lotNumber"
          ? parseInt(value, 10)
          : parseFloat(value),
    }));
  };

  const handleDateFormChange = (name: string, date: Dayjs | null) => {
    setFormValues((prevFilters) => ({
      ...prevFilters,
      [name]: date,
    }));
  };

  const handleAddToList = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the default form submission behavior

    if (ingredientInputValue !== null) {
      // Update ingredients ID list
      const newIngredientId: string = ingredientInputValue.id;
      setIngredientIDList((prevList) => [...prevList, newIngredientId]);
      //Update inventory list
      setInventoryList((prevList) => [
        ...prevList,
        {
          ...formValues,
          ingredientId: newIngredientId,
          ingredientName: ingredientInputValue.name,
        }, // Spread formValues first and then append ingredientId
      ]);
    }
    //Reset form values and the uncontrolled inputs
    setIngredientInputValue(null);
    setFormValues(defaultValues);
  };

  const handleEditInventoryItem = () => {
    const ingredientIdToEdit = ingredientIDList[selectedIndex];
    const indexToEdit = inventoryList.findIndex(
      (item) => item.ingredientId === ingredientIdToEdit
    );

    if (indexToEdit !== -1) {
      console.log(ingredientIDList);
      // Update ingredient id
      const updatedIngredientIDList = [...ingredientIDList];
      if (ingredientInputValue) {
        updatedIngredientIDList[selectedIndex] = ingredientInputValue.id;
        console.log(updatedIngredientIDList);
        setIngredientIDList(updatedIngredientIDList);
      }

      const updatedInventoryList = [...inventoryList];
      console.log(updatedInventoryList[indexToEdit]);
      updatedInventoryList[indexToEdit] = {
        ...formValues,
        ingredientId: ingredientInputValue ? ingredientInputValue.id : "",
        ingredientName: ingredientInputValue ? ingredientInputValue.name : "",
      };
      setInventoryList(updatedInventoryList);

      //Reset form values and the uncontrolled inputs
      //setIngredientInputValue(null);
      setFormValues(formValues);
    }
  };

  const handleRemoveFromList = () => {
    if (selectedIndex !== -1) {
      const ingredientIdToRemove = ingredientIDList[selectedIndex];
      const indexToRemove = inventoryList.findIndex(
        (item) => item.ingredientId === ingredientIdToRemove
      );

      if (indexToRemove !== -1) {
        // Remove ingredient id from ingredientIDList
        const updatedIngredientIDList = [...ingredientIDList];
        updatedIngredientIDList.splice(selectedIndex, 1);
        setIngredientIDList(updatedIngredientIDList);

        const updatedInventoryList = [...inventoryList];
        updatedInventoryList.splice(indexToRemove, 1);
        setInventoryList(updatedInventoryList);

        // Reset selected index and edit mode
        setSelectedIndex(-1);
        setEditMode(false);
        //Reset form values and the uncontrolled inputs
        setIngredientInputValue(null);
        setFormValues(defaultValues);
      }
    }
  };

  const handleNewIngredient = () => {
    // Remove from edit mode
    setEditMode(false);
    // Remove select index in list
    setSelectedIndex(-1);
    //Reset form values and the uncontrolled inputs
    setIngredientInputValue(null);
    setFormValues(defaultValues);
  };

  useEffect(() => {
    if (props.sendInventory) {
      if (supplierInputValue !== null && supplierInputValue.id !== undefined) {
        props.onSend({
          supplierId: supplierInputValue.id,
          list: inventoryList,
        });
      } else {
        props.onSend({
          supplierId: "",
          list: [],
        });
      }
    }
  }, [props.sendInventory]);

  return (
    <>
      <AlertDialog
        alertTitle={t("alerts.nonconform.title")}
        alertContent={t("alerts.nonconform.content")}
        open={alertNonConform}
        handleClose={() => setAlertNonConform(false)}
        handleAction={() => setAlertNonConform(false)}
      />

      <Box sx={{ display: "flex", flexDirection: "row", gap: "50px" }}>
        <NewInventoryList
          lng={props.lng}
          selectedIndex={selectedIndex}
          onSelectedIndexChange={setSelectedIndex}
          ingredientIdList={ingredientIDList}
          onSelectIngredient={handleSelectIngredientChange}
        />

        <Box sx={{ width: "100%" }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "10px",
            }}
          >
            <TypographyTitle
              variant="body1"
              textAlign={"center"}
              sx={{ p: 1.5, pl: 3 }}
            >
              {t("new.step3.form.title")}
            </TypographyTitle>

            <Divider />

            <Box
              component={"form"}
              onSubmit={handleAddToList}
              sx={{ flexGrow: 2, p: 3, pt: 4 }}
            >
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <CustomTextField
                    label={t("new.step3.form.recDate")}
                    value={getCurrentDateTime()}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <SelectSupplierUncontrolledInput
                    lng={props.lng}
                    value={supplierInputValue}
                    setValue={setSupplierInputValue}
                  />
                </Grid>

                <Grid xs={12}>
                  <Divider />
                </Grid>

                <Grid xs={12} md={6}>
                  <SelectIngredientUncontrolledInput
                    lng={props.lng}
                    value={ingredientInputValue}
                    setValue={setIngredientInputValue}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <CustomTextField
                    type="number"
                    name={"lotNumber"}
                    label={t("new.step3.form.lot")}
                    value={
                      Number.isNaN(formValues.lotNumber)
                        ? ""
                        : formValues.lotNumber
                    }
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleFormChanges(event)
                    }
                    inputProps={{ min: 1 }}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>

                <Grid xs={6} md={6}>
                  <CustomTextField
                    type="number"
                    label={t("new.step3.form.qty")}
                    name="quantity"
                    value={
                      Number.isNaN(formValues.quantity)
                        ? ""
                        : formValues.quantity
                    }
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleFormChanges(event)
                    }
                    inputProps={{ step: 0.01, min: 0.1 }}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>

                <Grid xs={6} md={6}>
                  <SelectMeasureUnitInput
                    lng={props.lng}
                    value={formValues.measureUnit}
                    onChange={handleFormChanges}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={props.lng}
                  >
                    <DatePickerInput
                      label={t("new.step3.form.expiryDate")}
                      value={formValues.expiryDate}
                      onChange={(date) =>
                        handleDateFormChange("expiryDate", date)
                      }
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid xs={12} md={6}>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={props.lng}
                  >
                    <TimePickerInput
                      label={t("new.step3.form.expiryTime")}
                      ampm={false}
                      value={formValues.expiryTime}
                      onChange={(date) =>
                        handleDateFormChange("expiryTime", date)
                      }
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid xs={12} mt={3}>
                  <Box
                    display={"flex"}
                    justifyContent={!editMode ? "flex-end" : "space-between"}
                    width={"100%"}
                  >
                    {!editMode ? (
                      <ContainedButton type="submit" buttonSize="small">
                        {t("new.step3.form.add")}
                      </ContainedButton>
                    ) : (
                      <>
                        <ContainedButton
                          onClick={handleNewIngredient}
                          buttonSize="small"
                          icon
                        >
                          {t("new.step3.form.new")}
                        </ContainedButton>
                        <Stack direction="row" gap={2}>
                          <OutlinedButton
                            onClick={handleEditInventoryItem}
                            buttonSize="small"
                          >
                            {t("new.step3.form.edit")}
                          </OutlinedButton>
                          <OutlinedButton
                            onClick={handleRemoveFromList}
                            buttonSize="small"
                            colorType="secondary"
                          >
                            {t("new.step3.form.remove")}
                          </OutlinedButton>
                        </Stack>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
