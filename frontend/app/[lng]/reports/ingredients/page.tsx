"use client";
import { useRef } from "react";
import { useTranslation } from "@wac/app/i18n/client";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ConsumptionPlot from "@wac/components/reports/ConsumptionPlot";
import WastagePlot from "@wac/components/reports/WastagePlot";
import OutlinedButton from "@wac/components/buttons/OutlinedButton";
import TextButton from "@wac/components/buttons/TextButton";
import ContainedButton from "@wac/components/buttons/ContainedButton";

interface PropsType {
  params: { lng: string };
}

export default function IngredientsPage({ params: { lng } }: PropsType) {
  const { t } = useTranslation(lng, "reports");

  const wastageRef = useRef<HTMLDivElement>(null);
  const consumptionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Paper elevation={0} sx={{ p: 2, borderRadius: "10px", mb: 3 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">{t("ingrReports")}</Typography>
          <Stack direction={"row"} gap={2}>
            <ContainedButton
              buttonSize="small"
              colorType="secondary"
              onClick={() => scrollToSection(wastageRef)}
            >
              {t("buttons.wastage")}
            </ContainedButton>
            <ContainedButton
              buttonSize="small"
              colorType="primary"
              onClick={() => scrollToSection(consumptionRef)}
            >
              {t("buttons.consumption")}
            </ContainedButton>
          </Stack>
        </Stack>
      </Paper>

      {/* Wastage Plot */}
      <div ref={wastageRef} id="wastage-section">
        <WastagePlot lng={lng} />
      </div>

      {/* Consumption Plot  */}
      <div ref={consumptionRef} id="consumption-section">
        <ConsumptionPlot lng={lng} />
      </div>
    </>
  );
}
