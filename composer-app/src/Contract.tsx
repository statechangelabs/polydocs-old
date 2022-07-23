import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  TokenTermsable__factory,
  TermsableNoToken__factory,
  TokenTermReader__factory,
  TermReader__factory,
} from "./contracts";
import { ethers } from "ethers";
import useAsyncEffect from "./useAsyncEffect";
import Renderer from "./Renderer";
import { useIPFSText } from "./useIPFS";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { catchClause } from "@babel/types";
import { prepareDataForValidation } from "formik";
const ethereum = (window as unknown as { ethereum: any }).ethereum;
const provider = ethereum
  ? new ethers.providers.Web3Provider(ethereum)
  : undefined;
const Contract: FC = () => {
  const navigate = useNavigate();
  const { contractId } = useParams();

  const [contractAddress, setContractAddress] = useState("");
  useEffect(() => {
    if (contractId) setContractAddress(contractId);
  }, [contractId]);
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
  }, [contractAddress]);
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
  }, [contractAddress]);
  useEffect(() => {
    setCurrentTemplate(contractTemplate);
  }, [contractTemplate]);
  const currentTemplateText = useIPFSText(currentTemplate);
  useEffect(() => {
    setTemplateTerms([]);
  }, [currentTemplate]);
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
          templateTerms.map(async (term) => {
            const termText = await tokenContract.tokenTerm(term, tokenId);
            setCurrentTerms((prev) => ({ ...prev, [term]: termText }));
          })
        );
      } catch (e) {
        const noTokenContract = TermReader__factory.connect(
          contractAddress,
          provider
        );
        //extract terms
        await Promise.all(
          templateTerms.map(async (term) => {
            if (!currentTerms[term]) {
              const termText = await noTokenContract.globalTerm(term);
              setCurrentTerms((prev) => ({ ...prev, [term]: termText }));
            }
          })
        );
      }
    }
    console.log("FINISHED UAE");
  }, [templateTerms, contractAddress, tokenId]);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  useEffect(() => {
    if (
      contractAddress !== contractId &&
      ethers.utils.isAddress(contractAddress)
    ) {
      navigate(`/contract/${contractAddress}`);
    }
  }, [contractAddress, contractId, navigate]);
  return (
    <Fragment>
      <div className="w-screen flex-row">
        <div className="flex flex-col w-1/2">
          <div>Contract Address</div>
          <input
            value={contractAddress}
            onChange={(e) => {
              setContractAddress(e.target.value);
            }}
          />
          <a
            className="bg-blue-500 text-white border-2 border-blue-800"
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open Signing Page in New Tab
          </a>
          <div>
            renderer CID:{" "}
            {currentRenderer && (
              <a
                href={`https://ipfs.io/ipfs/${currentRenderer}`}
                target="_blank"
                rel="noreferrer"
              >
                {currentRenderer}
              </a>
            )}
          </div>
          {!showTemplateForm && (
            <div>
              <div>
                template CID:
                {currentTemplate && (
                  <a
                    href={`https://ipfs.io/ipfs/${currentTemplate}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {currentTemplate}
                  </a>
                )}
              </div>
              <button
                className="bg-blue-500 rounded text-white"
                onClick={() => setShowTemplateForm(true)}
              >
                Change
              </button>
            </div>
          )}
          {showTemplateForm && (
            <div>
              <div className="flex flex-row">
                <input
                  value={currentTemplate}
                  onChange={(e) => setCurrentTemplate(e.target.value)}
                />{" "}
                {currentTemplate !== contractTemplate && (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
                        toast("Saving new renderer to chain");
                        await txn.wait();
                        toast("Renderer saved to chain");
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
                <h2>Available Templates</h2>
                <ol>
                  {Object.entries(templates).map(([cid, template]) => (
                    <li className="list-decimal ml-10">
                      <button
                        onClick={() => {
                          setCurrentTemplate(cid);
                        }}
                        className="hover:text-gray-500 align-left"
                      >
                        <div>
                          {template.replaceAll("#", "").substring(0, 60)}
                          ...
                        </div>
                        <div className="text-xs text-gray-60">cid: {cid}</div>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/template/" + cid);
                        }}
                      >
                        Copy
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
              <button
                className="bg-blue-500 rounded text-white"
                onClick={() => setShowTemplateForm(false)}
              >
                Cancel
              </button>
            </div>
          )}
          <div>
            {templateTerms.map((term) => (
              <div>
                <div>
                  {term}: {currentTerms[term] || "UNDEFINED"}
                </div>
                <div>
                  <input
                    value={currentTerms[term]}
                    onChange={(e) => {
                      setCurrentTerms((prev) => ({
                        ...prev,
                        [term]: e.target.value,
                      }));
                    }}
                  />
                  <button
                    className="bg-blue-500 rounded text-white"
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
        <div className="flex flex-col w-1/2">
          <Renderer
            template={currentTemplateText}
            setTerms={setTemplateTerms}
            terms={currentTerms}
          />
        </div>
      </div>
    </Fragment>
  );
};
export default Contract;
