import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery } from "@/state/api";
import { useTheme } from "@mui/material";
import { useMemo } from "react";

import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
  ComposedChart,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Area,
  Bar,
} from "recharts";

const Row2 = () => {
  const { palette } = useTheme();
  const { data } = useGetKpisQuery();

  const currentRatio = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, currentAssets, currentLiabilities }) => {
        const ratio = currentAssets / currentLiabilities;
        return {
          name: month.substring(0, 3),
          value: Number(ratio.toFixed(2)),
        };
      })
    );
  }, [data]);
  
  const quickRatio = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, currentAssets, inventory, currentLiabilities }) => {
        const ratio = (currentAssets - inventory) / currentLiabilities;
        return {
          name: month.substring(0, 3),
          value: Number(ratio.toFixed(2)),
        };
      })
    );
  }, [data]);
  
  const inventoryTurnover = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, costOfGoodsSold, inventory }) => {
        const ratio = costOfGoodsSold / inventory;
        return {
          name: month.substring(0, 3),
          value: Number(ratio.toFixed(2)),
        };
      })
    );
  }, [data]);
  
  const accountsReceivableTurnover = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, netSales, accountsReceivable }) => {
        const ratio = netSales / accountsReceivable;
        return {
          name: month.substring(0, 3),
          value: Number(ratio.toFixed(2)),
        };
      })
    );
  }, [data]);
  
  const assetTurnover = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, netSales, totalAssets }) => {
        const ratio = netSales / totalAssets;
        return {
          name: month.substring(0, 3),
          value: Number(ratio.toFixed(2)),
        };
      })
    );
  }, [data]);
  

  return (
    <>
  {/* Chart 1: Current Ratio - Line Chart */}
  <DashboardBox gridArea="d">
    <BoxHeader title="Current Ratio" subtitle="Current Assets / Current Liabilities" sideText="Monthly" />
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={currentRatio} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
        <CartesianGrid stroke={palette.grey[800]} />
        <XAxis dataKey="name" style={{ fontSize: "10px" }} />
        <YAxis style={{ fontSize: "10px" }} />
        <Tooltip />
        <Legend  verticalAlign="bottom" height={36}/>
        <Line type="monotone" dataKey="value" name="Current Ratio" stroke={palette.primary.main} />
      </LineChart>
    </ResponsiveContainer>
  </DashboardBox>

  {/* Chart 2: Quick Ratio - Area Chart */}
  <DashboardBox gridArea="e">
    <BoxHeader title="Quick Ratio" subtitle="(Current Assets - Inventory) / Current Liabilities" sideText="Monthly" />
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={quickRatio} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
        <CartesianGrid stroke={palette.grey[800]} />
        <XAxis dataKey="name" style={{ fontSize: "10px" }} />
        <YAxis style={{ fontSize: "10px" }} />
        <Tooltip />
        <Legend  verticalAlign="bottom" height={36}/>
        <Area
          type="monotone"
          dataKey="value"
          name="Quick Ratio"
          stroke={palette.secondary.main}
          fill={palette.secondary.light}
        />
      </AreaChart>
    </ResponsiveContainer>
  </DashboardBox>

  {/* Chart 3: Inventory Turnover - Vertical Bar Chart */}
  <DashboardBox gridArea="f">
    <BoxHeader title="Inventory Turnover" subtitle="COGS / Inventory" sideText="Monthly" />
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={inventoryTurnover} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
        <CartesianGrid stroke={palette.grey[800]} />
        <XAxis dataKey="name" style={{ fontSize: "10px" }} />
        <YAxis style={{ fontSize: "10px" }} />
        <Tooltip />
        <Legend  verticalAlign="bottom" height={36}/>
        <Bar dataKey="value" name="Inventory Turnover" fill={palette.tertiary[500]} />
      </BarChart>
    </ResponsiveContainer>
  </DashboardBox>

  {/* Chart 4: AR Turnover - Horizontal Bar Chart */}
  <DashboardBox gridArea="g">
    <BoxHeader title="AR Turnover" subtitle="Net Sales / Accounts Receivable" sideText="Monthly"  />
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={accountsReceivableTurnover}
        layout="vertical"
        margin={{ top: 20, right: 20, left: 40, bottom: 40 }}
      >
        <CartesianGrid stroke={palette.grey[800]} />
        <XAxis type="number" style={{ fontSize: "10px" }}
           />
        <YAxis type="category" dataKey="name" style={{ fontSize: "10px" }} />
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
        <Bar   dataKey="value" name="AR Turnover" fill={palette.primary[700]} />
      </BarChart>
    </ResponsiveContainer>
  </DashboardBox>

  {/* Chart 5: Asset Turnover - Area + Line Combo */}
  <DashboardBox gridArea="h">
  <BoxHeader title="Asset Turnover" subtitle="Net Sales / Total Assets" sideText="Monthly" />
  <ResponsiveContainer width="100%" height="100%">
    <ComposedChart data={assetTurnover} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
      <CartesianGrid stroke={palette.grey[800]} />
      <XAxis dataKey="name" style={{ fontSize: "10px" }} />
      <YAxis style={{ fontSize: "10px" }} />
      <Tooltip />
      <Legend verticalAlign="bottom" height={36} />
      <Area
        type="monotone"
        dataKey="value"
        name="Asset Turnover (Area)"
        stroke={palette.warning.main}
        fill={palette.warning.light}
      />
      <Line
        type="monotone"
        dataKey="value"
        name="Asset Turnover (Line)"
        stroke={palette.warning.dark}
        dot={false}
      />
    </ComposedChart>
  </ResponsiveContainer>
</DashboardBox>

</>

  );
};

export default Row2;
