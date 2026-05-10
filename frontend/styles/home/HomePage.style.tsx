import homebanner from "../../public/banners/home-banner.png";
import { styled } from "@mui/material/styles";

export const BodyImage = styled("div")({
  // backgroundImage: `url(${image1.src})`,
  //background: background.main,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100vh",
  overflow: "hidden",
});

export const BannerImg = styled("div")({
  backgroundImage: `url(${homebanner.src})`,
  backgroundPosition: "top right",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  width: "100%",
  height: "100vh",
  overflow: "hidden",
});
