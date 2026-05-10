import * as React from "react";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import Autocomplete from "@mui/material/Autocomplete";
import { Supplier } from "@wac/lib/interfaces/supplier.interface";
import { getSuppliers } from "@wac/lib/api/suppliers.api";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  lng: string;
  onChange: any;
  errors: any;
}

export default function SelectSupplierInput(props: PropsType) {
  const { t } = useTranslation(props.lng, "common");
  const { suppliers, isLoading, isError } = getSuppliers(props.lng);

  let supplierList: Supplier[] = [];
  if (!isLoading && !isError && suppliers) {
    supplierList = suppliers;
  }

  return (
    <Autocomplete
      id="supplier-select"
      options={supplierList}
      getOptionLabel={(option: Supplier) => option.name}
      onChange={(event: any, newValue: Supplier | null) => {
        const supplierId = newValue ? newValue.id : "";
        console.log(supplierId);
        props.onChange(supplierId); // Update the field value
      }}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          label={t("inputs.supplier")}
          error={Boolean(props.errors.supplierId)}
          helperText={props.errors.supplierId ? "Required" : ""}
          variant="outlined"
          size="small"
          fullWidth
        />
      )}
    />
  );
}
