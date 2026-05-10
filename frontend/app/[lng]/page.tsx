"use client";
import * as React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import { useRouter } from "next/navigation";
import {
  Stack,
  Box,
  Typography,
  Paper,
  Divider,
  MenuItem,
  Container,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import { CustomTextField } from "@wac/styles/inputs/CustomTextField.style";
import { useEffect, useState } from "react";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import { auxiliary } from "@wac/styles/palette";

interface PropsType {
  params: { lng: string };
}

export default function HomeLayout({ params: { lng } }: PropsType) {
  const router = useRouter();
  const { t } = useTranslation(lng, "common");
  const themeMUI = useTheme();
  const isSmallScreen = useMediaQuery(themeMUI.breakpoints.down("md"));

  const roleOptions = [
    {
      value: "admin",
      label: t("home.roleOptions.admin"),
    },
    {
      value: "handler",
      label: t("home.roleOptions.handler"),
    },
    {
      value: "manager",
      label: t("home.roleOptions.manager"),
    },
  ];

  const [selectedRole, setSelectedRole] = useState("admin");

  useEffect(() => {
    const storedRole = localStorage.getItem("selectedRole");
    if (storedRole) {
      setSelectedRole(storedRole);
    } else {
      localStorage.setItem("selectedRole", "admin");
    }
  }, []);

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const role = event.target.value;
    setSelectedRole(role);
    localStorage.setItem("selectedRole", role); // Save the selected role to local storage
  };

  const handleSubmitForm = () => {
    router.push(`/${lng}/dashboard`);
  };

  return (
    <Container maxWidth="lg" sx={{ p: 1 }}>
      <Grid container spacing={5} justifyContent="center">
        {/* <Grid xs={12} md={10} lg={10}>
          <Typography variant="h3">{t("home.title")}</Typography>
        </Grid> */}
        <Grid xs={12} md={8} lg={8}>
          <Paper
            elevation={2}
            sx={{
              p: 5,
              pt: 2,
              borderRadius: "10px",
            }}
          >
            {/* <Typography variant="h6" textAlign={"center"}>
              {t("home.signIn")}
            </Typography> */}
            <Typography variant="h6" textAlign={"center"}>
              {t("home.title")}{" "}
            </Typography>

            <Divider sx={{ mt: 1, mb: 1 }} />

            <Typography
              variant="body2"
              sx={{ mt: 1, mb: 5 }}
              textAlign={"center"}
              color={auxiliary.dark}
            >
              Selecione a função que desempenha no sistema
            </Typography>

            <CustomTextField
              select
              label={t("home.role")}
              name="role"
              value={selectedRole}
              onChange={handleRoleChange}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mb: 5 }}
            >
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </CustomTextField>
            <ContainedButton onClick={handleSubmitForm}>
              {t("home.logIn")}
            </ContainedButton>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
