"use client";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Shop from "@mui/icons-material/Storefront";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslation } from "@wac/app/i18n/client";
import { StyledListItemButton } from "@wac/styles/lists/SettingsList.style";
import Link from "@mui/material/Link";

interface PropsType {
  lng: string;
}

export default function SettingOptions({ lng }: PropsType) {
  const { t } = useTranslation(lng, "settings");
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: 300,
          bgcolor: "background.paper",
          minHeight: "75vh",
        }}
      >
        <List component="nav">
          <Link href={`/${lng}/settings/shop`} underline="none">
            <StyledListItemButton
              selected={pathname === `/${lng}/settings/shop`}
            >
              <ListItemIcon>
                <Shop />
              </ListItemIcon>
              <ListItemText primary={t("sidebar.shop")} />
            </StyledListItemButton>
          </Link>

          <Link href={`/${lng}/settings/account`} underline="none">
            <StyledListItemButton
              selected={pathname === `/${lng}/settings/account`}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={t("sidebar.account")} />
            </StyledListItemButton>
          </Link>
        </List>
      </Box>

      <Divider orientation="vertical" variant="middle" flexItem />
    </>
  );
}
