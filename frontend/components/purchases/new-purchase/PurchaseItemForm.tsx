"use client";
import { useTranslation } from "@wac/app/i18n/client";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import { secondary } from "@wac/styles/palette";
import { getCostPerItem } from "./utils";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SelectIngredientInput from "@wac/components/inputs/SelectIngredient/SelectIngredientInput";
import { Controller } from "react-hook-form";

interface PropsType {
  lng: string;
  control: any;
  index: number;
  register: any;
  remove: any;
  watch: any;
}

export default function PurchaseItemForm(props: PropsType) {
  const { t } = useTranslation(props.lng, "purchases");
  const quantity = props.watch(`item.${props.index}.quantity`);
  const unit = props.watch(`item.${props.index}.measureUnit`);
  const unitPrice = props.watch(`item.${props.index}.unitPrice`);

  return (
    <Grid container spacing={2} mt={0.5} mb={1}>
      <Grid xs={12} md={2.3}>
        <Controller
          name={`item.${props.index}.ingredientId`}
          control={props.control}
          rules={{ required: true }}
          render={({ field: { onChange } }) => (
            <SelectIngredientInput lng={props.lng} onChange={onChange} />
          )}
        />
      </Grid>
      <Grid xs={12} md={2.3}>
        <CustomTextField
          required
          label={t("new.ingrsList.quantity")}
          type="number"
          inputProps={{ step: 0.01, min: 0.1 }}
          {...props.register(`item.${props.index}.quantity`, {
            valueAsNumber: true,
          })}
          variant="outlined"
          size="small"
          fullWidth
        />
      </Grid>
      <Grid xs={12} md={2.3}>
        <CustomTextField
          required
          label={t("new.ingrsList.measureUnit")}
          {...props.register(`item.${props.index}.measureUnit`)}
          variant="outlined"
          size="small"
          fullWidth
        />
      </Grid>
      <Grid xs={12} md={2.3}>
        <CustomTextField
          required
          label={t("new.ingrsList.pricePerKg")}
          type="number"
          inputProps={{ step: 0.01, min: 0.1 }}
          {...props.register(`item.${props.index}.unitPrice`, {
            valueAsNumber: true,
          })}
          variant="outlined"
          size="small"
          fullWidth
        />
      </Grid>
      <Grid xs={12} md={2.3}>
        <CustomTextField
          disabled
          label={t("new.ingrsList.cost")}
          type="number"
          {...props.register(`item.${props.index}.cost`, {
            valueAsNumber: true,
          })}
          value={getCostPerItem(quantity, unit, unitPrice)} // show the cost value
          inputProps={{ step: 0.01 }}
          variant="outlined"
          size="small"
          fullWidth
        />
      </Grid>

      <Grid xs={12} md={0.5}>
        <Tooltip
          title={t("new.ingrsList.delete")}
          onClick={() => props.remove(props.index)}
        >
          <IconButton sx={{ color: secondary.main }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
