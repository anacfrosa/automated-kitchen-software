"use client";
import * as React from "react";
import { Divider, Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import userImage from "@wac/public/images/user_image.jpg";
import { useTranslation } from "@wac/app/i18n/client";
import Loading from "@wac/components/Loading";

interface PropsType {
  params: { lng: string };
}

export default function AccountSettingsPage({ params: { lng } }: PropsType) {
  const { t } = useTranslation(lng, "settings");
  const [currentRole, setCurrentRole] = useState<string>("");

  useEffect(() => {
    // Get the current role from local storage
    const role = localStorage.getItem("selectedRole");
    if (role) {
      setCurrentRole(role);
    }
  }, []);

  useEffect(() => {
    console.log(currentRole);
  }, [currentRole]);

  return (
    <Stack direction="column">
      <TypographyTitle variant="subtitle1">
        {t("account.title")}
      </TypographyTitle>

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        {currentRole ? (
          <>
            <Grid xs={12}>
              <Stack direction={"row"} gap={4} alignItems={"center"}>
                <Avatar
                  alt="Account Image"
                  src={userImage.src}
                  sx={{ width: 100, height: 100 }}
                />
                <Stack direction="column" gap={1}>
                  <TypographyTitle variant="body1">Jane Doe</TypographyTitle>
                  <Typography variant="body2">
                    {t(`account.roleOptions.${currentRole}`)}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid xs={12} md={3}>
              <Stack direction={"column"} gap={1.2}>
                <TypographyTitle variant="body2">
                  {t("account.email")}
                </TypographyTitle>
                <Typography variant="body2">JaneDoe@wac.pt</Typography>
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Divider />
            </Grid>
            <Grid xs={12}>
              <Stack direction={"column"} gap={1.2}>
                <TypographyTitle variant="body2">
                  {t("account.rolePurpose")}
                </TypographyTitle>

                <Typography variant="body2">
                  {t(`account.userRole.${currentRole}`)}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Divider />
            </Grid>
            <Grid xs={12}>
              <Stack direction={"column"} gap={1.2}>
                <TypographyTitle variant="body2">
                  {t("account.roleRestrictions")}
                </TypographyTitle>

                <Typography variant="body2">
                  {t(`account.userRestrictions.${currentRole}`)}
                </Typography>
              </Stack>
            </Grid>
          </>
        ) : (
          <Loading customHeight="70vh"></Loading>
        )}
      </Grid>
    </Stack>
  );
}
