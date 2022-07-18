import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIPFSText } from "./useIPFS";
import { BigNumber, ethers } from "ethers";
import { TokenTermReader__factory } from "./contracts";
import Mustache from "mustache";
import Markdown from "react-markdown";
let fragment = window.location.hash;
if (fragment.startsWith("#/")) fragment = fragment.substring(2);
else if (fragment.startsWith("#")) fragment = fragment.substring(1);
const [documentId, chainId, contractAddress, block, tokenId] =
  fragment.split("::");
console.log({ documentId, chainId, contractAddress, block, tokenId });
const bigTokenId = BigNumber.from(tokenId);
export const ethereum = (window as unknown as { ethereum: any }).ethereum;
export const provider = ethereum
  ? new ethers.providers.Web3Provider(
      ethereum
      // "0x" + Number.parseInt(chainId, 10).toString(16)
    )
  : undefined;

export const useTerms = (address: string, token?: ethers.BigNumber) => {
  const [terms, setTerms] = useState<Record<string, string>>({});
  const termRef = useRef(terms);
  termRef.current = terms;
  const addTerm = useCallback(
    async (key: string) => {
      const [realKey, _defaultValue] = key.split(",");
      if (termRef.current[key]) {
        console.log("I have term already for ", key);
        return;
      }
      console.log("Got past with ", key, termRef.current);
      const defaultValue = _defaultValue ?? `**${realKey} MISSING**`;
      console.log("Evaluating", { realKey, defaultValue });
      setTerms((prev) => {
        if (prev[key]) return prev;
        return { ...prev, [key]: defaultValue };
      });
      try {
        console.log("Gonna try to get my data");
        console.log("Checking for a provider");
        if (!provider) return;
        console.log("got my provider");
        const contract = TokenTermReader__factory.connect(address, provider);
        console.log("Got my contract", address);
        const blockTag = parseInt(block);
        if (typeof token === "undefined") {
          console.log("getting a global term");

          const term = isNaN(blockTag)
            ? await contract.term(realKey)
            : await contract.term(realKey, {
                blockTag,
              });
          if (term) setTerms((prev) => ({ ...prev, [key]: `**${term}**` }));
          console.log("Got my glboal term", key, term);
        } else {
          console.log("Getting a token term", realKey, token);

          const term = isNaN(blockTag)
            ? await contract.tokenTerm(realKey, token)
            : await contract.tokenTerm(realKey, token, {
                blockTag,
              });
          console.log("Got my token term", key, term, blockTag);
          if (term) setTerms((prev) => ({ ...prev, [key]: `**${term}**` }));
        }
      } catch (e) {
        console.error("My life is so hard", e);
      }
    },
    [address, token]
  );
  console.log("my terms are", terms);
  //http://localhost:3000/
  // #/bafkreiahgnurv72abvrvlvl4s2k62s4kxwxuc56l7eyfwhh3tatnmt4poa::31337::0x5FbDB2315678afecb367f032d93F642f64180aa3::2::0

  // https://ipfs.io/ipfs/bafybeia45ccvqp632ysddhs3bykp3j273pkoxnuaq24r37mh3dl4g3qmvm/#/bafkreiahgnurv72abvrvlvl4s2k62s4kxwxuc56l7eyfwhh3tatnmt4poa::31337::0x5FbDB2315678afecb367f032d93F642f64180aa3::2::0

  return useMemo(() => ({ terms, addTerm }), [terms, addTerm]);
};

const Renderer: FC = () => {
  const template = useIPFSText(documentId);

  // const template = `# Hello!
  //  and I am {{Name, NAME GOES HERE}} so I ask hello there {{ipfs:CID, BOBBLE}}`; // useIPFSText(documentId);
  console.log("I'm gonna useterms", tokenId);
  const { terms, addTerm } = useTerms(
    contractAddress,
    typeof tokenId === "undefined" ? undefined : bigTokenId
  );
  useEffect(() => {
    console.log("Terms changed", terms);
  }, [terms]);
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
  if (!provider) return <div>"No provider"</div>;
  const output = Mustache.render(template, terms);
  return (
    <div className="w-screen h-screen bg-pink-800 print:bg-white p-5">
      <div className="flex-col flex h-full print:h-full">
        <div className="m-2 flex overflow-y-auto print:overflow-visible flex-row justify-center max-h-full">
          <div className="prose bg-white rounded-md shadow-md p-4 lg:p-8 m-2 w-full max-w-200 overflow-y-auto print:overflow-visible">
            <Markdown>{output}</Markdown>
          </div>
        </div>
        <div className=" w-full flex flex-row justify-center print:hidden">
          <button
            className="bg-blue-500 text-white font-medium rounded-md p-2"
            onClick={() => window.print()}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};
export default Renderer;
