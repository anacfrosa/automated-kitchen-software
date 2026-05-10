import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import theme from "@wac/styles/theme";

interface PropTypes {
  lng: string;
  open: boolean;
  onSuccessAlertChange: (event: boolean, alertText: string) => void;
  alertText: string;
}

export default function SuccessAlert({
  lng,
  open,
  onSuccessAlertChange,
  alertText,
}: PropTypes) {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    onSuccessAlertChange(false, "");
  };
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{
            minWidth: "250px",
            // color: theme.palette.primary.dark,
            // backgroundColor: theme.palette.primary.light,
            color: "white",
            backgroundColor: theme.palette.primary.main,
            fontWeight: 600,
          }}
        >
          {alertText}
        </Alert>
      </Snackbar>
    </>
  );
}
