import { TimePicker, TimePickerProps } from "@mui/x-date-pickers/TimePicker";
import { Dayjs } from "dayjs";

interface PropTypes extends TimePickerProps<Dayjs> {}

export default function TimePickerInput({ ...props }: PropTypes) {
  return (
    <>
      <TimePicker
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
