"use client";
import { useTranslation } from "@wac/app/i18n/client";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Card, CardActionArea, MenuItem, Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Arrow from "@mui/icons-material/ArrowForward";
import theme from "@wac/styles/theme";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import { useState, useEffect, useMemo } from "react";
import { SHOPID } from "@wac/lib/api/shops.api";
import { getForecastDates } from "@wac/lib/api/forecasts.api";
import NotificationLayout from "@wac/components/notifications/NotificationLayout";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import { Box } from "@mui/system";
import { shopList } from "../settings/shop/page";
import { ReadSupplyNotif } from "@wac/lib/interfaces/notifications.interface";
import { getSupplyNotifByShop } from "@wac/lib/api/notifications.api";
import Loading from "@wac/components/Loading";
import Image from "next/image";
import logohorizontal from "@wac/public/logo/logo-horizontal.png";
import { SupplyNotif } from "@wac/lib/enums/supply-notif.enum";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StoreIcon from "@mui/icons-material/Store";

function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("pt-PT"); // Format: DD/MM/YYYY
  const time = now.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  }); // Format: HH:MM
  return `${date} ${time}`;
}

interface PropsType {
  params: { lng: string };
}

export default function Dashboard({ params: { lng } }: PropsType) {
  const { t } = useTranslation(lng, "dashboard");

  const [currentRole, setCurrentRole] = useState<string>("");
  const [forecastDates, setForecastDates] = useState<string[]>([]);
  // Forecast Day choosen
  const [selectedDate, setSelectedDate] = useState<string>("2024-11-18");
  // Store ALL supply notifications from DB
  const [allNotifications, setAllNotifications] = useState<ReadSupplyNotif[]>(
    []
  );
  // Store the supply notifications for the chosen date
  const [supplyNotifs, setSupplyNotifs] = useState<ReadSupplyNotif[]>([]);

  const { dates, isLoading, isError } = getForecastDates(lng);
  const { notifications, isNotifLoading, isNotifError } = getSupplyNotifByShop(
    lng,
    SHOPID
  );

  const handleForecastDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    //console.log(event.target.value);
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    // Get the current role from local storage
    const role = localStorage.getItem("selectedRole");
    if (role) {
      setCurrentRole(role);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isError && dates) {
      setForecastDates(dates);
    }
  }, [dates, isLoading, isError]);

  useEffect(() => {
    if (!isNotifLoading && !isNotifError && notifications) {
      setAllNotifications(notifications);
    }
  }, [notifications, isNotifLoading, isNotifError]);

  useEffect(() => {
    if (
      allNotifications.length !== 0 &&
      selectedDate != "" &&
      currentRole !== ""
    ) {
      const notifBySelectedDate = allNotifications.filter(
        (item) => item.forecastDate === selectedDate
      );

      console.log(currentRole);

      if (currentRole == "admin") {
        // Admin
        setSupplyNotifs(notifBySelectedDate);
      }

      if (currentRole == "handler") {
        // Food Handler
        setSupplyNotifs(
          notifBySelectedDate.filter(
            (item) =>
              item.type === SupplyNotif.FILL || item.type === SupplyNotif.REFILL
          )
        );
      }

      if (currentRole == "manager") {
        // Shop Manager
        setSupplyNotifs(
          notifBySelectedDate.filter(
            (item) => item.type === SupplyNotif.PURCHASE
          )
        );
      }
    }
  }, [selectedDate, allNotifications, currentRole]);

  return (
    <>
      {/* <Grid container spacing={4} sx={{ m: 2, display: "flex" }}> */}
      <Grid container spacing={4} mt={2}>
        <Grid xs={12} md={6} flexGrow={2}>
          <Paper
            elevation={1}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
              borderRadius: "10px",
            }}
          >
            <Stack
              direction={"row"}
              //justifyContent={"space-between"}
              alignItems={"center"}
              gap={3}
            >
              <AccessTimeIcon fontSize="medium" />

              <TypographyTitle variant="body1">
                {/* {getCurrentDateTime()} */}
                {"17/11/2024"}
              </TypographyTitle>
            </Stack>

            <Stack
              direction={"row"}
              //justifyContent={"center"}
              alignItems={"center"}
              gap={3}
            >
              <StoreIcon fontSize="medium" />

              <CustomTextField
                select
                name="shop"
                value={"wac1"}
                variant="outlined"
                size="small"
                fullWidth
                sx={{ width: "70%" }}
              >
                {shopList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Stack>
          </Paper>
        </Grid>

        <Grid xs={6} md={3}>
          <Card
            elevation={1}
            sx={{
              borderRadius: "10px",
              backgroundColor: theme.palette.primary.light,
            }}
          >
            <CardActionArea href={`/${lng}/settings`} sx={{ p: 2 }}>
              <Stack direction={"column"} spacing={1}>
                <Typography variant="body2">
                  {t("shopShortcut.title")}
                </Typography>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography variant="subtitle2" fontWeight={550}>
                    {t("shopShortcut.subtitle")}
                  </Typography>
                  <Arrow fontSize="small" />
                </Stack>
              </Stack>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid xs={6} md={3}>
          <Card
            elevation={1}
            sx={{
              borderRadius: "10px",
              backgroundColor: theme.palette.primary.light,
            }}
          >
            <CardActionArea
              href={`/${lng}/maintenance/storage/inventory`}
              sx={{ p: 2 }}
            >
              <Stack direction={"column"} spacing={1}>
                <Typography variant="body2">
                  {t("storageShortcut.title")}
                </Typography>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography variant="subtitle2" fontWeight={550}>
                    {t("storageShortcut.subtitle")}
                  </Typography>

                  <Arrow fontSize="small" />
                </Stack>
              </Stack>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Stack direction={"column"} gap={1.5}>
            <TypographyTitle variant="body1">
              {t("suggestions")}
            </TypographyTitle>

            <Paper
              elevation={1}
              sx={{
                p: 2,
                borderRadius: "10px",
                minHeight: "55vh",
                maxHeight: "55vh",
                overflow: "auto",
                "&::-webkit-scrollbar": { width: "5px", borderRadius: "10px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#c1c1c1",
                  borderRadius: "10px",
                  width: "5px",
                },
                "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
              }}
            >
              <Stack direction={"column"} gap={1.5}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row-reverse",
                  }}
                >
                  <CustomTextField
                    select
                    label={t("forecastDate")}
                    name="date"
                    value={forecastDates.length == 0 ? "" : selectedDate}
                    onChange={handleForecastDateChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ width: "30%" }}
                  >
                    {forecastDates.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column", // Ensure vertical stacking of items
                    gap: 1.5,
                  }}
                >
                  {isNotifLoading ? (
                    <Loading customHeight={"40vh"} />
                  ) : supplyNotifs.length == 0 ? (
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      minHeight={"35vh"}
                    >
                      <Typography variant="body1">
                        {t("noNotifications")}
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {supplyNotifs.map(
                        (notification: ReadSupplyNotif, item: number) => (
                          <NotificationLayout
                            key={item}
                            lng={lng}
                            notification={notification}
                          />
                        )
                      )}
                    </>
                  )}
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
