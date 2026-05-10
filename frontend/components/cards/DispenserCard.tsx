"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { auxiliary, primary } from "@wac/styles/palette";
import { LinearProgressWithLabel } from "@wac/components/linear-progress/LinearProgress";
import { useState } from "react";
import DispenserDrawer from "@wac/components/drawer/DispenserDrawer";
import { ReadDispenser } from "@wac/types/dispenser";
import TypographyTitle from "../typography/TypographyTitle";
import { Stack, Typography } from "@mui/material";
import {
  convertToGrams,
  getDispenserLevel,
  getDispenserMaxCapacity,
} from "@wac/lib/common";

export default function DispenserCard({
  lng,
  dispenser,
  onSucessAlert,
}: {
  lng: string;
  dispenser: ReadDispenser;
  onSucessAlert: (event: boolean, alertText: string) => void;
}) {
  const { t } = useTranslation(lng, "dispensers");

  const isFree = dispenser.isFree;
  const dispVolume = dispenser.volume;
  const ingrDensity = dispenser.ingredientId
    ? dispenser.ingredientId.density
    : 0;
  const currentQuantity = convertToGrams(
    dispenser.quantity.current,
    dispenser.quantity.measureUnit
  );
  const ingrName = dispenser.ingredientId ? dispenser.ingredientId.name : "";
  const ingrIcon = dispenser.ingredientId ? dispenser.ingredientId.icon : "";

  const [iconSrc, setIconSrc] = useState("");
  const [fillDispenser, setFillDispenser] = useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleClickCard = (event: boolean) => {
    if (isFree) {
      setFillDispenser(event);
    } else {
      setDrawerOpen(event);
    }
  };

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

  React.useEffect(() => {
    if (ingrIcon != "") {
      import(`@wac/public/${ingrIcon}`)
        .then((iconModule) => setIconSrc(iconModule.default.src))
        .catch((error) => console.error("Error loading icon:", error));
    }
  }, [ingrIcon]);

  return (
    <>
      <Card
        sx={{
          borderRadius: "10px",
          backgroundColor: isFree ? primary.light : auxiliary.lighter,
        }}
      >
        <CardActionArea onClick={() => handleClickCard(true)}>
          <CardContent
            sx={{
              minHeight: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <TypographyTitle
              variant="body2"
              textAlign={"right"}
              color={isFree ? primary.dark : auxiliary.dark}
            >
              {dispenser.number}
            </TypographyTitle>

            {isFree ? (
              <TypographyTitle variant="body2" color={primary.dark}>
                {t("freeStatus")}
              </TypographyTitle>
            ) : (
              <>
                <Stack direction="row" alignItems={"center"} gap={1}>
                  <Typography variant="body1" color={auxiliary.darker}>
                    {ingrName}
                  </Typography>

                  {ingrIcon != "" && iconSrc != "" && (
                    <Box // Use Box instead of IconButton to avoid nesting buttons
                      sx={{
                        width: 30,
                        height: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img src={iconSrc} />
                    </Box>
                  )}
                </Stack>

                <Box sx={{ width: "70%" }}>
                  <LinearProgressWithLabel
                    value={getDispCurrentLevel(
                      dispVolume,
                      ingrDensity,
                      currentQuantity
                    )}
                  />
                </Box>
              </>
            )}
          </CardContent>
        </CardActionArea>
      </Card>

      {!isFree && (
        <>
          {/* Dispenser Drawer with all information - if not FREE */}
          <DispenserDrawer
            lng={lng}
            openDrawer={drawerOpen}
            onClose={() => {
              setDrawerOpen(false);
            }}
            dispenser={dispenser}
          />
        </>
      )}
    </>
  );
}
