import * as React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { ReadPurchase } from "@wac/lib/interfaces/purchases.interface";
import { fDateDDMMYYYYTime } from "@wac/lib/format-date";
import StatusBox from "@wac/components/StatusBox";
import EuroIcon from "@mui/icons-material/Euro";
import { usePathname } from "next/navigation";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import { useTranslation } from "@wac/app/i18n/client";

export default function PurchasesTableRow({
  purchase,
  lng,
}: {
  lng: string;
  purchase: ReadPurchase;
}) {
  const { t } = useTranslation(lng, "purchases");
  const pathname = usePathname();

  const purchaseDate = fDateDDMMYYYYTime({
    datetime: purchase.purchaseDate,
  });

  const deliveryDate =
    purchase.deliveryDate !== null
      ? fDateDDMMYYYYTime({
          datetime: purchase.deliveryDate,
        })
      : // <StatusBox status={"Empty"}>Unknown</StatusBox>
        "--";

  const status = purchase.status;

  return (
    <>
      <TableRow hover>
        <TableCell component="th" scope="row" align="center">
          #{purchase.number}
        </TableCell>
        <TableCell align="center">{purchase.supplier.name}</TableCell>
        <TableCell>
          <StatusBox status={status}>{t(`status.${status}`)}</StatusBox>
        </TableCell>
        <TableCell align="center">{purchaseDate}</TableCell>
        <TableCell align="center">{deliveryDate}</TableCell>
        <TableCell align="center">
          {purchase.totalCost == 0 ? "--" : purchase.totalCost}
          {purchase.totalCost != 0 && <EuroIcon sx={{ fontSize: "12px" }} />}
        </TableCell>

        <TableCell align="right">
          <ContainedButton
            href={`${pathname}/details/${purchase.id}`}
            buttonSize="smaller"
          >
            {t("buttons.details")}
          </ContainedButton>
        </TableCell>
      </TableRow>
    </>
  );
}
