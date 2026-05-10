"use client";
import { useTranslation } from "@wac/app/i18n/client";
import { Paper, Stack, Typography } from "@mui/material";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import Grid from "@mui/material/Unstable_Grid2";
import { auxiliary } from "@wac/styles/palette";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/PhoneIphone";
import { ReadPurchase } from "@wac/lib/interfaces/purchases.interface";

interface PropsType {
  lng: string;
  purchaseInfo: ReadPurchase | undefined;
}

export default function PurchaseSupplierInfo({ lng, purchaseInfo }: PropsType) {
  const { t } = useTranslation(lng, "purchases");
  return (
    <Grid container spacing={2} xs={12} md={6} sx={{ mt: 3, mb: 3 }}>
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          borderRadius: "10px",
          p: 1,
          width: "100%",
        }}
      >
        <Grid xs={12}>
          <TypographyTitle variant={"body2"}>
            {t("details.supplierInfo")}
          </TypographyTitle>
        </Grid>
        <Grid xs={12}>
          <Typography variant={"body2"}>
            {purchaseInfo ? purchaseInfo.supplier.name : ""}
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Stack direction={"row"} alignItems={"center"} gap={2}>
            <EmailIcon fontSize="small" sx={{ color: auxiliary.main }} />
            <Typography variant={"body2"}>
              {purchaseInfo ? purchaseInfo.supplier.email : ""}
            </Typography>
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack direction={"row"} alignItems={"center"} gap={2}>
            <PhoneIcon fontSize="small" sx={{ color: auxiliary.main }} />
            <Typography variant={"body2"}>
              {purchaseInfo ? purchaseInfo.supplier.phone : ""}
            </Typography>
          </Stack>
        </Grid>
      </Paper>
    </Grid>
  );
}
