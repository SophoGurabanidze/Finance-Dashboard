import mongoose from "mongoose";
import { loadType } from "mongoose-currency";

const Schema = mongoose.Schema;
loadType(mongoose); // enables mongoose.Types.Currency

const MonthlySaleSchema = new Schema(
  {
    month: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    unitsSold: {
      type: Number,
      required: true,
    },
    revenue: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

const MonthlySale = mongoose.model("MonthlySale", MonthlySaleSchema);
export default MonthlySale;
