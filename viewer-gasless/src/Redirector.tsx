import { FC, useState } from "react";
import { BigNumber, ethers } from "ethers";
import {
  TermsableNoToken__factory,
  TokenTermsable__factory,
} from "./contracts";
import useAsyncEffect from "./useAsyncEffect";
const providers: Record<string, string> = {
  "137": process.env.REACT_APP_POLYGON_RPC || "",
  "80001": process.env.REACT_APP_MUMBAI_RPC || "",
};

let fragment = window.location.hash;
if (fragment.startsWith("#/")) fragment = fragment.substring(2);
else if (fragment.startsWith("#")) fragment = fragment.substring(1);
const [documentId, chain, address, token] = fragment.split("::");
const validGaslessRenderers = [
  "bafybeig44fabnqp66umyilergxl6bzwno3ntill3yo2gtzzmyhochbchhy",
];
const Redirector: FC = () => {
  const [error, setError] = useState("");
  console.log("Hello");
  useAsyncEffect(async () => {
    if (!address) {
      console.log("No address to work with");
      return;
    }

    if (!providers[chain]) {
      setError("No provider for chain " + chain);
      return;
    }
    try {
      const provider = new ethers.providers.JsonRpcProvider(providers[chain]);
      if (token) {
        const contract = TokenTermsable__factory.connect(address, provider);
        const termsUrl = await contract.termsUrl(BigNumber.from(token));
        const [, fragment] = termsUrl.split("://");
        console.log("in token view", fragment);
        window.location.href =
          window.location.protocol +
          "//" +
          window.location.host +
          "/#/" +
          fragment;
        window.location.reload();
      } else {
        const contract = TermsableNoToken__factory.connect(address, provider);
        const termsUrl = await contract.termsUrl();
        const [, fragmentBase] = termsUrl.split("://");
        const [renderer, fragment] = fragmentBase.split("/#/");
        //validate renderer
        if (validGaslessRenderers.includes(renderer)) {
          window.location.href =
            window.location.protocol +
            "//" +
            window.location.host +
            "/#/" +
            fragment;
          window.location.reload();
          console.log("in nontotken view", fragment);
        } else {
          window.location.href =
            "https://ipfs.io/ipfs/" + renderer + ("/#/" + fragment);
        }
        // }
      }
    } catch (e) {
      console.log("got an error", e);
    }
  }, []);
  if (error) {
    return <div>Error: {error}</div>;
  } else {
    return <div>LOading...</div>;
  }
};
export default Redirector;
