import React, { Fragment } from "react";
import {
  MetamaskConnected,
  MetamaskDisconnected,
  MetamaskNotInstalled,
  MetamaskWrongChain,
  useReloadOnChainChange,
} from "@raydeck/usemetamask";
import GetMetamask from "./GetMetamask";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Main from "./Main";
import WrongChain from "./WrongChain";
let fragment = window.location.hash;
if (fragment.startsWith("#/")) fragment = fragment.substring(2);
else if (fragment.startsWith("#")) fragment = fragment.substring(1);
const [documentId, chainId, contractAddress, block, tokenId] =
  fragment.split("::");
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
        <Main
          block={block}
          contractAddress={contractAddress}
          documentId={documentId}
          tokenId={tokenId}
        />
      </MetamaskConnected>
      <ToastContainer />
    </Fragment>
  );
}

export default App;
