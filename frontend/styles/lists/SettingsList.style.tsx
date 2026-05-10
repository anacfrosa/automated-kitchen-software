import MuiListItemButton from "@mui/material/ListItemButton";
import { styled } from "@mui/material/styles";
import theme from "../theme";

export const StyledListItemButton = styled(MuiListItemButton)({
  height: 50,
  borderRadius: "10px",
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.light,
  },
});
