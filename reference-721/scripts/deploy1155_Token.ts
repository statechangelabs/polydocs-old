import hre, { network, ethers } from "hardhat";
import fs from "fs";
import { execSync } from "child_process";

async function main() {
  const [signer_1, signer_2, signer_3] = await ethers.getSigners();

  const Doc = await ethers.getContractFactory("Test1155_Token");
  const doc = await Doc.deploy("TestNFT","TNFT","sampleuri");
  await doc.deployed();

  console.log("1155_Token deployed to:", doc.address);

    let config = `
  export const ERC1155_NoToken address = "${doc.address}";
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

  // const txn = await doc.connect(signer_1).mint();
  // const receipt = await txn.wait();
  // console.log("Minted 1 token to:", signer_1.address);
  // console.log("I'm about ot get terms. Let's see how this works...");
  // const terms = await doc.connect(signer_1).termsURL(0);
  // console.log("Terms URL:", terms);

  // const txn2 = await doc.connect(signer_2).acceptTerms(0, terms);
  // const receipt2 = await txn2.wait();
  // console.log("Accepted terms from:", signer_2.address);

  // const txn_transfer = await doc
  //   .connect(signer_1).safeTransferFrom(
  //     signer_1.address,
  //     signer_2.address,
  //     0, 1, ""
  //   );
  // const receipt_transfer = await txn_transfer.wait();
  // console.log("Transfer done to:", signer_2.address);

  // const setterms = await doc
  //   .connect(signer_1)
  //   .setTermsURL(0, "sign this please");
  // const receipt_setterms = await setterms.wait();
  // console.log("Set terms url done!!!");

  // const acceptTerms = await doc.connect(signer_3).acceptTerms(0, terms);
  // const receipt_acceptTerms = await acceptTerms.wait();
  // console.log("Accepted terms from:", signer_3.address);

  // const txn3 = await doc
  //   .connect(signer_2).safeTransferFrom(
  //     signer_1.address,
  //     signer_2.address,
  //     0, 1, ""
  //   );
  // const receipt_3 = await txn3.wait();
  // console.log("Transfer done to:", signer_3.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
