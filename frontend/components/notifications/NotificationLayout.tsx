"use client";
import {
  Box,
  Card,
  CardActionArea,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "@wac/app/i18n/client";
import { useEffect, useState } from "react";
import { generateNotification, Notification } from "./generate-notification";
import Arrow from "@mui/icons-material/ArrowForward";
import { auxiliary } from "@wac/styles/palette";
import TypographyTitle from "../typography/TypographyTitle";
import AlertDialog from "../dialog/AlertDialog";
import { convertToStandardUnit } from "@wac/lib/common";
import { useRouter } from "next/navigation";
import { ReadSupplyNotif } from "@wac/lib/interfaces/notifications.interface";
import { SupplyNotif } from "@wac/lib/enums/supply-notif.enum";

interface PropsType {
  lng: string;
  notification: ReadSupplyNotif;
}

export default function NotificationLayout({ lng, notification }: PropsType) {
  const { t } = useTranslation(lng, "dashboard");
  const router = useRouter();

  console.log(notification.type);

  const [dispsAvailabel, setDispsAvailabel] = useState<boolean>(true);
  const ingredientId = notification.ingredientId;
  const dispenserId: string | null = notification.dispenserId;
  const inventoryId: string | null = notification.inventoryId;

  const handleNotificationColor = (type: string) => {
    if (type == SupplyNotif.PURCHASE) {
      return "#FFB2B2";
    }

    if (type == SupplyNotif.FILL) return "#fff2cf";

    if (type == SupplyNotif.REFILL) return "#f7ea97";

    return "";
  };

  const handleClickNotification = () => {
    // Convert required quatity to standard unit (Kg)
    const quantityInKg: number = convertToStandardUnit(
      notification.quantity,
      notification.measureUnit
    );

    switch (notification.type) {
      case SupplyNotif.PURCHASE:
        router.push(`/${lng}/maintenance/storage/purchases/new`);
        break;
      case SupplyNotif.FILL:
        console.log("Quantity to Fill : ", quantityInKg);
        if (dispenserId !== null) {
          if (inventoryId !== null) {
            //Fill with one lot
            router.push(
              `/${lng}/maintenance/storage/dispensers/fill/${dispenserId}/${inventoryId}/${quantityInKg}`
            );
          } else {
            // Fill with more than one lot
            router.push(
              `/${lng}/maintenance/storage/dispensers/fill/${dispenserId}/ingredient/${ingredientId}/${quantityInKg}`
            );
          }
        } else {
          // No dispenser available
          setDispsAvailabel(false);
        }

        break;
      case SupplyNotif.REFILL:
        console.log("Quantity to Refill : ", quantityInKg);
        router.push(
          `/${lng}/maintenance/storage/dispensers/refill/${notification.dispenserId}/${notification.inventoryId}/${quantityInKg}`
        );
        break;
      default:
        console.log("Something went wrong !");
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: "10px",
          backgroundColor: handleNotificationColor(notification.type),
        }}
      >
        <CardActionArea
          onClick={() => handleClickNotification()}
          sx={{ p: 1, pl: 2, pr: 2 }}
        >
          <Stack direction="column" justifyContent="space-between" gap={0.5}>
            <TypographyTitle variant="body2" color={auxiliary.dark}>
              {t(`${notification.title}`)}
            </TypographyTitle>
            <Stack
              direction="row"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: "0.8rem" }}
                color={auxiliary.dark}
              >
                {t(`${notification.subtitle}`)}
              </Typography>

              <Arrow fontSize="small" sx={{ fontSize: "18px" }} />
            </Stack>
          </Stack>
        </CardActionArea>
      </Card>
      <AlertDialog
        alertTitle={"No free dispensers."}
        alertContent={"There are no dispensers available."}
        open={!dispsAvailabel}
        handleClose={() => setDispsAvailabel(true)}
        handleAction={() => setDispsAvailabel(true)}
      />
    </>
  );
}
