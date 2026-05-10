import * as React from "react";
import { Box, Toolbar } from "@mui/material";
import { PiExportBold } from "react-icons/pi";
import BasicMenu from "@wac/components/menu/BasicMenu";
import { exportToCSV, exportToExcel } from "@wac/lib/export";
import {
  ExportPurchases,
  ReadPurchase,
} from "@wac/lib/interfaces/purchases.interface";
import { Stack } from "@mui/system";
import { Dayjs } from "dayjs";
import { FiltersType, processDataToExport } from "./utils";
import SearchInput from "@wac/components/inputs/SearchInput";
import FilterIcon from "@mui/icons-material/FilterList";
import FiltersDrawer from "@wac/components/drawer/PurchasesFilterDrawer";
import TextButton from "@wac/components/buttons/TextButton";
import TabsWithCounter from "./TabsWithCounter";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  lng: string;
  dataFiltered: ReadPurchase[];
  filters: FiltersType;
  purchaseStatus: string;
  onPurchaseStatusChange: (event: React.SyntheticEvent, value: string) => void;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDateFilterChange: (
    type: "purchaseDate" | "expectedDate",
    name: string,
    date: Dayjs | null
  ) => void;
  onClearFilterValues: () => void;
}

export default function PurchasesTableToolbar(props: PropsType) {
  const { t } = useTranslation(props.lng, "purchases");

  const ExportMenu = [
    { value: "excel", label: t("buttons.downloadAsExcel") },
    { value: "csv", label: t("buttons.downloadAsCSV") },
  ];

  // Handle Filters Button
  const [openFilters, setOpenFilters] = React.useState(false);
  // Handle Export Button
  const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenFiltersChange = (event: boolean) => {
    setOpenFilters(event);
  };

  const openExportMenu = Boolean(anchorElMenu);

  const handleClickExportButton = (
    event: React.MouseEvent<HTMLButtonElement> | null
  ) => {
    if (event === null) {
      setAnchorElMenu(null);
    } else {
      setAnchorElMenu(event.currentTarget);
    }
  };

  const handleSelectedOption = (option: string) => {
    const dataToExport: ExportPurchases[] = processDataToExport(
      props.dataFiltered
    );
    if (option === "excel") {
      // Call function to export data to Excel
      exportToExcel(t("title"), dataToExport);
    }
    if (option === "csv") {
      // Call function to export data to CSV
      exportToCSV(t("title"), dataToExport);
    }
  };

  const handleClearSearchInput = () => {
    const event = {
      target: {
        name: "name", // Assuming the name of the input field is "name"
        value: "", // Clear the search text
      },
    };
    props.onFilterChange(event as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <>
      <Toolbar
        disableGutters
        sx={{
          height: 120,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <TabsWithCounter
          lng={props.lng}
          purchaseStatus={props.purchaseStatus}
          onPurchaseStatusChange={props.onPurchaseStatusChange}
        />

        <Box
          display={"flex"}
          justifyContent={"space-between"}
          width={"100%"}
          p={2}
        >
          <SearchInput
            placeholder={t("searchInput")}
            name="name"
            value={props.filters.name}
            onChange={props.onFilterChange}
            onClear={handleClearSearchInput}
            maxWidth={500}
          />

          <Stack direction={"row"}>
            <TextButton
              startIcon={<FilterIcon />}
              buttonSize="small"
              colorType="auxiliary"
              onClick={() => handleOpenFiltersChange(true)}
            >
              {t("buttons.filters")}
            </TextButton>

            <TextButton
              startIcon={<PiExportBold />}
              buttonSize="small"
              colorType="auxiliary"
              onClick={handleClickExportButton}
            >
              {t("buttons.export")}
            </TextButton>

            <BasicMenu
              optionsMenu={ExportMenu}
              open={openExportMenu}
              anchorEl={anchorElMenu}
              onAnchorElChange={handleClickExportButton}
              onSelectedOption={handleSelectedOption}
            />
          </Stack>
        </Box>
      </Toolbar>

      <FiltersDrawer
        lng={props.lng}
        openFilters={openFilters}
        onCloseFilters={handleOpenFiltersChange}
        filters={props.filters}
        onDateFilterChange={props.onDateFilterChange}
        onClearFilterValues={props.onClearFilterValues}
      />
    </>
  );
}
