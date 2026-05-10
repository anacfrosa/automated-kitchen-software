import { OutlinedInput, OutlinedInputProps } from "@mui/material";
import { IconButton, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { auxiliary } from "@wac/styles/palette";

interface PropTypes extends OutlinedInputProps {
  maxWidth?: number;
  onClear: () => void; // Callback function to handle clearing text
}

export default function SearchInput({
  maxWidth,
  onClear,
  ...props
}: PropTypes) {
  return (
    <>
      <OutlinedInput
        name="name"
        value={props.value}
        size="small"
        fullWidth
        sx={{
          maxWidth: maxWidth,
          borderRadius: "12px",
          fontSize: "14.5px",
          mr: 4,
        }}
        startAdornment={
          <InputAdornment position="start">
            <IconButton
              disabled
              sx={{
                "&.Mui-disabled": {
                  color: auxiliary.dark,
                },
              }}
            >
              <SearchIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          </InputAdornment>
        }
        endAdornment={
          props.value ? (
            <InputAdornment position="end">
              <IconButton onClick={onClear}>
                <ClearIcon sx={{ fontSize: "16px" }} />
              </IconButton>
            </InputAdornment>
          ) : null
        }
        {...props}
      />
    </>
  );
}
