import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Divider, Popover, PopoverProps } from "@mui/material";
import { auxiliary, background } from "@wac/styles/palette";

interface PropsType extends PopoverProps {
  optionsMenu: { label: string; value: string }[];
  open: boolean;
  anchorEl: null | HTMLElement;
  onAnchorElChange: (event: React.MouseEvent<HTMLButtonElement> | null) => void;
  onSelectedOption: (action: string) => void;
}

export default function BasicMenu({
  optionsMenu,
  open,
  anchorEl,
  onAnchorElChange,
  onSelectedOption,
  ...props
}: PropsType) {
  const handleClose = () => {
    onAnchorElChange(null);
  };

  const handleSelectedItem = (action: string) => {
    console.log(action);
    onSelectedOption(action);
    handleClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "10px",
            background: "rgba(242, 247, 233)",
          },
        },
      }}
      {...props}
    >
      {optionsMenu.map((option, index) => (
        <React.Fragment key={index}>
          <MenuItem
            onClick={() => handleSelectedItem(option.value)}
            sx={{ typography: "body2" }}
          >
            {option.label}
          </MenuItem>
        </React.Fragment>
      ))}
    </Popover>
  );
}
