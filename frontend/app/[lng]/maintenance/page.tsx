"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { auxiliary } from "@wac/styles/palette";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import theme from "@wac/styles/theme";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";

interface PropsType {
  params: { lng: string };
}

export default function MaintenancePage({ params: { lng } }: PropsType) {
  const { t } = useTranslation(lng, "maintenance");

  const cardInfo = [
    {
      title: t("optionCard.storage.title"),
      subtitle: t("optionCard.storage.subtitle"),
      href: `/${lng}/maintenance/storage/inventory`,
      disabled: false,
    },
    {
      title: t("optionCard.cooking.title"),
      subtitle: t("optionCard.cooking.subtitle"),
      href: "",
      disabled: true,
    },
    {
      title: t("optionCard.cleaning.title"),
      subtitle: t("optionCard.cleaning.subtitle"),
      href: "",
      disabled: true,
    },
    {
      title: t("optionCard.equipment.title"),
      subtitle: t("optionCard.equipment.subtitle"),
      href: "",
      disabled: true,
    },
  ];

  return (
    <Box mt={5} minHeight={"45vh"} display={"flex"} alignItems={"center"}>
      <Grid
        container
        spacing={3}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {cardInfo.map(
          (
            {
              title,
              subtitle,
              href,
              disabled,
            }: {
              title: string;
              subtitle: string;
              href: string;
              disabled: boolean;
            },
            index
          ) => (
            <Grid key={index} xs={12} md={6}>
              {disabled ? (
                <Card
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "rgb(224,239,191, 0.3)",
                    p: 2.5,
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: 0,
                      "&:last-child": {
                        paddingBottom: 0,
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontSize={"13px"}
                      color={auxiliary.dark}
                    >
                      {subtitle}
                    </Typography>
                    <Stack
                      mt={1}
                      width={"100%"}
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <TypographyTitle
                        variant="subtitle2"
                        color={auxiliary.dark}
                      >
                        {title}
                      </TypographyTitle>

                      <ArrowForwardIcon
                        fontSize="small"
                        sx={{ color: auxiliary.main }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              ) : (
                <Card
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: theme.palette.primary.light,
                  }}
                >
                  <CardActionArea href={href} sx={{ p: 2.5 }}>
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: 0,
                        "&:last-child": {
                          paddingBottom: 0,
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontSize={"13px"}
                        color={auxiliary.dark}
                      >
                        {subtitle}
                      </Typography>
                      <Stack
                        mt={1}
                        width={"100%"}
                        direction={"row"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <TypographyTitle
                          variant="subtitle2"
                          color={auxiliary.darker}
                        >
                          {title}
                        </TypographyTitle>
                        <ArrowForwardIcon fontSize="small" />
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              )}
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
}
