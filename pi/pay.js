import express from "express";
import { validatePiPayment } from "../pi/api.js";

const router = express.Router();

router.post("/check", async (req, res) => {
  const { userId, txId, requiredPi } = req.body;

  try {
    const result = await validatePiPayment(userId, txId, requiredPi);
    res.json({ success: true, message: "Payment verified via Pi Network", result });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

export default router;
