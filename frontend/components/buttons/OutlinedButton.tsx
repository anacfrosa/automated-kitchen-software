import Button, { ButtonProps } from "@mui/material/Button";
import { auxiliary } from "@wac/styles/palette";
import theme from "@wac/styles/theme";
import {
  buttonFontSize,
  mediumbutton,
  mediumbuttonIcon,
  smallbutton,
  smallbuttonIcon,
} from "./button-sizes";

interface PropTypes extends ButtonProps {
  children: React.ReactNode;
  buttonSize?: string; // small , medium, fullwidth (default)
  colorType?: string; // primary (default), secondary
  icon?: boolean;
}

export default function OutlinedButton({
  children,
  buttonSize,
  colorType,
  icon,
  ...props
}: PropTypes) {
  // Select Colors
  let color: string = "";
  let backgroundColor: string = "";
  let borderColor: string = "";
  let hoverColor: string = "";

  switch (colorType) {
    case "secondary":
      color = theme.palette.secondary.main;
      backgroundColor = "white";
      borderColor = theme.palette.secondary.main;
      hoverColor = "white";
      break;
    case "auxiliary":
      color = auxiliary.dark;
      backgroundColor = "white";
      borderColor = auxiliary.dark;
      hoverColor = auxiliary.lighter;
      break;
    default:
      color = theme.palette.primary.main;
      backgroundColor = "white";
      borderColor = theme.palette.primary.main;
      hoverColor = "white";
      break;
  }

  // Select sizes
  let width: string = "";
  let height: string = "";
  switch (buttonSize) {
    case "smaller":
      width = "80px";
      height = smallbutton.height;
      break;
    case "small":
      width = !icon ? smallbutton.width : smallbuttonIcon.width;
      height = !icon ? smallbutton.height : smallbuttonIcon.height;
      break;
    case "medium":
      width = !icon ? mediumbutton.width : mediumbuttonIcon.width;
      height = !icon ? mediumbutton.height : mediumbuttonIcon.height;
      break;
    default:
      width = "100%";
      height = !icon ? smallbutton.height : smallbuttonIcon.height;
      break;
  }

  return (
    <>
      <Button
        variant="outlined"
        sx={{
          textTransform: "none",
          fontSize: buttonFontSize,
          width: width,
          height: height,
          backgroundColor: backgroundColor,
          "&.MuiButton-outlined": {
            color: color,
            borderColor: borderColor,
            "&:hover": {
              backgroundColor: hoverColor,
            },
          },
        }}
        {...props}
      >
        {children}
      </Button>
    </>
  );
}
