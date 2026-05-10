import * as React from "react";
import { Stack, Toolbar } from "@mui/material";
import { PiExportBold } from "react-icons/pi";
import { Dayjs } from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import FiltersDrawer from "@wac/components/drawer/InventoryFiltersDrawer";
import { FiltersType, processDataToExport } from "./utils";
import { ExportInventory, Inventory } from "@wac/types/inventory";
import BasicMenu from "@wac/components/menu/BasicMenu";
import { exportToCSV, exportToExcel } from "@wac/lib/export";
import SearchInput from "@wac/components/inputs/SearchInput";
import TextButton from "@wac/components/buttons/TextButton";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  lng: string;
  dataFiltered: Inventory[];
  filters: FiltersType;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDateFilterChange: (
    type: "receptionDate" | "expiryDate",
    name: string,
    date: Dayjs | null
  ) => void;
  onClearFilterValues: () => void;
}

export default function InventoryTableToolbar({
  lng,
  dataFiltered,
  filters,
  onFilterChange,
  onDateFilterChange,
  onClearFilterValues,
}: PropsType) {
  const { t } = useTranslation(lng, "inventory");
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
    const dataToExport: ExportInventory[] = processDataToExport(dataFiltered);
    if (option === "excel") {
      // Call function to export data to Excel
      exportToExcel("Inventory List", dataToExport);
    }
    if (option === "csv") {
      // Call function to export data to CSV
      exportToCSV("Inventory List", dataToExport);
    }
  };

  const handleOpenFiltersChange = (event: boolean) => {
    setOpenFilters(event);
  };

  const handleClearSearchInput = () => {
    const event = {
      target: {
        name: "name", // Assuming the name of the input field is "name"
        value: "", // Clear the search text
      },
    };
    onFilterChange(event as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <>
      <Toolbar
        sx={{
          height: 80,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchInput
          placeholder={t("searchInput")}
          value={filters.name}
          onChange={onFilterChange}
          onClear={handleClearSearchInput}
          maxWidth={420}
        />

        <Stack direction={"row"}>
          <TextButton
            startIcon={<PiExportBold />}
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
      </Toolbar>

      <FiltersDrawer
        lng={lng}
        openFilters={openFilters}
        onCloseFilters={handleOpenFiltersChange}
        filters={filters}
        onFilterChange={onFilterChange}
        onDateFilterChange={onDateFilterChange}
        onClearFilterValues={onClearFilterValues}
      />
    </>
  );
}
