import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="w-full">
      <div className="w-full">
        <div className="flex justify-center space-x-12">
          <h2 className="flex text-3xl font-bold text-purple-default">
            Manage My Contract
          </h2>
        </div>
        <div className="flex justify-center space-x-2">
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="w-80 text-xs"
          />
          <button
            disabled={!utils.isAddress(contractAddress)}
            onClick={() => {
              navigate("/contract/" + contractAddress);
            }}
            className="btn btn-primary"
          >
            Manage
          </button>
        </div>
      </div>
      <div>
        <div className="flex justify-center space-x-12 mt-8">
          <h2 className="flex text-3xl font-bold text-purple-default">
            Manage Template Documents
          </h2>
        </div>
        <div className="w-3/4 mx-auto">
          <div className="flex justify-center space-x-12 mt-8">
            <h3 className="flex text-xl font-bold text-purple-default">
              Known Documents
            </h3>
          </div>
          <div className="text-xs italic flex justify-center space-x-12">
            Click To Review/Revise
          </div>
          <ol className="flex justify-center space-x-12 mt-4">
            {Object.entries(knownTemplates).map(([cid, ab]) => (
              <li className=" ml-10">
                <Link
                  to={"/template/" + cid}
                  className="text-gray-60 mt-4 text-purple-default hover:text-purple-light"
                >
                  <div>
                    {decodeAB(ab).replaceAll("#", "").substring(0, 60)}
                    ...
                  </div>
                </Link>
                <div className="text-xs text-gray-600">
                  {/* <a
                    href={"https://ipfs.io/ipfs/" + cid}
                    className=" hover:text-purple-light"
                  > */}
                  cid: {cid}
                  {/* </a> */}
                </div>
              </li>
            ))}
          </ol>
          <div className="flex justify-center space-x-12 mt-8">
            <h3 className="flex text-xl font-bold text-purple-default">
              My Documents
            </h3>
          </div>
          <div className="text-xs italic flex justify-center space-x-12">
            Click To Review/Revise
          </div>
          <ol>
            {Object.entries(templates).map(([cid, template]) => (
              <li className=" ml-10">
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
                    localStorage.setItem(
                      "templates",
                      JSON.stringify(templates)
                    );
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
    </div>
  );
};
export default Home;
