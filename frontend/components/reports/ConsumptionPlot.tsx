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
import "dayjs/locale/pt"; // For Portuguese

// Import the JSON file
import consumptionData from "@wac/public/data/consumption_data.json"; // Import data
import Loading from "../Loading";

interface PropsType {
  lng: string;
}

interface ConsumptionData {
  ingredientId: string;
  day: number;
  month: number;
  year: number;
  quantity: number;
}

export default function ConsumptionPlot({ lng }: PropsType) {
  const { t } = useTranslation(lng, "reports");

  const initialIngredientId = "5ba6c6c1-d2b2-4e11-b5ab-92ecd03ba6ea";
  const initialDate = dayjs("2019-01-01");

  const [ingredientInputValue, setIngredientInputValue] =
    useState<Ingredient | null>({
      id: "5ba6c6c1-d2b2-4e11-b5ab-92ecd03ba6ea",
      name: lng == "pt" ? "Sal" : "Salt",
      form: lng == "pt" ? "Sólido" : "Solid",
      image: "images/salt.png",
      icon: "icons/salt.svg",
      shelfLife: 0,
      density: 2.16,
    });
  const [selectedIngrID, setSelectedIngrID] =
    useState<string>(initialIngredientId);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(initialDate);
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    if (ingredientInputValue != null) {
      setSelectedIngrID(ingredientInputValue.id);
    } else {
      setSelectedIngrID("");
    }
  }, [ingredientInputValue]);

  useEffect(() => {
    if (selectedIngrID && selectedDate) {
      const month = selectedDate.month() + 1; // month is 0-indexed
      const year = selectedDate.year();

      // Filter data based on selected ingredient and date
      const filteredData = consumptionData.filter(
        (item) =>
          item.ingredientId === selectedIngrID &&
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
  }, [selectedIngrID, selectedDate]);

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
                  {t("plots.consumption")}
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
            {chartData.length !== 0 ? (
              <Box sx={{ maxWidth: "1500px", width: "100%", margin: "0 auto" }}>
                <LineChart
                  xAxis={[
                    {
                      data: Array.from({ length: 31 }, (_, i) => i + 1),
                      label: t("xAxis"),
                    },
                  ]}
                  yAxis={[{ label: t("yAxis") }]}
                  series={[{ data: chartData }]}
                  height={345}
                  //width={1215}
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
