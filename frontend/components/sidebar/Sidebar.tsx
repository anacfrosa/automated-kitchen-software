"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  ListItem,
  IconButton,
  ListItemText,
  Link,
  Stack,
  Typography,
  ListItemIcon,
  ListItemButton,
  List,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  Drawer,
  TemporaryDrawer,
  DrawerHeader,
  DrawerList,
  StyledLink,
  ListButton,
} from "@wac/styles/sidebar/Sidebar.style";
import { useEffect, useState } from "react";
import AlertDialog from "../dialog/AlertDialog";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import logohorizontal from "@wac/public/logo/logo-horizontal.png";
import logovertical from "@wac/public/logo/logo-vertical.png";
import icon from "@wac/public/favicon.ico";
import theme from "@wac/styles/theme";
import { auxiliary } from "@wac/styles/palette";

interface PropsType {
  lng: string;
  openDrawer: boolean;
  onHandleDrawer: (open: boolean) => void;
}

const Sidebar = ({ lng, openDrawer, onHandleDrawer }: PropsType) => {
  const { t } = useTranslation(lng, "common");
  const pathname = usePathname();
  const router = useRouter();

  // For user restrictions
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<string>("");
  // const [open, setOpen] = React.useState(false);

  const Links = [
    {
      text: t("sidebarLinks.dashboard"),
      href: `/${lng}/dashboard`,
      icon: DashboardOutlinedIcon,
    },
    {
      text: t("sidebarLinks.maintenance"),
      href: `/${lng}/maintenance`,
      icon: ShieldOutlinedIcon,
    },
    {
      text: t("sidebarLinks.reports"),
      href: `/${lng}/reports`,
      icon: LeaderboardOutlinedIcon,
      roles: ["admin", "manager"],
    },
    {
      text: t("sidebarLinks.settings"),
      href: `/${lng}/settings`,
      icon: SettingsOutlinedIcon,
    },
  ];

  // const toggleDrawer =
  //   (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
  //     if (
  //       event.type === "keydown" &&
  //       ((event as React.KeyboardEvent).key === "Tab" ||
  //         (event as React.KeyboardEvent).key === "Shift")
  //     ) {
  //       return;
  //     }

  //     setOpen(open);
  //   };

  const selectedHandler = (href: string) => {
    // Split the URL string by '/'
    const split_pathname = pathname.split("/");
    // Take the first three segments and join them back with '/'
    const url = split_pathname.slice(0, 3).join("/");

    return url == href;
  };

  useEffect(() => {
    // Get the current role from local storage
    const role = localStorage.getItem("selectedRole");
    if (role) {
      setCurrentRole(role);
    }
  }, []);

  const handleLinkClick =
    (href: string, roles?: string[]) =>
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (roles && !roles.includes(currentRole)) {
        event.preventDefault();
        setUnauthorized(true);
      } else {
        router.push(href);
      }
    };

  return (
    <>
      {/* PERMANENT SMALL DRAWER */}
      <Drawer variant="permanent" open={openDrawer}>
        <DrawerHeader>
          {openDrawer ? (
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={1.5}
            >
              <Image
                src={logohorizontal}
                width={140}
                alt="Vertical Log Wish and Cook"
              />
              <IconButton onClick={() => onHandleDrawer(!openDrawer)}>
                <ChevronLeftIcon fontSize="small"/>
              </IconButton>
            </Stack>
          ) : (
            <IconButton onClick={() => onHandleDrawer(!openDrawer)}>
              {/* <MenuIcon /> */}
              <Image src={icon} width={30} alt="Vertical Log Wish and Cook" />
            </IconButton>
          )}
        </DrawerHeader>

        <DrawerList>
          {Links.map(({ text, href, icon: Icon, roles }) => (
            <ListItem key={href} disablePadding>
              <ListButton
                selected={selectedHandler(href)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  justifyContent: openDrawer ? "initial" : "center",
                }}
              >
                <StyledLink
                  href={href}
                  //sx={{ marginTop: "8px" }}
                  onClick={handleLinkClick(href, roles)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      mr: openDrawer ? 3 : "auto",
                    }}
                  >
                    <Icon sx={{ fontSize: "1.18rem" }} />
                  </ListItemIcon>
                  {/* {text} */}
                  {openDrawer && (
                    <ListItemText
                      primary={text}
                      sx={{
                        opacity: openDrawer ? 1 : 0,
                        color: selectedHandler(href)
                          ? theme.palette.primary.main
                          : auxiliary.dark,
                      }}
                    />
                  )}
                </StyledLink>
              </ListButton>
            </ListItem>
          ))}
        </DrawerList>
      </Drawer>

      {/* TEMPORARY DRAWER */}
      {/* <TemporaryDrawer open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ m: "auto" }}>
          <Image
            src={logovertical}
            width={130}
            alt="Vertical Log Wish and Cook"
          />
        </Box>

        <DrawerList
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          role="presentation"
          sx={{ top: "-10vh" }}
        >
          {Links.filter(
            ({ roles }) => !roles || roles.includes(currentRole)
          ).map(({ text, href, icon: Icon }) => (
            <ListItem key={href} disablePadding>
              <ListButton selected={selectedHandler(href)}>
                <Link href={href} underline="none">
                  <ListIcon>
                    <Icon sx={{ fontSize: "1.18rem" }} />
                  </ListIcon>
                  {text}
                </Link>
              </ListButton>
            </ListItem>
          ))}
        </DrawerList>
      </TemporaryDrawer> */}

      <AlertDialog
        alertTitle={t("unauthorized.title")}
        alertContent={t("unauthorized.content")}
        open={unauthorized}
        handleClose={() => setUnauthorized(false)}
        handleAction={() => setUnauthorized(false)}
      />
    </>
  );
};

export default Sidebar;
