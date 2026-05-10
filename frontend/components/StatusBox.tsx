import { Box, BoxProps, Typography } from "@mui/material";
import { auxiliary, primary, secondary, error } from "@wac/styles/palette";

interface PropTypes extends BoxProps {
  children: React.ReactNode;
  status: string;
}

export default function StatusBox({ children, status, ...props }: PropTypes) {
  let color: string = "";
  let backgroundColor: string = "";

  switch (status) {
    case "Delivered":
      color = primary.dark;
      backgroundColor = primary.light;
      break;
    case "Pending":
      color = secondary.dark;
      backgroundColor = secondary.light;
      break;
    case "Canceled":
      color = error.main;
      backgroundColor = error.light;
      break;
    case "Empty":
      color = auxiliary.dark;
      backgroundColor = auxiliary.lighter;
      break;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box
        bgcolor={backgroundColor}
        sx={{
          height: 30,
          minWidth: 100,
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        {...props}
      >
        <Typography variant="body2" color={color} fontWeight={600}>
          {children}
        </Typography>
      </Box>
    </Box>
  );
}
