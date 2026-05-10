import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { FixedSizeList } from "react-window";
import {
  Box,
  CircularProgress,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import MuiListItemButton from "@mui/material/ListItemButton";
import { styled } from "@mui/material/styles";
import theme from "@wac/styles/theme";
import { SHOPID } from "@wac/lib/api/shops.api";
import { auxiliary } from "@wac/styles/palette";
import { useEffect, useState } from "react";
import { ReadDispenser } from "@wac/types/dispenser";
import { getDispenserByShop } from "@wac/utils/api/dispensers.api";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
const ListItemButton = styled(MuiListItemButton)({
  height: 42,
  borderRadius: "10px",
  "&.Mui-selected": {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.dark,
  },
});

interface PropsType {
  lng: string;
  selectedDispensers: ReadDispenser[];
  onSelectedDispensersChange: (selectedList: ReadDispenser[]) => void;
}

export default function DispensersList({
  lng,
  selectedDispensers,
  onSelectedDispensersChange,
}: PropsType) {
  // Fetching dispensers by shopId
  const { dispensers, isLoading, isError } = getDispenserByShop(lng, SHOPID);

  const [filledDispensers, setFilledDispensers] = useState<ReadDispenser[]>([]);
  const [selectedIndices, setSelected] = useState<number[]>([]);

  const toggleSelectedIndex = (index: number) => {
    const selectedIndex = selectedIndices.indexOf(index);
    const newSelectedIndices = [...selectedIndices];

    if (selectedIndex === -1) {
      newSelectedIndices.push(index);
      onSelectedDispensersChange([
        ...selectedDispensers,
        filledDispensers[index],
      ]);
    } else {
      newSelectedIndices.splice(selectedIndex, 1);
      onSelectedDispensersChange(
        selectedDispensers.filter((item, i) => i !== selectedIndex)
      );
    }

    setSelected(newSelectedIndices);
  };

  useEffect(() => {
    if (!isLoading && !isError) {
      setFilledDispensers(
        dispensers.filter(
          (dispenser: ReadDispenser) => dispenser.ingredientId !== null
        )
      );
    }
  }, [dispensers]);

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: "10px",
        width: "250px",
        minHeight: "450px",
      }}
    >
      <Box
        sx={{ p: 3, pb: 1 }}
        display={"flex"}
        flexDirection={"column"}
        gap={2}
      >
        <TypographyTitle variant="body1">Dispensers</TypographyTitle>

        <Stack direction={"row"} gap={5}>
          <TypographyTitle variant="body2">Number</TypographyTitle>
          <TypographyTitle variant="body2">Ingredient</TypographyTitle>
        </Stack>
      </Box>

      {filledDispensers.length !== 0 ? (
        <FixedSizeList
          height={350}
          width={250}
          itemSize={46}
          itemCount={filledDispensers.length}
          overscanCount={5}
        >
          {({ index, style }) => (
            <ListItem
              style={style}
              key={index}
              component="div"
              disablePadding
              sx={{ p: 2 }}
            >
              <ListItemButton
                selected={selectedIndices.includes(index)}
                onClick={() => {
                  toggleSelectedIndex(index);
                }}
              >
                <ListItemText
                  primary={
                    <Stack direction={"row"} gap={8}>
                      <Typography variant="body2" fontWeight={500}>
                        D{filledDispensers[index].number}
                      </Typography>

                      <Typography variant="body2" fontWeight={500}>
                        {filledDispensers[index].ingredientId.name}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItemButton>
            </ListItem>
          )}
        </FixedSizeList>
      ) : (
        <Box
          height={300}
          width={250}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: auxiliary.main }} />
        </Box>
      )}
    </Paper>
  );
}
