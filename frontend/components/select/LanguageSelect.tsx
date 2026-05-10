"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { languages } from "@wac/app/i18n/settings";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LanguageIcon from "@mui/icons-material/Language";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";

import EN_icon from "@wac/public/flags/flag_en.svg";
import PT_icon from "@wac/public/flags/flag_pt.svg";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";

const LANGS = [
  {
    value: "en",
    label: "EN",
    icon: EN_icon,
  },
  {
    value: "pt",
    label: "PT",
    icon: PT_icon,
  },
];

export default function LanguageSelect({ locale }: { locale: string }) {
  const router = useRouter();
  const currentPathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.push(currentPathname.replace(`/${locale}`, `/${newLocale}`));
    handleClose();
  };

  const [open, setOpen] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 30,
          height: 30,
        }}
      >
        <img
          src={LANGS.find((lang) => lang.value === locale)?.icon.src}
          alt={locale}
        />
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {LANGS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === locale}
            onClick={() => handleChange(option.value)}
            sx={{ typography: "body2", py: 1 }}
          >
            <Box
              component="img"
              alt={option.label}
              src={option.icon.src}
              sx={{ width: 22, mr: 2 }}
            />

            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}

{
  /* <FormControl sx={{ minWidth: 20 }} size="small" variant="outlined">
  <Select
    value={locale}
    onChange={(e) => handleChange(e.target.value)}
    displayEmpty
    inputProps={{ "aria-label": "Without label" }}
    sx={{ fontSize: 13, height: 33, width: 61, borderRadius: "10px" }}
  >
    {languages.map((language, index) => (
      <MenuItem key={index} value={language} sx={{ fontSize: 13 }}>
        {language}
      </MenuItem>
    ))}
  </Select>
</FormControl>; */
}
