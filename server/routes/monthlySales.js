import express from "express";
import MonthlySale from "../models/MonthlySale.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await MonthlySale.find().populate("productId");
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
