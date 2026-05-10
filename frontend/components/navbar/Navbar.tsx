"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import {
  Badge,
  Box,
  Breadcrumbs,
  Divider,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  // ToolbarStyled,
  AppBarStyled,
  OffsetStyled,
  ToolbarStyled,
} from "@wac/styles/navbar/Navbar.style";
import { usePathname, useRouter } from "next/navigation";
import LanguageSelect from "../select/LanguageSelect";
import { auxiliary } from "@wac/styles/palette";
import { jost } from "@wac/styles/theme";
import TypographyTitle from "../typography/TypographyTitle";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useEffect, useState } from "react";
import BasicMenu from "../menu/BasicMenu";

interface PropsType {
  lng: string;
  openDrawer: boolean;
}

export default function MainNavbar({ lng, openDrawer }: PropsType) {
  const { t } = useTranslation(lng, "common");
  const pathname = usePathname();
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<string>("");

  // Each individual "crumb" in the breadcrumbs list
  const Crumb = (pathname: string, t: any) => {
    let pathSegments = pathname.split("/").filter((segment) => segment !== "");

    // Find the index of the "storage" segment
    const storageIndex = pathSegments.indexOf("storage");
    // Find the index of the "ingredients" segment
    const ingredientsIndex = pathSegments.indexOf("ingredients");
    // Find the index of the "settings" segment
    const settingsIndex = pathSegments.indexOf("settings");

    // Extract segments up to and including "storage"
    if (storageIndex !== -1) {
      // "storage" path found
      pathSegments = pathSegments.slice(0, storageIndex + 1);
    } else if (ingredientsIndex !== -1) {
      pathSegments = pathSegments.slice(0, ingredientsIndex + 1);
    } else if (settingsIndex !== -1) {
      pathSegments = pathSegments.slice(0, settingsIndex + 1);
    }

    const route = pathSegments.slice(1, pathSegments.length);

    return route.map((txt, index) => {
      const crumbPath = pathSegments.slice(0, 2).join("/");

      return index === route.length - 1 ? (
        <TypographyTitle key={index} variant="subtitle2">
          {t(`navbarLinks.${txt}`)}
        </TypographyTitle>
      ) : (
        <Link
          key={index}
          variant="body1"
          fontFamily={jost.style.fontFamily}
          color={auxiliary.dark}
          underline="hover"
          href={"/" + crumbPath}
        >
          {t(`navbarLinks.${txt}`)}
        </Link>
      );
    });
  };

  const AccountMenu = [
    { value: "account", label: "Profile" },
    { value: "logout", label: "Log Out" },
  ];

  // Handle Account Button
  const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(
    null
  );

  const openAccountMenu = Boolean(anchorElMenu);

  const handleClickAccountButton = (
    event: React.MouseEvent<HTMLButtonElement> | null
  ) => {
    if (event === null) {
      setAnchorElMenu(null);
    } else {
      setAnchorElMenu(event.currentTarget);
    }
  };

  const handleSelectedOption = (option: string) => {
    if (option === "account") {
      router.push(`/${lng}/settings/account`);
    }
    if (option === "logout") {
      router.push(`/${lng}`);
    }
  };

  useEffect(() => {
    // Get the current role from local storage
    const role = localStorage.getItem("selectedRole");
    if (role) {
      setCurrentRole(role);
    }
  }, []);

  return (
    <>
      <AppBarStyled position="fixed" elevation={0} open={openDrawer}>
        {/* <ToolbarStyled disableGutters variant="dense">
          <Box ml={3} sx={{ pt: 2 }}> */}
        <ToolbarStyled>
          <Box>
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={
                <NavigateNextIcon
                  fontSize="small"
                  sx={{ color: auxiliary.dark }}
                />
              }
            >
              {Crumb(pathname, t)}
            </Breadcrumbs>
          </Box>
          <Box
            //mr={3}
            sx={{
              //pt: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "18px",
              height: "50px",
            }}
          >
            <LanguageSelect locale={lng} />
            <Divider orientation="vertical" variant="middle" flexItem />
            <Stack direction="row" alignItems={"center"} gap={1}>
              <IconButton size="small" onClick={handleClickAccountButton}>
                <AccountCircle fontSize="large" />
              </IconButton>

              <BasicMenu
                optionsMenu={AccountMenu}
                open={openAccountMenu}
                anchorEl={anchorElMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onAnchorElChange={handleClickAccountButton}
                onSelectedOption={handleSelectedOption}
              />

              <Stack direction={"column"} justifyContent={"space-between"}>
                <TypographyTitle variant="body2">Jane Doe</TypographyTitle>
                <Typography variant="body2" noWrap={false}>
                  {/* {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} */}
                  {t(`home.roleOptions.${currentRole}`)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </ToolbarStyled>
      </AppBarStyled>
      <OffsetStyled />
    </>
  );
}
