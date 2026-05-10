import * as React from "react";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { FormPropsType } from "./utils";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  lng: string;
  supplierInfo: FormPropsType;
  reset: any;
  watch: any;
  register: any;
  errors: any;
}

export default function EditSupplierForm({
  lng,
  supplierInfo,
  reset,
  watch,
  register,
  errors,
}: PropsType) {
  const { t } = useTranslation(lng, "suppliers");

  React.useEffect(() => {
    // Reset the form fields with new supplierInfo when it changes
    reset(supplierInfo);
  }, [supplierInfo]);
  return (
    <Grid container spacing={2}>
      {/* Supplier name  */}
      <Grid xs={12} sm={6} md={4}>
        <CustomTextField
          {...register("name")}
          value={watch("name")}
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
          value={watch("phone")}
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
          value={watch("email")}
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
          value={watch("country")}
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
          value={watch("city")}
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
          value={watch("address")}
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
          value={watch("zipcode")}
          label={t("fields.zipcode")}
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
          value={watch("website")}
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
