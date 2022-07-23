import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { utils } from "ethers";
import { decodeAB, useIPFSList } from "./useIPFS";
const knownCids = [
  "bafybeih2ea4d777iaot4fodu76r5adaqf5hvp4aumfrlxk4teexs2b54ua/template.md",
];
const Home: FC = () => {
  const [contractAddress, setContractAddress] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const contractAddress = localStorage.getItem("contractAddress");
    if (contractAddress) setContractAddress(contractAddress);
  }, []);
  const templates = useMemo(() => {
    return JSON.parse(localStorage.getItem("templates") || "{}") as Record<
      string,
      string
    >;
  }, []);
  const [counter, setCounter] = useState(0);
  const incrementCounter = useCallback(() => {
    setCounter((old) => old + 1);
  }, []);
  const knownTemplates = useIPFSList(knownCids);
  return (
    <div>
      <div>
        <h2>Manage My Contract</h2>

        <div>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
          <button
            disabled={!utils.isAddress(contractAddress)}
            onClick={() => {
              navigate("/contract/" + contractAddress);
            }}
          >
            Manage
          </button>
        </div>
      </div>
      <div>
        <h2>Manage Template Documents</h2>
        <h3>Known Documents</h3>
        <ol>
          {Object.entries(knownTemplates).map(([cid, ab]) => (
            <li className="list-decimal ml-10">
              <button
                onClick={() => {
                  navigate("/template/" + cid);
                }}
              >
                <div>
                  {decodeAB(ab).replaceAll("#", "").substring(0, 60)}
                  ...
                </div>
                <div className="text-xs text-gray-60">cid: {cid}</div>
              </button>
            </li>
          ))}
        </ol>
        <h3>My Documents</h3>
        <ol>
          {Object.entries(templates).map(([cid, template]) => (
            <li className="list-decimal ml-10">
              <button
                onClick={() => {
                  navigate("/template/" + cid);
                }}
              >
                <div>
                  {template.replaceAll("#", "").substring(0, 60)}
                  ...
                </div>
                <div className="text-xs text-gray-60">cid: {cid}</div>
              </button>
              <button
                onClick={() => {
                  delete templates[cid];
                  localStorage.setItem("templates", JSON.stringify(templates));
                  incrementCounter();
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
export default Home;
