"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
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
import theme from "@wac/styles/theme";
import EditSupplierForm from "@wac/components/suppliers/supplier-form/EditSupplierForm";
import ContainedButton from "@wac/components/buttons/ContainedButton";
import SuccessAlert from "@wac/components/alerts/SuccessAlert";
import {
  FormPropsType,
  FormSchema,
  defaultFormValues,
} from "@wac/components/suppliers/supplier-form/utils";
import {
  getSupplierById,
  updateSupplierById,
} from "@wac/lib/api/suppliers.api";
import { useTranslation } from "@wac/app/i18n/client";

interface PropsType {
  params: { id: string; lng: string };
}

export default function EditSupplierPage({ params: { id, lng } }: PropsType) {
  const { t } = useTranslation(lng, "suppliers");

  const { supplier, isLoading, isError, mutate } = getSupplierById(lng, id);

  const [supplierInformation, setSupplierInformation] =
    useState<FormPropsType>(defaultFormValues);

  // Handle success alert when supplier info is edited
  const [successAlert, setSuccessAlert] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormPropsType>({
    defaultValues: supplierInformation,
    resolver: yupResolver<FormPropsType>(FormSchema),
  });

  const handleEditForm = async (data: FormPropsType) => {
    const statusCode: number | undefined = await updateSupplierById(id, data);
    if (statusCode === 200) {
      setSuccessAlert(true);
    }
    mutate();
  };

  const handleSuccessAlertChange = (event: boolean) => {
    setSuccessAlert(event);
  };

  useEffect(() => {
    if (!isLoading && !isError && supplier) {
      setSupplierInformation({
        name: supplier.name,
        phone: supplier.phone,
        email: supplier.email,
        country: supplier.country,
        city: supplier.city,
        address: supplier.address,
        zipcode: supplier.zipcode,
        website: supplier.website,
      });
    }
  }, [isLoading, isError, supplier]);

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
            flexGrow: 2,
            borderRadius: "10px",
          }}
        >
          <TypographyTitle
            variant="subtitle1"
            textAlign={"center"}
            sx={{ p: 1.5, pl: 3 }}
          >
            {t("editTitle")}
          </TypographyTitle>

          <Divider />

          <Box
            component={"form"}
            autoComplete="off"
            onSubmit={handleSubmit(handleEditForm)}
            sx={{ p: 3, pt: 4, pb: 4 }}
          >
            <EditSupplierForm
              lng={lng}
              supplierInfo={supplierInformation}
              reset={reset}
              register={register}
              watch={watch}
              errors={errors}
            />
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
        alertText={t("editSucces")}
      />
    </>
  );
}
