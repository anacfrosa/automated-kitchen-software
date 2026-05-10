"use client";
import { usePathname } from "next/navigation";
import { BannerImg, BodyImage } from "../../styles/home/HomePage.style";
import { Box } from "@mui/system";
import logoVerticalWhite from "@wac/public/logo/logo-vertical-white.png";
import Stack from "@mui/material/Stack";
import LanguageSelect from "@wac/components/select/LanguageSelect";
import Layout from "./Layout";
import Scrollbar from "../Scrollbar";

interface PropsType {
  children: React.ReactNode;
  lng: string;
}

export default function HomeLayout({ children, lng }: PropsType) {
  const pathname = usePathname();

  return (
    <>
      {pathname == `/${lng}` ? (
        <BodyImage>
          <BannerImg>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              mt={"20px"}
              mr={"25px"}
              ml={"25px"}
            >
              {/* Language Select */}
              <LanguageSelect locale={lng} />

              {/* Logo Vertical Wish and Cook White */}
              <Box
                component="img"
                src={logoVerticalWhite.src}
                alt="White vertical logo Wish and Cook"
                sx={{
                  height: { xs: 70, md: 84 },
                  width: { xs: 110, md: 134 },
                }}
              />
            </Stack>
            {children}
          </BannerImg>
        </BodyImage>
      ) : (
        <Layout children={children} lng={lng} />
      )}
    </>
  );
}
