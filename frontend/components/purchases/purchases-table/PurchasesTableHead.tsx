import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { StyledTableHead } from "@wac/styles/tables/Table.style";
import { useTranslation } from "@wac/app/i18n/client";

interface HeadLabel {
  label: string;
  alignRight: boolean;
  disablePadding: boolean;
}

export default function PurchasesTableHead({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, "purchases");

  const headLabels: readonly HeadLabel[] = [
    { label: t("tableHead.number"), alignRight: false, disablePadding: false },
    {
      label: t("tableHead.supplier"),
      alignRight: false,
      disablePadding: false,
    },
    { label: t("tableHead.status"), alignRight: false, disablePadding: false },

    {
      label: t("tableHead.purchaseDate"),
      alignRight: false,
      disablePadding: false,
    },
    {
      label: t("tableHead.expectedDate"),
      alignRight: false,
      disablePadding: false,
    },
    {
      label: t("tableHead.totalCost"),
      alignRight: false,
      disablePadding: false,
    },
    { label: " ", alignRight: true, disablePadding: false },
  ];
  return (
    <StyledTableHead>
      <TableRow>
        <>
          {headLabels.map((headCell, index) => (
            <TableCell
              key={index}
              align={headCell.alignRight ? "right" : "center"}
              padding={headCell.disablePadding ? "none" : "normal"}
              // sx={{ pr: 4 }}
            >
              {headCell.label}
            </TableCell>
          ))}
        </>
      </TableRow>
    </StyledTableHead>
  );
}
