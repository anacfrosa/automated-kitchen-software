"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import { Tab, CustomTabs } from "@wac/styles/navbar/StockNavbar.style";
import AppBar from "@mui/material/AppBar";
import { useEffect } from "react";

interface PropsType {
  lng: string;
}

export default function ReportsNavbar({ lng }: PropsType) {
  const router = useRouter();
  const pathname = usePathname();

  const LinksTab = [
    {
      value: "ingredients",
      label: "Ingredients",
    },
  ];

  // Split the path into segments
  const pathSegments = pathname.split("/");
  console.log(pathSegments);
  // Find the index of "ingredients" segment
  const ingredientsIndex = pathSegments.indexOf("ingredients");
  console.log(ingredientsIndex);
  // Get the current tab value from the route
  const currentTab = pathSegments.slice(0, ingredientsIndex + 2).pop();
  console.log(currentTab);

  const [tabValue, setTabValue] = React.useState("ingredients");

  const tabsHandler = (event: React.SyntheticEvent, value: string) => {
    setTabValue(value);
    router.push(`/${lng}/reports/ingredients`);
  };

  useEffect(() => {
    console.log(currentTab);
  }, [currentTab]);

  return (
    <Box position={"fixed"} width={"90%"} zIndex={1000}>
      <CustomTabs value={tabValue} onChange={tabsHandler}>
        {LinksTab.map(({ value, label }) => (
          <Tab key={value} value={value} label={label} />
        ))}
      </CustomTabs>
    </Box>
  );
}
