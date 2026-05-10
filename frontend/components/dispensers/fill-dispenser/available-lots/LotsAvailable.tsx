import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import { Box, Divider, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { auxiliary } from "@wac/styles/palette";
import { useEffect } from "react";
import { Inventory } from "@wac/types/inventory";
import { FillDetails } from "@wac/types/dispenser";
import { InitializeFields, UpdateFields } from "./InitializeFields";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import SelectMeasureUnitInput from "@wac/components/inputs/SelectUnitInput";
import { DisplayQuantity } from "@wac/lib/common";
import TypographyTitle from "@wac/components/typography/TypographyTitle";

interface PropsType {
  lng: string;
  InitializeDispenserFields: () => void;
  quantityRequired: {
    quantity: number;
    measureUnit: string;
  };
  lotNumberList: Inventory[];
  dispenserFields: FillDetails[];
  setDispenserFields: (newList: FillDetails[]) => void;
  editFields: boolean;
}

export default function LotsAvailable({
  lng,
  InitializeDispenserFields,
  quantityRequired,
  lotNumberList,
  dispenserFields,
  setDispenserFields,
  editFields,
}: PropsType) {
  const { t } = useTranslation(lng, "dispensers");

  const handleDispenserFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    lotNumber: number
  ) => {
    const { name, value } = event.target;
    console.log(name);
    console.log(value);
    const newDispenserFields = [...dispenserFields];
    const index = newDispenserFields.findIndex(
      (field) => field.lotNumber === lotNumber
    );
    if (index !== -1) {
      newDispenserFields[index] = {
        ...newDispenserFields[index],
        [name]: value,
      };
      setDispenserFields(newDispenserFields);

      console.log(newDispenserFields);

      if (name != "confirmQuantity") {
        if (name != "confirmUnit") {
          // Recalculate dispenser fields
          const updatedDispenserFields = UpdateFields(
            lotNumberList,
            lotNumber,
            newDispenserFields,
            quantityRequired
          );
          //console.log(updatedDispenserFields);
          setDispenserFields(updatedDispenserFields);

          console.log(updatedDispenserFields);
        }
      }
    }
  };

  useEffect(() => {
    InitializeDispenserFields();
  }, [lotNumberList]);

  return (
    <Grid container spacing={1}>
      {dispenserFields.map((field, index) => (
        <React.Fragment key={field.lotNumber}>
          <Box
            display={"flex"}
            width={"100%"}
            //bgcolor={auxiliary.lighter}
            bgcolor={"rgb(249,249,249)"}
            borderRadius={"10px"}
            p={1}
            //mb={index !== dispenserFields.length - 1 ? 2 : 0}
            mb={1}
          >
            <Grid xs={2}>
              <CustomTextField
                value={field ? field.lotNumber : 0}
                label={t("add.lot")}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid xs={2}>
              <CustomTextField
                value={DisplayQuantity(
                  field?.quantityAvailable.quantity,
                  field?.quantityAvailable.unit
                )}
                label={t("add.labels.available")}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>

            <Grid xs={2}>
              <CustomTextField
                disabled={!editFields}
                type="number"
                name="quantity"
                label={t("add.qtyToAdd")}
                value={field ? field.quantity : 0}
                onChange={(event: any) =>
                  handleDispenserFieldChange(event, field.lotNumber)
                }
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid xs={2}>
              <SelectMeasureUnitInput
                lng={lng}
                disabled={!editFields}
                value={field.measureUnit}
                onChange={(event: any) =>
                  handleDispenserFieldChange(event, field.lotNumber)
                }
              />
            </Grid>

            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ mr: 1, ml: 1 }}
            />

            <Grid xs={2}>
              <CustomTextField
                type="number"
                name="confirmQuantity"
                label={t("add.labels.confirm")}
                value={field ? field.confirmQuantity : 0}
                onChange={(event: any) =>
                  handleDispenserFieldChange(event, field.lotNumber)
                }
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid xs={2}>
              <SelectMeasureUnitInput
                lng={lng}
                name="confirmUnit"
                value={field.confirmUnit}
                onChange={(event: any) =>
                  handleDispenserFieldChange(event, field.lotNumber)
                }
              />
            </Grid>
          </Box>
        </React.Fragment>
      ))}
    </Grid>
  );
}
