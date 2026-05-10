// "use client";
// import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
// import { useTranslation } from "@wac/app/i18n/client";
// import { SHOPID } from "@wac/lib/api/shops.api";
// import { ReadForecast } from "@wac/lib/interfaces/forecasts.interface";
// import { ReadDispenser } from "@wac/types/dispenser";
// import { Inventory } from "@wac/types/inventory";
// import { getInventoryByShopAndIngredient } from "@wac/utils/api/inventory.api";
// import { useEffect, useState } from "react";
// import { generateNotification, Notification } from "./generate-notification";
// import Arrow from "@mui/icons-material/ArrowForward";
// import { auxiliary } from "@wac/styles/palette";
// import TypographyTitle from "../typography/TypographyTitle";
// import AlertDialog from "../dialog/AlertDialog";
// import {
//   assignDispenser,
//   convertToGrams,
//   convertToStandardUnit,
//   getDispenserMaxCapacity,
// } from "@wac/lib/common";
// import { useRouter } from "next/navigation";
// import {
//   getDispenserByShop,
//   getDispenserByShopAndIngredient,
// } from "@wac/lib/api/dispensers.api";

// interface PropsType {
//   lng: string;
//   prediction: ReadForecast;
//   onSuggChange: (event: boolean) => void;
// }

// export default function NotificationLayout({
//   lng,
//   prediction,
//   onSuggChange,
// }: PropsType) {
//   const { t } = useTranslation(lng, "dashboard");
//   const router = useRouter();

//   const [dispsList, setDispsList] = useState<ReadDispenser[] | undefined>();
//   const [dispsAvailabel, setDispsAvailabel] = useState<boolean>(true);
//   const [ingrsDispensers, setIngrsDispensers] = useState<ReadDispenser[]>([]);
//   const [ingrsInventory, setIngrsInventory] = useState<Inventory[]>([]);
//   const [notification, setNotification] = useState<Notification | null>(null);

//   const ingredientId = prediction.ingredient.id;
//   const ingredientName = prediction.ingredient.name;

//   const {
//     inventoryByIngredient,
//     isLoading: invIsLoading,
//     isError: invIsError,
//   } = getInventoryByShopAndIngredient(lng, SHOPID, ingredientId);

//   const {
//     dispensers,
//     isLoading: dispIsLoading,
//     isError: dispIsError,
//   } = getDispenserByShopAndIngredient(lng, SHOPID, ingredientId);

//   // Get the list of dispenser by shop id
//   const {
//     dispensers: allDispensers,
//     isLoading: isDispsLoading,
//     isError: isDispsError,
//   } = getDispenserByShop(lng, SHOPID);

//   const handleAssignDispenser = () => {
//     if (dispsList != undefined && notification !== null) {
//       // Assign a dispenser based on the ingredient shelf life
//       const dispenserId = assignDispenser(dispsList, prediction.ingredient);

//       if (dispenserId == "") {
//         setDispsAvailabel(false);
//       } else {
//         let quantityToAdd: number = 0;
//         // Find the max quantity that is possible to insert based on the dispenser capacity
//         const findDisp = dispsList.find(
//           (dispenser) => dispenser.id === dispenserId
//         );
//         if (findDisp != undefined) {
//           const findMaxQty = getDispenserMaxCapacity(
//             findDisp.volume,
//             prediction.ingredient.density
//           );
//           quantityToAdd = Math.min(
//             findMaxQty,
//             convertToGrams(
//               notification.required.quantity,
//               notification.required.measureUnit
//             )
//           );
//         }
//         // Convert required quatity to standard unit (Kg)
//         const quantityKg: number = convertToStandardUnit(quantityToAdd, "g");

//         if (notification.inventoryId != undefined) {
//           console.log("Fill By Inventory Id !");
//           router.push(
//             `/${lng}/maintenance/storage/dispensers/fill/${dispenserId}/${notification.inventoryId}/${quantityKg}`
//           );
//         } else {
//           //console.log("Fill By Ingredient !");
//           router.push(
//             `/${lng}/maintenance/storage/dispensers/fill/${dispenserId}/ingredient/${ingredientId}/${quantityKg}`
//           );
//         }
//       }
//     }
//   };

