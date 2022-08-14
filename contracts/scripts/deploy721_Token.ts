import hre, { network, ethers } from "hardhat";
import fs from "fs";
import { execSync } from "child_process";
import { docItemTypes } from "solidity-docgen/dist/doc-item";
async function main() {
  
  const [signer_1, signer_2, signer_3, signer_4] = await ethers.getSigners();
  const Doc = await ethers.getContractFactory("ERC721TokenTermsable");
  const doc = await Doc.deploy(signer_2.address, "TEST-CONTRACT", "TEST");
  await doc.deployed();

  console.log("721_Token deployed to:", doc.address);

  console.log("Signer_2 address is :", signer_2.address);
  console.log("Signer_3 address is :", signer_3.address);

  console.log(await doc.name());
  console.log(await doc.symbol());
  console.log(await doc.owner());


  const txn_setTerms = await doc.setTokenTerm("Name", 0, "Akshay");
  const receipt_setTerms = await txn_setTerms.wait();
  console.log("Terms set!");

  // Metasigner mints nft
  const txn = await doc.mint("sampleURI");
  const receipt = await txn.wait();
  console.log("Minted 1 token to:", signer_1.address);

  // getting terms for token 0 that was just minted
  const terms = await doc.termsUrl(0);
  console.log("Terms url:", terms);

  const txn_acceptTerms = await doc.connect(signer_3).acceptTerms(0,terms);
  const receipt_acceptTerms = await txn_acceptTerms.wait();
  console.log("Accepted terms by signer 3");

  const approve_signer_3 = await doc.approve(signer_3.address, 0);
  const approve_signer_3_receipt = await approve_signer_3.wait();
  console.log("Signer 1 Approves signer 3 for token 0");

  const transfer_to_signer_3 = await doc.connect(signer_3).transferFrom(signer_1.address, signer_3.address,0);
  const transfer_to_signer_3_receipt = await transfer_to_signer_3.wait();
  console.log("Transferred token from signer_1 to signer_3");

  const check_owner = await doc.ownerOf(0);
  console.log("Owner of token 0 is:", check_owner);
  console.log("Is owner of token 0 signer_3?", check_owner === signer_3.address);


  const set_document_signer3 = await doc.setPolydocs(0, "bafybeig44fabnqp66umyilergxl6bzwno3ntill3yo2gtzzmyhochbchhy", "bafybeiavljiisrizkro3ob5rhdludulsiqwkjp43lanlekth33sqhikfry/template.md", [{"key":"key1", "value": "Ray"},{"key":"key2", "value": "Akshay"}]);
  const set_document_signer3_receipt = await set_document_signer3.wait();
  console.log("Set document for the contract by metasigner!");

  const tokenRenderer = await doc.tokenRenderer(0);
  console.log("Token renderer:", tokenRenderer);
  
  const tokenTerm = await doc.tokenTerm('key1',0);
  console.log("Token value for term key1 for token 0 is :", tokenTerm);

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
