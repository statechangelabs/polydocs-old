import React from "react";
import {
  MetamaskConnected,
  MetamaskDisconnected,
  MetamaskNotInstalled,
  MetamaskWrongChain,
  useReloadOnChainChange,
} from "@raydeck/usemetamask";
import GetMetamask from "./GetMetamask";

import { HashRouter } from "react-router-dom";
import Main from "./Main";
const fragment = window.location.hash;
const [, chainId] = fragment.split("::");
const base16Chain = "0x" + Number.parseInt(chainId).toString(16);

function App() {
  useReloadOnChainChange();
  return (
    <HashRouter>
      <MetamaskNotInstalled>
        <GetMetamask />
      </MetamaskNotInstalled>
      <MetamaskDisconnected>DISCONNECTED</MetamaskDisconnected>
      <MetamaskWrongChain chainIds={[base16Chain]}>
        WRONG CHAIN {chainId}
      </MetamaskWrongChain>
      <MetamaskConnected chainIds={[base16Chain]}>
        <Main />
      </MetamaskConnected>
    </HashRouter>
  );
}

export default App;
