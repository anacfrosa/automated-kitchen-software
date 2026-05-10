"use client";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import StepIcon, { StepIconProps } from "@mui/material/StepIcon";
import Check from "@mui/icons-material/Check";
import { Box, Container } from "@mui/system";
import { styled } from "@mui/material/styles";
import Step from "@mui/material/Step";
import StepperDialogActions from "./StepperDialogActions";
import ConfirmDialog from "../ConfirmDialog";
import { background } from "@wac/styles/palette";
import AlertDialog from "../AlertDialog";
import { useState } from "react";
import { useTranslation } from "@wac/app/i18n/client";

const StepStyled = styled(Step)({
  "& .MuiStepLabel-root .MuiStepIcon-text": { fill: "white" },
  "& .Mui-disabled .MuiStepIcon-root": { color: "#cfcfcf" },
});

const CustomStepIcon = (props: StepIconProps) => {
  const { completed } = props;
  return <>{completed ? <Check color="primary" /> : <StepIcon {...props} />}</>;
};

interface PropsType {
  lng: string;
  title: string;
  stepsLabel: string[];
  steps: React.ReactNode[];
  openDialog: boolean;
  closeDialog: () => void;
  alertCancelDialog: { title: string; content: string };
  sendAction: () => void;
  goToStep2: boolean;
  goToStep3: boolean;
}

export default function StepperDialog(props: PropsType) {
  const { t } = useTranslation(props.lng, "common");
  const [activeStep, setActiveStep] = useState(0); // Handle the different steps
  const [openCancelAlert, setOpenCancelAlert] = useState(false); // Handle alert dialog
  const [openAlertNextStep, setOpenAlertNextStep] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xl"));

  // Handle next and send buttons
  const handleNextButton = () => {
    if (activeStep === props.stepsLabel.length - 1) {
      // Last Step
      props.sendAction(); // Send Button
    } else {
      if (activeStep === 0 && props.goToStep2) {
        // Next button
        setActiveStep((prevActiveStep) => prevActiveStep + 1); // Move to the next step
      } else if (activeStep === 1 && props.goToStep3) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1); // Move to the next step
      } else {
        setOpenAlertNextStep(true);
      }
    }
  };

  // Handle back button
  const handleBackButton = () => {
    // Move to the previous step
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCancelButton = (cancel: boolean) => {
    if (cancel) {
      setOpenCancelAlert(true); // Open alert dialog to confirm the cancelation
    }
  };

  const handleCancelAction = (confirmCancel: boolean) => {
    if (confirmCancel) {
      props.closeDialog();
    }
    setOpenCancelAlert(false);
  };

  // Effect to set activeStep to 0 when openDialog is true
  React.useEffect(() => {
    if (props.openDialog) {
      setActiveStep(0);
    }
  }, [props.openDialog]);

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth={"xl"}
        PaperProps={{ sx: { minHeight: "95vh" } }}
        open={props.openDialog}
      >
        {/* Dialog Header */}
        <Box component={"div"} sx={{ mb: 1 }}>
          <DialogTitle display="flex" justifyContent="center" sx={{ p: 1 }}>
            {props.title}
          </DialogTitle>

          <Container>
            <Stepper activeStep={activeStep}>
              {props.stepsLabel.map((label) => (
                <StepStyled key={label}>
                  <StepLabel StepIconComponent={CustomStepIcon}>
                    {label}
                  </StepLabel>
                </StepStyled>
              ))}
            </Stepper>
          </Container>
        </Box>

        <DialogContent
          dividers
          sx={{
            backgroundColor: background.main,
            minHeight: "510px",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 5 }}>
            {/* Render the current step */}
            {props.steps[activeStep]}
          </Container>
        </DialogContent>
        <DialogActions>
          <StepperDialogActions
            lng={props.lng}
            stepsLabel={props.stepsLabel}
            activeStep={activeStep}
            handleNextButton={handleNextButton}
            handleBackButton={handleBackButton}
            handleCancelButton={handleCancelButton}
          />
        </DialogActions>
      </Dialog>

      {/* CANCEL action */}
      <ConfirmDialog
        alertTitle={props.alertCancelDialog["title"]}
        alertContent={props.alertCancelDialog["content"]}
        open={openCancelAlert}
        handleClose={() => setOpenCancelAlert(false)}
        action1={t("buttons.yes")}
        action2={t("buttons.no")}
        handleAction={handleCancelAction}
      />

      <AlertDialog
        alertTitle={t("alertReception.title")}
        alertContent={t("alertReception.subtitle")}
        open={openAlertNextStep}
        handleClose={() => setOpenAlertNextStep(false)}
        handleAction={() => setOpenAlertNextStep(false)}
      />
    </>
  );
}
