import * as React from "react";
import { Box, Divider, IconButton, Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { FiltersType } from "../inventory/inventory-table/utils";
import { CustomFilterDrawer } from "@wac/styles/drawers/FilterDrawer.style";
import TypographyTitle from "../typography/TypographyTitle";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import SelectMeasureUnitInput from "../inputs/SelectUnitInput";
import DatePickerInput from "../inputs/DatePickerInput";
import ContainedButton from "../buttons/ContainedButton";
import Scrollbar from "../Scrollbar";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  lng: string;
  openFilters: boolean;
  onCloseFilters: (event: boolean) => void;
  filters: FiltersType;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDateFilterChange: (
    type: "receptionDate" | "expiryDate",
    name: string,
    date: Dayjs | null
  ) => void;
  onClearFilterValues: () => void;
}

export default function InventoryFiltersDrawer(props: PropsType) {
  const { t } = useTranslation(props.lng, "inventory");

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

      <Scrollbar>
        {/* <Box flexGrow={2}> */}
        <Grid container spacing={2} sx={{ p: 2, pl: 3 }}>
          <Grid xs={12}>
            <TypographyTitle variant="body2">
              {t("filtersDrawer.lot")}
            </TypographyTitle>
          </Grid>
          <Grid xs={12}>
            <CustomTextField
              type="number"
              //label={t("filtersDrawer.lot")}
              name="lotNumber"
              value={props.filters.lotNumber}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                props.onFilterChange(event)
              }
              variant="outlined"
              size="small"
              fullWidth
              //InputLabelProps={{ sx: { fontSize: "14px" } }}
            />
          </Grid>

          <Grid xs={12} mt={3}>
            <TypographyTitle variant="body2">
              {t("filtersDrawer.receptionDate")}
            </TypographyTitle>
          </Grid>
          <Grid xs={12}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={props.lng}
            >
              <DatePickerInput
                label={t("filtersDrawer.from")}
                value={props.filters.receptionDate.start}
                onChange={(date) =>
                  props.onDateFilterChange("receptionDate", "start", date)
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
                value={props.filters.receptionDate.end}
                onChange={(date) =>
                  props.onDateFilterChange("receptionDate", "end", date)
                }
              />
            </LocalizationProvider>
          </Grid>

          <Grid xs={12}>
            <TypographyTitle variant="body2">
              {t("filtersDrawer.expiryDate")}
            </TypographyTitle>
          </Grid>
          <Grid xs={12}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={props.lng}
            >
              <DatePickerInput
                label={t("filtersDrawer.from")}
                value={props.filters.expiryDate.start}
                onChange={(date) =>
                  props.onDateFilterChange("expiryDate", "start", date)
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
                value={props.filters.expiryDate.end}
                onChange={(date) =>
                  props.onDateFilterChange("expiryDate", "end", date)
                }
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        {/* </Box> */}
      </Scrollbar>

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
