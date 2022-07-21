import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIPFSText } from "./useIPFS";
import { BigNumber, ethers } from "ethers";
import { TokenTermReader__factory } from "./contracts";
import Mustache from "mustache";
import Markdown from "react-markdown";
import copy from "clipboard-copy";
import { toast } from "react-toastify";
export const ethereum = (window as unknown as { ethereum: any }).ethereum;
export const provider = ethereum
  ? new ethers.providers.Web3Provider(ethereum)
  : undefined;
export const useTerms = (
  address: string,
  block: string,
  token?: ethers.BigNumber
) => {
  const [terms, setTerms] = useState<Record<string, string>>({});
  const termRef = useRef(terms);
  termRef.current = terms;
  const addTerm = useCallback(
    async (key: string) => {
      const [realKey, _defaultValue] = key.split(",");
      if (termRef.current[key]) {
        return;
      }
      const defaultValue = _defaultValue; //?? ``;
      if (defaultValue)
        setTerms((prev) => {
          if (prev[key]) return prev;
          return { ...prev, [key]: defaultValue };
        });
      try {
        if (!provider) return;

        const contract = TokenTermReader__factory.connect(address, provider);

        const blockTag = parseInt(block);
        if (typeof token === "undefined") {
          const term = isNaN(blockTag)
            ? await contract.term(realKey)
            : await contract.term(realKey, {
                blockTag,
              });
          if (term) setTerms((prev) => ({ ...prev, [key]: `${term}` }));
        } else {
          const term = isNaN(blockTag)
            ? await contract.tokenTerm(realKey, token)
            : await contract.tokenTerm(realKey, token, {
                blockTag,
              });
          if (term.startsWith(""))
            if (term) setTerms((prev) => ({ ...prev, [key]: `${term}` }));
        }
      } catch (e) {
        console.error("My life is so hard", e);
      }
    },
    [address, token]
  );

  //http://localhost:3000/
  // #/bafkreiahgnurv72abvrvlvl4s2k62s4kxwxuc56l7eyfwhh3tatnmt4poa::31337::0x5FbDB2315678afecb367f032d93F642f64180aa3::2::0

  // https://ipfs.io/ipfs/bafybeia45ccvqp632ysddhs3bykp3j273pkoxnuaq24r37mh3dl4g3qmvm/#/bafkreiahgnurv72abvrvlvl4s2k62s4kxwxuc56l7eyfwhh3tatnmt4poa::31337::0x5FbDB2315678afecb367f032d93F642f64180aa3::2::0

  return useMemo(() => ({ terms, addTerm }), [terms, addTerm]);
};

const Renderer: FC<{
  documentId: string;
  contractAddress: string;
  block: string;
  tokenId?: string;
}> = ({ block, contractAddress, documentId, tokenId }) => {
  const template = useIPFSText(documentId);
  const { terms, addTerm } = useTerms(
    contractAddress,
    block,
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
  if (!provider) return <div>"No provider"</div>;
  const output = Mustache.render(template, terms);
  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(output));
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
            className="m-2 rounded-md p-2 border-2 border-purple-800 bg-pink-200 text-gray-800 hover:text-gray-600"
            onClick={() => {
              copy(hash);
              toast("Copied to clipboard");
            }}
          >
            <span className="text-gray-600">Hash:</span> {hash}
          </button>
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
