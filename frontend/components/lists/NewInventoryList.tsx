import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { FixedSizeList } from "react-window";
import { Box, CircularProgress, ListItem, ListItemText } from "@mui/material";
import { auxiliary } from "@wac/styles/palette";
import { StyledListItemButton } from "@wac/styles/lists/IngredientsList.style";
import TypographyTitle from "../typography/TypographyTitle";
import { useEffect, useState } from "react";
import { Ingredient } from "@wac/lib/interfaces/ingredient.interface";
import { getIngredients } from "@wac/lib/api/ingredients.api";

/**
 * List Component:
 *  - Receives the list of ingredient's id to be listed.
 *  - The onSelectIngredient has the ingredient id selected.
 */

interface PropsType {
  lng: string;
  selectedIndex: number;
  onSelectedIndexChange: (newIndex: number) => void;
  ingredientIdList: string[];
  onSelectIngredient: (ingredient: Ingredient) => void;
}

export default function NewInventoryList({
  lng,
  selectedIndex,
  onSelectedIndexChange,
  ingredientIdList,
  onSelectIngredient,
}: PropsType) {
  const { t } = useTranslation(lng, "inventory");

  // Store ingredients
  const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);

  // Fetching inventory by shopId
  const { ingredients, isLoading, isError } = getIngredients(lng);

  const handleSelectItem = (index: number) => {
    // Set the selected ingredient index to be highlighted in the ingredients list
    onSelectedIndexChange(index);
    // Set the selected ingredient to be passed to the form
    onSelectIngredient(ingredientsList[index]);
  };

  useEffect(() => {
    if (!isLoading && !isError && ingredientIdList.length !== 0) {
      //Filter ingredients name based on the ingredient id list given
      const filteredIngredients = ingredientIdList
        .map((id) =>
          ingredients.find((ingredient: Ingredient) => ingredient.id === id)
        )
        .filter(Boolean);

      setIngredientsList(filteredIngredients);
    } else {
      setIngredientsList([]);
    }
  }, [isLoading, isError, ingredientIdList]);

  // useEffect(() => {
  //   console.log(ingredientIdList);
  // }, [ingredientIdList]);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "10px",
        width: "250px",
        minHeight: { lg: "420px", xl: "550px" },
      }}
    >
      <Box sx={{ p: 3, pb: 1 }}>
        <TypographyTitle variant="body1">{t("new.step3.list")}</TypographyTitle>
      </Box>

      {!isLoading && !isError ? (
        <FixedSizeList
          height={300}
          width={250}
          itemSize={46}
          itemCount={ingredientsList.length}
          overscanCount={5}
        >
          {({ index, style }) => (
            <ListItem
              style={style}
              key={index}
              component="div"
              disablePadding
              sx={{ p: 2 }}
            >
              <StyledListItemButton
                selected={selectedIndex === index}
                onClick={() => handleSelectItem(index)}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500}>
                      {ingredientsList[index].name}
                    </Typography>
                  }
                />
              </StyledListItemButton>
            </ListItem>
          )}
        </FixedSizeList>
      ) : (
        <Box
          height={300}
          width={250}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: auxiliary.main }} />
        </Box>
      )}
    </Paper>
  );
}
