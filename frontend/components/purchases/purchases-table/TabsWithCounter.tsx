import { Box, Typography } from "@mui/material";
import { useTranslation } from "@wac/app/i18n/client";
import { getPurchasesByShop } from "@wac/lib/api/purchases.api";
import { SHOPID } from "@wac/lib/api/shops.api";
import { ReadPurchase } from "@wac/lib/interfaces/purchases.interface";
import { auxiliary, error, primary, secondary } from "@wac/styles/palette";
import {
  CustomTab,
  CustomTabs,
} from "@wac/styles/tabs/PurchaseTableTabs.style";

interface PropsType {
  lng: string;
  purchaseStatus: string;
  onPurchaseStatusChange: (event: React.SyntheticEvent, value: string) => void;
}

function TabsWithCounter({
  lng,
  purchaseStatus,
  onPurchaseStatusChange,
}: PropsType) {
  const { t } = useTranslation(lng, "purchases");

  // Define colors for each status
  const selectedColors: Record<string, string> = {
    [t("tabsTitle.all")]: auxiliary.dark,
    [t("tabsTitle.delivered")]: primary.main,
    [t("tabsTitle.pending")]: secondary.main,
    [t("tabsTitle.canceled")]: error.main,
  };

  const unselectedColors: Record<string, string> = {
    [t("tabsTitle.all")]: auxiliary.dark,
    [t("tabsTitle.delivered")]: primary.light,
    [t("tabsTitle.pending")]: secondary.light,
    [t("tabsTitle.canceled")]: error.light,
  };

  const textColor: Record<string, string> = {
    [t("tabsTitle.all")]: "white",
    [t("tabsTitle.delivered")]: primary.dark,
    [t("tabsTitle.pending")]: secondary.dark,
    [t("tabsTitle.canceled")]: error.dark,
  };

  let purchasesList: ReadPurchase[] = [];
  const { purchases, isLoading, isError } = getPurchasesByShop(lng, SHOPID);
  if (!isLoading && !isError) {
    purchasesList = purchases;
  }

  // Debugging: Log the purchase status values
  //console.log("Purchases List:", purchasesList);

  const counts = {
    [t("tabsTitle.all")]: purchasesList.length,
    [t("tabsTitle.delivered")]: purchasesList.filter(
      (purchase: ReadPurchase) => purchase.status === "Delivered"
    ).length,
    [t("tabsTitle.pending")]: purchasesList.filter(
      (purchase: ReadPurchase) => purchase.status === "Pending"
    ).length,
    [t("tabsTitle.canceled")]: purchasesList.filter(
      (purchase: ReadPurchase) => purchase.status === "Canceled"
    ).length,
  };

  // console.log(purchaseStatus);
  // console.log(counts);
  return (
    <Box width={"100%"}>
      <CustomTabs value={purchaseStatus} onChange={onPurchaseStatusChange}>
        {Object.entries(counts).map(([status, count]) => (
          <CustomTab
            key={status}
            value={status === t("tabsTitle.all") ? "" : status}
            label={
              <Box display="flex" alignItems="center">
                {status}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 1.5,
                    height: "22px",
                    minWidth: "25px",
                    borderRadius: "5px",
                    color:
                      purchaseStatus === status ? "white" : textColor[status],
                    backgroundColor:
                      purchaseStatus === status
                        ? selectedColors[status]
                        : unselectedColors[status],
                  }}
                >
                  <Typography fontWeight={600} sx={{ fontSize: "0.8rem" }}>
                    {count}
                  </Typography>
                </Box>
              </Box>
            }
          />
        ))}
      </CustomTabs>
    </Box>
  );
}

export default TabsWithCounter;
