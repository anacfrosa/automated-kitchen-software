import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";

export const CustomDrawer = styled(MuiDrawer)({
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflowX: "hidden",
    width: 400,
  },
});
