"use client";
import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ReadPurchaseItem } from "@wac/lib/interfaces/purchases.interface";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Inventory } from "@wac/types/inventory";
import { getInventoryyByPurchaseItem } from "@wac/utils/api/inventory.api";
import theme from "@wac/styles/theme";

interface PropsType {
  lng: string;
  purchaseItem: ReadPurchaseItem;
  received: boolean;
}

export default function PurchaseItemValues({
  lng,
  purchaseItem,
  received,
}: PropsType) {
  const itemAccepted: boolean = purchaseItem.isAccepted;

  // Store the purchase details selected
  const [inventoryItem, setInventoryItem] = useState<Inventory | undefined>(
    undefined
  );

  const { inventory, isLoading, isError } = getInventoryyByPurchaseItem(
    lng,
    purchaseItem.id
  );

  const handleDisplayLotNumber = () => {
    if (received && itemAccepted && inventoryItem != undefined) {
      return inventoryItem.lotNumber;
    } else {
      return "--";
    }
  };

  const handleDisplayAcceptedInfo = () => {
    if (received) {
      return itemAccepted ? (
        <CheckIcon color="primary" sx={{ fontSize: "20px" }} />
      ) : (
        <CloseIcon color="error" sx={{ fontSize: "20px" }} />
      );
    } else {
      return "--";
    }
  };

  useEffect(() => {
    if (!isLoading && !isError && inventory) {
      setInventoryItem(inventory);
    }
  }, [isLoading, isError]);

  useEffect(() => {
    console.log(inventoryItem);
  }, [inventoryItem]);

  return (
    <Stack direction={"row"} justifyContent={"space-between"}>
      <Typography sx={{ flex: "1" }} variant={"body2"}>
        {purchaseItem.ingredient.name}
      </Typography>
      <Stack
        direction={"row"}
        sx={{ flex: "3", justifyContent: "space-between" }}
      >
        <Typography sx={{ flex: "1", textAlign: "right" }} variant={"body2"}>
          {handleDisplayAcceptedInfo()}
        </Typography>
        <Typography sx={{ flex: "1", textAlign: "right" }} variant={"body2"}>
          {handleDisplayLotNumber()}
        </Typography>
        <Typography sx={{ flex: "1", textAlign: "right" }} variant={"body2"}>
          {purchaseItem.quantity} {purchaseItem.measureUnit}
        </Typography>
        <Typography sx={{ flex: "1", textAlign: "right" }} variant={"body2"}>
          {purchaseItem.unitPrice == 0 ? "--" : purchaseItem.unitPrice}
        </Typography>
        <Typography sx={{ flex: "1", textAlign: "right" }} variant={"body2"}>
          {purchaseItem.cost == 0 ? "--" : purchaseItem.cost}
        </Typography>
      </Stack>
    </Stack>
  );
}
