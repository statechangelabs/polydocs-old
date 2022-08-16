import hre, { network, ethers } from "hardhat";
async function main() {
  const [signer_1, signer_2, signer_3] = await ethers.getSigners();

  const Doc = await ethers.getContractFactory("TemplateRegistry");
  const doc = await Doc.deploy();
  await doc.deployed();

  console.log("TemplateRegistry deployed to:", doc.address);


  const addTemplate_1 = await doc.add({"name":"name_1","cid":"randomcid_1", "score":0, "MetadataURI":"MetadataURI_1", "owner":signer_1.address}); 
  const addTemplateReceipt_1 = await addTemplate_1.wait();
  console.log("Added template 1 !");

  const addTemplate_2 = await doc.add("randomcid_2")
  const addTemplateReceipt_2 = await addTemplate_2.wait();
  console.log("Added template 2!");

  const addTemplate_3 = await doc.add("randomcid_3")
  const addTemplateReceipt_3 = await addTemplate_3.wait();
  console.log("Added template 3!");


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
