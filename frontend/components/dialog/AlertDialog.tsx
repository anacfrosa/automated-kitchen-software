import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider } from "@mui/material";
import OutlinedButton from "../buttons/OutlinedButton";
import { auxiliary } from "@wac/styles/palette";

interface PropsType {
  alertTitle: string;
  alertContent: string;
  open: boolean;
  handleClose: any;
  handleAction: (event: boolean) => void;
}

export default function AlertDialog({
  alertTitle,
  alertContent,
  open,
  handleClose,
  handleAction,
}: PropsType) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle color={"secondary"}>{alertTitle}</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText sx={{ color: auxiliary.dark }}>
            {alertContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <OutlinedButton
            onClick={() => handleAction(false)}
            buttonSize={"small"}
            colorType="secondary"
          >
            Ok
          </OutlinedButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
