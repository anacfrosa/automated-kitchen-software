import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";

export const CustomFilterDrawer = styled(MuiDrawer)({
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflowX: "hidden",
    width: 380,
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Sets the backdrop color
  },
});
