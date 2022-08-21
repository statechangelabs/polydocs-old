import {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  TokenTermsable__factory,
  TermsableNoToken__factory,
  TokenTermReader__factory,
  TermReader__factory,
} from "./contracts";
import { ethers } from "ethers";
import useAsyncEffect from "./useAsyncEffect";
import { useMain } from "./Main";
import Renderer from "./Renderer";
import { useIPFSText } from "./useIPFS";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useKnownTemplates } from "./useKnownTemplates";
import { useProvider } from "./provider";
const knownRenderers = [
  "bafybeig44fabnqp66umyilergxl6bzwno3ntill3yo2gtzzmyhochbchhy",
];
const Contract: FC = () => {
  console.log("Render");
  const knownTemplates = useKnownTemplates();
  const navigate = useNavigate();
  const { contractId } = useParams();
  const [chainId, contractAddress] = (contractId || "").split("::");
  const provider = useProvider(chainId);
  const [currentRenderer, setCurrentRenderer] = useState("");
  const [currentBlock, setCurrentBlock] = useState("");
  const [currentTemplate, setCurrentTemplate] = useState("");
  const [contractTemplate, setContractTemplate] = useState("");
  const [currentTerms, setCurrentTerms] = useState<Record<string, string>>({});
  const [templateTerms, setTemplateTerms] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const updateUrl = useCallback(async () => {
    if (!provider) return;
    const noTokenContract = TermsableNoToken__factory.connect(
      contractAddress,
      provider
    );
    setCurrentUrl(
      await noTokenContract.termsUrlWithPrefix("https://ipfs.io/ipfs/")
    );
  }, [contractAddress, provider]);
  useEffect(() => {
    updateUrl();
  }, [updateUrl, currentTemplate, currentTerms, currentRenderer]);
  const [tokenId, setTokenId] = useState(0);
  const templates = useMemo(() => {
    const templates: Record<string, string> = JSON.parse(
      localStorage.getItem("templates") || "{}"
    );
    console.log("I will use templates", templates);
    return templates;
  }, []);
  const { setTitle } = useMain();
  useEffect(() => {
    setTitle("Contract");
  }, []);
  useAsyncEffect(async () => {
    if (!provider) return;
    if (ethers.utils.isAddress(contractAddress)) {
      const tokenContract = TokenTermsable__factory.connect(
        contractAddress,
        provider
      );
      try {
        console.log("Trtying to get from contracts");
        const tokenRenderer = await tokenContract.tokenRenderer(tokenId);
        console.log(" iam tryign to get the template cid");
        setContractTemplate(tokenRenderer);
      } catch (e) {
        console.log("trying another way");
        const noTokenContract = TermsableNoToken__factory.connect(
          contractAddress,
          provider
        );
        console.log("On this other path", await noTokenContract.renderer());
        setCurrentRenderer(await noTokenContract.renderer());
        setContractTemplate(await noTokenContract.docTemplate());
      }
    } else {
      setCurrentRenderer("");
      setContractTemplate("");
      setCurrentTerms({});
    }
  }, [contractAddress, provider]);
  useEffect(() => {
    setCurrentTemplate(contractTemplate);
  }, [contractTemplate]);
  const currentTemplateText = useIPFSText(currentTemplate);
  useEffect(() => {
    setTemplateTerms([]);
  }, [currentTemplate]);
  const currentTermsRef = useRef(currentTerms);
  useEffect(() => {
    currentTermsRef.current = currentTerms;
  }, [currentTerms]);
  useAsyncEffect(async () => {
    console.log("starting UAE");
    if (
      templateTerms &&
      templateTerms.length &&
      ethers.utils.isAddress(contractAddress) &&
      provider
    ) {
      const tokenContract = TokenTermReader__factory.connect(
        contractAddress,
        provider
      );
      try {
        await Promise.all(
          templateTerms
            .filter((v, i, a) => a.indexOf(v) === i)
            .filter((v) => !currentTermsRef.current[v])
            .map(async (term) => {
              const termText = await tokenContract.tokenTerm(term, tokenId);
              setCurrentTerms((prev) =>
                prev[term] ? prev : { ...prev, [term]: termText }
              );
            })
        );
      } catch (e) {
        const noTokenContract = TermReader__factory.connect(
          contractAddress,
          provider
        );
        //extract terms
        await Promise.all(
          templateTerms
            .filter((v) => !currentTermsRef.current[v])
            .map(async (term) => {
              if (!currentTerms[term]) {
                const termText = await noTokenContract.globalTerm(term);
                setCurrentTerms((prev) =>
                  prev[term] ? prev : { ...prev, [term]: termText }
                );
              }
            })
        );
      }
    }
    console.log("FINISHED UAE");
  }, [templateTerms, contractAddress, tokenId]);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  // useEffect(() => {
  //   if (
  //     contractAddress !== contractId &&
  //     ethers.utils.isAddress(contractAddress)
  //   ) {
  //     navigate(`/contract/${contractAddress}`);
  //     localStorage.setItem("contractAddress", contractAddress);
  //   }
  // }, [contractAddress, contractId, navigate]);
  // const knownTemplates = useIPFSList(knownCids);
  return (
    <Fragment>
      <div>
        <div className="flex space-x-6 items-center mb-12 bg-white doc-shadow p-6">
          {/* <h2 className="text-xl font-semibold ">Contract Address</h2>
          <input
            className="border border-gray-200 rounded-none p-1  flex-grow"
            value={contractAddress}
            onChange={(e) => {
              setContractAddress(e.target.value);
            }}
          /> */}
          <div>
            <a
              className="btn btn-primary text-center"
              href={`https://sign.polydocs.xyz/#/redirect::${chainId}::${contractAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              Open Signing Page in New Tab
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6">
          <div>
            <div className="bg-white doc-shadow p-6 mb-6">
              <span className="font-semibold mr-6">Renderer CID:</span>{" "}
              {currentRenderer && (
                <a
                  href={`https://ipfs.io/ipfs/${currentRenderer}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {currentRenderer.substring(0, 6)}...
                  {currentRenderer.substring(currentRenderer.length - 4)}
                </a>
              )}
              {currentRenderer === knownRenderers[0] && (
                <span className="ml-2 text-xs text-teal-dark">
                  Using the best renderer!
                </span>
              )}
            </div>
            <div className="bg-white doc-shadow p-6">
              <div className="mb-3">
                <h2 className="text-lg font-semibold">Document Template</h2>
                {currentRenderer !== knownRenderers[0] && (
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      console.log("Uou are pressing the button");
                      if (!provider) return;
                      const contract = TermsableNoToken__factory.connect(
                        contractAddress,
                        provider?.getSigner()
                      );
                      try {
                        const txn = await contract.setGlobalRenderer(
                          knownRenderers[0]
                        );
                        toast("Saving renderer to blockchain");
                        txn.wait();
                        toast("Saved to blockchain");
                        setCurrentRenderer(knownRenderers[0]);
                      } catch (e) {
                        toast(
                          "Error saving to blockchain: " +
                            (e as { reason: string }).reason.substring(14)
                        );
                      }
                    }}
                  >
                    Use Default Renderer
                  </button>
                )}
              </div>

              {!showTemplateForm && (
                <div>
                  <div>
                    <span className="font-semibold mr-6">Template CID:</span>
                    {currentTemplate && (
                      <a
                        href={`https://ipfs.io/ipfs/${currentTemplate}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {currentTemplate.substring(0, 6)}...
                        {currentTemplate.substring(currentTemplate.length - 4)}
                      </a>
                    )}
                  </div>
                  <button
                    className="btn btn-primary mt-6"
                    onClick={() => setShowTemplateForm(true)}
                  >
                    Change
                  </button>
                </div>
              )}
              {showTemplateForm && (
                <div>
                  <div className="flex flex-col mb-6">
                    <input
                      className="border border-gray-200 p-1 rounded-none mb-3"
                      value={currentTemplate}
                      onChange={(e) => setCurrentTemplate(e.target.value)}
                    />{" "}
                    {currentTemplate !== contractTemplate && (
                      <button
                        className="btn btn-primary"
                        onClick={async () => {
                          if (!provider) return;
                          const contract = TermsableNoToken__factory.connect(
                            contractAddress,
                            provider.getSigner()
                          );
                          try {
                            const txn = await contract.setGlobalTemplate(
                              currentTemplate
                            );
                            toast("Saving new template to chain");
                            await txn.wait();
                            toast("Template saved to chain");
                            updateUrl();
                          } catch (e) {
                            let reason = (e as { reason: any }).reason;
                            if (reason.startsWith("execution reverted: "))
                              reason = reason.substring(
                                "execution reverted: ".length
                              );
                            toast("Could not save because " + reason, {
                              type: "error",
                            });
                          }
                        }}
                      >
                        Update Template
                      </button>
                    )}
                  </div>
                  <div>
                    <p className="text-xs opacity-75 mb-2">
                      Click on a template to preview how it would work in your
                      contract. Click copy to make a modified version of the
                      template.
                    </p>
                    <h3 className="font-semibold mb-2">Known Templates</h3>
                    <ul>
                      {knownTemplates.map(({ cid, name }) => (
                        <li className="flex justify-between  mb-4 ">
                          <button
                            onClick={() => {
                              setCurrentTemplate(cid);
                            }}
                            className="text-gray-60 text-primary-default hover:text-primary-light truncate"
                          >
                            <div>
                              {name}
                              ...
                            </div>
                            <div className="text-xs text-gray-60">
                              cid: {cid}
                            </div>
                          </button>
                          <button
                            className="btn btn-gradient !px-4 ml-4"
                            onClick={() => {
                              navigate("/template/" + cid);
                            }}
                          >
                            Copy
                          </button>
                        </li>
                      ))}
                    </ul>
                    <h3 className="font-semibold mb-2">My Templates</h3>
                    <ul>
                      {Object.entries(templates).map(([cid, template]) => (
                        <li className="flex justify-between  mb-4 ">
                          <button
                            onClick={() => {
                              setCurrentTemplate(cid);
                            }}
                            className="text-gray-60 text-primary-default hover:text-primary-light truncate"
                          >
                            <div>
                              {template.replaceAll("#", "").substring(0, 60)}
                              ...
                            </div>
                            <div className="text-xs text-gray-60">
                              cid: {cid}
                            </div>
                          </button>
                          <button
                            className="btn btn-gradient !px-4 ml-4"
                            onClick={() => {
                              navigate("/template/" + cid);
                            }}
                          >
                            Copy
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    className="btn btn-gradient"
                    onClick={() => setShowTemplateForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white doc-shadow p-6">
            <h2 className="text-lg font-semibold">Terms used in contract</h2>
            {templateTerms
              .filter((v, i, a) => a.indexOf(v) === i)
              .map((term) => (
                <div>
                  <div className="text-xs text-black text-opacity-75 mt-4">
                    {term}
                  </div>
                  <div className="w-full flex">
                    <input
                      className="border border-gray-200 p-1 rounded-none flex-grow"
                      value={currentTerms[term]}
                      onChange={(e) => {
                        setCurrentTerms((prev) => ({
                          ...prev,
                          [term]: e.target.value,
                        }));
                      }}
                    />
                    <button
                      className="btn btn-gradient !px-4 ml-4"
                      onClick={async () => {
                        if (!provider) return;
                        const contract = TermsableNoToken__factory.connect(
                          contractAddress,
                          provider.getSigner()
                        );
                        try {
                          const txn = await contract.setGlobalTerm(
                            term,
                            currentTerms[term]
                          );
                          console.log("Saving", term, currentTerms[term]);
                          toast("Saving new term to chain");
                          await txn.wait();
                          toast("Term saved to chain");
                          updateUrl();
                        } catch (e) {
                          let reason = (e as { reason: any }).reason;
                          if (reason.startsWith("execution reverted: "))
                            reason = reason.substring(
                              "execution reverted: ".length
                            );
                          toast("Could not save because " + reason, {
                            type: "error",
                          });
                        }
                        updateUrl();
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-col mt-12">
          <div className="prose mx-auto">
            <Renderer
              template={currentTemplateText}
              setTerms={setTemplateTerms}
              terms={currentTerms}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Contract;
