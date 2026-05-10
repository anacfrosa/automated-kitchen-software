"use client";
import * as React from "react";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import OutlinedButton from "@wac/components/buttons/OutlinedButton";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  lng: string;
  stepsLabel: string[];
  activeStep: number;
  handleNextButton: () => void;
  handleBackButton: () => void;
  handleCancelButton: (cancel: boolean) => void;
}

export default function StepperDialogActions({
  lng,
  stepsLabel,
  activeStep,
  handleNextButton,
  handleBackButton,
  handleCancelButton,
}: PropsType) {
  const { t } = useTranslation(lng, "common");
  return (
    <Box width="100%">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <OutlinedButton
          buttonSize="small"
          colorType="secondary"
          onClick={() => handleCancelButton(true)}
        >
          {t("buttons.cancel")}
        </OutlinedButton>

        <Stack
          direction="row-reverse"
          justifyContent="flex-start"
          alignItems="center"
          spacing={3}
        >
          {activeStep === stepsLabel.length - 1 ? (
            <ContainedButton buttonSize="small" onClick={handleNextButton}>
              {t("buttons.submit")}
            </ContainedButton>
          ) : (
            <ContainedButton buttonSize="small" onClick={handleNextButton}>
              {t("buttons.next")}
            </ContainedButton>
          )}

          <ContainedButton
            buttonSize="small"
            colorType="auxiliary"
            disabled={activeStep == 0}
            onClick={handleBackButton}
          >
            {t("buttons.back")}
          </ContainedButton>
        </Stack>
      </Stack>
    </Box>
  );
}
