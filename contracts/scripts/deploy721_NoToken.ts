import hre, { network, ethers } from "hardhat";
import fs from "fs";
import { execSync } from "child_process";
async function main() {
  // const [signer_1, signer_2, signer_3, signer_4] = await ethers.getSigners();

  const Doc = await ethers.getContractFactory("ERC721Termsable");
  const doc = await Doc.deploy("0x90f14e3282977416286085e0d90210A400bEFD22","Signing Sloths v2.0", "SS");
  await doc.deployed();

  console.log("721_NoToken deployed to:", doc.address);
  
  console.log(await doc.name());
  console.log(await doc.symbol());
  console.log(await doc.owner());


  const terms = await doc.termsUrl();
  console.log("Terms url:", terms);


  const set_document = await doc.setPolydocs("bafybeig44fabnqp66umyilergxl6bzwno3ntill3yo2gtzzmyhochbchhy", "bafkreihjxacfifvrpwwcve4l33ysrcfqylxjo33mq7mqe4pja25d5mubve", [{"key":"ShortCompanyName", "value": "Statechange Labs"},{"key":"LongCompanyName", "value": "Statechange Labs, Inc."}]);
  const set_document_receipt = await set_document.wait();
  console.log("Set document for the contract!");

  const get_term_value_1 = await doc.globalTerm("ShortCompanyName");
  console.log("key1's value is :", get_term_value_1);

  const get_term_value_2 = await doc.globalTerm("LongCompanyName");
  console.log("key2's value is :", get_term_value_2);
  
  const URI = 'ipfs://bafkreiem6fz33ddo6u72woy6ebxpbqggo77jatts4e5c6s6twyknanxooy';

  const setURI = await doc.setURI(URI);
  const setURI_receipt = await setURI.wait();

  const getURI = await doc.URI();
  console.log("URI is :", getURI);

  const mint_nft = await doc.mint();
  const mint_nft_receipt = await mint_nft.wait();
  console.log("Minted the NFT!");

  // try {
  // // should pass - as signer 1 is the owner of the contract
  // const assignMetaSigner = await doc.addMetaSigner(signer_2.address);
  // const addMetaSigner_receipt = await assignMetaSigner.wait();
  // console.log("Signer 1 (owner) added signer 2 as meta signer");
  // console.log("Metasigner's address (signer2): ", signer_2.address);
  // } catch (error) {
  //   console.log("error:", error);
  // }

  // try {
  // // should fail - signer2 is not the owner of the contract
  // const assignMetaSigner_2 = await doc.connect(signer_2).addMetaSigner(signer_3.address);
  // const addMetaSigner_2_receipt = await assignMetaSigner_2.wait();
  // console.log("Signer 2 added signer 3 as meta signer");
  // } catch (error) {
  //   console.log("error:", error);
  // }
  
  // try{
  // // Printing signer_3's address
  // console.log("Signer 3 address:", signer_3.address);

  // // Retrieving terms
  // const terms = await doc.termsUrl();
  // console.log("Terms url:", terms);
  
  // // Signer 3 signs the terms
  // const signature = await signer_3.signMessage(terms);
  // console.log("signature: ", signature);
  
  // // verifying the signer using ethers
  // const signer = ethers.utils.verifyMessage(terms, signature);
  // console.log("signer:", signer);
  
  // // Signer2 signs on behalf of signer 3
  // const metasign_1 =  await doc.connect(signer_2).acceptTermsFor(signer_3.address, terms, signature);
  // const metasign_1_receipt = await metasign_1.wait();
  // console.log("Metasigner accepted terms on behalf of signer 3");
  // console.log("receipt:", metasign_1_receipt);

  // // signer3 tries to mint a token
  // const mint_1 = await doc.connect(signer_3).mint();
  // const mint_1_receipt = await mint_1.wait();
  // console.log("Signer 3 minted a token! YAYAYAYAY");

  // } catch (error) {
  //   console.log("error:", error);
  // }








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
