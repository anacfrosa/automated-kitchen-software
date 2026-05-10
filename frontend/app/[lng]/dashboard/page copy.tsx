// "use client";
// import { useTranslation } from "@wac/app/i18n/client";
// import Typography from "@mui/material/Typography";
// import Paper from "@mui/material/Paper";
// import { IconButton, MenuItem, Stack } from "@mui/material";
// import Grid from "@mui/material/Unstable_Grid2";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import Arrow from "@mui/icons-material/ArrowForward";
// import theme from "@wac/styles/theme";
// import TypographyTitle from "@wac/components/typography/TypographyTitle";
// import { useState, useEffect, useMemo } from "react";
// import { currentUserName } from "@wac/lib/user-management";
// import { ReadForecast } from "@wac/lib/interfaces/forecasts.interface";
// import { SHOPID } from "@wac/lib/api/shops.api";
// import { getForecastsByShop } from "@wac/lib/api/forecasts.api";
// import NotificationLayout from "@wac/components/notifications/NotificationLayout";
// import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
// import { Box, display } from "@mui/system";
// import { shopList } from "../settings/shop/page";

// interface PropsType {
//   params: { lng: string };
// }

// export default function Dashboard({ params: { lng } }: PropsType) {
//   const { t } = useTranslation(lng, "dashboard");
//   const [currentRole, setCurrentRole] = useState<string>("");
//   // All the predictions for the future 9 days
//   const [forecasts, setForecasts] = useState<ReadForecast[]>([]);
//   // Forecast Day choosen
//   const [forecastDate, setForecastDate] = useState<string>("2024-07-01");
//   // Ingredients Prefictions for the forecast date choosen
//   const [ingrsPredictions, setIngrsPredictions] = useState<ReadForecast[]>([]);
//   const [withoutSugg, setWithoutSugg] = useState<boolean>(true);

//   const { data, isLoading, isError } = getForecastsByShop(lng, SHOPID);

//   // Extract unique dates for dropdown options
//   const forecastDates = useMemo(() => {
//     if (forecasts.length === 0) return [];

//     const uniqueDates = Array.from(
//       new Set(forecasts.map((forecast) => forecast.date))
//     );
//     return uniqueDates.map((date) => ({ value: date }));
//   }, [forecasts]);

//   const handleForecastDateChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     console.log(event.target.value);
//     setForecastDate(event.target.value);
//   };

//   useEffect(() => {
//     if (!isLoading && !isError && data) {
//       setForecasts(data);
//     }
//   }, [data, isLoading, isError]);

//   useEffect(() => {
//     if (forecasts.length !== 0 && forecastDate != "") {
//       setIngrsPredictions(
//         forecasts.filter((item) => item.date === forecastDate)
//       );
//     }
//   }, [forecastDate, forecasts]);

//   useEffect(() => {
//     console.log(ingrsPredictions);
//   }, [ingrsPredictions]);

//   useEffect(() => {
//     // Get the current role from local storage
//     const role = localStorage.getItem("selectedRole");
//     if (role) {
//       setCurrentRole(role);
//     }
//   }, []);

//   return (
//     <>
//       <Grid container spacing={4} sx={{ m: 1.5, display: "flex" }}>
//         <Grid xs={12} md={6} flexGrow={2}>
//           <Paper elevation={1} sx={{ p: 3, borderRadius: "10px" }}>
//             <Stack direction={"row"} justifyContent={"space-between"}>
//               <Box>
//                 <Typography variant="body1">{t("selectShop") + ":"}</Typography>
//               </Box>
//               <CustomTextField
//                 select
//                 name="shop"
//                 value={"wac1"}
//                 variant="outlined"
//                 size="small"
//                 fullWidth
//                 sx={{ width: "70%" }}
//               >
//                 {shopList.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </CustomTextField>
//             </Stack>
//           </Paper>
//         </Grid>

