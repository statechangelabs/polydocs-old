import hre, { network, ethers } from "hardhat";
import fs from "fs";
import { execSync } from "child_process";
async function main() {
  // const [signer_1, signer_2, signer_3] = await ethers.getSigners();

  const Doc = await ethers.getContractFactory("TemplateRegistry");
  const doc = await Doc.deploy();
  await doc.deployed();

  console.log("TemplateRegistry deployed to:", doc.address);

  let config = `
  export const TemplateRegistry address = "${doc.address}";
  `;
  const onThisNetwork = network.name;
  if (onThisNetwork && onThisNetwork !== "hardhat") {
    setTimeout(() => {
      const cmd = `yarn hardhat verify ${doc.address} --network ${onThisNetwork}`;
      console.log("Running", cmd);
      execSync(cmd, {
        stdio: "inherit",
      });
    }, 30000);
  }
  let data = JSON.stringify(config);
  fs.writeFileSync("./config.ts", JSON.parse(data));
  fs.writeFileSync(
    "contracts.txt",
    `${new Date().toLocaleString()}: ${network.config.chainId}: ${doc.address}
`,
    { flag: "a" }
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
