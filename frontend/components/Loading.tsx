import { Box, CircularProgress } from "@mui/material";
import { auxiliary } from "@wac/styles/palette";

interface PropTypes {
  customHeight?: string;
}

export default function Loading({ customHeight }: PropTypes) {
  //console.log(customHeight);
  const height: string = customHeight != undefined ? customHeight : "85vh";
  //console.log(height);
  return (
    <Box
      sx={{
        height: height,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress sx={{ color: auxiliary.main }} />
    </Box>
  );
}
