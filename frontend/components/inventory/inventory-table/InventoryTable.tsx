import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import IngredientTableHead from "./InventoryTableHead";
import InventoryTableRow from "./InventoryTableRow";
import InventoryTableToolbar from "./InventoryTableToolbar";
import { FiltersType, applyFilter } from "./utils";
import TableNoData from "./TableNoData";
import { Dayjs } from "dayjs";
import { Inventory } from "@wac/types/inventory";
import { StyledTableBody } from "@wac/styles/tables/Table.style";
import { StyledTableHead } from "@wac/styles/tables/Table.style";
import Loading from "@wac/components/Loading";

export default function InventoryTable({
  lng,
  invIsLoading,
  inventoryList,
}: {
  lng: string;
  invIsLoading: boolean;
  inventoryList: Inventory[];
}) {
  const { t } = useTranslation(lng, "inventory");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filters, setFilters] = React.useState<FiltersType>({
    name: "",
    lotNumber: 0,
    quantity: 0,
    measureUnit: "g",
    receptionDate: {
      start: null,
      end: null,
    },
    expiryDate: {
      start: null,
      end: null,
    },
  });

  const dataFiltered = applyFilter({
    inputData: inventoryList,
    filters: filters,
  });

  const noData = inventoryList.length == 0;
  const notFound = !dataFiltered.length && !!filters.name;
  //const fetchError = notFound;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFiltersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPage(0);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]:
        name === "name" || name === "measureUnit"
          ? value
          : name === "lotNumber"
          ? parseInt(value, 10)
          : parseFloat(value),
    }));
  };

  const handleDateFilterChange = (
    type: "receptionDate" | "expiryDate",
    name: string,
    date: Dayjs | null
  ) => {
    setPage(0);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: {
        ...prevFilters[type],
        [name]: date,
      },
    }));
  };

  // Clear filter values inside the filters box
  const clearFilterValues = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      lotNumber: 0,
      quantity: 0,
      measureUnit: "g",
      receptionDate: {
        start: null,
        end: null,
      },
      expiryDate: {
        start: null,
        end: null,
      },
    }));
  };

  return (
    <Card sx={{ borderRadius: "10px" }}>
      <InventoryTableToolbar
        lng={lng}
        dataFiltered={dataFiltered}
        filters={filters}
        onFilterChange={handleFiltersChange}
        onDateFilterChange={handleDateFilterChange}
        onClearFilterValues={clearFilterValues}
      />

      {invIsLoading ? (
        <Loading customHeight={"40vh"} />
      ) : (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <StyledTableHead>
                <IngredientTableHead lng={lng} rowCount={dataFiltered.length} />
              </StyledTableHead>

              <StyledTableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((inventory: Inventory, index: number) => (
                    <InventoryTableRow
                      key={index}
                      lng={lng}
                      inventoryItem={inventory}
                    />
                  ))}

                {notFound && (
                  <TableNoData lng={lng} query={filters.name} error={false} />
                )}

                {noData && <TableNoData lng={lng} query={""} error={false} />}

                {/* {fetchError && <TableNoData query={""} error={true} />} */}
              </StyledTableBody>
            </Table>
          </TableContainer>

          <TablePagination
            page={page}
            component="div"
            count={dataFiltered.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Card>
  );
}
