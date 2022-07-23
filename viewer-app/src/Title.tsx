import { FC, Fragment } from "react";
import Logo from "./logo.svg";
const Title: FC = () => {
  return (
    <Fragment>
      <h1 className="flex flex-row justify-center text-5xl font-medium m-5">
        <img src={Logo} alt="Logo" className="h-16 -mt-2 mr-2" />
        <span className="text-purple-300">Poly</span>Docs
      </h1>
      <p className="flex flex-row justify-center text-2xl font-bold m-5 text-purple-300">
        Select a supported network
      </p>
    </Fragment>
  );
};
export default Title;
