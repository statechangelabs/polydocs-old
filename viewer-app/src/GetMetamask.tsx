import { FC } from "react";
import { FaGithub } from "react-icons/fa";
import MetaMaskOnboarding from "@metamask/onboarding";
import Logo from "./logo.png";
const GetMetamask: FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center align-center bg-gradient-to-r from-pink-600 to-blue-900 ">
      <h1 className="flex flex-row justify-center text-5xl font-extrabold m-5">
        <img src={Logo} className="h-16" />
        <span className="text-purple-300">Poly</span>Chat
      </h1>
      <p className="flex flex-row justify-center text-2xl font-bold m-5 text-purple-300">
        Document Renderer
      </p>
      <div className="flex flex-row justify-center">
        <button
          className="bg-black bg-opacity-60 text-white hover:text-gray-200 hover:bg-opacity-80 font-bold py-2 px-4 border-1 rounded-md transition transition-opacity flex items-center justify-center"
          onClick={async () => {
            const onboarder = new MetaMaskOnboarding();
            onboarder.startOnboarding();
          }}
        >
          Get Metamask
        </button>
      </div>
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
};
export default GetMetamask;
