const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require("crypto");

app.use(cors());

// Sample PO Data
const poData = {
  PurchaseOrderID: "PO123",
  CompanyName: "UK Buyer Timber",
  CompanyID: "CIN-U72900MH2000PTC123456",
  PODesc: "TeakWood in tonnes",
  POQty: "10",
  POUnitPrice: "100000",
  POTotalPrice: "1000000",
  POCreateDateTimeStamp: "20/08/2004 04:23:05",
  POCreatePlace: "Manchester UK",
  CreatedBy: "John Smith",
};

// Encryption setup
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // Generate a random key
const iv = crypto.randomBytes(16); // Generate a random IV

// Function to encrypt each field value as a single, long encrypted string
function encryptField(field) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(field, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

// Endpoint to get encrypted PO Data in a structured format
app.get("/api/purchaseOrder", (req, res) => {
  const encryptedPoData = {};

  // Encrypt each field to keep a single encrypted string per key-value
  Object.keys(poData).forEach((key) => {
    encryptedPoData[key] = encryptField(poData[key]);
  });

  // Respond with the encrypted data and provide the key and IV for client decryption
  res.json({
    data: encryptedPoData,
    key: key.toString("hex"), // Send key and IV in hexadecimal format for decryption
    iv: iv.toString("hex"),
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
