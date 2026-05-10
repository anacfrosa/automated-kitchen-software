"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import { Tab, CustomTabs } from "@wac/styles/navbar/StockNavbar.style";
import AppBar from "@mui/material/AppBar";
import { useEffect, useState } from "react";
import AlertDialog from "../dialog/AlertDialog";

interface PropsType {
  lng: string;
}

export default function StorageNavbar({ lng }: PropsType) {
  const { t } = useTranslation(lng, "common");
  const router = useRouter();
  const pathname = usePathname();

  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<string>("");

  const LinksTab = [
    {
      value: "inventory",
      label: t("navbarTitles.inventory"),
    },
    {
      value: "dispensers",
      label: t("navbarTitles.dispensers"),
    },
    {
      value: "purchases",
      label: t("navbarTitles.purchases"),
      roles: ["admin", "manager"],
    },
    {
      value: "suppliers",
      label: t("navbarTitles.suppliers"),
      roles: ["admin", "manager"],
    },
  ];

  // Split the path into segments
  const pathSegments = pathname.split("/");
  //console.log("pathSegments: ", pathSegments);
  // Find the index of "storage" segment
  const storageIndex = pathSegments.indexOf("storage");
  //console.log("storageIndex: ", storageIndex);
  // Get the current tab value from the route
  const currentTab = pathSegments.slice(0, storageIndex + 2).pop();
  //console.log("currentTab: ", currentTab);

  const [tabValue, setTabValue] = useState(currentTab);

  const tabsHandler = (event: React.SyntheticEvent, value: string) => {
    const selectedTab = LinksTab.find((tab) => tab.value === value);
    if (
      selectedTab &&
      selectedTab.roles &&
      !selectedTab.roles.includes(currentRole)
    ) {
      setUnauthorized(true);
      return;
    }
    setTabValue(value);
    router.push(`/${lng}/maintenance/storage/${value}`);
  };

  useEffect(() => {
    setTabValue(currentTab);
  }, [pathname, currentTab]);

  useEffect(() => {
    // Get the current role from local storage
    const role = localStorage.getItem("selectedRole");
    if (role) {
      setCurrentRole(role);
    }
  }, []);

  return (
    <>
      {/* <Box position={"fixed"} width={"90%"} zIndex={1000}>
        <CustomTabs value={tabValue} onChange={tabsHandler}>
          {LinksTab.map(({ value, label }) => (
            <Tab key={value} value={value} label={label} />
          ))}
        </CustomTabs>
      </Box> */}
      <Box position={"fixed"} width={"90%"} zIndex={1000}>
        <CustomTabs value={tabValue} onChange={tabsHandler}>
          {LinksTab.map(({ value, label }) => (
            <Tab key={value} value={value} label={label} />
          ))}
        </CustomTabs>
      </Box>

      <AlertDialog
        alertTitle={t("unauthorized.title")}
        alertContent={t("unauthorized.content")}
        open={unauthorized}
        handleClose={() => setUnauthorized(false)}
        handleAction={() => setUnauthorized(false)}
      />
    </>
  );
}
