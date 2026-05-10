import Button, { ButtonProps } from "@mui/material/Button";
import theme from "@wac/styles/theme";
import {
  buttonFontSize,
  mediumbutton,
  mediumbuttonIcon,
  smallbutton,
  smallbuttonIcon,
} from "./button-sizes";
import { auxiliary } from "@wac/styles/palette";

interface PropTypes extends ButtonProps {
  children: React.ReactNode;
  buttonSize?: string; // small , medium, fullwidth (default)
  colorType?: string; // primary (default), secondary
  icon?: boolean;
}

export default function ContainedButton({
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
      color = "white";
      backgroundColor = theme.palette.secondary.main;
      borderColor = theme.palette.secondary.main;
      hoverColor = theme.palette.secondary.dark;
      break;
    case "auxiliary":
      color = "white";
      backgroundColor = auxiliary.main;
      borderColor = auxiliary.main;
      hoverColor = auxiliary.dark;
      break;
    default:
      color = "white";
      backgroundColor = theme.palette.primary.main;
      borderColor = theme.palette.primary.main;
      hoverColor = theme.palette.primary.dark;
      break;
  }

  // Select sizes
  let width: string = "";
  let height: string = "";
  switch (buttonSize) {
    case "smaller":
      width = "75px";
      height = "30px";
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
        variant="contained"
        sx={{
          textTransform: "none",
          fontSize: buttonFontSize,
          width: width,
          height: height,
          backgroundColor: backgroundColor,
          "&.MuiButton-contained": {
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
