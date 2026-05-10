import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { getInventoryByShopAndIngredient } from "@wac/utils/api/inventory.api";
import { useEffect, useState } from "react";
import { Inventory } from "@wac/types/inventory";
import { FillDetails, FillStatus, ReadDispenser } from "@wac/types/dispenser";
import Grid from "@mui/material/Unstable_Grid2";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import theme from "@wac/styles/theme";
import LotsAvailable from "./available-lots/LotsAvailable";
import EditIcon from "@mui/icons-material/ModeEdit";
import DoneIcon from "@mui/icons-material/Done";
import { RxReset } from "react-icons/rx";
import { InitializeFields } from "./available-lots/InitializeFields";
import { Ingredient } from "@wac/lib/interfaces/ingredient.interface";
import { SHOPID } from "@wac/lib/api/shops.api";
import { DisplayRequiredQty, getDispenserMaxCapacity } from "@wac/lib/common";

interface PropsType {
  lng: string;
  dispenser: ReadDispenser;
  sendFillDetails: boolean;
  onSend: (list: FillDetails[], editStatus: boolean) => void;
  quantityRequired: number;
  ingredient: Ingredient;
}

export default function SelectInventory({
  lng,
  dispenser,
  sendFillDetails,
  onSend,
  ingredient,
  quantityRequired,
}: PropsType) {
  const { t } = useTranslation(lng, "dispensers");

  // List of available lots for the ingredient selected
  const [selectedInventory, setSelectedInventory] = useState<Inventory[]>([]);
  // List with the quantities of the ingredient added to the dispenser
  const [dispenserFields, setDispenserFields] = useState<FillDetails[]>([]);

  const [editFields, setEditFields] = useState(false);

  const dispVolume = dispenser ? dispenser.volume : 0;
  const ingrDensity = ingredient.density;

  const { inventoryByIngredient, isLoading, isError } =
    getInventoryByShopAndIngredient(lng, SHOPID, ingredient.id);

  const InitializeDispenserFields = () => {
    const initDispenserFields = InitializeFields(selectedInventory, {
      quantity: quantityRequired,
      measureUnit: "kg",
    });

    setDispenserFields(initDispenserFields);
  };

  // const handleSelectedIngredientChange = (newIngredient: Ingredient | null) => {
  //   setIngredientSelected(newIngredient);
  //   mutate();
  // };

  useEffect(() => {
    // Change the list of lot numbers based on the selected ingredient
    if (!isLoading && !isError) {
      setSelectedInventory(inventoryByIngredient);
    }
  }, [ingredient, isLoading, isError]);

  // Send final list of fill dispenser information to 'Fill Process'
  useEffect(() => {
    if (sendFillDetails && selectedInventory.length !== 0) {
      // Call the onSend callback with the current list of ingredients
      onSend(dispenserFields, editFields);
    }
  }, [sendFillDetails, selectedInventory, dispenserFields]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        minHeight: "460px",
        maxHeight: "400px",
        borderRadius: "10px",
        overflowY: "auto",
      }}
    >
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <Stack direction={"row"} gap={3}>
            <TypographyTitle variant="body2">{t("add.number")}</TypographyTitle>
            <Typography variant="body2">
              {dispenser ? dispenser.number : 0}
            </Typography>
          </Stack>
        </Grid>
        <Grid xs={12} md={4}>
          <Stack direction={"row"} gap={3}>
            <TypographyTitle variant="body2">
              {t("add.storage")}
            </TypographyTitle>
            <Typography variant="body2">
              {dispenser ? dispenser.storage : "Dry"}
            </Typography>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <Stack direction={"row"} gap={3}>
            <TypographyTitle variant="body2">
              {t("add.ingredient")}
            </TypographyTitle>
            <Typography variant="body2">{ingredient.name}</Typography>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <Stack direction={"row"} gap={3}>
            <TypographyTitle
              variant="body2"
              color={theme.palette.secondary.main}
            >
              {t("add.requiredQty")}
            </TypographyTitle>
            <Typography variant="body2">
              {DisplayRequiredQty(quantityRequired)}
            </Typography>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <Stack direction={"row"} gap={3}>
            {/* Max Dispenser Capacity */}
            <TypographyTitle variant="body2">{t("add.maxCap")}</TypographyTitle>
            <Typography variant="body2">
              {getDispenserMaxCapacity(dispVolume, ingrDensity) / 1000 + " kg"}
            </Typography>
          </Stack>
        </Grid>

        <Grid xs={12}>
          <Divider />
        </Grid>

        <Grid xs={12}>
          <Stack direction={"column"} gap={1}>
            <Stack direction={"row"} justifyContent={"space-around"}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={3}
                sx={{ mb: 1 }}
              >
                <TypographyTitle variant="body2">
                  {t("add.list")}
                </TypographyTitle>

                <Stack direction={"row"} gap={2}>
                  {editFields ? (
                    <>
                      <IconButton onClick={() => setEditFields(false)}>
                        <DoneIcon
                          fontSize="small"
                          sx={{ color: theme.palette.primary.main }}
                        />
                      </IconButton>
                      <IconButton onClick={InitializeDispenserFields}>
                        <RxReset fontSize="medium" />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      type="submit"
                      onClick={() => setEditFields(true)}
                    >
                      <EditIcon
                        fontSize="small"
                        sx={{ color: theme.palette.secondary.main }}
                      />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
              <TypographyTitle variant="body2">
                {t("add.confirmList")}
              </TypographyTitle>
            </Stack>

            {/* <TypographyTitle variant="body2">Help: </TypographyTitle>
              <Typography variant="body2">
                To generate new lots, edit the quantity to be added.
              </Typography> */}

            {/* Show and select available lots number  */}
            <LotsAvailable
              lng={lng}
              InitializeDispenserFields={InitializeDispenserFields}
              quantityRequired={{
                quantity: quantityRequired,
                measureUnit: "kg",
              }}
              lotNumberList={selectedInventory}
              dispenserFields={dispenserFields}
              setDispenserFields={setDispenserFields}
              editFields={editFields}
            />
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}
