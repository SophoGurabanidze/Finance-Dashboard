import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import kpiRoutes from "./routes/kpi.js";
import productRoutes from "./routes/product.js";
import monthlySalesRoutes from "./routes/monthlySales.js";

import KPI from "./models/KPI.js";
import Product from "./models/Product.js";
import MonthlySale from "./models/MonthlySale.js";

import { kpis, products, monthlySales } from "./data/data.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes);
app.use("/monthlySales", monthlySalesRoutes);

/* MONGOOSE SETUP */
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

    const shouldSeed = process.env.SEED_DB === "true";
    if (shouldSeed) {
      console.log("🔁 Dropping DB and inserting seed data...");
      await mongoose.connection.db.dropDatabase();

      
      const insertedProducts = await Product.insertMany(products);
      console.log(`✅ Inserted ${insertedProducts.length} products`);

      await KPI.insertMany([{ monthlyData: kpis }]);
      console.log("✅ Inserted KPI data");

      
      const productMap = {};
      insertedProducts.forEach((p) => {
        productMap[p.name.trim().toLowerCase()] = p._id;
      });

     
      const salesWithProductIds = monthlySales
      .map((sale) => {
        if (!sale.productId || typeof sale.productId !== "string") {
          console.warn(`⚠️ Skipping sale: Missing or invalid productId`, sale);
          return null;
        }
    
        const normalizedId = sale.productId.trim().toLowerCase();
        const realId = productMap[normalizedId];
    
        if (!realId) {
          console.warn(`⚠️ Skipping sale: No matching productId for "${sale.productId}"`);
          return null;
        }
    
        return {
          ...sale,
          productId: realId,
        };
      })
      .filter(Boolean);

      await MonthlySale.insertMany(salesWithProductIds);
      console.log(`✅ Inserted ${salesWithProductIds.length} monthly sales`);
    }
  })
  .catch((error) => console.log(`❌ ${error.message} did not connect`));
