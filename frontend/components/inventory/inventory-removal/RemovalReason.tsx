"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import theme, { jost } from "@wac/styles/theme";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import { fDateDDMMYYYYTime } from "@wac/lib/format-date";
import { Inventory } from "@wac/types/inventory";
import { auxiliary } from "@wac/styles/palette";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import SelectMeasureUnitInput from "@wac/components/inputs/SelectUnitInput";
import { removalFieldsType } from "./utils";
import Loading from "@wac/components/Loading";
import { DisplayQuantity } from "@wac/lib/common";

interface PropsType {
  lng: string;
  inventory: Inventory | undefined;
  removalfields: removalFieldsType;
  onRemovalFieldsChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RemovalReason({
  lng,
  inventory,
  removalfields,
  onRemovalFieldsChange,
}: PropsType) {
  const { t } = useTranslation(lng, "inventory");

  const removalOptions = [
    { label: t("remove.reason.reason1"), value: "lineup" },
    {
      label: t("remove.reason.reason2"),
      value: "healthRegulations",
    },
    { label: t("remove.reason.reason3"), value: "expityDate" },
  ];

  const [value, setValue] = React.useState("lineup");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <>
      {inventory !== undefined ? (
        <>
          <Grid container spacing={3} mt={1}>
            <Grid xs={12} md={4}>
              <Stack direction={"row"} gap={3}>
                <TypographyTitle variant="body2">
                  {t("remove.ingredient")}
                </TypographyTitle>
                <Typography variant="body2">
                  {inventory.purchaseInfo.ingredient.name}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={12} md={4}>
              <Stack direction={"row"} gap={3}>
                <TypographyTitle variant="body2">
                  {t("remove.lot")}
                </TypographyTitle>
                <Typography variant="body2">{inventory.lotNumber}</Typography>
              </Stack>
            </Grid>
            <Grid xs={12} md={4}>
              <Stack direction={"row"} gap={3}>
                <TypographyTitle variant="body2">
                  {t("remove.form")}
                </TypographyTitle>
                <Typography variant="body2">
                  {inventory.purchaseInfo.ingredient.form}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={12} md={4}>
              <Stack direction={"row"} gap={3}>
                <TypographyTitle variant="body2">
                  {t("remove.available")}
                </TypographyTitle>
                <Typography variant="body2">
                  {DisplayQuantity(
                    inventory.quantity.current,
                    inventory.quantity.measureUnit
                  )}
                </Typography>
              </Stack>
            </Grid>

            <Grid xs={12} md={4}>
              <Stack direction={"row"} gap={3}>
                <TypographyTitle variant="body2">
                  {t("remove.recDate")}
                </TypographyTitle>
                <Typography variant="body2">
                  {fDateDDMMYYYYTime({
                    datetime: inventory.purchaseInfo.receptionDate,
                  })}
                </Typography>
              </Stack>
            </Grid>

            <Grid xs={12} md={4}>
              <Stack direction={"row"} gap={3}>
                <TypographyTitle variant="body2">
                  {t("remove.expiryDate")}
                </TypographyTitle>
                <Typography variant="body2">
                  {fDateDDMMYYYYTime({
                    datetime: inventory.expiryDate,
                  })}
                </Typography>
              </Stack>
            </Grid>

            <Grid xs={12} md={6}>
              <Stack direction={"column"} gap={2}>
                <TypographyTitle
                  variant="body2"
                  color={theme.palette.secondary.main}
                >
                  {t("remove.qtyToRemove")}
                </TypographyTitle>

                <Stack direction={"row"} gap={1}>
                  <CustomTextField
                    type="number"
                    name="quantity"
                    label={t("remove.qtyLabel")}
                    inputProps={{ step: 0.01 }}
                    value={
                      isNaN(removalfields.quantity)
                        ? ""
                        : removalfields.quantity
                    }
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      onRemovalFieldsChange(event)
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  <SelectMeasureUnitInput
                    lng={lng}
                    value={removalfields.measureUnit}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      onRemovalFieldsChange(event)
                    }
                  />
                </Stack>
              </Stack>
            </Grid>

            <Grid xs={12}>
              <Divider />
            </Grid>

            <Grid xs={12}>
              <FormControl fullWidth>
                <TypographyTitle>{t("remove.reason.title")}</TypographyTitle>
                <RadioGroup
                  value={value}
                  onChange={handleChange}
                  sx={{ mt: 1 }}
                >
                  {removalOptions.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option.value}
                      control={<Radio size={"small"} color="secondary" />}
                      label={option.label}
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "14px",
                        },
                      }}
                    />
                  ))}
                  <FormControlLabel
                    value="other"
                    control={<Radio size={"small"} color="secondary" />}
                    label={t("remove.reason.reason4")}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "14px",
                      },
                    }}
                  />
                  {value === "other" && (
                    <CustomTextField
                      placeholder={t("remove.reason.placeholder")}
                      multiline
                      rows={2}
                      maxRows={Infinity}
                      fullWidth
                    />
                  )}
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </>
      ) : (
        <Loading customHeight="63vh"></Loading>
      )}
    </>
  );
}
