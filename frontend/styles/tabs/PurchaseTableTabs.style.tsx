import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";
import { auxiliary, background } from "../palette";

export const CustomTabs = styled(Tabs)({
  borderBottom: "1px solid",
  borderBottomColor: auxiliary.light,
  "& .MuiTabs-indicator": {
    backgroundColor: auxiliary.dark,
    height: 1,
  },
});

export const CustomTab = styled(MuiTab)(({ theme }) => ({
  textTransform: "none",
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  padding: 5,
  minWidth: 0,
  fontWeight: 500,
  color: auxiliary.main,
  "&:hover": {
    color: auxiliary.dark,
    opacity: 1,
  },
  "&.Mui-selected": {
    color: auxiliary.dark,
  },
}));
