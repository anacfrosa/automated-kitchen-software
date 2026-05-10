"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import MuiTab from "@mui/material/Tab";
import { auxiliary, background } from "@wac/styles/palette";
import { jost } from "@wac/styles/theme";
import { getInventoryList } from "./utils";

const Tab = styled(MuiTab)(({ theme }) => ({
  padding: theme.spacing(1.1), // Adjust the padding as needed
  //minHeight: 0,
  //height: "20px",
  marginRight: theme.spacing(1),
  textTransform: "none",
  fontFamily: jost.style.fontFamily,
  fontWeight: 550,
  color: auxiliary.darker,
  backgroundColor: "white",
  borderRadius: "10px",
  "&.Mui-selected": {
    color: theme.palette.secondary.dark,
    backgroundColor: theme.palette.secondary.light,
    border: `1px solid ${theme.palette.secondary.dark}`, // Change border color as needed
    //borderRadius: "10px",
  },
  "&:hover": {
    color: theme.palette.secondary.dark,
  },
}));

interface PropsType {
  lng: string;
  removalList: string[];
  selectedValue: number;
  onSelectedValue: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function RemovalTabs({
  lng,
  removalList,
  selectedValue,
  onSelectedValue,
}: PropsType) {
  //console.log(removalList);

  // Define inventoryList outside of the if block
  const inventoryList = getInventoryList({ inventoryIDList: removalList, lng });

  //console.log(inventoryList);

  return (
    <>
      {/* <Box sx={{ maxWidth: { xs: 340, sm: 500 }, bgcolor: "white" }}> */}
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={selectedValue}
          onChange={onSelectedValue}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "transparent",
            },
          }}
        >
          {inventoryList.map((inventory, index) => {
            const idx = removalList.findIndex((item) => item == inventory.id);
            if (idx !== -1) {
              return (
                <Tab
                  key={index}
                  label={inventory.purchaseInfo.ingredient.name}
                />
              );
            }
          })}
        </Tabs>
      </Box>
    </>
  );
}
