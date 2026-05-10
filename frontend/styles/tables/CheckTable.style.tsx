import { styled } from "@mui/material/styles";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableHead from "@mui/material/TableHead";
import { auxiliary } from "@wac/styles/palette";
import { jost } from "@wac/styles/theme";

export const TableHeadStyled = styled(MuiTableHead)({
  "& .MuiTableCell-root": {
    // fontWeight: 650,
    fontFamily: jost.style.fontFamily,
    fontWeight: 550,
    fontSize: "15px",
    color: auxiliary.darker,
  },
});

export const TableBodyStyled = styled(MuiTableBody)({
  "& .MuiTableCell-root": {
    paddingTop: 10,
    paddingBottom: 10,
  },
});
