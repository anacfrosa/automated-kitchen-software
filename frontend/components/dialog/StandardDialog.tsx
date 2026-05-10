"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { auxiliary } from "@wac/styles/palette";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import OutlinedButton from "../buttons/OutlinedButton";
import ConfirmDialog from "./ConfirmDialog";
import ContainedButton from "../buttons/ContainedButton";

interface PropsType extends DialogProps {
  children: React.ReactNode;
  lng: string;
  title: string;
  containerWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  closeDialog: () => void;
  alertCancelDialog: { title: string; content: string };
  submitAction: () => void;
}

export default function StandardDialog({
  children,
  lng,
  title,
  containerWidth,
  closeDialog,
  alertCancelDialog,
  submitAction,
  ...props
}: PropsType) {
  const { t } = useTranslation(lng, "common");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xl"));

  const [confirmCancel, setConfirmCancel] = React.useState(false); // Handle alert dialog

  const handleCancelButton = (cancel: boolean) => {
    if (cancel) {
      setConfirmCancel(true); // Open alert dialog to confirm the cancelation
    }
  };

  const handleCancelAction = (confirmCancel: boolean) => {
    if (confirmCancel) {
      closeDialog();
    }
    setConfirmCancel(false);
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth={"xl"}
        PaperProps={{ sx: { minHeight: "95vh" } }}
        {...props}
      >
        {/* Dialog Header */}
        <DialogTitle display="flex" justifyContent="center">
          {title}
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            backgroundColor: auxiliary.lighter,
            minHeight: "500px",
          }}
        >
          <Container
            maxWidth={containerWidth != undefined ? containerWidth : "lg"}
          >
            {children}
          </Container>
        </DialogContent>
        <DialogActions>
          <Box
            width="100%"
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
          >
            <OutlinedButton
              colorType="secondary"
              buttonSize="small"
              onClick={() => handleCancelButton(true)}
            >
              {t("buttons.cancel")}
            </OutlinedButton>

            <ContainedButton buttonSize="small" onClick={submitAction}>
              {t("buttons.submit")}
            </ContainedButton>
          </Box>
        </DialogActions>
      </Dialog>

      {/* CANCEL action */}
      <ConfirmDialog
        alertTitle={alertCancelDialog["title"]}
        alertContent={alertCancelDialog["content"]}
        open={confirmCancel}
        handleClose={() => setConfirmCancel(false)}
        action1={t("buttons.yes")}
        action2={t("buttons.no")}
        handleAction={handleCancelAction}
      />
    </>
  );
}
