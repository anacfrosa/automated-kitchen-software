"use client";
import { useTranslation } from "@wac/app/i18n/client";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import SelectIngredientUncontrolledInput from "@wac/components/inputs/SelectIngredient/UncontrolledInput";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { LineChart } from "@mui/x-charts/LineChart";
import Grid from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import TypographyTitle from "@wac/components/typography/TypographyTitle";
import { Ingredient } from "@wac/lib/interfaces/ingredient.interface";
import dayjs, { Dayjs } from "dayjs";
import { SHOPID } from "@wac/lib/api/shops.api";
import { getWastagesByShop } from "@wac/lib/api/wastage.api";
import { ReadWastage } from "@wac/lib/interfaces/wastage.interface";
import theme from "@wac/styles/theme";
import "dayjs/locale/pt"; // For Portuguese
import Loading from "../Loading";

interface PropsType {
  lng: string;
}

export default function WastagePlot({ lng }: PropsType) {
  const { t } = useTranslation(lng, "reports");

  const initialIngredientId = "5ba6c6c1-d2b2-4e11-b5ab-92ecd03ba6ea";
  const initialDate = dayjs("2024-07-01");

  const [ingredientInputValue, setIngredientInputValue] =
    useState<Ingredient | null>(null);
  const [selectedIngrID, setSelectedIngrID] =
    useState<string>(initialIngredientId);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(initialDate);
  const [chartData, setChartData] = useState<number[]>([]);
  const [wastageData, setWastageData] = useState<ReadWastage[]>([]);

  const { wastage, isLoading, isError } = getWastagesByShop(lng, SHOPID);

  useEffect(() => {
    if (!isLoading && !isError && wastage) {
      setWastageData(wastage);
    }
  }, [isLoading, isError, wastage]);

  useEffect(() => {
    if (ingredientInputValue != null) {
      setSelectedIngrID(ingredientInputValue.id);
    } else {
      setSelectedIngrID("");
    }
  }, [ingredientInputValue]);

  useEffect(() => {
    // Set initial ingredient value based on the initial ID
    if (
      selectedIngrID === initialIngredientId &&
      ingredientInputValue === null
    ) {
      setIngredientInputValue({
        id: "5ba6c6c1-d2b2-4e11-b5ab-92ecd03ba6ea",
        name: lng == "pt" ? "Sal" : "Salt",
        form: lng == "pt" ? "Sólido" : "Solid",
        image: "images/salt.png",
        icon: "icons/salt.svg",
        shelfLife: 0,
        density: 2.16,
      } as Ingredient);
    }
  }, [selectedIngrID, ingredientInputValue]);

  useEffect(() => {
    if (selectedIngrID && selectedDate) {
      const month = selectedDate.month() + 1; // month is 0-indexed
      const year = selectedDate.year();

      // Filter data based on selected ingredient and date
      const filteredData = wastageData.filter(
        (item) =>
          item.ingredient.id === selectedIngrID &&
          item.month === month &&
          item.year === year
      );

      // Format data for the chart
      const dailyQuantities = Array(31).fill(0); // Assuming up to 31 days in a month

      filteredData.forEach((item) => {
        dailyQuantities[item.day - 1] = item.quantity;
      });

      setChartData(dailyQuantities);
    }
  }, [selectedIngrID, selectedDate, wastageData]);

  // Handle date change
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <>
      <Paper elevation={0} sx={{ p: 2, borderRadius: "10px", mb: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Box>
                <TypographyTitle variant="body1">
                  {t("plots.wastage")}
                </TypographyTitle>
              </Box>

              <Stack direction={"row"} gap={3} width={"50%"}>
                <Box width={"50%"}>
                  <SelectIngredientUncontrolledInput
                    lng={lng}
                    value={ingredientInputValue}
                    setValue={setIngredientInputValue}
                  />
                </Box>

                <Box width={"50%"}>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={lng}
                  >
                    <DatePicker
                      label={t("datePicker")}
                      views={["month", "year"]}
                      value={selectedDate}
                      onChange={handleDateChange}
                      slotProps={{
                        textField: { size: "small", fullWidth: true },
                      }}
                      sx={{
                        "& .MuiSvgIcon-root": { fontSize: 19 },
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                        "& .MuiFormLabel-root": { fontSize: "14.5px" },
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Stack>
            </Stack>
          </Grid>

          <Grid xs={12}>
            {!isLoading && !isError ? (
              <Box sx={{ maxWidth: "1500px", width: "100%", margin: "0 auto" }}>
                <LineChart
                  xAxis={[
                    {
                      data: Array.from({ length: 31 }, (_, i) => i + 1),
                      label: t("xAxis"),
                    },
                  ]}
                  yAxis={[{ label: t("yAxis") }]}
                  series={[
                    {
                      data: chartData,
                      color: `${theme.palette.secondary.main}`, // Orange color
                    },
                  ]}
                  height={345}
                  margin={{ top: 10, bottom: 60 }}
                />
              </Box>
            ) : (
              <Loading customHeight="50vh"></Loading>
            )}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
