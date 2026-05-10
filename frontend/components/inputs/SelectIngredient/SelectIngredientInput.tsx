import * as React from "react";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import { useState } from "react";
import { getIngredients } from "@wac/lib/api/ingredients.api";
import { Ingredient } from "@wac/lib/interfaces/ingredient.interface";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  lng: string;
  onChange: any;
}

export default function SelectIngredientInput(props: PropsType) {
  const { t } = useTranslation(props.lng, "common");

  const { ingredients, isLoading, isError } = getIngredients(props.lng);

  const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);

  React.useEffect(() => {
    if (!isLoading && !isError && ingredients) {
      setIngredientsList(ingredients);
    }
  }, [ingredients]);

  // controlled input
  return (
    <Autocomplete
      id="supplier-select"
      options={ingredientsList}
      getOptionLabel={(option: Ingredient) => option.name}
      onChange={(event: any, newValue: Ingredient | null) => {
        const ingredientId = newValue ? newValue.id : "";
        //console.log(newValue?.name);
        console.log(ingredientId);
        props.onChange(ingredientId);
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
