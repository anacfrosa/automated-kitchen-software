import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider } from "@mui/material";
import OutlinedButton from "../buttons/OutlinedButton";

interface PropsType {
  alertTitle: string;
  alertContent: React.ReactNode | string;
  open: boolean;
  handleClose: any;
  action1: string;
  action2: string;
  handleAction: (event: boolean) => void;
}

export default function ConfirmDialog({
  alertTitle,
  alertContent,
  open,
  handleClose,
  action1,
  action2,
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
        <DialogTitle>{alertTitle}</DialogTitle>
        <Divider />
        <DialogContent>
          {/* <DialogContentText>{alertContent}</DialogContentText> */}
          {alertContent}
        </DialogContent>
        <DialogActions>
          {action2 !== "" && (
            // <AuxMainSmallBttn
            //   variant="outlined"
            //   onClick={() => handleAction(false)}
            // >
            //   {action2}
            // </AuxMainSmallBttn>
            <OutlinedButton
              onClick={() => handleAction(false)}
              buttonSize={"small"}
              colorType="secondary"
            >
              {action2}
            </OutlinedButton>
          )}
          <OutlinedButton
            onClick={() => handleAction(true)}
            buttonSize={"small"}
          >
            {action1}
          </OutlinedButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
