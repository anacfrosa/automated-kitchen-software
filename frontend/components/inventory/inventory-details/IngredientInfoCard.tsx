import React from "react";
import { useTranslation } from "@wac/app/i18n/client";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Inventory } from "@wac/types/inventory";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import Grid from "@mui/material/Unstable_Grid2";
import { Paper } from "@mui/material";
import { fDateDDMMYYYYTime } from "@wac/lib/format-date";

export default function QuantityInfoCard({
  data,
  lng,
}: {
  data: Inventory;
  lng: string;
}) {
  const { t } = useTranslation(lng, "inventory");

  const imagePath = data.purchaseInfo.ingredient.image;
  const [imageSrc, setImageSrc] = React.useState(null);

  //console.log(imagePath)

  React.useEffect(() => {
    // Dynamically import the image based on the imagePath
    import(`@wac/public/${imagePath}`)
      .then((imageModule) => setImageSrc(imageModule.default.src))
      .catch((error) => console.error("Error loading image:", error));
  }, [imagePath]);

  // Render null if imageSrc is not available yet
  if (!imageSrc) return null;

  return (
    <Grid
      container
      xs={12}
      md={4}
      spacing={2}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          flexGrow: 1,
          width: "100%",
          p: 1,
          borderRadius: "10px",
        }}
      >
        <Grid xs={4}>
          <CardMedia
            sx={{
              height: 85,
              width: "85%",
              borderRadius: "10px",
            }}
            image={imageSrc}
            title="ingredient image"
          />
        </Grid>

        <Grid xs={8}>
          <Stack direction={"column"} gap={"15px"}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <TypographyTitle variant="body2">
                {t("info.ingredient")}
              </TypographyTitle>
              <Typography variant="body2">
                {data.purchaseInfo.ingredient.name}
              </Typography>
            </Stack>

            <Stack direction={"row"} justifyContent={"space-between"}>
              <TypographyTitle variant="body2">
                {t("info.form")}
              </TypographyTitle>
              <Typography variant="body2">
                {data.purchaseInfo.ingredient.form}
              </Typography>
            </Stack>

            <Stack direction={"row"} justifyContent={"space-between"}>
              <TypographyTitle variant="body2">
                {t("info.supplier")}
              </TypographyTitle>
              <Typography variant="body2">
                {data.purchaseInfo.supplier}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Paper>
    </Grid>
  );
}
