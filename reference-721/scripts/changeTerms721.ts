import "../artifacts/contracts/Test721.sol/Test721.json";
import { ERC721address } from "../config";
import { ethers } from "hardhat";
import { Test721__factory} from "../typechain-types";

async function main() {
    const [signer_1, signer_2, signer_3] = await ethers.getSigners();

    const doc = Test721__factory.connect(ERC721address, signer_1);
    
    const txn = await doc.tokenTerm("Name", 0);
    console.log("Terms:", txn);

    const txn_setTerms = await doc.setTokenTerm("Name", 0, "Ray");
    const receipt_setTerms = await txn_setTerms.wait();
    console.log("New Terms set!");

    const txn2 = await doc.tokenTerm("Name", 0);
    console.log("New Terms:", txn2);
    // const txn = await doc.mint();


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});