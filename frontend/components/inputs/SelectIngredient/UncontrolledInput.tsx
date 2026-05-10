import * as React from "react";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";
import { getIngredients } from "@wac/lib/api/ingredients.api";
import { Ingredient } from "@wac/lib/interfaces/ingredient.interface";
import { Inventory } from "@wac/types/inventory";
import { SHOPID } from "@wac/lib/api/shops.api";
import { getInventoryByShop } from "@wac/utils/api/inventory.api";
import { filterUniqueIngredients } from "@wac/lib/common";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  lng: string;
  value: Ingredient | null; // to be a uncontrolled input
  setValue: (newValue: Ingredient | null) => void; // to be a uncontrolled input
  ingredientsInventory?: boolean;
}

export default function SelectIngredientUncontrolledInput(props: PropsType) {
  const { t } = useTranslation(props.lng, "common");

  const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>(
    []
  );
  const [inventoryList, setInventoryList] = useState<Inventory[]>([]);

  const { ingredients, isLoading, isError } = getIngredients(props.lng);
  const {
    inventory,
    isLoading: isInvLoading,
    isError: isInvError,
  } = getInventoryByShop(props.lng, SHOPID);

  useEffect(() => {
    if (!isLoading && !isError && ingredients) {
      setIngredientsList(ingredients);
    }
  }, [isLoading, isError, ingredients]);

  useEffect(() => {
    if (!isInvLoading && !isInvError && inventory) {
      setInventoryList(inventory);
    }
  }, [isInvLoading, isInvError, inventory]);

  useEffect(() => {
    if (
      props.ingredientsInventory &&
      inventoryList.length > 0 &&
      ingredientsList.length > 0
    ) {
      const uniqueIngredientInventories =
        filterUniqueIngredients(inventoryList);
      const filtered = ingredientsList.filter((ingredient) =>
        uniqueIngredientInventories.some((ing) => ing.id === ingredient.id)
      );
      setFilteredIngredients(filtered);
    } else {
      setFilteredIngredients(ingredientsList);
    }
  }, [inventoryList, ingredientsList, props.ingredientsInventory]);

  // uncontrolled input
  return (
    <Autocomplete
      id="supplier-select"
      options={filteredIngredients}
      getOptionLabel={(option: Ingredient) => option.name}
      value={props.value}
      onChange={(event: any, newValue: Ingredient | null) => {
        props.setValue(newValue);
      }}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          required
          label={t("inputs.ingredient")}
          variant="outlined"
          size="small"
          fullWidth
        />
      )}
    />
  );
}
