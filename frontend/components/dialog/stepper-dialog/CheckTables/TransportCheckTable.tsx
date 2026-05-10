"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import {
  Box,
  FormControlLabel,
  IconButton,
  RadioGroup,
  Typography,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/HelpOutlineOutlined";
import Popover from "@mui/material/Popover";
import { CheckStatus, RadioValues, Row, createData } from "./utils";
import {
  TableBodyStyled,
  TableHeadStyled,
} from "@wac/styles/tables/CheckTable.style";
import { useEffect } from "react";

interface PropsType {
  lng: string;
  radioValues: RadioValues;
  onRadioChange: (
    taskId: number,
    value: "conform" | "nonconform" | "cantobserve"
  ) => void;
}

export default function TransportCheckTable({
  lng,
  radioValues,
  onRadioChange,
}: PropsType) {
  const { t } = useTranslation(lng, "purchases");

  // Create rows for the transport check table
  const rows: Row[] = [
    createData(1, "task1", false, false, false),
    createData(2, "task2", false, false, false),
    createData(3, "task3", false, false, false),
  ];

  // Create states for Popover
  const [anchorEls, setAnchorEls] = React.useState<
    Array<HTMLButtonElement | null>
  >(rows.map(() => null));

  // Handler Help Button - to open popover with the right help text
  const handleHelpBttn = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    const newAnchorEls = anchorEls.slice();
    newAnchorEls[index] = event.currentTarget;
    setAnchorEls(newAnchorEls);
  };

  // Handler Popover - close popover and change text help
  const handleClosePopover = (index: number) => {
    const newAnchorEls = anchorEls.slice();
    newAnchorEls[index] = null;
    setAnchorEls(newAnchorEls);
  };

  const openIndex = anchorEls.findIndex((el) => el !== null);
  const id = openIndex !== -1 ? `popover-${rows[openIndex].id}` : undefined;

  return (
    <TableContainer
      component={Paper}
      elevation={1}
      sx={{ borderRadius: "10px" }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHeadStyled>
          <TableRow>
            <TableCell>{t("reception.tablesHead.task")}</TableCell>
            <TableCell align="right">
              {t("reception.tablesHead.conform")}
            </TableCell>
            <TableCell align="right">
              {t("reception.tablesHead.nonconform")}
            </TableCell>
            <TableCell align="right">
              {t("reception.tablesHead.cantobserve")}
            </TableCell>
          </TableRow>
        </TableHeadStyled>
        <TableBodyStyled>
          {rows.map((row, index) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {/* HELP Button with more information about the transport check */}
                <IconButton
                  //aria-describedby={id}
                  onClick={(e) => handleHelpBttn(e, index)}
                >
                  <HelpIcon fontSize="small" />
                </IconButton>
                <Popover
                  id={`popover-${row.id}`}
                  open={anchorEls[index] !== null}
                  anchorEl={anchorEls[index]}
                  onClose={() => handleClosePopover(index)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  sx={{ width: "50%" }}
                >
                  <Typography sx={{ p: 2 }}>
                    {t(`reception.step1.tableBody.${row.task}.help`)}
                  </Typography>
                </Popover>
                &nbsp;
                {t(`reception.step1.tableBody.${row.task}.task`)}
              </TableCell>
              <TableCell align="right">
                <RadioGroup
                  name={`radio-group-${row.id}`}
                  value={radioValues[row.id]}
                  onChange={(event) =>
                    onRadioChange(
                      row.id,
                      event.target.value as
                        | "conform"
                        | "nonconform"
                        | "cantobserve"
                    )
                  }
                >
                  <FormControlLabel
                    value="conform"
                    control={<Radio />}
                    label=""
                    sx={{ marginLeft: "auto", marginRight: 1 }}
                  />
                </RadioGroup>
              </TableCell>
              <TableCell align="right">
                <RadioGroup
                  name={`radio-group-${row.id}`}
                  value={radioValues[row.id]}
                  onChange={(event) =>
                    onRadioChange(
                      row.id,
                      event.target.value as
                        | "conform"
                        | "nonconform"
                        | "cantobserve"
                    )
                  }
                >
                  <FormControlLabel
                    value="nonconform"
                    control={<Radio />}
                    label=""
                    sx={{ marginLeft: "auto", marginRight: 2.5 }} // Adjusted styles
                  />
                </RadioGroup>
              </TableCell>
              <TableCell align="right">
                <RadioGroup
                  name={`radio-group-${row.id}`}
                  value={radioValues[row.id]}
                  onChange={(event) =>
                    onRadioChange(
                      row.id,
                      event.target.value as
                        | "conform"
                        | "nonconform"
                        | "cantobserve"
                    )
                  }
                >
                  <FormControlLabel
                    value="cantobserve"
                    control={<Radio />}
                    label=""
                    sx={{ marginLeft: "auto", marginRight: 3 }} // Adjusted styles
                  />
                </RadioGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBodyStyled>
      </Table>
    </TableContainer>
  );
}
