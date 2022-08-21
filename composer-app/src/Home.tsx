import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { blockExplorers } from "./chains";
import { useMain } from "./Main";
import { useContracts } from "./useContracts";

const Home: FC = () => {
  const { contracts, removeContract } = useContracts();

  const { setTitle } = useMain();
  useEffect(() => {
    setTitle("My Smart Contracts");
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
          <div className="justify-center flex">
            <Link to="/contract" className="btn btn-primary">
              Create an NFT Contract
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
