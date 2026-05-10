import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

interface PropTypes extends DatePickerProps<Dayjs> {}

export default function DatePickerInput({ ...props }: PropTypes) {
  return (
    <>
      <DatePicker
        format="DD-MM-YYYY"
        slotProps={{ textField: { size: "small", fullWidth: true } }}
        sx={{
          "& .MuiSvgIcon-root": { fontSize: 19 },
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
          },
          "& .MuiFormLabel-root": {
            fontSize: "14.5px", // Change the label font size here
          },
        }}
        {...props}
      />
    </>
  );
}
