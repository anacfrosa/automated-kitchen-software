"use client";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { DrawerHeader } from "@wac/styles/sidebar/Sidebar.style";

interface PropsType {
  children: React.ReactNode;
  lng: string;
}

export default function Layout({ children, lng }: PropsType) {
  const MARGIN = 3;
  const [open, setOpen] = React.useState(true);

  // Load the drawer state from localStorage on component mount
  useEffect(() => {
    const storedDrawerState = localStorage.getItem("drawerState");
    if (storedDrawerState !== null) {
      setOpen(JSON.parse(storedDrawerState));
    }
  }, []);

  // Save the drawer state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("drawerState", JSON.stringify(open));
  }, [open]);

  const handleDrawer = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar lng={lng} openDrawer={open} />
      <Sidebar lng={lng} openDrawer={open} onHandleDrawer={handleDrawer} />
      {/* <Box component="main" sx={{ flexGrow: 1, p: 6 }}>
        {children}
      </Box> */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 9.5,
          pt: 6,
          pr: 4,
          marginLeft: open ? MARGIN + 20 : MARGIN,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
