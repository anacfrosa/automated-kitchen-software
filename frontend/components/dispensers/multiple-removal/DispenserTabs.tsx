"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import MuiTab from "@mui/material/Tab";
import { auxiliary, background } from "@wac/styles/palette";
import { jost } from "@wac/styles/theme";
import { Inventory } from "@wac/types/inventory";
import { ReadDispenser } from "@wac/types/dispenser";

export const Tab = styled(MuiTab)(({ theme }) => ({
  marginRight: theme.spacing(1),
  textTransform: "none",
  fontFamily: jost.style.fontFamily,
  fontWeight: 550,
  fontSize: "13px",
  color: auxiliary.darker,
  backgroundColor: "white",
  borderRadius: "10px",
  padding: theme.spacing(1.1), // Adjust the padding as needed
  minHeight: 0,
  "&.Mui-selected": {
    color: theme.palette.secondary.dark,
    backgroundColor: theme.palette.secondary.light,
    border: `1px solid ${theme.palette.secondary.dark}`, // Change border color as needed
  },
  "&:hover": {
    color: theme.palette.secondary.dark,
  },
}));

interface PropsType {
  lng: string;
  tabsList: ReadDispenser[];
  selectedTab: number;
  onSelectedTab: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function DispenserTabs({
  lng,
  tabsList,
  selectedTab,
  onSelectedTab,
}: PropsType) {
  return (
    <>
      {/* <Box sx={{ maxWidth: { xs: 340, sm: 500 }, bgcolor: "white" }}> */}
      <Box sx={{ width: "55%" }}>
        <Tabs
          value={selectedTab}
          onChange={onSelectedTab}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "transparent",
            },
          }}
        >
          {tabsList.map((item, index) => (
            <Tab key={index} label={"D" + item.number.toString()} />
          ))}
        </Tabs>
      </Box>
    </>
  );
}
