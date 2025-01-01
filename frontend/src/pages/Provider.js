import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import axios from "axios";
import "./Provider.css";

const Provider = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProvider = location.state?.provider;

  const [encryptedPoData, setEncryptedPoData] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);
  const [isRedacted, setIsRedacted] = useState(false);

  const requiredFields = {
    "Provider 1": [
      "PurchaseOrderID",
      "CompanyID",
      "PODesc",
      "POQty",
      "POUnitPrice",
      "POCreateDateTimeStamp",
    ],
    "Provider 2": [
      "PurchaseOrderID",
      "CompanyName",
      "POQty",
      "POTotalPrice",
      "POCreatePlace",
    ],
    "Provider 3": [
      "PurchaseOrderID",
      "CompanyID",
      "POQty",
      "POUnitPrice",
      "POCreatePlace",
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/purchaseOrder"
        );
        setEncryptedPoData(response.data);
      } catch (error) {
        console.error("Error fetching PO data", error);
      }
    };

    fetchData();
  }, []);

  const decryptField = (encryptedData, key, iv) => {
    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      CryptoJS.enc.Hex.parse(key),
      {
        iv: CryptoJS.enc.Hex.parse(iv),
      }
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleRedact = () => {
    if (!selectedProvider || !encryptedPoData) return;

    const { data, key, iv } = encryptedPoData;
    const requiredKeys = requiredFields[selectedProvider];

    // Decrypt only the required fields
    const filteredData = requiredKeys.reduce((obj, field) => {
      obj[field] = decryptField(data[field], key, iv);
      return obj;
    }, {});

    setDecryptedData(filteredData);
    setIsRedacted(true);
  };

  const handleGenerateProof = () => {
    navigate("/generate-proof", { state: { provider: selectedProvider } });
  };

  return (
    <div className="provider-container">
      <h1>{selectedProvider || "Provider Page"}</h1>
      <p>Details of the selected Purchase Order.</p>

      {encryptedPoData && (
        <div className="po-data-box">
          <h2>Encrypted Purchase Order Data</h2>
          {Object.keys(encryptedPoData.data).map((key) => (
            <p key={key}>
              <strong>{key}:</strong> {encryptedPoData.data[key]}
            </p>
          ))}
        </div>
      )}

      <div className="redact-section">
        <button className="redact-button" onClick={handleRedact}>
          Redact
        </button>
      </div>

      {isRedacted && decryptedData && (
        <div>
          <div className="redacted-data-box">
            <h2>Redacted Purchase Order Details</h2>
            {Object.keys(decryptedData).map((key) => (
              <p key={key}>
                <strong>{key}:</strong> {decryptedData[key]}
              </p>
            ))}
          </div>
          <div className="generate-proof-section">
            <button
              className="redact-button" // Using the same class as Redact
              onClick={handleGenerateProof}
            >
              Generate Proof
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Provider;
