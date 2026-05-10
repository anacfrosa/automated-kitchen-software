"use client";
import * as React from "react";
import {
  Box,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import theme from "@wac/styles/theme";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SuccessAlert from "@wac/components/alerts/SuccessAlert";
import AddSupplierForm from "@wac/components/suppliers/supplier-form/AddSupplierForm";
import {
  FormPropsType,
  FormSchema,
  defaultFormValues,
} from "@wac/components/suppliers/supplier-form/utils";
import { createSupplier } from "@wac/lib/api/suppliers.api";
import { useRouter } from "next/navigation";
import { sleep } from "@wac/lib/common";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  params: { lng: string };
}

export default function NewSupplierPage({ params: { lng } }: PropsType) {
  const { t } = useTranslation(lng, "suppliers");
  const router = useRouter();
  // Handle success alert when created new supplier
  const [successAlert, setSuccessAlert] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormPropsType>({
    defaultValues: defaultFormValues,
    resolver: yupResolver<FormPropsType>(FormSchema),
  });

  const handleSubmitForm = async (data: FormPropsType) => {
    const statusCode: number | undefined = await createSupplier(data);
    if (statusCode === 201) {
      setSuccessAlert(true);
    }
    reset();
    await sleep(500); // Wait for 0.5 seconds
    router.push(`/${lng}/maintenance/storage/suppliers`);
  };

  const handleSuccessAlertChange = (event: boolean) => {
    setSuccessAlert(event);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        <IconButton href={`/${lng}/maintenance/storage/suppliers`}>
          <ArrowBack fontSize="medium" />
        </IconButton>

        <Paper
          elevation={0}
          sx={{
            borderRadius: "10px",
          }}
        >
          <TypographyTitle
            variant="subtitle1"
            textAlign={"center"}
            sx={{ p: 1.5, pl: 3 }}
          >
            {t("createTitle")}
          </TypographyTitle>

          <Divider />

          <Box
            component={"form"}
            autoComplete="off"
            onSubmit={handleSubmit(handleSubmitForm)}
            sx={{ p: 3, pt: 4, pb: 4 }}
          >
            <AddSupplierForm lng={lng} register={register} errors={errors} />
            <Stack direction={"row"} justifyContent={"flex-end"} sx={{ mt: 3 }}>
              <ContainedButton type="submit" buttonSize="small">
                {t("buttons.submit")}
              </ContainedButton>
            </Stack>
          </Box>
        </Paper>
      </Box>
      <SuccessAlert
        lng={lng}
        open={successAlert}
        onSuccessAlertChange={handleSuccessAlertChange}
        alertText={t("createSuccess")}
      />
    </>
  );
}
