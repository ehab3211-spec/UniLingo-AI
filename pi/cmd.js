import express from "express";
import { parseIntent } from "../ai/intent.js";
import { runWorkflow } from "../eng/wf.js";
import { validatePiPayment } from "../pi/api.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, command, txId, requiredPi } = req.body;

  try {
    // التحقق من الدفع عبر Pi قبل تنفيذ أي Workflow
    await validatePiPayment(userId, txId, requiredPi);

    const workflow = await parseIntent(command);
    const result = await runWorkflow(workflow);

    res.json({ workflow, result, message: "Workflow executed successfully" });
  } catch (e) {
    res.status(403).json({ message: e.message });
  }
});

export default router;
