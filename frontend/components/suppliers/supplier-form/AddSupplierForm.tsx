import * as React from "react";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  lng: string;
  register: any;
  errors: any;
}

export default function AddSupplierForm({ lng, register, errors }: PropsType) {
  const { t } = useTranslation(lng, "suppliers");

  return (
    <Grid container spacing={3}>
      {/* Supplier name  */}
      <Grid xs={12} sm={6} md={4}>
        <CustomTextField
          {...register("name")}
          label={t("fields.name")}
          variant="outlined"
          size="small"
          fullWidth
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
      </Grid>
      {/* Supplier phone */}
      <Grid xs={12} sm={6} md={4}>
        <CustomTextField
          {...register("phone")}
          label={t("fields.phone")}
          variant="outlined"
          size="small"
          fullWidth
          error={Boolean(errors.phone)}
          helperText={errors.phone?.message}
        />
      </Grid>
      {/* Supplier email */}
      <Grid xs={12} sm={6} md={4}>
        <CustomTextField
          {...register("email")}
          label={t("fields.email")}
          variant="outlined"
          size="small"
          fullWidth
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />
      </Grid>
      {/* Supplier Country */}
      <Grid xs={12} sm={6} md={4}>
        <CustomTextField
          {...register("country")}
          label={t("fields.country")}
          variant="outlined"
          size="small"
          fullWidth
          error={Boolean(errors.country)}
          helperText={errors.country?.message}
        />
      </Grid>
      {/* Supplier City */}
      <Grid xs={12} sm={6} md={4}>
        <CustomTextField
          {...register("city")}
          label={t("fields.city")}
          variant="outlined"
          size="small"
          fullWidth
          error={Boolean(errors.city)}
          helperText={errors.city?.message}
        />
      </Grid>
      {/* Supplier Adress */}
      <Grid xs={12} sm={6} md={4}>
        <CustomTextField
          {...register("address")}
          label={t("fields.address")}
          variant="outlined"
          size="small"
          fullWidth
          error={Boolean(errors.address)}
          helperText={errors.address?.message}
        />
      </Grid>
      {/* Supplier Zip Code */}
      <Grid xs={12} sm={6} md={4}>
        <CustomTextField
          {...register("zipcode")}
          label={t("fields.zipcode")}
          inputProps={{ min: 1 }}
          variant="outlined"
          size="small"
          fullWidth
          error={Boolean(errors.zipcode)}
          helperText={errors.zipcode?.message}
        />
      </Grid>
      {/* Supplier website */}
      <Grid xs={12} sm={6} md={4}>
        <CustomTextField
          {...register("website")}
          label={t("fields.website")}
          variant="outlined"
          size="small"
          fullWidth
          error={Boolean(errors.website)}
          helperText={errors.website?.message}
        />
      </Grid>
    </Grid>
  );
}
