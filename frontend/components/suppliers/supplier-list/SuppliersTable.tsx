"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { applySupplierFilter } from "./utils";
import { getSuppliers } from "@wac/lib/api/suppliers.api";
import SuppliersTableToolbar from "./SuppliersTableToolbar";
import SuppliersTableHead from "./SuppliersTableHead";
import SuppliersTableRow from "./SuppliersTableRow";
import { Supplier } from "@wac/lib/interfaces/supplier.interface";
import { Paper } from "@mui/material";
import { StyledTableBody } from "@wac/styles/tables/Table.style";
import { useTranslation } from "@wac/app/i18n/client";
import TableNoData from "./TableNoData";

export default function SuppliersTable({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, "suppliers");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filter, setFilter] = React.useState<string>("");

  let supplierList: Supplier[] = [];
  const { suppliers, isLoading, isError } = getSuppliers(lng);
  if (!isLoading && !isError) {
    supplierList = suppliers;
  }

  const dataFiltered = applySupplierFilter({
    inputData: supplierList,
    filter: filter,
  });

  const noData = supplierList.length == 0;
  const notFound = !dataFiltered.length && !!filter;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card elevation={0} sx={{ borderRadius: "10px" }}>
      <SuppliersTableToolbar
        lng={lng}
        dataFiltered={dataFiltered}
        filter={filter}
        onFilterChange={setFilter}
      />
      <TableContainer sx={{ mt: 1 }}>
        <Table sx={{ minWidth: 400 }}>
          <SuppliersTableHead lng={lng} rowCount={dataFiltered.length} />

          <StyledTableBody>
            {dataFiltered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((supplier: Supplier, index: number) => (
                <SuppliersTableRow
                  key={index}
                  lng={lng}
                  supplierItem={supplier}
                />
              ))}

            {notFound && <TableNoData query={filter} error={false} lng={lng} />}

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
