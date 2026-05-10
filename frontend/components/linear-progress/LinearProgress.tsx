import Box from "@mui/material/Box";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import theme from "@wac/styles/theme";

export function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  let color: LinearProgressProps["color"];

  if (props.value < 30) {
    color = "error";
  } else if (props.value >= 30 && props.value < 60) {
    color = "secondary";
  } else {
    color = "primary";
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} color={color} />
      </Box>
      <Box sx={{ width: 0 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
