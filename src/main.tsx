import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Web3Providers } from "./lib/wagmi";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3Providers>
      <App />
    </Web3Providers>
  </React.StrictMode>
);