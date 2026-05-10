import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import theme from "@wac/styles/theme";

interface PropTypes {
  open: boolean;
  onAlertChange: (event: boolean) => void;
  alertText: string;
}

export default function TemporaryAlert({
  open,
  onAlertChange,
  alertText,
}: PropTypes) {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    onAlertChange(false);
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
