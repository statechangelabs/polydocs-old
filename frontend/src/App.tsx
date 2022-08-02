import React, { useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ethers } from "ethers";
import {} from "@raydeck/usemetamask";
import { eth_requestAccounts } from "@raydeck/metamask-ts";
function App() {
  const clicker = useCallback(async () => {
    console.log("Starting clicker");
    const p = new ethers.providers.Web3Provider((window as any).ethereum);
    console.log("I have an p", p);
    const message = "Hello darkness my old friend";
    console.log("message", message);
    const hash = ethers.utils.keccak256(
      ethers.utils.formatBytes32String(message)
    );
    console.log("hash", hash);
    const signature = await p.getSigner().signMessage(message);
    console.log("signature", signature);
    const signer = ethers.utils.verifyMessage(message, signature);
    console.log("signer", signer);
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={eth_requestAccounts}>Click me 1</button>
        <button onClick={clicker}>Click me 3000</button>
      </header>
    </div>
  );
}

export default App;
