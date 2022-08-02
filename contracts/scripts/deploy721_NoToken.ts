import hre, { network, ethers } from "hardhat";
import fs from "fs";
import { execSync } from "child_process";
async function main() {
  const [signer_1, signer_2, signer_3] = await ethers.getSigners();

  const Doc = await ethers.getContractFactory("ERC721Termsable");
  const doc = await Doc.deploy();
  await doc.deployed();

  console.log("721_NoToken deployed to:", doc.address);

  let config = `
  export const ERC721_NoToken address = "${doc.address}";
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
  
  try {
  // should pass - as signer 1 is the owner of the contract
  const assignMetaSigner = await doc.addMetaSigner(signer_2.address);
  const addMetaSigner_receipt = await assignMetaSigner.wait();
  console.log("Signer 1 (owner) added signer 2 as meta signer");
  console.log("Metasigner's address (signer2): ", signer_2.address);
  } catch (error) {
    console.log("error:", error);
  }

  try {
  // should fail - signer2 is not the owner of the contract
  const assignMetaSigner_2 = await doc.connect(signer_2).addMetaSigner(signer_3.address);
  const addMetaSigner_2_receipt = await assignMetaSigner_2.wait();
  console.log("Signer 2 added signer 3 as meta signer");
  } catch (error) {
    console.log("error:", error);
  }
  
  try{
  // Printing signer_3's address
  console.log("Signer 3 address:", signer_3.address);

  // Retrieving terms
  const terms = await doc.termsUrl();
  console.log("Terms url:", terms);
  
  // Signer 3 signs the terms
  const signature = await signer_3.signMessage(terms);
  console.log("signature: ", signature);
  
  // verifying the signer using ethers
  const signer = ethers.utils.verifyMessage(terms, signature);
  console.log("signer:", signer);
  
  // Signer2 signs on behalf of signer 3
  const metasign_1 =  await doc.connect(signer_2).acceptTermsFor(signer_3.address, terms, signature);
  const metasign_1_receipt = await metasign_1.wait();
  console.log("Metasigner accepted terms on behalf of signer 3");
  console.log("receipt:", metasign_1_receipt);

  // signer3 tries to mint a token
  const mint_1 = await doc.connect(signer_3).mint();
  const mint_1_receipt = await mint_1.wait();
  console.log("Signer 3 minted a token! YAYAYAYAY");

  } catch (error) {
    console.log("error:", error);
  }
//   const txn_setTerms = await doc.setTokenTerm("Name", 0, "Akshay");
//   const receipt_setTerms = await txn_setTerms.wait();
//   console.log("Terms set!");

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
  //   .connect(signer_1)
  //   ["safeTransferFrom(address,address,uint256)"](
  //     signer_1.address,
  //     signer_2.address,
  //     0
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
  //   .connect(signer_2)
  //   ["safeTransferFrom(address,address,uint256)"](
  //     signer_2.address,
  //     signer_3.address,
  //     0
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
