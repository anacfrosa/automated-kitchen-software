import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { StyledTableHead } from "@wac/styles/tables/Table.style";
import { useTranslation } from "@wac/app/i18n/client";

interface HeadLabel {
  label: string;
  alignRight: boolean;
  disablePadding: boolean;
}

export default function SuppliersTableHead({
  lng,
  rowCount,
}: {
  lng: string;
  rowCount: number;
}) {
  const { t } = useTranslation(lng, "suppliers");

  const headLabels: readonly HeadLabel[] = [
    {
      label: t("tableHead.supplier"),
      alignRight: false,
      disablePadding: false,
    },
    { label: t("tableHead.contact"), alignRight: false, disablePadding: false },
    { label: t("tableHead.email"), alignRight: false, disablePadding: false },
    {
      label: t("tableHead.location"),
      alignRight: false,
      disablePadding: false,
    },
    { label: t("tableHead.address"), alignRight: false, disablePadding: false },
    { label: t("tableHead.website"), alignRight: false, disablePadding: false },
    { label: " ", alignRight: true, disablePadding: false },
  ];

  return (
    <StyledTableHead>
      <TableRow>
        {headLabels.map((headCell, index) => (
          <TableCell
            key={index}
            align={headCell.alignRight ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </StyledTableHead>
  );
}
