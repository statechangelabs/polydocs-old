import { ethers } from "hardhat";
import { Test721_Token__factory} from "../typechain-types";
import dotenv from "dotenv";
dotenv.config();

async function main() {
    try {

    const contract_address = "0xCd0Dc7492E3c0AD3d5D4ed60944BA17f94528708";
    const [signer_1, signer_2, signer_3] = await ethers.getSigners();
    
    const provider = new ethers.providers.AlchemyProvider('maticmum' || "", process.env.ALCHEMY_API_KEY);

    const account_1 = new ethers.Wallet(process.env.PK || "", provider);
    const account_2 = new ethers.Wallet(process.env.PK_2 || "", provider);

    console.log("Account 1 address is : ",account_1.address);
    console.log("Account 2 address is : ",account_2.address);

    // Connecting Account 1 to the contract
    const doc = Test721_Token__factory.connect(contract_address, account_1);
    
    
    const terms_url = await doc.termsUrl(0);
    console.log("Terms URL: ", terms_url);

    const terms_url_with_prefix = await doc.termsUrlWithPrefix(0,"https://");
    console.log("Terms URL with prefix: ", terms_url_with_prefix);
    
    // Happy Path
    const set_global_term = await doc.setGlobalTerm("Project Name", "PoolTogether");
    const set_global_term_receipt = await set_global_term.wait();
    console.log("Set Global Project Name Receipt hash: ", set_global_term_receipt.blockHash);

    const globalTerm = await doc.globalTerm("Project Name");
    console.log("Global Project Name: ", globalTerm);

    const terms_url_1 = await doc.termsUrl(0);
    console.log("Terms URL: ", terms_url_1);

    const accept_terms_txn_1 = await doc.acceptTerms(0, terms_url_1);
    const accept_terms_txn_1_receipt = await accept_terms_txn_1.wait();
    console.log("Accepted new terms by account 1 after setting new Global Project Name hash: ", accept_terms_txn_1_receipt.blockHash);

    const accepted_terms_1 = await doc.acceptedTerms(account_1.address, 0);
    console.log("Checking terms accepted by Account_1: ",accepted_terms_1);

    const mint_txn = await doc.mint();
    const mint_receipt = await mint_txn.wait();
    console.log("Minted 1 NFT to Account 1 hash: ", mint_receipt.blockHash);

    const doc_2 = Test721_Token__factory.connect(contract_address, account_2);

    const accepted_terms_2 = await doc_2.acceptedTerms(account_2.address, 0);
    console.log("Checking terms accepted by Account_2: ",accepted_terms_2);

    console.log("Account 2 will be accepting terms for token 0 now...");

    const accept_terms_txn_2 = await doc_2.acceptTerms(0, terms_url);
    const accept_terms_txn_receipt_2 = await accept_terms_txn_2.wait();
    console.log("Accepted terms by account 2 hash: ", accept_terms_txn_receipt_2.blockHash);
    
    const accepted_terms_3 = await doc_2.acceptedTerms(account_2.address, 0);
    console.log("Checking terms accepted by Account_2: ",accepted_terms_3);

    const transfer_txn = await doc_2["safeTransferFrom(address,address,uint256)"](account_1.address, account_2.address,0);
    const transfer_receipt = await transfer_txn.wait();
    console.log("Transferred 1 NFT from account 1 to account 2 hash:", transfer_receipt.blockHash);


    const txn_setTerms = await doc.setTokenTerm("Project Name", 0, "Pooptogether");
    const receipt_setTerms = await txn_setTerms.wait();
    console.log("New {{Project name}} set for Token 0! with hash: ", receipt_setTerms.blockHash);

    const terms_project_name = await doc.tokenTerm("Project Name", 0);
    console.log("New {{Project Name}} for Token 0: ", terms_project_name);
        
    } catch (error) {
     console.error(error);   
    }
    


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});