import { ethers } from "hardhat";

async function main() {
  const [signer_1, signer_2, signer_3] = await ethers.getSigners();

  const Doc = await ethers.getContractFactory("Test721");
  const doc = await Doc.deploy();
  await doc.deployed();

  console.log("Doc deployed to:", doc.address);

  const txn = await doc.connect(signer_1).mint();
  const receipt = await txn.wait();
  console.log("Minted 1 token to:", signer_1.address);
  console.log("I'm about ot get terms. Let's see how this works...");
  const terms = await doc.connect(signer_1).termsURL(0);
  console.log("Terms URL:", terms);

  const txn2 = await doc.connect(signer_2).acceptTerms(0, terms);
  const receipt2 = await txn2.wait();
  console.log("Accepted terms from:", signer_2.address);

  const txn_transfer = await doc
    .connect(signer_1)
    ["safeTransferFrom(address,address,uint256)"](
      signer_1.address,
      signer_2.address,
      0
    );
  const receipt_transfer = await txn_transfer.wait();
  console.log("Transfer done to:", signer_2.address);

  const setterms = await doc
    .connect(signer_1)
    .setTermsURL(0, "sign this please");
  const receipt_setterms = await setterms.wait();
  console.log("Set terms url done!!!");

  const acceptTerms = await doc.connect(signer_3).acceptTerms(0, terms);
  const receipt_acceptTerms = await acceptTerms.wait();
  console.log("Accepted terms from:", signer_3.address);

  const txn3 = await doc
    .connect(signer_2)
    ["safeTransferFrom(address,address,uint256)"](
      signer_2.address,
      signer_3.address,
      0
    );
  const receipt_3 = await txn3.wait();
  console.log("Transfer done to:", signer_3.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
