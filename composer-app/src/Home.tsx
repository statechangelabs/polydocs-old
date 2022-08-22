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
        <div>
          <ol className="">
            {contracts.map((contract) => (
              <li key={contract.id}>
                <Link to={`/contracts/${contract.id}`}>
                  <div>
                    {contract.name} ({contract.symbol}){" "}
                    {contract.deployed ? "" : "(deploying...)"}
                  </div>
                  {/* <div>{contract.title}</div> */}
                  {contract.address}{" "}
                </Link>
                {contract.deployed && (
                  <a
                    href={`${blockExplorers[parseInt(contract.chainId)]}/${
                      contract.address
                    }`}
                  >
                    View on Block Explorer
                  </a>
                )}
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
        </div>
        <ContractFinder refresh={refresh} />
      </div>
    </div>
  );
};
export default Home;
