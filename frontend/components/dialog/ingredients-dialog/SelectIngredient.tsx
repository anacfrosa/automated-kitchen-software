"use client";
import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Pagination,
  Stack,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import theme from "@wac/styles/theme";
import IngredientCard from "@wac/components/cards/IngredientCard";
import { auxiliary } from "@wac/styles/palette";
import { applyIngredientsFilter, loadIngredients } from "./utils";
import { Ingredient } from "@wac/lib/interfaces/ingredient.interface";

interface FilterTypes {
  name: string;
  type: string;
}

export default function SelectIngredient({
  lng,
  open,
  onHandleDialog,
  onSelectedIngredient,
}: {
  lng: string;
  open: boolean;
  onHandleDialog: (event: boolean) => void;
  onSelectedIngredient: ({ id, name }: { id: string; name: string }) => void;
}) {
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [ingredientsPerPage, setIngredientsPerPage] = React.useState(6);
  const [filters, setFilters] = React.useState<FilterTypes>({
    name: "",
    type: "",
  });

  // Fetching ingredients
  // const fetchIngredients = getIngredients(lng);
  // const { ingredients, error } = loadIngredients(fetchIngredients);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const dataFiltered = applyIngredientsFilter({
    inputData: [],
    filters,
  });

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPage(1);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Set total pages based on the filtered dispensers
  React.useEffect(() => {
    setTotalPages(Math.ceil(dataFiltered.length / ingredientsPerPage));
  }, [dataFiltered, ingredientsPerPage]);

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"sm"}
      open={open}
      onClose={() => onHandleDialog(false)}
    >
      <DialogTitle>
        <Grid container spacing={1}>
          <Grid xs={8}>
            {/* Search dispensers by ingredient NAME */}
            <OutlinedInput
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search ingredient"
              size="small"
              fullWidth
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid xs={4}>
            {/* Search dispensers by ingredient TYPE */}
            <TextField
              select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              label="Type"
              variant="outlined"
              size="small"
              fullWidth
            >
              <MenuItem value="">
                <span style={{ color: theme.palette.primary.dark }}>Clear</span>
              </MenuItem>
              <MenuItem value="Solid">Solid</MenuItem>
              <MenuItem value="Liquid">Liquid</MenuItem>
              <MenuItem value="Paste">Paste</MenuItem>
              <MenuItem value="Spice">Spice</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{ backgroundColor: auxiliary.lighter, minHeight: "380px" }}
      >
        <Grid container spacing={2}>
          {dataFiltered
            .slice((page - 1) * ingredientsPerPage, page * ingredientsPerPage)
            .map((ingredient: Ingredient, index: number) => (
              <Grid key={index} xs={12} sm={6} md={4}>
                <IngredientCard
                  ingredient={ingredient}
                  onSelectedIngredient={onSelectedIngredient}
                  onHandleDialog={onHandleDialog}
                />
              </Grid>
            ))}
        </Grid>
      </DialogContent>

      {/* Pagination */}
      <Stack direction={"row"} justifyContent={"center"} sx={{ p: 1.5 }}>
        <Pagination
          size="medium"
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          sx={{
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: theme.palette.primary.light,
            },
          }}
        />
      </Stack>
      {/* <DialogActions>
        
      </DialogActions> */}
    </Dialog>
  );
}
