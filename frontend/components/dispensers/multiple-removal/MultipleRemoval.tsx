"use client";
import Box from "@mui/material/Box";
import StandardDialog from "@wac/components/dialog/StandardDialog";
import { ReadDispenser } from "@wac/types/dispenser";
import * as React from "react";
import { useEffect, useState } from "react";
import DispensersList from "./DispensersList";
import Stack from "@mui/material/Stack";
import DispenserTabs from "./DispenserTabs";
import RemovalReason from "../dispenser-removal/RemovalReason";

interface PropsType {
  lng: string;
  openDialog: boolean;
  onHandleDialog: (event: boolean) => void;
}

export default function DispenserMultipleRemoval({
  lng,
  openDialog,
  onHandleDialog,
}: PropsType) {
  const alertCancelDialog = {
    title: `Cancel Removal Process?`,
    content:
      "This will cancel the process to remove ingredients from dispensers",
  };

  const [selectedDispensers, setSelectedDispensers] = useState<ReadDispenser[]>(
    []
  );

  const handleSelectedChange = (newSelectedDispensers: ReadDispenser[]) => {
    setSelectedDispensers(newSelectedDispensers);
  };

  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleSelectedTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (openDialog) {
      setSelectedTab(0);
      setSelectedDispensers([]);
    }
  }, [openDialog]);

  return (
    // <StandardDialog
    //   open={openDialog}
    //   title={"Ingredient Removal"}
    //   closeDialog={() => onHandleDialog(false)}
    //   alertCancelDialog={alertCancelDialog}
    // >
    //   <Box sx={{ display: "flex", flexDirection: "row", gap: "80px" }}>
    //     <DispensersList
    //       lng={lng}
    //       selectedDispensers={selectedDispensers}
    //       onSelectedDispensersChange={handleSelectedChange}
    //     />

    //     <Stack direction={"column"} sx={{ width: "100%" }}>
    //       <DispenserTabs
    //         lng={lng}
    //         tabsList={selectedDispensers}
    //         selectedTab={selectedTab}
    //         onSelectedTab={handleSelectedTabChange}
    //       />

    //       {selectedDispensers[selectedTab] !== undefined && (
    //         <RemovalReason
    //           lng={lng}
    //           dispenserId={selectedDispensers[selectedTab].id}
    //         />
    //       )}
    //     </Stack>
    //   </Box>
    // </StandardDialog>
    <></>
  );
}
