import { FC, useCallback, useEffect, useState } from "react";
import { useIPFSText } from "./useIPFS";
import { BigNumber, ethers } from "ethers";
import { useChainId } from "@raydeck/usemetamask";
import { TermReader__factory } from "./contracts";
import Mustache from "mustache";
let fragment = window.location.hash;
if (fragment.startsWith("#/")) fragment = fragment.substring(2);
else if (fragment.startsWith("#")) fragment = fragment.substring(1);
const [documentId, chainId, contractAddress, block, tokenId] =
  fragment.split("::");
console.log({ documentId, chainId, contractAddress, block, tokenId });
export const ethereum = (window as unknown as { ethereum: any }).ethereum;
export const provider = ethereum
  ? new ethers.providers.Web3Provider(ethereum)
  : undefined;
export const useTerms = (address: string, token?: ethers.BigNumber) => {
  const [terms, setTerms] = useState<Record<string, string>>({});
  const addTerm = useCallback(
    async (key: string) => {
      const [realKey, defaultValue] = key.split(",");
      console.log("Evaluationg", { realKey, defaultValue });
      setTerms((prev) => {
        if (prev[key]) return prev;
        return { ...prev, [key]: defaultValue };
      });
      try {
        if (!provider) return;
        const contract = TermReader__factory.connect(address, provider);
        if (typeof token === "undefined") {
          const term = await contract.getTerm(realKey);
          setTerms((prev) => ({ ...prev, [key]: term }));
        } else {
          const term = await contract.getTokenTerm(realKey, token);
          setTerms((prev) => ({ ...prev, [key]: term }));
        }
      } catch (e) {}
    },
    [address, token]
  );
  console.log("my terms are", terms);
  return { terms, addTerm };
};
const Renderer: FC = () => {
  // const template = useIPFSText(documentId);
  const template = `Hello and I am {{myname, NAME GOES HERE}} so I ask hello there {{ipfs:CID, BOBBLE}}`; // useIPFSText(documentId);
  const _chainId = useChainId();
  console.log("I'm gonna useterms", tokenId);
  const { terms, addTerm } = useTerms(
    contractAddress,
    typeof tokenId === "undefined" ? undefined : BigNumber.from(tokenId)
  );
  useEffect(() => {
    if (template) {
      const spans = Mustache.parse(template);
      const tokens = spans
        .filter(([type]) => type === "name")
        .map(([, key]) => key);
      tokens.forEach(addTerm);
    }
  }, [template, addTerm]);
  if (!template) return <div>"Loading..."</div>;
  if (_chainId !== "0x" + Number.parseInt(chainId, 10).toString(16))
    return (
      <div>
        "Oh noes wrong chain {chainId}{" "}
        {"0x" + Number.parseInt(chainId, 10).toString(16)}
      </div>
    );
  if (!provider) return <div>"No provider"</div>;
  const output = Mustache.render(template, terms);

  console.log("temp output", output);
  //   useEffect(() => {}, [contract, template]);
  return (
    <div>
      fragment: {fragment}
      <pre>
        {JSON.stringify(
          {
            documentId,
            chainId,
            contractAddress,
            block,
            tokenId,
          },
          null,
          2
        )}
      </pre>
      <div className="prose">{output}</div>
    </div>
  );
};
export default Renderer;
