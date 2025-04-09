import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery } from "@/state/api";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import regression, { DataPoint } from "regression";

const Predictions = () => {
  const { palette } = useTheme();
  const [isPredictions, setIsPredictions] = useState(false);
  const { data: kpiData } = useGetKpisQuery();

  const formattedData = useMemo(() => {
    if (!kpiData) return [];

    const monthData = kpiData[0].monthlyData;
    const formatted: Array<DataPoint> = monthData.map(({ revenue }, i) => [i, revenue]);
    const regressionLine = regression.linear(formatted);

    // Actual months + regression line
    const historicalData = monthData.map(({ month, revenue }, i) => ({
      name: month,
      "Actual Revenue": revenue,
      "Regression Line": regressionLine.points[i][1],
    }));

    // Predicted next 12 months
    const futureData = Array.from({ length: 12 }).map((_, i) => {
      const futureIndex = i + monthData.length;
      const predicted = regressionLine.predict(futureIndex)[1];

      return {
        name: `+${i + 1} mo`, // optionally use real months
        "Predicted Revenue": predicted,
        "Regression Line": predicted,
      };
    });

    return isPredictions ? [...historicalData, ...futureData] : historicalData;
  }, [kpiData, isPredictions]);

  return (
    <DashboardBox width="100%" height="100%" p="1rem" overflow="hidden">
      <FlexBetween m="1rem 2.5rem" gap="1rem">
        <Box>
          <Typography variant="h3">Revenue and Predictions</Typography>
          <Typography variant="h6">
            Charted revenue and predicted revenue based on a simple linear regression model
          </Typography>
        </Box>
        <Button
          onClick={() => setIsPredictions((prev) => !prev)}
          sx={{
            color: palette.grey[900],
            backgroundColor: palette.grey[700],
            boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,.4)",
          }}
        >
          {isPredictions
            ? "Hide Predicted Revenue"
            : "Show Predicted Revenue for Next Year"}
        </Button>
      </FlexBetween>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 20,
            right: 75,
            left: 20,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[800]} />
          <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }}>
            <Label value="Month" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis
            domain={["auto", "auto"]}
            axisLine={{ strokeWidth: "0" }}
            style={{ fontSize: "10px" }}
            tickFormatter={(v) => `$${v}`}
          >
            <Label
              value="Revenue in USD"
              angle={-90}
              offset={-5}
              position="insideLeft"
            />
          </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="Actual Revenue"
            stroke={palette.primary.main}
            strokeWidth={0}
            dot={{ strokeWidth: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Regression Line"
            stroke="#8884d8"
            dot={false}
          />
          {isPredictions && (
            <Line
              type="monotone"
              strokeDasharray="5 5"
              dataKey="Predicted Revenue"
              stroke={palette.secondary[500]}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </DashboardBox>
  );
};

export default Predictions;
