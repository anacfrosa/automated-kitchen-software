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
  buttonSize?: string; // small , medium, auxiliary, fullwidth (default)
  colorType?: string; // primary (default), secondary
  icon?: boolean;
  transparent?: boolean;
}

export default function TextButton({
  children,
  buttonSize,
  colorType,
  icon,
  transparent,
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
      borderColor = "white";
      hoverColor = theme.palette.secondary.light;
      break;
    case "auxiliary":
      color = auxiliary.dark;
      backgroundColor = "white";
      borderColor = "white";
      hoverColor = auxiliary.lighter;
      break;
    default:
      color = theme.palette.primary.main;
      backgroundColor = "white";
      borderColor = "white";
      hoverColor = theme.palette.primary.light;
      break;
  }

  // Select sizes
  let width: string = "";
  let height: string = "";
  switch (buttonSize) {
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
        variant="text"
        sx={{
          textTransform: "none",
          fontSize: buttonFontSize,
          width: width,
          height: height,
          backgroundColor: !transparent ? backgroundColor : "transparent",
          "&.MuiButton-text": {
            color: color,
            borderColor: !transparent ? borderColor : "transparent",
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
