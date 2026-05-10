import * as React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { FiLink } from "react-icons/fi";
import { auxiliary } from "@wac/styles/palette";
import { Checkbox, IconButton, Stack, Tooltip } from "@mui/material";
import { usePathname } from "next/navigation";
import EmailIcon from "@mui/icons-material/Email";
import { Supplier } from "@wac/lib/interfaces/supplier.interface";
import EditIcon from "@mui/icons-material/Edit";
import theme from "@wac/styles/theme";
import { useTranslation } from "@wac/app/i18n/client";

export default function SuppliersTableRow({
  supplierItem,
  lng,
}: {
  supplierItem: Supplier;
  lng: string;
}) {
  const { t } = useTranslation(lng, "suppliers");
  const pathname = usePathname();

  const handleWebsiteClick = () => {
    window.open(`${supplierItem.website}`);
  };

  const handleEmailClick = () => {
    // Open supplierItem's email in a new tab
    window.open(`mailto:${supplierItem.email}`);
  };

  //console.log(supplierItem);

  return (
    <>
      <TableRow hover>
        <TableCell component="th" scope="row">
          {supplierItem.name}
        </TableCell>
        <TableCell>{supplierItem.phone}</TableCell>
        <TableCell>{supplierItem.email}</TableCell>
        <TableCell>
          {supplierItem.country}, {supplierItem.city}
        </TableCell>
        <TableCell>
          {supplierItem.address}, {supplierItem.zipcode}
        </TableCell>

        <TableCell>
          {supplierItem.website != "" ? (
            <IconButton
              sx={{ color: auxiliary.dark }}
              onClick={handleWebsiteClick}
            >
              <FiLink fontSize="small" />
            </IconButton>
          ) : (
            "--"
          )}
        </TableCell>

        <TableCell align="right">
          <Stack direction={"row"} justifyContent={"flex-end"} gap={1.5}>
            <Tooltip title={t("tooltip.email")}>
              <IconButton
                onClick={handleEmailClick}
                sx={{ color: auxiliary.main }}
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("tooltip.edit")}>
              <IconButton
                sx={{ color: theme.palette.secondary.main }}
                href={`${pathname}/edit/${supplierItem.id}`}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
}
