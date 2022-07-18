import React, { Fragment } from "react";
import {
  MetamaskConnected,
  MetamaskDisconnected,
  MetamaskNotInstalled,
  MetamaskWrongChain,
  useReloadOnChainChange,
} from "@raydeck/usemetamask";
import GetMetamask from "./GetMetamask";

import Main from "./Main";
import WrongChain from "./WrongChain";
const fragment = window.location.hash;
const [, chainId] = fragment.split("::");
const base16Chain = "0x" + Number.parseInt(chainId).toString(16);

function App() {
  useReloadOnChainChange();
  return (
    <Fragment>
      <MetamaskNotInstalled>
        <GetMetamask />
      </MetamaskNotInstalled>
      <MetamaskDisconnected>DISCONNECTED</MetamaskDisconnected>
      <MetamaskWrongChain chainIds={[base16Chain]}>
        <WrongChain />
      </MetamaskWrongChain>
      <MetamaskConnected chainIds={[base16Chain]}>
        <Main />
      </MetamaskConnected>
    </Fragment>
  );
}

export default App;
