import { useTheme } from "@mui/material";
import { useGetMonthlySalesQuery } from "@/state/api";
import DashboardBox from "@/components/DashboardBox";
import BoxHeader from "@/components/BoxHeader";
import {
  ResponsiveContainer,
  // BarChart,
  // Bar,
  // XAxis,
  // YAxis,
  // CartesianGrid,
  Tooltip,
  // Legend,
  PieChart,
  Pie,
  Cell,
  // LineChart,
  // Line,
} from "recharts";
import { useMemo } from "react";



const Row3 = () => {
  const { palette } = useTheme();
  const { data: monthlySales } = useGetMonthlySalesQuery();
  
  
  // Add the useMemo logic from Step 1 here
  const topProducts = useMemo(() => {
    if (!monthlySales) return [];
    const productMap = new Map();
  
    monthlySales.forEach(({ productId, revenue }) => {
      if (!productId || !productId.name) return; // 👈 fix
      const name = productId.name;
      const existing = productMap.get(name) || 0;
      productMap.set(name, existing + revenue);
    });
    return Array.from(productMap, ([name, revenue]) => ({ name, revenue }));
  }, [monthlySales]);

  console.log("Top Products Data:", topProducts);

  const categorySales = useMemo(() => {
    if (!monthlySales) return [];
    const categoryMap = new Map();
  
    monthlySales.forEach(({ productId, revenue }) => {
      if (!productId || !productId.category) return; // 👈 fix
      const category = productId.category;
      const existing = categoryMap.get(category) || 0;
      categoryMap.set(category, existing + revenue);
    });
  
    return Array.from(categoryMap, ([name, value]) => ({ name, value }));
  }, [monthlySales]);

  console.log("Category Sales Data:", categorySales);

  
  const pieColors = [
    palette.secondary[700],
    palette.secondary[500],
    palette.secondary[200],
    palette.secondary[300],
  ];

  // const monthlyTrend = useMemo(() => {
  //   if (!monthlySales) return [];
  //   const monthMap = new Map();
  
  //   monthlySales.forEach(({ month, revenue }) => {
  //     const existing = monthMap.get(month) || 0;
  //     monthMap.set(month, existing + revenue);
  //   });
  
  //   return Array.from(monthMap, ([name, revenue]) => ({ name: name.slice(0, 3), revenue }));
  // }, [monthlySales]);
  
  
  
  return (
    <>
      {/* Top-Selling Products
      <DashboardBox gridArea="i">
        <BoxHeader title="Top-Selling Products" sideText="Total Revenue" />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topProducts}
            layout="vertical"
            margin={{ top: 10, left: 40, right: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" style={{ fontSize: "10px" }} />
            <YAxis
              type="category"
              dataKey="name"
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill={palette.secondary.main} />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox> */}

      {/* Sales by Category */}
      <DashboardBox gridArea="j">
        <BoxHeader title="Sales by Category" sideText="Total Revenue" />
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categorySales}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {categorySales.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </DashboardBox>

   
     
    </>
  );
};

export default Row3;
