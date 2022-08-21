import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { blockExplorers } from "./chains";
import { useMain } from "./Main";
import { useContracts } from "./useContracts";
import { useKnownTemplates } from "./useKnownTemplates";

const Home: FC = () => {
  const { contracts, removeContract } = useContracts();
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
            Manage My Smart Contracts
          </h2>
        </div>
        <div>
          <ol className="">
            {contracts.map((contract) => (
              <li key={contract.id}>
                <Link to={`/contracts/${contract.id}`}>
                  <div>
                    {contract.name} ({contract.symbol})
                  </div>
                  {/* <div>{contract.title}</div> */}
                  {contract.address}{" "}
                </Link>
                <a
                  href={`${blockExplorers[parseInt(contract.chainId)]}/${
                    contract.address
                  }`}
                >
                  View on Block Explorer
                </a>
                <button
                  onClick={() => {
                    removeContract(contract.id);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ol>
          <div className="justify-center flex">
            <Link to="/contract" className="btn btn-primary">
              Create an NFT Contract
            </Link>
          </div>
          {/* <input
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
          </button> */}
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
                <li className="pt-4" key={cid}>
                  <Link
                    to={"/template/" + cid}
                    className="text-gray-60 mt-4 text-primary-default hover:text-primary-light"
                  >
                    <div>{name}</div>
                    <div className="text-xs text-gray-600">
                      {/* <a
                    href={"https://ipfs.io/ipfs/" + cid}
                    className=" hover:text-primary-light"
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
                <div className="flex justify-between mt-4" key={cid}>
                  <Link
                    to={"/template/" + cid}
                    className="w-3/4 block align-left text-primary-default hover:text-primary-light"
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
