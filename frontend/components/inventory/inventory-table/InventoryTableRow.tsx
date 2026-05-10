import * as React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { fDateDDMMYYYYTime } from "@wac/lib/format-date";
import { usePathname } from "next/navigation";
import { Inventory } from "@wac/types/inventory";
import { convertToGrams } from "@wac/lib/common";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import { useTranslation } from "@wac/app/i18n/client";

export default function InventoryTableRow({
  lng,
  inventoryItem,
}: {
  lng: string;
  inventoryItem: Inventory;
}) {
  const { t } = useTranslation(lng, "inventory");
  const pathname = usePathname();

  const currentQuantity: string =
    inventoryItem.quantity.current < 1
      ? convertToGrams(
          inventoryItem.quantity.current,
          inventoryItem.quantity.measureUnit
        ) + " g"
      : inventoryItem.quantity.current +
        " " +
        inventoryItem.quantity.measureUnit;

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell component="th" scope="row">
          {inventoryItem.purchaseInfo.ingredient.name}
        </TableCell>
        <TableCell>{inventoryItem.lotNumber}</TableCell>
        <TableCell>{currentQuantity}</TableCell>
        <TableCell>
          {fDateDDMMYYYYTime({
            datetime: inventoryItem.purchaseInfo.receptionDate,
          })}
        </TableCell>
        <TableCell>
          {fDateDDMMYYYYTime({
            datetime: inventoryItem.expiryDate,
          })}
        </TableCell>

        <TableCell>{inventoryItem.storage}</TableCell>

        <TableCell align="right">
          <ContainedButton
            href={`${pathname}/details/${inventoryItem.id}`}
            buttonSize="smaller"
          >
            {t("buttons.details")}
          </ContainedButton>
        </TableCell>
      </TableRow>
    </>
  );
}
