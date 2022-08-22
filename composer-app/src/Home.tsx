import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { blockExplorers } from "./chains";
import ContractFinder from "./ContractFinder";
import { useMain } from "./Main";
import { useContracts } from "./useContracts";

const Home: FC = () => {
  const { contracts, removeContract, refresh } = useContracts();

  const { setTitle } = useMain();
  useEffect(() => {
    setTitle("");
  }, []);
  return (
    <div>
      <div className="container-narrow">
        <div className="flex justify-between items-center space-x-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            Manage Contracts
          </h2>

          <Link to="/contract" className="btn btn-primary">
            Create an NFT Contract
          </Link>
        </div>
        <div className="mb-12">
          <ol className=" doc-shadow bg-white p-6 flex flex-col space-y-6">
            {contracts.map((contract, index) => (
              <li key={contract.id} className="flex justify-between space-x-6">
                <div>
                  <Link
                    to={`/contracts/${contract.id}`}
                    className="relative text-primary-default hover:text-primary-light "
                  >
                    <h2 className="">
                      <span className="font-bold text-md mr-2">
                        {contract.name}
                      </span>
                      <span className="text-gray-700">
                        ({contract.symbol}){" "}
                        {contract.deployed ? "" : "(deploying...)"}
                      </span>
                    </h2>

                    <div className="text-gray-700 text-xs">
                      {contract.address}{" "}
                    </div>
                  </Link>
                </div>
                <div>
                  {!!contract.deployed && (
                    <a
                      className="btn-gradient btn mr-2"
                      href={`${blockExplorers[parseInt(contract.chainId)]}/${
                        contract.address
                      }`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on Block Explorer
                    </a>
                  )}
                  <button
                    className="btn btn-gradient"
                    onClick={() => {
                      removeContract(contract.id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <ContractFinder refresh={refresh} />
      </div>
    </div>
  );
};
export default Home;
