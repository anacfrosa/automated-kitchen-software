import { Ingredient } from "@wac/lib/interfaces/ingredient.interface";


function loadIngredients({
  data,
  error,
  isLoading,
}: {
  data: Ingredient[];
  isLoading: boolean;
  error: any;
}) {
  let ingredients: Ingredient[] = [];

  if (error) {
    return { data, error: true };
  } else {
    if (!isLoading && data) {
      ingredients = [...data];
    }
  }

  return { ingredients, error: false };
}

function applyIngredientsFilter({
  inputData,
  filters,
}: {
  inputData: any;
  filters: {
    name: string;
    type: string;
  };
}) {
  const filterByName: string = filters.name;
  const filterByType: string = filters.type;

  if (inputData) {
    if (filterByName) {
      inputData = inputData.filter(
        (ingredient: Ingredient) =>
          ingredient.name.toLowerCase().indexOf(filterByName.toLowerCase()) !==
          -1
      );
    }

    if (filterByType) {
      inputData = inputData.filter(
        (ingredient: Ingredient) =>
          ingredient.form.toLowerCase().indexOf(filterByType.toLowerCase()) !==
          -1
      );
    }
  }

  return inputData;
}

export { loadIngredients, applyIngredientsFilter };
