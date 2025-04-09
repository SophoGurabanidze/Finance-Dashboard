import mongoose from "mongoose";
import { loadType } from "mongoose-currency";

const Schema = mongoose.Schema;
loadType(mongoose); // adds Currency type to Mongoose

const monthSchema = new Schema(
  {
    month: String,
    revenue: { type: mongoose.Types.Currency, currency: "USD", get: v => v / 100 },
    expenses: { type: mongoose.Types.Currency, currency: "USD", get: v => v / 100 },
    operationalExpenses: { type: mongoose.Types.Currency, currency: "USD", get: v => v / 100 },
    nonOperationalExpenses: { type: mongoose.Types.Currency, currency: "USD", get: v => v / 100 },
    currentAssets: { type: mongoose.Types.Currency, currency: "USD", get: v => v / 100 },
    currentLiabilities: { type: mongoose.Types.Currency, currency: "USD", get: v => v / 100 },
    totalAssets: { type: mongoose.Types.Currency, currency: "USD", get: v => v / 100 },
    netSales: { type: mongoose.Types.Currency, currency: "USD", get: v => v / 100 },
    inventory: { type: mongoose.Types.Currency, currency: "USD", get: v => v / 100 },
    costOfGoodsSold: { type: mongoose.Types.Currency, currency: "USD", get: v => v / 100 },
    accountsReceivable: { type: mongoose.Types.Currency, currency: "USD", get: v => v / 100 },
  },
  { toJSON: { getters: true } }
);

const KPISchema = new Schema(
  {
    monthlyData: [monthSchema],
  },
  { timestamps: true, toJSON: { getters: true } }
);

const KPI = mongoose.model("KPI", KPISchema);

export default KPI;

