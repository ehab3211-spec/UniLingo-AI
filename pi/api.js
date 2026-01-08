import fetch from "node-fetch";

export async function validatePiPayment(userId, txId, requiredAmount) {
  // استدعاء Pi Node أو Pi API الرسمي للتحقق
  const response = await fetch(`https://api.minepi.com/v1/transactions/${txId}`);
  const tx = await response.json();

  if (!tx) throw new Error("Transaction not found on Pi Network");
  if (tx.amount < requiredAmount) throw new Error("Insufficient Pi");
  if (!tx.confirmed) throw new Error("Transaction not confirmed");

  return true; // الدفع مؤكد
}
