import { styled } from "@mui/material/styles";
import MuiTableHead from "@mui/material/TableHead";
import MuiTableBody from "@mui/material/TableBody";
import { jost } from "../theme";
import { auxiliary, primary } from "../palette";

export const StyledTableHead = styled(MuiTableHead)({
  "& .MuiTableCell-root": {
    paddingTop: 2,
    paddingBottom: 10,
    fontFamily: jost.style.fontFamily,
    fontWeight: 550,
    fontSize: "14px",
    color: auxiliary.darker,
  },
});

export const StyledTableBody = styled(MuiTableBody)({
  "& .MuiTableCell-root": {
    paddingTop: 8,
    paddingBottom: 8,
  },
});
