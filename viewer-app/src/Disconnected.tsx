import { eth_requestAccounts } from "@raydeck/metamask-ts";
import { FC } from "react";
import { FaGithub } from "react-icons/fa";
import Title from "./Title";
const Disconnected: FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center align-center bg-gradient-to-r from-pink-600 to-blue-900 ">
      <Title />
      <div className="flex flex-row justify-center">
        <button
          className="bg-black bg-opacity-60 text-white hover:text-gray-200 hover:bg-opacity-80 font-bold py-2 px-4 border-1 rounded-md transition transition-opacity flex items-center justify-center"
          onClick={async () => {
            const accounts = await eth_requestAccounts();
            console.log("I haz accounts", accounts);
          }}
        >
          Connect to Metamask
        </button>
      </div>
      <div className="fixed bottom-0 w-screen h-10 p-2 bg-black text-white flex flex-row space-between">
        <div className="text-xs hover:text-purple-400 transition">
          <a href="https://github.com/rhdeck/polyDocs">
            <FaGithub className="h-6 w-6 mr-2 inline " />
            Source on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
export default Disconnected;
