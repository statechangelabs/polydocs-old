import { ethers } from "hardhat";

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const lockedAmount = ethers.utils.parseEther("1");
  const [signer_1] = await ethers.getSigners();
  console.log("Signers address is :", signer_1.address);

  const message = "Hello darkness my old friend";
  console.log("message: ", message);

  // const hash = ethers.utils.hashMessage(message);

  // console.log("hash of the message: ", hash);

  const signature = await signer_1.signMessage(message);
  console.log("signature: ", signature);

  const signer = ethers.utils.verifyMessage(message, signature);
  console.log("signer:", signer);

  // const hash= '0x489d0c0409292d12e50fc968f10dfd181d773ce905a0e6a6d4be55ebd0b6f3f8';
  // const samplemsg = 'hi there!';
  // const sig = '0xc4818c095fcb389360e3b17951d1976725e242e5011fdb3b8614c5e1d2ea3d504746ca9a17b9bb7ff8e6ffb97f412e322fe6f3754d5b0b201aa49d90e18d81d51c'
  const Verify = await ethers.getContractFactory("Verify");
  const verify = await Verify.deploy();
  await verify.deployed();

  console.log("Verify deployed to:", verify.address);

  const txn = await verify.validateSigner(message, signature, signer_1.address);
  console.log("Transaction returned:", txn);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
