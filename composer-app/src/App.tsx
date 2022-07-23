import React, { FC, Fragment } from "react";
import {
  MetamaskConnected,
  MetamaskDisconnected,
  MetamaskNotInstalled,
  MetamaskWrongChain,
} from "@raydeck/usemetamask";
import { HashRouter, Route, Routes } from "react-router-dom";
import GetMetamask from "./GetMetamask";
import WrongChain from "./WrongChain";
import Disconnected from "./Disconnected";
import { ToastContainer } from "react-toastify";
import Main from "./Main";
import "inter-ui";
import Redirector from "./Redirector";
const App: FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/redirect/:key" element={<Redirector />} />
        <Route path="*" element={<RestOfApp />} />
      </Routes>
      <ToastContainer />
    </HashRouter>
  );
};

const RestOfApp: FC = () => {
  return (
    <Fragment>
      <MetamaskNotInstalled>
        <GetMetamask />
      </MetamaskNotInstalled>
      <MetamaskDisconnected>
        <Disconnected />
      </MetamaskDisconnected>
      <MetamaskWrongChain>
        <WrongChain />
      </MetamaskWrongChain>
      <MetamaskConnected>
        <Main />
      </MetamaskConnected>
    </Fragment>
  );
};

export default App;
