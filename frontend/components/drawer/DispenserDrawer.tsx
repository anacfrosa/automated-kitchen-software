"use client";
import * as React from "react";
import {
  Box,
  CardMedia,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "@wac/app/i18n/client";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import { CustomDrawer } from "@wac/styles/drawers/Drawer.style";
import Scrollbar from "../Scrollbar";
import { LinearProgressWithLabel } from "../linear-progress/LinearProgress";
import theme, { jost } from "@wac/styles/theme";
import TypographyTitle from "../typography/TypographyTitle";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ReadDispenser } from "@wac/types/dispenser";
import {
  DisplayQuantity,
  convertToGrams,
  getDispenserLevel,
  getDispenserMaxCapacity,
} from "@wac/lib/common";
import OutlinedButton from "../buttons/OutlinedButton";
import { lotNumberList } from "@wac/lib/interfaces/inventory.interface";
import { findLotsInDispenser } from "@wac/utils/api/dispensers.api";
import { fDateDDMMYYYYTime } from "@wac/lib/format-date";
import AlertDialog from "../dialog/AlertDialog";
import ContainedButton from "../buttons/ContainedButton";

interface PropsType {
  lng: string;
  openDrawer: boolean;
  onClose: any;
  dispenser: ReadDispenser;
}

export default function DispensersDrawer({
  lng,
  openDrawer,
  onClose,
  dispenser,
}: PropsType) {
  const { t } = useTranslation(lng, "dispensers");

  const router = useRouter();
  const pathname = usePathname();

  let imagePath = "";

  const dispVolume = dispenser.volume;
  const ingrDensity = dispenser.ingredientId
    ? dispenser.ingredientId.density
    : 0;
  const currentQuantity = convertToGrams(
    dispenser.quantity.current,
    dispenser.quantity.measureUnit
  );

  const [imageSrc, setImageSrc] = useState(null);
  // Store all the inventories that are inside the selected dispenser
  const [lotsList, setLotsList] = useState<lotNumberList[]>([]);
  const [refillAvailable, setReffilAvailable] = useState<boolean>(true);
  const [fullDispenser, setFullDispenser] = useState<boolean>(false);
  const [insufficientQty, setInsufficientQty] = useState<boolean>(false);

  // Get all the lots that are on this dispenser
  const { lots, isLotsLoading, isLotsError } = findLotsInDispenser(
    lng,
    dispenser.id
  );

  const getDispCurrentLevel = (
    dispVolume: number,
    ingrDensity: number,
    currentQty: number
  ) => {
    const maxCapacity: number = getDispenserMaxCapacity(
      dispVolume,
      ingrDensity
    );
    const percentageLevel: number = getDispenserLevel(currentQty, maxCapacity);
    return percentageLevel;
  };

  const checkRefillAvailable = () => {
    // Assuming getDispCurrentLevel returns a number
    const currentLevel = getDispCurrentLevel(
      dispVolume,
      ingrDensity,
      currentQuantity
    );
    // Convert to integer
    const isFull: boolean = Math.floor(currentLevel) == 100 ? true : false;

    if (!isFull) {
      setFullDispenser(false);
      if (lotsList.length == 1) {
        const quantityInInventory = lotsList[0].currentQty;
        if (quantityInInventory != 0) {
          setReffilAvailable(true);
          setInsufficientQty(false);
          router.push(
            `/${lng}/maintenance/storage/dispensers/refill/${dispenser.id}/${lotsList[0].inventoryId}`
          );
        } else {
          setInsufficientQty(true);
        }
      } else {
        setReffilAvailable(false);
      }
    } else {
      setFullDispenser(true);
    }
  };

  useEffect(() => {
    if (!isLotsLoading && !isLotsError && lots) {
      setLotsList(lots);
    }
  }, [isLotsLoading, isLotsError]);

  React.useEffect(() => {
    if (dispenser.ingredientId != null) {
      imagePath = dispenser.ingredientId.image;

      // Dynamically import the image based on the imagePath
      import(`@wac/public/${imagePath}`)
        .then((imageModule) => setImageSrc(imageModule.default.src))
        .catch((error) => console.error("Error loading image:", error));
    }
  }, [imagePath]);

  // Render null if imageSrc is not available yet
  if (!imageSrc) return null;

  return (
    <>
      <CustomDrawer anchor="right" open={openDrawer} onClose={onClose}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2, pl: 3 }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            fontFamily={jost.style.fontFamily}
            //color={theme.palette.primary.dark}
          >
            {t("drawer.title")} {dispenser.number}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack direction={"column"} spacing={3} sx={{ p: 3 }}>
            {/* INGREDIENT DETAILS */}
            <Stack direction={"row"} gap={3}>
              <CardMedia
                sx={{
                  height: 100,
                  width: "50%",
                  borderRadius: "10px",
                }}
                image={imageSrc}
                title="ingredient image"
              />

              <Stack direction={"column"} gap={1.5} width={"100%"}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Stack direction={"column"} gap={1}>
                    <TypographyTitle variant="body2">
                      {t("drawer.ingredient")}
                    </TypographyTitle>
                    <Typography variant="body2">
                      {dispenser.ingredientId
                        ? dispenser.ingredientId.name
                        : ""}
                    </Typography>
                  </Stack>
                  <Stack direction={"column"} gap={1}>
                    <TypographyTitle variant="body2">
                      {t("drawer.form")}
                    </TypographyTitle>
                    <Typography variant="body2">
                      {dispenser.ingredientId
                        ? dispenser.ingredientId.form
                        : ""}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction={"column"} gap={0.5}>
                  <TypographyTitle variant="body2">
                    {t("drawer.level")}
                  </TypographyTitle>
                  <Box sx={{ width: "45%" }}>
                    <LinearProgressWithLabel
                      value={getDispCurrentLevel(
                        dispVolume,
                        ingrDensity,
                        currentQuantity
                      )}
                    />
                  </Box>
                </Stack>
              </Stack>
            </Stack>

            <Divider />

            {/* INGREDIENT DATES */}
            <Stack direction={"column"} gap={2}>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <TypographyTitle variant="body2">
                  {t("drawer.fillDate")}
                </TypographyTitle>
                <Typography variant="body2">
                  {fDateDDMMYYYYTime({
                    datetime: dispenser.fillDate,
                  })}
                </Typography>
              </Stack>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <TypographyTitle variant="body2">
                  {t("drawer.secDate")}
                </TypographyTitle>
                <Typography variant="body2">
                  {fDateDDMMYYYYTime({
                    datetime: dispenser.expiryDate,
                  })}
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            <Stack direction={"column"} gap={2}>
              {/* MAX CAPACITY */}
              <Stack direction={"row"} justifyContent={"space-between"}>
                <TypographyTitle variant="body2">
                  {t("drawer.maxCap")}
                </TypographyTitle>
                <Typography variant="body2">
                  {getDispenserMaxCapacity(dispVolume, ingrDensity) / 1000 +
                    " kg"}
                </Typography>
              </Stack>

              {/* CURRENT QUANTITY */}
              <Stack direction={"row"} justifyContent={"space-between"}>
                <TypographyTitle variant="body2">
                  {t("drawer.currQty")}
                </TypographyTitle>
                <Typography variant="body2">
                  {DisplayQuantity(
                    dispenser.quantity.current,
                    dispenser.quantity.measureUnit
                  )}
                </Typography>
              </Stack>

              {/* LOT NUMBERS */}
              {lotsList.map((item, index) => (
                <Stack
                  key={index}
                  direction={"row"}
                  justifyContent={"space-between"}
                >
                  <Stack direction={"row"} alignItems={"center"} gap={0.5}>
                    <TypographyTitle variant="body2">
                      {t("drawer.lotNumber")}
                    </TypographyTitle>
                    <IconButton
                      size="small"
                      href={`/${lng}/maintenance/storage/inventory/details/${item.inventoryId}`}
                    >
                      <InfoIcon
                        fontSize="small"
                        sx={{ color: theme.palette.primary.dark }}
                      />
                    </IconButton>
                  </Stack>
                  <Typography variant="body2">{item.lotNumber}</Typography>
                </Stack>
              ))}
            </Stack>

            <Divider />

            <Stack direction={"column"} gap={2}>
              {/* TEMPERATURE */}
              <Stack direction={"row"} justifyContent={"space-between"}>
                <TypographyTitle variant="body2">
                  {t("drawer.temperature")}
                </TypographyTitle>
                <Typography variant="body2">10ºC</Typography>
              </Stack>

              {/* HUMIDITY */}
              <Stack direction={"row"} justifyContent={"space-between"}>
                <TypographyTitle variant="body2">
                  {t("drawer.humidity")}
                </TypographyTitle>
                <Typography variant="body2">20%</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Scrollbar>

        <Divider />

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          sx={{ p: 1.5, px: 3 }}
        >
          <ContainedButton buttonSize={"small"} onClick={checkRefillAvailable}>
            {t("drawer.refillBtt")}
          </ContainedButton>

          <ContainedButton
            buttonSize={"small"}
            colorType={"secondary"}
            href={`${pathname}/remove/${dispenser.id}`}
          >
            {t("drawer.removeBtt")}
          </ContainedButton>
        </Stack>
      </CustomDrawer>

      <AlertDialog
        alertTitle={t("refillNotAllowed.title")}
        alertContent={t("refillNotAllowed.content1")}
        open={!refillAvailable}
        handleClose={() => setReffilAvailable(true)}
        handleAction={() => setReffilAvailable(true)}
      />

      <AlertDialog
        alertTitle={t("refillNotAllowed.title")}
        alertContent={t("refillNotAllowed.content2")}
        open={fullDispenser}
        handleClose={() => setFullDispenser(false)}
        handleAction={() => setFullDispenser(false)}
      />

      <AlertDialog
        alertTitle={t("refillNotAllowed.title")}
        alertContent={t("refillNotAllowed.content3")}
        open={insufficientQty}
        handleClose={() => setInsufficientQty(false)}
        handleAction={() => setInsufficientQty(false)}
      />
    </>
  );
}
