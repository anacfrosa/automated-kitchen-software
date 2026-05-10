import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import theme from "@wac/styles/theme";
import { auxiliary } from "@wac/styles/palette";
import { Box } from "@mui/material";
import { useTranslation } from "@wac/app/i18n/client";

// Code inspired from :
// https://github.com/minimal-ui-kit/material-kit-react/blob/main/src/sections/user/table-no-data.jsx

interface ProspType {
  lng: string;
  query: string;
  error: boolean;
}

export default function TableNoData({ query, error, lng }: ProspType) {
  const { t } = useTranslation(lng, "suppliers");
  return (
    <TableRow>
      <TableCell align="center" colSpan={8}>
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            p: 4,
          }}
        >
          <Box sx={{ mb: "20px" }}>
            {!error ? (
              query == "" ? (
                <Typography variant="h6" color={auxiliary.darker} paragraph>
                  {t("noData.empty.title")}
                </Typography>
              ) : (
                <Typography variant="h6" color={auxiliary.darker} paragraph>
                  {t("noData.notFound.title")}
                </Typography>
              )
            ) : (
              <Typography variant="h6" color={"error"} paragraph>
                ERROR
              </Typography>
            )}
          </Box>

          {!error ? (
            query == "" ? (
              <Typography variant="body2">
                {t("noData.empty.problem")}
              </Typography>
            ) : (
              <Typography variant="body2">
                {t("noData.notFound.problem")} &nbsp;
                <strong>&quot;{query}&quot;</strong>.
                <br /> {t("noData.notFound.help")}
              </Typography>
            )
          ) : (
            <Typography variant="body2">
              Error loading suppliers info. Please try again later.
            </Typography>
          )}
        </Paper>
      </TableCell>
    </TableRow>
  );
}
