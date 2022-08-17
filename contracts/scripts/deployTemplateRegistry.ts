import { BigNumber } from "ethers";
import hre, { network, ethers } from "hardhat";
async function main() {
  const [signer_1, signer_2, signer_3] = await ethers.getSigners();

  const Doc = await ethers.getContractFactory("TemplateRegistry");
  const doc = await Doc.deploy();
  await doc.deployed();

  console.log("TemplateRegistry deployed to:", doc.address);

  const terms = await doc.termsUrl();
  console.log("Terms URL:", terms);

  const accept_terms = await doc.acceptTerms(terms);
  const accept_terms_receipt = await accept_terms.wait();
  console.log("Signer 1 Accepted Terms:", accept_terms_receipt);

  const addTemplate_1 = await doc.add({"name":"name_1","cid":"randomcid_1", "score":0, "MetadataURI":"MetadataURI_1", "owner":signer_1.address}); 
  const addTemplateReceipt_1 = await addTemplate_1.wait();
  console.log("Added template 1 !");

  const accept_terms_2 = await doc.connect(signer_2).acceptTerms(terms);
  const accept_terms_receipt_2 = await accept_terms_2.wait();
  console.log("Signer 2 Accepted Terms:", accept_terms_receipt_2);

  const addTemplate_2 = await doc.connect(signer_2).add({"name":"name_2","cid":"randomcid_2", "score":0, "MetadataURI":"MetadataURI_1", "owner":signer_2.address})
  const addTemplateReceipt_2 = await addTemplate_2.wait();
  console.log("Added template 2!");

  const accept_terms_3 = await doc.connect(signer_3).acceptTerms(terms);
  const accept_terms_receipt_3 = await accept_terms_3.wait();
  console.log("Signer 3 Accepted Terms:", accept_terms_receipt_3);

  const addTemplate_3 = await doc.connect(signer_3).add({"name":"name_3","cid":"randomcid_3", "score":0, "MetadataURI":"MetadataURI_3", "owner":signer_3.address})
  const addTemplateReceipt_3 = await addTemplate_3.wait();
  console.log("Added template 3!");

  const numTemplates = await doc.count();
  console.log("Number of templates:", numTemplates);

  const getTemplate_1 = await doc.connect(signer_2).template(0);
  console.log("Template 1:", getTemplate_1);

  const getTemplate_2 = await doc.template(1);
  console.log("Template 2:", getTemplate_2);

  const get_template_by_cid = await doc.templatebyCID("randomcid_3");
  console.log("Getting Template 3 by CID:", get_template_by_cid);

  // should return true
  const index_of_template_3 = await doc.indexOf("randomcid_3");
  console.log(ethers.BigNumber.from(2));
  console.log(index_of_template_3);
  console.log("Index of template 3 is 2:", index_of_template_3 ==ethers.BigNumber.from("2"));

  const upvote_template_1 = await doc.upvote("randomcid_1",{value: ethers.utils.parseEther("0.5")});
  const upvote_template_receipt_1 = await upvote_template_1.wait();
  console.log("Upvoted template 1:", upvote_template_receipt_1);

  const upvote_template_2 = await doc.downvote("randomcid_2",{value: ethers.utils.parseEther("2")});
  const upvote_template_receipt_2 = await upvote_template_2.wait();
  console.log("Upvoted template 2:", upvote_template_receipt_2);

  const score_template_1 = await doc.score("randomcid_1");
  console.log("Score of template 1:", score_template_1);

  const score_template_2 = await doc.score("randomcid_2");
  console.log("Score of template 2:", score_template_2);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
