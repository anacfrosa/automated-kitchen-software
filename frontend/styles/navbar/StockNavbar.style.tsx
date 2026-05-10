import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";
import { auxiliary, background } from "../palette";

export const CustomTabs = styled(Tabs)({
  borderBottom: "1px solid",
  borderBottomColor: auxiliary.light,
  backgroundColor: "rgba(242, 247, 233)",
  paddingTop: 10,
});

export const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: "none",
  marginRight: theme.spacing(5),
  padding: 6,
  minWidth: 0,
  [theme.breakpoints.up("sm")]: {
    minWidth: 0,
  },
  fontSize: 15,
  color: auxiliary.dark,
  "&:hover": {
    color: theme.palette.primary.dark,
    opacity: 1,
  },
}));
