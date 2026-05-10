import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import { useTranslation } from "@wac/app/i18n/client";

interface HeadLabel {
  label: string;
  alignRight: boolean;
  disablePadding: boolean;
}

export default function InventoryTableHead({
  lng,
  rowCount,
}: {
  lng: string;
  rowCount: number;
}) {
  const { t } = useTranslation(lng, "inventory");

  const headLabels: readonly HeadLabel[] = [
    {
      label: t("tableHead.ingredient"),
      alignRight: false,
      disablePadding: false,
    },
    {
      label: t("tableHead.lotNumber"),
      alignRight: false,
      disablePadding: false,
    },
    {
      label: t("tableHead.quantity"),
      alignRight: false,
      disablePadding: false,
    },
    {
      label: t("tableHead.receptionDate"),
      alignRight: false,
      disablePadding: false,
    },
    {
      label: t("tableHead.expiryDate"),
      alignRight: false,
      disablePadding: false,
    },
    {
      label: t("tableHead.location"),
      alignRight: false,
      disablePadding: false,
    },
    { label: "", alignRight: true, disablePadding: false },
  ];

  return (
    <TableRow>
      {/* Inventory Details  */}
      {headLabels.map((headCell, index) => (
        <TableCell
          key={index}
          align={headCell.alignRight ? "right" : "left"}
          padding={headCell.disablePadding ? "none" : "normal"}
          // sx={{ pr: 4 }}
        >
          {headCell.label}
        </TableCell>
      ))}
    </TableRow>
  );
}
