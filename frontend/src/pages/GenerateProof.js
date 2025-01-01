import React from "react";
import { useLocation } from "react-router-dom";
import "./GenerateProof.css";

const GenerateProof = () => {
  const location = useLocation();
  const provider = location.state?.provider;

  const handleGenerateProof = async () => {
    // Add your zk-proof generation logic here
    console.log("Generating proof for provider:", provider);
  };

  return (
    <div className="generate-proof-container">
      <h1>Generate Proof for {provider || "Purchase Order"}</h1>
      <button className="generate-button" onClick={handleGenerateProof}>
        Generate Proof
      </button>
    </div>
  );
};

export default GenerateProof;