//   const handleRefill = () => {
//     if (notification !== null) {
//       // Convert required quatity to standard unit (Kg)
//       const quantity: number = convertToStandardUnit(
//         notification.required.quantity,
//         notification.required.measureUnit
//       );

//       if (
//         notification.inventoryId != undefined &&
//         notification.dispenserId != undefined
//       ) {
//         router.push(
//           `/${lng}/maintenance/storage/dispensers/refill/${notification.dispenserId}/${notification.inventoryId}/${quantity}`
//         );
//       }
//     }
//   };

//   const handlePurchase = () => {
//     if (notification !== null) {
//       // console.log(`/${lng}/maintenance/storage/purchases/new`);
//       router.push(`/${lng}/maintenance/storage/purchases/new`);
//     }
//   };

//   useEffect(() => {
//     if (!invIsLoading && !invIsError && inventoryByIngredient) {
//       setIngrsInventory(inventoryByIngredient);
//     }
//   }, [inventoryByIngredient, invIsLoading, invIsError]);

//   useEffect(() => {
//     if (!dispIsLoading && !dispIsError && dispensers) {
//       setIngrsDispensers(dispensers);
//     }
//   }, [dispensers, dispIsLoading, dispIsError]);

//   useEffect(() => {
//     if (!isDispsLoading && !isDispsError && allDispensers) {
//       setDispsList(allDispensers);
//     }
//   }, [isDispsLoading, isDispsError, allDispensers]);

//   // Generate notification only after the component has rendered
//   useEffect(() => {
//     console.log("\nDate: ", prediction.date);
//     console.log("Ingredient: ", prediction.ingredient.name);
//     console.log("Required: ", prediction.quantity + prediction.measureUnit);
//     const notf: Notification | null = generateNotification(
//       ingrsInventory,
//       ingrsDispensers,
//       {
//         quantity: prediction.quantity,
//         measureUnit: prediction.measureUnit,
//       }
//     );
//     setNotification(notf);
//   }, [prediction, ingrsInventory, ingrsDispensers]);

//   useEffect(() => {
//     if (notification !== null) onSuggChange(false);
//     console.log(notification);
//   }, [notification]);

//   return (
//     <>
//       {notification !== null && (
//         <>
//           <Paper
//             variant="outlined"
//             sx={{
//               p: 1,
//               pl: 2,
//               pr: 2,
//               borderRadius: "10px",
//               backgroundColor:
//                 notification.type == "Purchase" ? "#FFB2B2" : "#fff2cf", //"FFE7A8
//             }}
//           >
//             <Stack direction="column" justifyContent="space-between" gap={0.5}>
//               <TypographyTitle variant="body2" color={auxiliary.dark}>
//                 {notification.type == "Fill" && t("fill")}
//                 {notification.type == "Refill" && t("refill")}
//                 {notification.type == "Purchase" &&
//                   t("purchase") + ` ${ingredientName}`}
//               </TypographyTitle>
//               <Stack
//                 direction="row"
//                 justifyContent={"space-between"}
//                 alignItems={"center"}
//               >
//                 <Typography
//                   variant="body2"
//                   sx={{ fontSize: "0.8rem" }}
//                   color={auxiliary.dark}
//                 >
//                   {`${t("required")} ${
//                     (notification.required.quantity < 1000
//                       ? notification.required.quantity
//                       : (notification.required.quantity / 1000).toFixed(1)) +
//                     " " +
//                     (notification.required.quantity < 1000 ? "g" : "kg")
//                   } ${t("of")} ${ingredientName}.`}
//                 </Typography>
//                 <IconButton
//                   sx={{ p: 0, m: 0 }}
//                   onClick={
//                     notification.type == "Fill"
//                       ? handleAssignDispenser
//                       : notification.type == "Refill"
//                       ? handleRefill
//                       : handlePurchase
//                   }
//                 >
//                   <Arrow fontSize="small" sx={{ fontSize: "18px" }} />
//                 </IconButton>
//               </Stack>
//             </Stack>
//           </Paper>
//           <AlertDialog
//             alertTitle={"No free dispensers."}
//             alertContent={"There are no dispensers available."}
//             open={!dispsAvailabel}
//             handleClose={() => setDispsAvailabel(true)}
//             handleAction={() => setDispsAvailabel(true)}
//           />
//         </>
//       )}
//     </>
//   );
// }
