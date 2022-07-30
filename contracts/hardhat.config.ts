import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-tracer";
import 'solidity-docgen';
dotenv.config();
const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    polygonMumbai: process.env.ALCHEMY_MUMBAI
      ? {
          url: process.env.ALCHEMY_MUMBAI,
          accounts: [process.env.PK || ""],
        }
      : undefined,
    polygon: process.env.ALCHEMY_POLYGON
      ? {
          url: process.env.ALCHEMY_POLYGON,
          accounts: [process.env.PK || ""],
        }
      : undefined,
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGON_API || "",
      polygon: process.env.POLYGON_API || "",
    },
  },
  docgen: {
    exclude:["reference-721/**/*.sol"]
  }
};
if (!config.networks!.polygonMumbai) delete config.networks!.polygonMumbai;
if (!config.networks!.polygon) delete config.networks!.polygon;
export default config;
