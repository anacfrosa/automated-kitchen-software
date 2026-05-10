import { Box, Divider, Stack } from "@mui/material";
import { FormValuesType } from "./utils";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import theme from "@wac/styles/theme";

export const ReceptionList = (
  validReception: boolean,
  list: FormValuesType[]
) => {
  if (validReception) {
    return (
      <Box display={"flex"} flexDirection={"column"} sx={{ p: 1 }}>
        <TypographyTitle
          variant="body1"
          color={theme.palette.primary.main}
          sx={{ mb: 1 }}
        >
          Ingredients Accepted
        </TypographyTitle>
        {list.map((obj, index) => {
          const itemId = Object.keys(obj)[0]; // Get the itemId from the object key
          const isAccepted = obj[itemId].isAccepted;
          const ingredient = obj[itemId].ingredient;

          return isAccepted && <li key={index}>{ingredient}</li>;
        })}
      </Box>
    );
  }

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      sx={{ p: 1, pr: 3, pl: 3 }}
    >
      <Box display={"flex"} flexDirection={"column"}>
        <TypographyTitle
          variant="body1"
          color={theme.palette.primary.main}
          sx={{ mb: 1 }}
        >
          Ingredients Accepted
        </TypographyTitle>
        {list.map((obj, index) => {
          const itemId = Object.keys(obj)[0]; // Get the itemId from the object key
          const isAccepted = obj[itemId].isAccepted;
          const ingredient = obj[itemId].ingredient;

          return isAccepted && <li key={index}>{ingredient}</li>;
        })}
      </Box>

      <Divider orientation="vertical" variant="middle" flexItem />

      <Box display={"flex"} flexDirection={"column"}>
        <TypographyTitle
          variant="body1"
          color={theme.palette.secondary.main}
          sx={{ mb: 1 }}
        >
          Ingredients Rejected
        </TypographyTitle>
        {list.map((obj, index) => {
          const itemId = Object.keys(obj)[0]; // Get the itemId from the object key
          const isAccepted = obj[itemId].isAccepted;
          const ingredient = obj[itemId].ingredient;

          return !isAccepted && <li key={index}>{ingredient}</li>;
        })}
      </Box>
    </Stack>
  );
};
