import * as React from "react";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import { measureUnitOptions } from "@wac/lib/constants";
import { MenuItem } from "@mui/material";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  lng: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  name?: string;
}

export default function SelectMeasureUnitInput(props: PropsType) {
  const { t } = useTranslation(props.lng, "common");
  let inputValue: string = "";
  if (props.value != undefined) inputValue = props.value;

  let name: string = "measureUnit";
  if (props.name != undefined) name = props.name;

  //console.log(props.error);

  let activeError: boolean = false;
  if (props.error != undefined) activeError = props.error;
  //console.log(activeError);

  return (
    <>
      <CustomTextField
        select
        disabled={props.disabled}
        label={t("inputs.measureUnit")}
        name={name}
        value={inputValue}
        onChange={props.onChange}
        error={activeError}
        variant="outlined"
        size="small"
        fullWidth
      >
        {measureUnitOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </CustomTextField>
    </>
  );
}
