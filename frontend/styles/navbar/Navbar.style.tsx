import { styled } from "@mui/material/styles";
import MuiToolbar from "@mui/material/Toolbar";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { auxiliary, background } from "../palette";

const MARGIN = 110;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export const AppBarStyled = styled(MuiAppBar)<AppBarProps>(
  ({ theme, open }) => ({
    zIndex: theme.zIndex.drawer,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: background.main,
    ...(open && {
      marginLeft: MARGIN,
      width: `calc(100% - ${MARGIN}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

// export const AppBarStyled = styled(MuiAppBar)(({ theme }) => ({
//   zIndex: theme.zIndex.drawer,
//   backgroundColor: background.main,
// }));

export const ToolbarStyled = styled(MuiToolbar)({
  //width: `calc(100% - ${DRAWER_WIDTH}px)`,
  marginLeft: MARGIN, // because of the sidebar
  backgroundColor: background.main,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
});

// To make the content not invisible behind the app bar.
export const OffsetStyled = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
