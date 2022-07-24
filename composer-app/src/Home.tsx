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
            Manage My Smart Contract
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
            Manage Document Templates
          </h2>
        </div>
        <div className="w-full mx-auto">
          <div className="flex justify-center space-x-12 mt-8">
            <h3 className="flex text-xl font-bold text-purple-default">
              Known Templates
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
                    {decodeAB(ab).replaceAll("#", "").substring(0, 120)}
                    ...
                  </div>
                  <div className="text-xs text-gray-600">
                    {/* <a
                    href={"https://ipfs.io/ipfs/" + cid}
                    className=" hover:text-purple-light"
                  > */}
                    cid: {cid}
                    {/* </a> */}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
          <div className="flex justify-center space-x-12 mt-8">
            <h3 className="flex text-xl font-bold text-purple-default">
              My Templates
            </h3>
          </div>
          <div className="text-xs italic flex justify-center space-x-12">
            Click To Review/Revise
          </div>
          <ol className="flex flex-col justify-center mt-4 w-full grid">
            {Object.entries(templates).map(([cid, template]) => (
              <div className="flex justify-between w-full mt-4">
                <Link
                  to={"/template/" + cid}
                  className="block align-left text-purple-default hover:text-purple-light"
                >
                  <div className="truncate">
                    {template.replaceAll("#", "").substring(0, 120)}
                    ...
                  </div>
                  <div className="text-xs text-gray-60">cid: {cid}</div>
                </Link>
                <button
                  onClick={() => {
                    delete templates[cid];
                    localStorage.setItem(
                      "templates",
                      JSON.stringify(templates)
                    );
                    incrementCounter();
                  }}
                  className="btn btn-gradient"
                >
                  Delete
                </button>
              </div>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
export default Home;
