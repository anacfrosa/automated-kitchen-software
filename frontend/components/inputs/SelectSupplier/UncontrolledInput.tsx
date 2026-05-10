import * as React from "react";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import Autocomplete from "@mui/material/Autocomplete";
import { Supplier } from "@wac/lib/interfaces/supplier.interface";
import { getSuppliers } from "@wac/lib/api/suppliers.api";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  lng: string;
  value: Supplier | null; // to be a uncontrolled input
  setValue: (newValue: Supplier | null) => void; // to be a uncontrolled input
}

export default function SelectSupplierUncontrolledInput(props: PropsType) {
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
        props.setValue(newValue);
      }}
      renderInput={(params) => (
        <CustomTextField
          required
          {...params}
          label={t("inputs.supplier")}
          variant="outlined"
          size="small"
          fullWidth
        />
      )}
    />
  );
}
