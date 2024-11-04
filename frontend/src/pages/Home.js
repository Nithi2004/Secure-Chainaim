import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [qrValue, setQrValue] = useState("");
  const navigate = useNavigate();

  const handleProviderChange = (e) => {
    const provider = e.target.value;
    setSelectedProvider(provider);
    setQrValue(`Provider: ${provider}`);
  };

  const handleGetPOClick = () => {
    navigate("/provider", { state: { provider: selectedProvider } });
  };

  return (
    <div className="home-container">
      <h1>Welcome to Chainaim</h1>
      <div className="dropdown-container">
        <label htmlFor="provider-dropdown">Select a provider:</label>
        <select
          id="provider-dropdown"
          value={selectedProvider}
          onChange={handleProviderChange}
        >
          <option value="">-- Select Provider --</option>
          <option value="Provider 1">Provider 1</option>
          <option value="Provider 2">Provider 2</option>
          <option value="Provider 3">Provider 3</option>
        </select>
      </div>

      {qrValue && (
        <div className="qr-code-container">
          <h3>QR Code for {selectedProvider}</h3>
          <QRCodeCanvas value={qrValue} />
          <button className="get-po-button" onClick={handleGetPOClick}>
            Get Purchase Order data
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
