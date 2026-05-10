"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import { MenuItem, Stack, Typography } from "@mui/material";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import Grid from "@mui/material/Unstable_Grid2";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import CircleIcon from "@mui/icons-material/Circle";
import theme from "@wac/styles/theme";

interface PropsType {
  lng: string;
}

export const shopList = [
  {
    value: "wac1",
    label: "Shop 1",
  },
];

export default function ShopSettings({ lng }: PropsType) {
  const { t } = useTranslation(lng, "settings");

  return (
    <Stack direction="column">
      <TypographyTitle variant="subtitle1">Shop Settings</TypographyTitle>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid xs={12}>
          <CustomTextField
            select
            label="Shop"
            name="shop"
            value={"wac1"}
            //onChange={props.onChange}
            variant="outlined"
            size="small"
            fullWidth
          >
            {shopList.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
        <Grid xs={12} md={3}>
          <Stack direction={"column"} gap={1.2}>
            <TypographyTitle variant="body2">Status</TypographyTitle>
            <Stack direction="row" alignItems={"center"} gap={1}>
              <CircleIcon
                fontSize="small"
                sx={{ color: theme.palette.primary.main }}
              />
              <Typography variant="body2">Active</Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid xs={12} md={3}>
          <Stack direction={"column"} gap={1.2}>
            <TypographyTitle variant="body2">Country</TypographyTitle>
            <Typography variant="body2">Portugal</Typography>
          </Stack>
        </Grid>

        <Grid xs={12} md={3}>
          <Stack direction={"column"} gap={1.2}>
            <TypographyTitle variant="body2">City</TypographyTitle>
            <Typography variant="body2">Aveiro</Typography>
          </Stack>
        </Grid>

        <Grid xs={12} md={3}>
          <Stack direction={"column"} gap={1.2}>
            <TypographyTitle variant="body2">Adress</TypographyTitle>
            <Typography variant="body2">
              Edifício Central, Via do Conhecimento, 3830-352 Ílhavo
            </Typography>
          </Stack>
        </Grid>

        <Grid xs={12} md={3}>
          <Stack direction={"column"} gap={1.2}>
            <TypographyTitle variant="body2">Total Dispensers</TypographyTitle>
            <Typography variant="body2">20</Typography>
          </Stack>
        </Grid>

        <Grid xs={12} md={3}>
          <Stack direction={"column"} gap={1.2}>
            <TypographyTitle variant="body2">Dry Dispensers</TypographyTitle>
            <Typography variant="body2">20</Typography>
          </Stack>
        </Grid>

        <Grid xs={12} md={3}>
          <Stack direction={"column"} gap={1.2}>
            <TypographyTitle variant="body2">Fridge Dispensers</TypographyTitle>
            <Typography variant="body2">20</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
