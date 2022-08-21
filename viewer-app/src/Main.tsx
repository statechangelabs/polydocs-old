import {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useIPFSDataUri, useIPFSText } from "./useIPFS";
import { BigNumber, ethers } from "ethers";
import {
  TokenTermReader__factory,
  TokenTermsable__factory,
  TermsableNoToken__factory,
  TermReader__factory,
  TermsableBase__factory,
  ERC721Termsable__factory,
} from "./contracts";
import Mustache from "mustache";
import Markdown from "react-markdown";
import copy from "clipboard-copy";
import { toast } from "react-toastify";
import Topography from "./topography.svg";
import Logo from "./logo.svg";
import { FaClipboard } from "react-icons/fa";
import useAsyncEffect from "./useAsyncEffect";
import Loading from "./Loading";
export const ethereum = (window as unknown as { ethereum: any }).ethereum;
export const provider = ethereum
  ? new ethers.providers.Web3Provider(ethereum)
  : undefined;
const useSign = (contractAddress: string, tokenId?: string) => {
  const [isSigning, setIsSigning] = useState(false);
  const sign = useCallback(async () => {
    if (!provider) return;
    if (typeof tokenId !== "undefined") {
      const contract = TokenTermsable__factory.connect(
        contractAddress,
        provider.getSigner()
      );

      const href = await contract.termsUrl(tokenId);
      setIsSigning(true);
      toast("Please approve your signature...");
      if (window.location.href.endsWith(href.substring("ipfs://".length))) {
        try {
          const txn = await contract.acceptTerms(tokenId, href);
          toast("Waiting for chain to record your signature...");
          await txn.wait();
        } catch (e) {
          console.error(e);
        }
      } else {
        toast("This is not the correct page to sign the terms!", {
          type: "error",
        });
      }
    } else {
      const contract = TermsableNoToken__factory.connect(
        contractAddress,
        provider.getSigner()
      );

      const href = await contract.termsUrl();

      if (window.location.href.endsWith(href.substring("ipfs://".length))) {
        const txn = await contract.acceptTerms(href);
        toast("Waiting for chain to record your signature...");
        await txn.wait();
      } else {
        toast("This is not the correct page to sign the terms!", {
          type: "error",
        });
      }
    }
    setIsSigning(false);
  }, [contractAddress, tokenId]);
  return { isSigning, sign };
};
export const useTerms = (
  address: string,
  block: string,
  token?: ethers.BigNumber
) => {
  const [terms, setTerms] = useState<Record<string, string>>({});
  const [termBlocks, setTermBlocks] = useState<Record<string, number>>({});
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

        const blockTag = parseInt(block);
        if (typeof token === "undefined") {
          const contract = TermReader__factory.connect(address, provider);
          const term = isNaN(blockTag)
            ? await contract.globalTerm(realKey)
            : await contract.globalTerm(realKey, {
                blockTag,
              });
          if (term) setTerms((prev) => ({ ...prev, [key]: `${term}` }));

          const events = await contract.queryFilter(
            contract.filters.GlobalTermChanged(ethers.utils.keccak256(realKey)),
            0,
            blockTag
          );
          const lastEvent = events.pop()?.blockNumber;
          if (lastEvent)
            setTermBlocks((prev) => ({ ...prev, [key]: lastEvent }));
        } else {
          const contract = TokenTermReader__factory.connect(address, provider);
          const term = isNaN(blockTag)
            ? await contract.tokenTerm(realKey, token)
            : await contract.tokenTerm(realKey, token, {
                blockTag,
              });
          if (term.startsWith(""))
            if (term) setTerms((prev) => ({ ...prev, [key]: `${term}` }));

          //@TODO Missing blocktags for token-based terms
        }
      } catch (e) {
        console.error("My life is so hard", e);
      }
    },
    [address, token, block]
  );

  //http://localhost:3000/
  // #/bafkreiahgnurv72abvrvlvl4s2k62s4kxwxuc56l7eyfwhh3tatnmt4poa::31337::0x5FbDB2315678afecb367f032d93F642f64180aa3::2::0

  // https://ipfs.io/ipfs/bafybeia45ccvqp632ysddhs3bykp3j273pkoxnuaq24r37mh3dl4g3qmvm/#/bafkreiahgnurv72abvrvlvl4s2k62s4kxwxuc56l7eyfwhh3tatnmt4poa::31337::0x5FbDB2315678afecb367f032d93F642f64180aa3::2::0
  const reset = useCallback(() => {
    setTerms({});
  }, []);
  const setTerm = useCallback((term: string, value: string) => {
    setTerms((old) => ({ ...old, [term]: term }));
  }, []);
  return useMemo(
    () => ({ terms, addTerm, reset, setTerm, termBlocks }),
    [terms, addTerm, reset, setTerm, termBlocks]
  );
};
const Renderer: FC<{
  documentId: string;
  contractAddress: string;
  block: string;
  tokenId?: string;
}> = ({ block, contractAddress, documentId, tokenId }) => {
  const [isSigned, setIsSigned] = useState(false);
  useAsyncEffect(async () => {
    if (!provider) return;
    if (typeof tokenId !== "undefined") {
      const contract = TokenTermsable__factory.connect(
        contractAddress,
        provider
      );
      const accepted = await contract.acceptedTerms(
        provider.getSigner().getAddress(),
        tokenId
      );
      if (accepted) setIsSigned(true);
    } else {
      const contract = TermsableNoToken__factory.connect(
        contractAddress,
        provider.getSigner()
      );

      const accepted = await contract.acceptedTerms(
        provider.getSigner().getAddress()
      );
      if (accepted) provider.getSigner();
    }
  }, []);
  const [URI, setURI] = useState("");
  const [lastURIBlock, setLastURIBlock] = useState(0);
  useAsyncEffect(async () => {
    if (!provider) return;
    const contract = ERC721Termsable__factory.connect(
      contractAddress,
      provider.getSigner()
    );
    const uri = (await contract.URI({ blockTag: parseInt(block) })) as string;
    const strippedUri = uri.split("://").pop() || uri;
    setURI(strippedUri);
    const events = await contract.queryFilter(
      contract.filters.UpdatedURI(),
      0,
      parseInt(block)
    );
    const lastEvent = events.pop()?.blockNumber;
    if (lastEvent) setLastURIBlock(lastEvent);
  }, [contractAddress, provider]);
  console.log("Last URI block is", lastURIBlock);
  const json = useIPFSText(URI);
  const obj = json ? JSON.parse(json) : {};
  const image = useIPFSDataUri(
    (obj.image && obj.image.split("://").pop()) || obj.image
  );
  const jsonTerms = obj.terms as Record<string, string>;
  const template = useIPFSText(documentId);
  const { terms, addTerm, termBlocks } = useTerms(
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
  const { isSigning, sign: _sign } = useSign(contractAddress, tokenId);
  const sign = useCallback(async () => {
    await _sign();
    toast("Signature recorded!");
    setIsSigned(true);
  }, [_sign]);
  if (!template) return <Loading />;
  if (!provider) return <div>"No provider"</div>;
  const overrideTerms = Object.entries(terms)
    .filter(([key]) => {
      if (!jsonTerms[key] || termBlocks[key] > lastURIBlock) {
        return true;
      }
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
  const output = Mustache.render(template, { ...jsonTerms, overrideTerms });
  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(output));

  return (
    <Fragment>
      <div style={{ background: `url(${Topography})` }}>
        <div className="relative max-w-[760px] mx-auto flex flex-col h-screen">
          <header className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img src={Logo} alt="Logo" className="w-6" />
              <h1 className="text-lg font-bold text-primary-default">
                PolyDocs
              </h1>
            </div>

            <div className="flex flex-row justify-end print:hidden">
              <button
                className=" text-purple-600 hover:text-gray-800 transition font-medium text-xs"
                onClick={() => {
                  copy(hash);
                  toast("Copied to clipboard");
                }}
              >
                <span className="text-gray-600">Hash:</span> {hash}
                <FaClipboard className="inline ml-1 -mt-1" />
              </button>
            </div>
          </header>
          <div className="scrollable flex-grow w-full prose mx-auto  bg-white doc-shadow overflow-y-scroll print:overflow-visible print:shadow-none">
            {image && (
              <img
                src={image}
                alt="Contract Image"
                className="h-64 object-contain"
              />
            )}
            <div className="p-6 lg:p-8">
              <Markdown>{output}</Markdown>
            </div>
          </div>

          <div className="py-4">
            <div className="prose mx-auto flex flex-row justify-end mt-4">
              <div className=" flex flex-row  print:hidden gap-4">
                <button
                  className="btn btn-gradient"
                  onClick={() => window.print()}
                  disabled={isSigned || isSigning}
                >
                  Print
                </button>
                <button
                  className="btn btn-gradient"
                  onClick={() => {
                    copy(window.location.href);
                    toast("Copied to clipboard");
                  }}
                  disabled={isSigned || isSigning}
                >
                  Copy Unique URL
                </button>
                <button
                  className={[
                    "btn ",
                    isSigning || isSigned
                      ? "text-black border bg-gradient-to-r from-gray-200 to-gray-400 hover:background-gray-200"
                      : "btn-primary",
                  ].join(" ")}
                  onClick={() => {
                    if (!isSigned && !isSigning) sign();
                  }}
                >
                  {isSigned
                    ? "You're all set!"
                    : isSigning
                    ? "Signing..."
                    : terms["signatureLabel"] || "Agree To Terms"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Renderer;
