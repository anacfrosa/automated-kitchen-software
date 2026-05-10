"use client";
import * as React from "react";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Arrow from "@mui/icons-material/ArrowBack";
import theme, { jost } from "@wac/styles/theme";
import RemovalReason from "@wac/components/inventory/inventory-removal/RemovalReason";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import { useEffect, useState } from "react";
import { Inventory } from "@wac/types/inventory";
import {
  getInventoryById,
  updateInventory,
} from "@wac/utils/api/inventory.api";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import { convertToStandardUnit } from "@wac/lib/common";
import RemovalTabs from "@wac/components/inventory/inventory-removal/RemovalTabs";
import { removalFieldsType } from "@wac/components/inventory/inventory-removal/utils";

const removalFieldDefault = {
  quantity: 0,
  measureUnit: "kg",
};

interface PropsType {
  params: { id: string[]; lng: string };
}

export default function MultipleInventoryRemoval({
  params: { id, lng },
}: PropsType) {
  const inventoryIDList: string[] = id;

  const [selectedValue, setSelectedValue] = React.useState(0); // value as uuid
  const [selecteInventoryId, setSelectedInventoryId] = useState<string>(
    inventoryIDList[selectedValue]
  );
  const [selectedInventory, setSelectedInventory] = useState<Inventory>();

  // Initialize removalFields array with default values for each inventory ID
  const initialRemovalFields = inventoryIDList.map((id) => ({
    id,
    ...removalFieldDefault,
  }));
  const [removalFields, setRemovalFields] =
    useState<removalFieldsType[]>(initialRemovalFields);

  const { data, isLoading, isError } = getInventoryById(
    lng,
    selecteInventoryId
  );

  const handleChangeValue = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue);
    setSelectedValue(newValue);

    console.log(inventoryIDList[newValue]);
    setSelectedInventoryId(inventoryIDList[newValue]);
  };

  const handleRemovalFieldsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const selectedIndex = inventoryIDList.indexOf(selecteInventoryId);
    if (selectedIndex !== -1) {
      setRemovalFields((prevFields) => {
        const updatedFields = [...prevFields];
        updatedFields[selectedIndex] = {
          ...updatedFields[selectedIndex],
          [name]: name === "measureUnit" ? value : parseFloat(value),
        };
        return updatedFields;
      });
    }
  };

  const handleRemoveIngredients = () => {
    console.log(removalFields);

    for (const field of removalFields) {
      console.log(field);
      const inventoryId = field.id; // Uncommented this line
      const quantityToRemove = field.quantity;
      const measureUnitToRemove = field.measureUnit;
      // Update inventory table
      const updatedInventory = {
        quantityOut: convertToStandardUnit(
          quantityToRemove,
          measureUnitToRemove
        ),
        measureUnit: "kg", // convert to standard unit DB
      };
      if (inventoryId !== undefined)
        updateInventory(inventoryId, updatedInventory);

      // Add quantity removed to waste table
    }
  };

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setSelectedInventory(data);
    }
  }, [isLoading, selecteInventoryId]);

  return (
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

      <Paper
        elevation={0}
        sx={{
          p: 2,
          pl: 4,
          pr: 4,
          width: "90%",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Stack
          direction="row"
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={1}
        >
          <TypographyTitle variant="subtitle2">
            Remove Multiple Inventory
          </TypographyTitle>
          <ContainedButton
            onClick={handleRemoveIngredients}
            buttonSize="small"
            colorType="secondary"
          >
            Remove all
          </ContainedButton>
        </Stack>

        <Divider />

        <RemovalTabs
          lng={lng}
          removalList={inventoryIDList}
          selectedValue={selectedValue}
          onSelectedValue={handleChangeValue}
        />

        <Divider />

        <RemovalReason
          lng={lng}
          inventory={selectedInventory}
          removalfields={removalFields[selectedValue]}
          onRemovalFieldsChange={handleRemovalFieldsChange}
        />
      </Paper>
    </Box>
  );
}
