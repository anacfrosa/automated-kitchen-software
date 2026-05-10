import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import MuiListItemButton from "@mui/material/ListItemButton";
import MuiDrawer from "@mui/material/Drawer";

const DRAWER_WIDTH = 220;
const TEMPORARY_DRAWER_WIDTH = 220;

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  //width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": open
    ? {
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: DRAWER_WIDTH,
      }
    : {
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: `calc(${theme.spacing(7)} + 1px)`, // Adjust this value if needed
        [theme.breakpoints.up("sm")]: {
          width: `calc(${theme.spacing(8)} + 1px)`,
        },
      },
}));

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const DrawerList = styled(List)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "80%",
  //backgroundColor: "red",
});

export const ListButton = styled(MuiListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    "&:hover": {
      backgroundColor: "#ffffff",
    },
    backgroundColor: "#ffffff",
    color: theme.palette.primary.main,
    borderLeft: `6px solid ${theme.palette.primary.main}`,

    ".MuiListItemIcon-root": {
      color: theme.palette.primary.main,
    },
  },
  borderLeft: "6px solid #ffffff",
  "&:hover": {
    borderLeft: `6px solid ${theme.palette.primary.main}`,
  },
}));

export const StyledLink = styled("a")({
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
});

export const TemporaryDrawer = styled(MuiDrawer)(({ theme }) => ({
  //zIndex: theme.zIndex.drawer + 1,
  width: TEMPORARY_DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    width: TEMPORARY_DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  },
}));
