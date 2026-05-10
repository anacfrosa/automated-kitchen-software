"use client";
import { useTranslation } from "@wac/app/i18n/client";
import Grid from "@mui/material/Unstable_Grid2";
import { fDateDDMMYYYYTime } from "@wac/lib/format-date";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import { ReadPurchase } from "@wac/lib/interfaces/purchases.interface";

interface PropsType {
  lng: string;
  purchaseInfo: ReadPurchase | undefined;
}

export default function PurchaseDatesInfo({ lng, purchaseInfo }: PropsType) {
  const { t } = useTranslation(lng, "purchases");
  return (
    <Grid
      container
      xs={12}
      md={6}
      spacing={3}
      sx={{ display: "flex", flexDirection: "column", mt: 2, mb: 2 }}
    >
      <Grid xs={12}>
        <CustomTextField
          label={t("details.purchaseDate")}
          value={
            purchaseInfo
              ? purchaseInfo.purchaseDate !== null
                ? fDateDDMMYYYYTime({
                    datetime: purchaseInfo.purchaseDate,
                  })
                : "-"
              : ""
          }
          variant="outlined"
          size="small"
          fullWidth
        />
      </Grid>

      <Grid xs={12}>
        <CustomTextField
          label={t("details.expectedDate")}
          value={
            purchaseInfo
              ? purchaseInfo.deliveryDate !== null
                ? fDateDDMMYYYYTime({
                    datetime: purchaseInfo.deliveryDate,
                  })
                : "-"
              : ""
          }
          variant="outlined"
          size="small"
          fullWidth
        />
      </Grid>

      <Grid xs={12}>
        <CustomTextField
          label={t("details.receptionDate")}
          value={
            purchaseInfo
              ? purchaseInfo.receptionDate !== null
                ? fDateDDMMYYYYTime({
                    datetime: purchaseInfo.receptionDate,
                  })
                : "-"
              : ""
          }
          variant="outlined"
          size="small"
          fullWidth
        />
      </Grid>
    </Grid>
  );
}
