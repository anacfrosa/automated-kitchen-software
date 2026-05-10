import { useState } from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { FiltersType, applyPurchaseFilter } from "./utils";
import { getPurchasesByShop } from "@wac/lib/api/purchases.api";
import { SHOPID } from "@wac/lib/api/shops.api";
import PurchasesTableToolbar from "./PurchasesTableToolbar";
import PurchasesTableHead from "./PurchasesTableHead";
import PurchasesTableRow from "./PurchasesTableRow";
import { Dayjs } from "dayjs";
import { StyledTableBody } from "@wac/styles/tables/Table.style";
import TableNoData from "./TableNoData";
import { ReadPurchase } from "@wac/lib/interfaces/purchases.interface";

export default function PurchasesTable({ lng }: { lng: string }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [purchaseStatus, setPurchaseStatus] = useState("");
  const [filters, setFilters] = useState<FiltersType>({
    name: "",
    purchaseDate: {
      start: null,
      end: null,
    },
    expectedDate: {
      start: null,
      end: null,
    },
  });

  let purchasesList: ReadPurchase[] = [];
  const { purchases, isLoading, isError } = getPurchasesByShop(lng, SHOPID);
  if (!isLoading && !isError) {
    purchasesList = purchases;
  }

  const dataFiltered = applyPurchaseFilter({
    lng,
    inputData: purchasesList,
    filters: filters,
    purchaseStatus: purchaseStatus,
  });

  const noData = purchasesList.length == 0;
  const notFound = !dataFiltered.length && !!filters.name;
  // const fetchError = error;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePurchaseStatusChange = (
    event: React.SyntheticEvent,
    value: string
  ) => {
    console.log(value);
    setPurchaseStatus(value);
  };

  const handleFiltersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPage(0);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDateFilterChange = (
    type: "purchaseDate" | "expectedDate",
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
      name: "",
      purchaseDate: {
        start: null,
        end: null,
      },
      expectedDate: {
        start: null,
        end: null,
      },
    }));
  };

  return (
    <Card elevation={0} sx={{ borderRadius: "10px" }}>
      <PurchasesTableToolbar
        lng={lng}
        dataFiltered={dataFiltered}
        purchaseStatus={purchaseStatus}
        onPurchaseStatusChange={handlePurchaseStatusChange}
        filters={filters}
        onFilterChange={handleFiltersChange}
        onDateFilterChange={handleDateFilterChange}
        onClearFilterValues={clearFilterValues}
      />
      <TableContainer sx={{ mt: 1 }}>
        <Table sx={{ minWidth: 750 }}>
          {/* <TableHeadStyled> */}
          <PurchasesTableHead lng={lng} />
          {/* </TableHeadStyled> */}
          <StyledTableBody>
            {dataFiltered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((purchase: ReadPurchase, index: number) => (
                <PurchasesTableRow key={index} lng={lng} purchase={purchase} />
              ))}

            {notFound && (
              <TableNoData lng={lng} query={filters.name} error={false} />
            )}

            {noData && <TableNoData lng={lng} query={""} error={false} />}
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
    </Card>
  );
}
