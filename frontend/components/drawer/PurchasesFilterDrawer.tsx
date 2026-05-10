import * as React from "react";
import { Box, Divider, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import Grid from "@mui/material/Unstable_Grid2";
import { Dayjs } from "dayjs";
import { CustomFilterDrawer } from "@wac/styles/drawers/FilterDrawer.style";
import { FiltersType } from "../purchases/purchases-table/utils";
import TypographyTitle from "../typography/TypographyTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DatePickerInput from "../inputs/DatePickerInput";
import ContainedButton from "../buttons/ContainedButton";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  lng: string;
  openFilters: boolean;
  onCloseFilters: (event: boolean) => void;
  filters: FiltersType;
  onDateFilterChange: (
    type: "purchaseDate" | "expectedDate",
    name: string,
    date: Dayjs | null
  ) => void;
  onClearFilterValues: () => void;
}

export default function PurchasesFiltersDrawer(props: PropsType) {
  const { t } = useTranslation(props.lng, "purchases");
  return (
    <CustomFilterDrawer
      anchor="right"
      open={props.openFilters}
      onClose={() => props.onCloseFilters(false)}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2, pl: 3 }}
      >
        <TypographyTitle variant="subtitle1">
          {t("filtersDrawer.title")}
        </TypographyTitle>
        <IconButton onClick={() => props.onCloseFilters(false)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Divider />

      <Box flexGrow={2}>
        <Grid container spacing={2} sx={{ p: 2, pl: 3 }}>
          <Grid xs={12}>
            <TypographyTitle variant="body2">
              {t("filtersDrawer.purchaseDate")}
            </TypographyTitle>
          </Grid>
          <Grid xs={12}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={props.lng}
            >
              <DatePickerInput
                label={t("filtersDrawer.from")}
                value={props.filters.purchaseDate.start}
                onChange={(date) =>
                  props.onDateFilterChange("purchaseDate", "start", date)
                }
              />
            </LocalizationProvider>
          </Grid>
          <Grid xs={12} mb={3}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={props.lng}
            >
              <DatePickerInput
                label={t("filtersDrawer.until")}
                value={props.filters.purchaseDate.end}
                onChange={(date) =>
                  props.onDateFilterChange("purchaseDate", "end", date)
                }
              />
            </LocalizationProvider>
          </Grid>

          <Grid xs={12}>
            <TypographyTitle variant="body2">
              {t("filtersDrawer.expectedDate")}
            </TypographyTitle>
          </Grid>
          <Grid xs={12}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={props.lng}
            >
              <DatePickerInput
                label="From"
                value={props.filters.expectedDate.start}
                onChange={(date) =>
                  props.onDateFilterChange("expectedDate", "start", date)
                }
              />
            </LocalizationProvider>
          </Grid>
          <Grid xs={12}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={props.lng}
            >
              <DatePickerInput
                label="Until"
                value={props.filters.expectedDate.end}
                onChange={(date) =>
                  props.onDateFilterChange("expectedDate", "end", date)
                }
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Box>

      <Divider />

      <Box p={2} display={"flex"} justifyContent={"center"}>
        <ContainedButton
          onClick={props.onClearFilterValues}
          colorType="secondary"
        >
          {t("filtersDrawer.clear")}
        </ContainedButton>
      </Box>
    </CustomFilterDrawer>
  );
}
