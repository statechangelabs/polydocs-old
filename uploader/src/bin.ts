#!/usr/bin/env node
import commander from "commander";
import { Web3Storage, getFilesFromPath } from "web3.storage";
import dotenv from "dotenv";
dotenv.config();
commander.description("Upload files to IPFS");
commander.option(
  "-k --key <APIKEY>",
  "APIKEY for the storage (env var W3S_APIKEY as fallback)",
  process.env.W3S_APIKEY
);
commander.option("-p --path <PATH>", "Path to the files to upload", ".");
commander.parse(process.argv);
const w3s = new Web3Storage({
  token: commander.key,
  endpoint: new URL("https://api.web3.storage"),
});
if (!commander.isDocumenting) {
  Promise.resolve().then(async () => {
    const files = await getFilesFromPath(commander.path);
    //@ts-ignore-line
    const newCid = await w3s.put(files, { wrapWithDirectory: false });
    console.log("They're up there!");
    console.log(newCid);
    console.log("https://ipfs.io/ipfs/" + newCid);
  });
}
export { commander };
