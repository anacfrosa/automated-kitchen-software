"use client";
import { styled } from "@mui/material/styles";
import MuiTextField from "@mui/material/TextField";

export const CustomTextField = styled(MuiTextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
  },
  "& .MuiFormLabel-root": {
    fontSize: "14.5px",
  },
  "& .MuiInputBase-root": {
    fontSize: "14.5px", // Example custom style
  },
});
