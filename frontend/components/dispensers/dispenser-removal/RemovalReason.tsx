"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import {
  Accordion,
  AccordionSummary,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import theme from "@wac/styles/theme";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { fDateDDMMYYYYTime } from "@wac/lib/format-date";
import { DisplayQuantity } from "@wac/lib/common";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import Loading from "@wac/components/Loading";
import { ReadDispenser } from "@wac/types/dispenser";
import { lotNumberList } from "@wac/lib/interfaces/inventory.interface";
import WarningIcon from "@mui/icons-material/WarningAmber";

interface PropsType {
  lng: string;
  dispenserInfo: ReadDispenser | undefined;
  lotNumbers: lotNumberList[];
}

export default function RemovalReason({
  lng,
  dispenserInfo,
  lotNumbers,
}: PropsType) {
  const { t } = useTranslation(lng, "dispensers");

  const [value, setValue] = React.useState("lineup");

  const removalOptions = [
    { label: t("remove.reason.reason1"), value: "lineup" },
    {
      label: t("remove.reason.reason2"),
      value: "healthRegulations",
    },
    { label: t("remove.reason.reason3"), value: "expityDate" },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <>
      {dispenserInfo !== undefined ? (
        <Grid container spacing={3} mt={1}>
          <Grid xs={12} md={4}>
            <Stack direction={"row"} gap={3}>
              <TypographyTitle variant="body2">
                {t("remove.number")}
              </TypographyTitle>
              <Typography variant="body2">{dispenserInfo.number}</Typography>
            </Stack>
          </Grid>

          <Grid xs={12} md={4}>
            <Stack direction={"row"} gap={3}>
              <TypographyTitle variant="body2">
                {t("remove.ingredient")}
              </TypographyTitle>
              <Typography variant="body2">
                {dispenserInfo.ingredientId.name}
              </Typography>
            </Stack>
          </Grid>

          <Grid xs={12} md={4}>
            <Stack direction={"row"} gap={3}>
              <TypographyTitle variant="body2">
                {t("remove.form")}
              </TypographyTitle>
              <Typography variant="body2">
                {dispenserInfo.ingredientId.form}
              </Typography>
            </Stack>
          </Grid>

          <Grid xs={12} md={4}>
            <Stack direction={"row"} gap={3}>
              <TypographyTitle variant="body2">
                {t("remove.currQty")}
              </TypographyTitle>
              <Typography variant="body2">
                {DisplayQuantity(
                  dispenserInfo.quantity.current,
                  dispenserInfo.quantity.measureUnit
                )}
              </Typography>
            </Stack>
          </Grid>

          <Grid xs={12} md={4}>
            <Stack direction={"row"} gap={3}>
              <TypographyTitle variant="body2">
                {t("remove.fillDate")}
              </TypographyTitle>
              <Typography variant="body2">
                {fDateDDMMYYYYTime({
                  datetime: dispenserInfo.fillDate,
                })}
              </Typography>
            </Stack>
          </Grid>

          <Grid xs={12} md={4}>
            <Stack direction={"row"} gap={3}>
              <TypographyTitle variant="body2">
                {t("remove.secDate")}
              </TypographyTitle>
              <Typography variant="body2">
                {fDateDDMMYYYYTime({
                  datetime: dispenserInfo.expiryDate,
                })}
              </Typography>
            </Stack>
          </Grid>

          <Grid xs={12}>
            <Divider />
          </Grid>

          <Grid xs={12}>
            <Stack direction={"row"} gap={3}>
              <TypographyTitle
                variant="body2"
                color={theme.palette.secondary.main}
              >
                {t("remove.removeQty")}
              </TypographyTitle>
              <Typography variant="body2">
                {DisplayQuantity(
                  dispenserInfo.quantity.current,
                  dispenserInfo.quantity.measureUnit
                )}
              </Typography>
            </Stack>
          </Grid>

          <Grid xs={12}>
            <Accordion
              sx={{
                backgroundColor: theme.palette.secondary.light,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon fontSize="small" />}
              >
                <Stack direction={"row"} alignItems={"center"} gap={2}>
                  <WarningIcon
                    fontSize="small"
                    sx={{ color: theme.palette.secondary.main }}
                  />
                  <TypographyTitle variant="body2">
                    {t("remove.listLots")}
                  </TypographyTitle>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                {/* LOT NUMBERS */}
                {lotNumbers.map((item, index) => (
                  <Stack
                    key={index}
                    direction={"row"}
                    justifyContent={"space-between"}
                  >
                    <Stack direction={"row"} alignItems={"center"} gap={1}>
                      <IconButton
                        size="small"
                        href={`/${lng}/maintenance/storage/inventory/details/${item.inventoryId}`}
                      >
                        <InfoIcon
                          fontSize="small"
                          //sx={{ color: theme.palette.secondary.main }}
                        />
                      </IconButton>
                      <Typography variant="body2">{item.lotNumber}</Typography>
                    </Stack>
                  </Stack>
                ))}
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid xs={12}>
            <Divider />
          </Grid>

          <Grid xs={12}>
            <FormControl fullWidth>
              <TypographyTitle variant="body2">
                {t("remove.reason.title")}
              </TypographyTitle>
              <RadioGroup value={value} onChange={handleChange} sx={{ mt: 1 }}>
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
                  <TextField
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
      ) : (
        <Loading customHeight="65vh"></Loading>
      )}
    </>
  );
}
