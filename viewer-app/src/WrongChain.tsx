import { wallet_switchEthereumChain } from "@raydeck/metamask-ts";
import { useChainId } from "@raydeck/usemetamask";
import Logo from "./logo.png";
import { FaGithub } from "react-icons/fa";
const chainNames: Record<number, string> = {
  1: "mainnet",
  3: "ropsten",
  4: "rinkeby",
  5: "goerli",
  42: "kovan",
  31337: "Hardhat 31337",
  1337: "Hardhat 1337",
  137: "Polygon Mainnet",
  80001: "Polygon Mumbai",
};
export default function WrongChain() {
  const chainId = useChainId();
  const targetChain = window.location.hash.split("::")[1];
  const isMatch = parseInt(chainId, 16).toString(10) === targetChain;
  if (!isMatch) {
    return (
      <div className="h-screen w-screen flex flex-col gap-2 justify-center align-center bg-gradient-to-r from-pink-600 to-blue-900 ">
        <h1 className="flex flex-row justify-center text-5xl font-extrabold m-5">
          <img src={Logo} alt="Logo" className="h-16" />
          <span className="text-purple-300">Poly</span>Chat
        </h1>
        <p className="flex flex-row justify-center text-2xl font-bold m-5 text-purple-300">
          Select a supported network
        </p>

        {[targetChain].map((chainId) => (
          <div className="flex flex-row justify-center ">
            <button
              className="w-80 bg-black bg-opacity-60 text-white hover:text-gray-200 hover:bg-opacity-80 font-bold py-2 px-4 border-1 rounded-md transition transition-opacity flex items-center justify-center"
              onClick={async () => {
                await wallet_switchEthereumChain(
                  "0x" + parseInt(chainId, 10).toString(16)
                );
                window.location.reload();
              }}
            >
              Switch to {chainNames[parseInt(chainId)]}
            </button>
          </div>
        ))}
        <div className="fixed bottom-0 w-screen h-10 p-2 bg-black text-white flex flex-row space-between">
          <div className="text-xs hover:text-purple-400 transition">
            <a href="https://github.com/rhdeck/polychat">
              <FaGithub className="h-6 w-6 mr-2 inline " />
              Source on GitHub
            </a>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
