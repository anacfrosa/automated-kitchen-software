import * as React from "react";
import { Toolbar } from "@mui/material";
import { PiExportBold } from "react-icons/pi";
import {
  ExportSupplier,
  Supplier,
} from "@wac/lib/interfaces/supplier.interface";
import OutlinedButton from "@wac/components/buttons/OutlinedButton";
import BasicMenu from "@wac/components/menu/BasicMenu";
import { processDataToExport } from "./utils";
import { exportToCSV, exportToExcel } from "@wac/lib/export";
import SearchInput from "@wac/components/inputs/SearchInput";
import TextButton from "@wac/components/buttons/TextButton";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  lng: string;
  dataFiltered: Supplier[];
  filter: string;
  onFilterChange: (newFilter: string) => void;
}

export default function SuppliersTableToolbar({
  lng,
  dataFiltered,
  filter,
  onFilterChange,
}: PropsType) {
  const { t } = useTranslation(lng, "suppliers");

  const ExportMenu = [
    { value: "excel", label: t("buttons.downloadAsExcel") },
    { value: "csv", label: t("buttons.downloadAsCSV") },
  ];

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
    const dataToExport: ExportSupplier[] = processDataToExport(dataFiltered);
    if (option === "excel") {
      // Call function to export data to Excel
      exportToExcel(t("title"), dataToExport);
    }
    if (option === "csv") {
      // Call function to export data to CSV
      exportToCSV(t("title"), dataToExport);
    }
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
          value={filter}
          onChange={(event) => onFilterChange(event.target.value)}
          onClear={() => onFilterChange("")}
          maxWidth={420}
        />

        {/* <Tooltip title="Export Supplier List"> */}
        <TextButton
          startIcon={<PiExportBold />}
          buttonSize="small"
          colorType="auxiliary"
          onClick={handleClickExportButton}
        >
          {t("buttons.export")}
        </TextButton>
        {/* </Tooltip> */}
        <BasicMenu
          optionsMenu={ExportMenu}
          open={openExportMenu}
          anchorEl={anchorElMenu}
          onAnchorElChange={handleClickExportButton}
          onSelectedOption={handleSelectedOption}
        />
      </Toolbar>
    </>
  );
}
