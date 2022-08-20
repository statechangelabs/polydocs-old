import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { utils } from "ethers";
import { decodeAB, useIPFSList } from "./useIPFS";
import { useMain } from "./Main";
import { useKnownTemplates } from "./useKnownTemplates";

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
  const knownTemplates = useKnownTemplates();

  const { setTitle } = useMain();
  useEffect(() => {
    setTitle("Dashboard");
  }, []);
  return (
    <div>
      <div className="mb-16">
        <div className="flex justify-center space-x-12">
          <h2 className="flex text-3xl font-bold text-black mb-4">
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
          <h2 className="flex text-3xl font-bold text-black">
            Manage Document Templates
          </h2>
        </div>
        <div className="w-full mx-auto">
          <div className="mb-12">
            <div className="flex justify-center space-x-12 mt-8">
              <h3 className="flex text-xl font-bold text-black">
                Known Templates
              </h3>
            </div>
            <div className="text-xs italic flex justify-center space-x-12 opacity-75 mb-4">
              Click To Review/Revise
            </div>
            <ul className="max-w-4xl mx-auto">
              {knownTemplates.map(({ cid, name }) => (
                <li>
                  <Link
                    to={"/template/" + cid}
                    className="text-gray-60 mt-4 text-purple-default hover:text-purple-light"
                  >
                    <div>
                      {name}
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
            </ul>
          </div>
          <div>
            <div className="flex justify-center space-x-12 mt-8">
              <h3 className="flex text-xl font-bold text-black">
                My Templates
              </h3>
            </div>
            <div className="text-xs italic flex justify-center space-x-12">
              Click To Review/Revise
            </div>
            <ul className="max-w-4xl mx-auto">
              {Object.entries(templates).map(([cid, template]) => (
                <div className="flex justify-between mt-4">
                  <Link
                    to={"/template/" + cid}
                    className="w-3/4 block align-left text-purple-default hover:text-purple-light"
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
