import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Stack } from "@mui/material";
import { auxiliary } from "@wac/styles/palette";
import { Ingredient } from "@wac/lib/interfaces/ingredient.interface";

export default function IngredientCard({
  ingredient,
  onSelectedIngredient,
  onHandleDialog,
}: {
  ingredient: Ingredient;
  onSelectedIngredient: ({ id, name }: { id: string; name: string }) => void;
  onHandleDialog: (event: boolean) => void;
}) {
  const imagePath = ingredient.image;

  const [imageSrc, setImageSrc] = React.useState(null);

  const handleCardClick = () => {
    onSelectedIngredient({ id: ingredient.id, name: ingredient.name });
    onHandleDialog(false);
  };

  React.useEffect(() => {
    // Dynamically import the image based on the imagePath
    import(`../../public/${imagePath}`)
      .then((imageModule) => setImageSrc(imageModule.default.src))
      .catch((error) => console.error("Error loading image:", error));
  }, [imagePath]);

  // Render null if imageSrc is not available yet
  if (!imageSrc) return null;

  return (
    <>
      {/* Ingredient Card */}
      <Card>
        <CardActionArea onClick={handleCardClick}>
          <CardMedia
            sx={{ height: 70 }}
            //image={ingredient.img}
            image={imageSrc}
            title="ingredient_image"
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ pl: 2, pr: 2, pt: 1, pb: 1 }}
          >
            <Typography variant="body2" fontWeight={600}>
              {ingredient.name}
            </Typography>
            <Typography variant="body2" sx={{ color: auxiliary.main }}>
              {ingredient.form}
            </Typography>
          </Stack>
        </CardActionArea>
      </Card>
    </>
  );
}