//         <Grid xs={6} md={3}>
//           <Paper
//             elevation={1}
//             sx={{
//               p: 2,
//               borderRadius: "10px",
//               backgroundColor: theme.palette.primary.light,
//             }}
//           >
//             <Stack direction={"column"} spacing={1}>
//               <Typography variant="body2">{t("shopShortcut.title")}</Typography>
//               <Stack direction={"row"} justifyContent={"space-between"}>
//                 <Typography variant="subtitle2" fontWeight={550}>
//                   {t("shopShortcut.subtitle")}
//                 </Typography>
//                 <IconButton href={`/${lng}/settings`} sx={{ p: 0, m: 0 }}>
//                   <Arrow fontSize="small" />
//                 </IconButton>
//               </Stack>
//             </Stack>
//           </Paper>
//         </Grid>
//         <Grid xs={6} md={3}>
//           <Paper
//             elevation={1}
//             sx={{
//               p: 2,
//               borderRadius: "10px",
//               backgroundColor: theme.palette.primary.light,
//             }}
//           >
//             <Stack direction={"column"} spacing={1}>
//               <Typography variant="body2">
//                 {t("storageShortcut.title")}
//               </Typography>
//               <Stack direction={"row"} justifyContent={"space-between"}>
//                 <Typography variant="subtitle2" fontWeight={550}>
//                   {t("storageShortcut.subtitle")}
//                 </Typography>
//                 <IconButton
//                   href={`/${lng}/maintenance/storage/inventory`}
//                   sx={{ p: 0, m: 0 }}
//                 >
//                   <Arrow fontSize="small" />
//                 </IconButton>
//               </Stack>
//             </Stack>
//           </Paper>
//         </Grid>

//         <Grid xs={12} md={6}>
//           <Stack direction={"column"} gap={1.5}>
//             <TypographyTitle variant="body1">
//               {t("suggestions")}
//             </TypographyTitle>

//             <Paper
//               elevation={1}
//               sx={{
//                 p: 2,
//                 borderRadius: "10px",
//                 minHeight: "55vh",
//                 maxHeight: "55vh",
//                 overflow: "auto",
//                 "&::-webkit-scrollbar": { width: "5px", borderRadius: "10px" },
//                 "&::-webkit-scrollbar-thumb": {
//                   backgroundColor: "#c1c1c1",
//                   borderRadius: "10px",
//                   width: "5px",
//                 },
//                 "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
//               }}
//             >
//               <Stack direction={"column"} gap={1.5}>
//                 <Box
//                   sx={{
//                     width: "100%",
//                     display: "flex",
//                     flexDirection: "row-reverse",
//                   }}
//                 >
//                   <CustomTextField
//                     select
//                     label={t("forecastDate")}
//                     name="date"
//                     value={forecastDates.length == 0 ? "" : forecastDate}
//                     onChange={handleForecastDateChange}
//                     variant="outlined"
//                     size="small"
//                     fullWidth
//                     sx={{ width: "30%" }}
//                   >
//                     {forecastDates.map((option) => (
//                       <MenuItem key={option.value} value={option.value}>
//                         {option.value}
//                       </MenuItem>
//                     ))}
//                   </CustomTextField>
//                 </Box>

//                 <Box
//                   sx={{
//                     width: "100%",
//                     display: "flex",
//                     flexDirection: "column", // Ensure vertical stacking of items
//                     gap: 1.5,
//                   }}
//                 >
//                   {ingrsPredictions.map(
//                     (prediction: ReadForecast, item: number) => (
//                       <NotificationLayout
//                         key={item}
//                         lng={lng}
//                         prediction={prediction}
//                         onSuggChange={setWithoutSugg}
//                       />
//                     )
//                   )}

//                   {withoutSugg && (
//                     <Box
//                       display={"flex"}
//                       justifyContent={"center"}
//                       alignItems={"center"}
//                       minHeight={"25vh"}
//                     >
//                       <Typography variant="body1">
//                         There are no suggestions for this date.
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//               </Stack>
//             </Paper>
//           </Stack>
//         </Grid>
//       </Grid>
//     </>
//   );
// }
