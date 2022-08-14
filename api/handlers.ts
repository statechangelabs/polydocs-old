import "./core";
import {
  httpSuccess,
  makeAPIGatewayLambda,
  makeLambda,
  sendHttpResult,
} from "@raydeck/serverless-lambda-builder";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { Agent } from "https";
import { QldbDriver, RetryConfig } from "amazon-qldb-driver-nodejs";
import { v4 as uuid } from "uuid";
import { getAssetPath } from "@raydeck/local-assets";
import { BigNumber, ContractFactory, ethers } from "ethers";
import { join } from "path";
import { exec, execSync } from "child_process";
import { Value } from "ion-js/dist/commonjs/es6/dom";
import { Lambda } from "aws-sdk";
import { get as registryGet } from "@raydeck/registry-manager";
import { copyFileSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import {
  TermsableNoToken__factory,
  ERC721Termsable__factory,
} from "./contracts/index";
import { promisify } from "util";
import { render } from "mustache";
// import fetch  from "cross-fetch";
import fetch from "node-fetch";
import FormData from "form-data";
import { KeyPair } from "ucan-storage-commonjs/keypair";
import { build, validate } from "ucan-storage-commonjs/ucan-storage";
import { getContractAddress } from "ethers/lib/utils";
const DEFAULT_RENDERER =
  "bafybeig44fabnqp66umyilergxl6bzwno3ntill3yo2gtzzmyhochbchhy";
const DEFAULT_TEMPLATE =
  "bafybeiavljiisrizkro3ob5rhdludulsiqwkjp43lanlekth33sqhikfry/template.md";
//#region QLDB intialization
const maxConcurrentTransactions = 10;
const retryLimit = 4;
//Reuse connections with keepAlive
const agentForQldb: Agent = new Agent({
  keepAlive: true,
  maxSockets: maxConcurrentTransactions,
});

const serviceConfigurationOptions = {
  region: process.env.region || process.env.AWS_REGION,
  httpOptions: {
    agent: agentForQldb,
  },
};
const retryConfig: RetryConfig = new RetryConfig(retryLimit);
const ledgerName = process.env.ledgerName || "myLedger";
const qldbDriver: QldbDriver = new QldbDriver(
  ledgerName,
  serviceConfigurationOptions,
  maxConcurrentTransactions,
  retryConfig
);
//#endregion
//#region Helper Functions
let madeTables = false;
const makeTables = async () => {
  if (madeTables) return;
  const tableNames = await qldbDriver.getTableNames();
  console.log(tableNames);
  if (!tableNames.includes("Nodes")) {
    //Build transmissions table
    await qldbDriver.executeLambda(async (txn) => {
      await txn.execute(`CREATE TABLE Contracts`);
      await txn.execute(`CREATE INDEX ON Contracts (id)`);
      await txn.execute(`CREATE INDEX ON Contracts (owner)`);
    });
  }
  if (!tableNames.includes("Accounts")) {
    //Build transmissions table
    await qldbDriver.executeLambda(async (txn) => {
      await txn.execute(`CREATE TABLE Accounts`);
      await txn.execute(`CREATE INDEX ON Accounts (id)`);
    });
  }
  if (!tableNames.includes("Templates")) {
    //Build transmissions table
    await qldbDriver.executeLambda(async (txn) => {
      await txn.execute(`CREATE TABLE Templates`);
      await txn.execute(`CREATE INDEX ON Templates (id)`);
      await txn.execute(`CREATE INDEX ON Templates (owner)`);
    });
  }
  if (!tableNames.includes("Users")) {
    //Build transmissions table
    await qldbDriver.executeLambda(async (txn) => {
      await txn.execute(`CREATE TABLE Users`);
      await txn.execute(`CREATE INDEX ON Users (id)`);
    });
  }
  madeTables = true;
};
const getRecord = async (tableName: string, id: string) => {
  await makeTables();
  const result = await qldbDriver.executeLambda(async (txn) => {
    const result = await txn.execute(
      `SELECT * FROM ${tableName} WHERE id = '${id}'`
    );
    return result;
  });
  return result.getResultList().pop();
};

const getUser = async (address: string) =>
  getRecord("Users", address.toLowerCase());

const getContract = async (address: string) =>
  getRecord("Contracts", address.toLowerCase());
const getAccount = async (id: string) => getRecord("Accounts", id);
const getAccountsForUser = async (address: string) => {
  const user = await getUser(address);
  if (user) {
    const output = user
      .get("accounts")
      ?.getAll()
      ?.map((v) => v.stringValue())
      ?.filter(Boolean);
    if (output && output.length) return output as string[];
  }
  return [];
};
const getSignerFromHeader = <T extends { exp: number }>(
  event: APIGatewayProxyEvent,
  apiKey?: string
) => {
  //check for the header
  //check the header for my signature
  const authorization = event.headers.Authorization;
  if (authorization) {
    const [, key] = authorization.split(" ");
    const json = Buffer.from(key, "base64").toString("utf8");
    const { signature, message }: { signature: string; message: string } =
      JSON.parse(json);
    const address = ethers.utils.verifyMessage(message, signature);
    const parsedMessage: T = JSON.parse(message);
    if (parsedMessage.exp) {
      //compare with now
      const exp = parsedMessage.exp;
      const now = Date.now();
      if (exp < now) {
        return undefined;
      }
    }
    return { address, message: parsedMessage };
  }
  return undefined;
};
const makeAuthenticatedFunc = (
  func: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>
) => <Handler<APIGatewayProxyEvent, APIGatewayProxyResult>>(async (
    event,
    context,
    callback
  ) => {
    const payload = getSignerFromHeader(event);
    if (!payload) {
      return sendHttpResult(401, "Unauthorized");
    }
    // const { address, message } = payload;
    // await makeTables();
    return func({ event, context, callback });
  });
//#endregion
//#region API Endpoints
export const signDocument = makeAPIGatewayLambda({
  path: "/sign",
  method: "post",
  cors: true,
  timeout: 30,
  func: async (event, context, callback) => {
    if (!process.env.METASIGNER_MUMBAI_PRIVATE_KEY)
      return sendHttpResult(500, "Environment keys not properly set up");
    if (!process.env.ALCHEMY_MUMBAI_KEY)
      return sendHttpResult(500, "Environment keys not properly set up");
    if (!event.body) return sendHttpResult(400, "No body provided");
    const provider = new ethers.providers.StaticJsonRpcProvider(
      process.env.ALCHEMY_MUMBAI_KEY
      // "0x" + (80001).toString(16)
    );
    // const provider = ethers.getDefaultProvider(80001);
    console.log("provider key", process.env.ALCHEMY_MUMBAI_KEY);
    // console.log("provider", provider);
    const signer = new ethers.Wallet(
      process.env.METASIGNER_MUMBAI_PRIVATE_KEY,
      provider
    );
    const {
      address,
      signature,
      message,
    }: { address: string; signature: string; message: string } = JSON.parse(
      event.body
    );
    console.log("I have stuff from body");
    console.log("Address", address);
    console.log("Signuature", signature);
    console.log("message", message);
    if (!ethers.utils.verifyMessage(message, signature)) {
      return sendHttpResult(400, "Invalid signature");
    }
    const polydocsURI = message.substring(
      message.indexOf(": "),
      message.length
    );
    console.log("polydocsURI is ", polydocsURI);
    // const polydocsUri = new URL(polydocsURI);
    // const fragment = polydocsUri.hash.substring(1);
    const fragment = polydocsURI.substring(polydocsURI.indexOf("#") + 1);
    console.log("fragment is ", fragment);
    const [cid, chainId, contractAddress, blockNumber] = fragment.split("::");
    console.log("contractAddress is ", contractAddress);
    console.log("We have pieces", {
      cid,
      chainId,
      contractAddress,
      blockNumber,
    });
    const polydocs = TermsableNoToken__factory.connect(contractAddress, signer);
    // const result = await fetch("https://polydocs.xyz");
    // const text = await result.text();
    // console.log("text is ", text);
    console.log(
      "now transaction time",
      await signer.getAddress(),
      await signer.getBalance()
    );
    try {
      await polydocs.acceptedTerms(address);
      await polydocs.acceptTermsFor(address, message, signature);
      // await txn.wait(); // We no longer wait for te transactions
      // console.log("transaction applied to chain");
      console.log("Transaction complete");
      return httpSuccess("signed");
    } catch (e) {
      return sendHttpResult(
        500,
        "Could not sign document on contract " + contractAddress
      );
    }
  },
});
export const deployNFT = makeAPIGatewayLambda({
  path: "/deploy",
  method: "post",
  cors: true,
  timeout: 30,

  func: async (event, context, callback) => {
    if (!event.body) return sendHttpResult(400, "No body provided");
    //What do we need to have in the payload
    // Eventual owner's ECSDA address
    // document info?
    //

    const {
      address,
      name,
      symbol,
    }: { address: string; name: string; symbol: string } = JSON.parse(
      event.body
    );
    if (!address || ethers.utils.isAddress(address) === false)
      return sendHttpResult(400, "Invalid address");
    if (!name) return sendHttpResult(400, "Invalid name");
    if (!symbol) return sendHttpResult(400, "Invalid symbol");

    const Payload = JSON.stringify({ address, name, symbol });
    console.log("invoking makecontract", registryGet("MAKE_CONTRACT_FUNCTION"));
    await new Lambda({ region: registryGet("AWS_REGION", "us-east-1") })
      .invoke({
        InvocationType: "Event",
        FunctionName: registryGet("stackName") + "-doDeploy",
        Payload,
      })
      .promise();

    return httpSuccess({
      message: "I got this party started",
    });
  },
});
export const doDeploy = makeLambda({
  timeout: 300,
  func: async (event) => {
    console.log("my event is ", event);
    const {
      address,
      name,
      symbol,
      renderer = DEFAULT_RENDERER,
      template = DEFAULT_TEMPLATE,
      terms = {},
    }: {
      address: string;
      name: string;
      symbol: string;
      renderer: string;
      template: string;
      terms: Record<string, string>;
    } = event;
    console.log("hello!!!");
    if (!process.env.METASIGNER_MUMBAI_PRIVATE_KEY)
      return sendHttpResult(500, "Environment keys not properly set up");
    if (!process.env.ALCHEMY_MUMBAI_KEY)
      return sendHttpResult(500, "Environment keys not properly set up");
    const provider = new ethers.providers.StaticJsonRpcProvider(
      process.env.ALCHEMY_MUMBAI_KEY
      // "0x" + (80001).toString(16)
    );
    // const provider = ethers.getDefaultProvider(80001);
    console.log("provider key", process.env.ALCHEMY_MUMBAI_KEY);
    // console.log("provider", provider);
    const signer = new ethers.Wallet(
      process.env.METASIGNER_MUMBAI_PRIVATE_KEY,
      provider
    );
    //time to deploy
    // build the new contract
    //copy everything into tmp/contracts

    const polyDocsFactory = new ERC721Termsable__factory(signer);
    const hundredgwei = ethers.utils.parseUnits("50", "gwei");
    console.log("A hundred gwei is", hundredgwei.toString());
    console.log("Deploying with", address, name, symbol);
    const polyDocs = await polyDocsFactory.deploy(address, name, symbol, {
      maxFeePerGas: hundredgwei,
      maxPriorityFeePerGas: hundredgwei,
      gasLimit: BigNumber.from(6_500_000),
    });
    console.log("polyDocs is ", polyDocs.address);
    await polyDocs.deployed();
    const pdtxn = await polyDocs.setPolydocs(
      renderer,
      template,
      Object.entries(terms).map(([key, value]) => ({
        key,
        value,
      }))
    );
    await pdtxn.wait();
    console.log("I have a deployed polydocs");
  },
});

export const hhDeploy = makeLambda({
  timeout: 300,
  func: async (event) => {
    console.log("my event is ", event);
    const {
      address,
      name,
      symbol,
      renderer = DEFAULT_RENDERER,
      template = DEFAULT_TEMPLATE,
      terms = {},
    }: {
      address: string;
      name: string;
      symbol: string;
      renderer: string;
      template: string;
      terms: Record<string, string>;
    } = event;
    console.log("hello!!!");
    if (!process.env.METASIGNER_MUMBAI_PRIVATE_KEY)
      return sendHttpResult(500, "Environment keys not properly set up");
    if (!process.env.ALCHEMY_MUMBAI_KEY)
      return sendHttpResult(500, "Environment keys not properly set up");
    const provider = new ethers.providers.StaticJsonRpcProvider(
      process.env.ALCHEMY_MUMBAI_KEY
      // "0x" + (80001).toString(16)
    );
    // const provider = ethers.getDefaultProvider(80001);
    console.log("provider key", process.env.ALCHEMY_MUMBAI_KEY);
    // console.log("provider", provider);
    const signer = new ethers.Wallet(
      process.env.METASIGNER_MUMBAI_PRIVATE_KEY,
      provider
    );
    //time to deploy
    // build the new contract
    //copy everything into tmp/contracts

    const templateContract = readFileSync(
      getAssetPath() + "/contracts/tokens/MyContract.sol",
      "utf8"
    );
    await promisify(exec)(
      "cp -r " + getAssetPath() + "/contracts/ /tmp/sources/"
    );
    await promisify(exec)(
      "cp -r " + getAssetPath() + "/node_modules/ /tmp/node_modules/"
    );

    const renderedContract = render(templateContract, {
      newowner: address.replace('"', '\\"'),
      name: name.replace('"', '\\"'),
      symbol: symbol.replace('"', '\\"'),
    });

    writeFileSync("/tmp/sources/tokens/MyContract.sol", renderedContract);
    console.log("wrote contract");
    console.log(readFileSync("/tmp/sources/tokens/MyContract.sol", "utf8"));
    console.log("compiling contract");
    copyFileSync(
      getAssetPath() + "/hardhat.config.js",
      "/tmp/hardhat.config.js"
    );
    const hardhatPrefix =
      "cd /tmp && /opt/nodejs/node_modules/hardhat/internal/cli/cli.js";
    const cmd = hardhatPrefix + " compile";
    console.log("cmd is ", cmd);
    console.log(await promisify(exec)(cmd));
    console.log("Getting the json");
    console.log(await promisify(exec)("ls -lR /tmp"));

    const json = readFileSync(
      "/tmp/artifacts/MyContract.sol/MyContract.json",
      "utf8"
    );
    console.log("json is ", json);
    const { abi, bytecode } = JSON.parse(json);
    console.log("abi is ", abi);
    const polyDocsFactory = new ContractFactory(abi, bytecode, signer);
    // const polyDocsFactory = new ERC721Termsable__factory(signer);
    const hundredgwei = ethers.utils.parseUnits("50", "gwei");
    console.log("A hundred gwei is", hundredgwei.toString());
    console.log("Deploying with", address, name, symbol);
    const polyDocs = await polyDocsFactory.deploy(address, name, symbol, {
      maxFeePerGas: hundredgwei,
      maxPriorityFeePerGas: hundredgwei,
      gasLimit: BigNumber.from(6_500_000),
    });
    console.log("polyDocs is ", polyDocs.address);
    await polyDocs.deployed();
    const pdtxn = await polyDocs.setPolydocs(
      renderer,
      template,
      Object.entries(terms).map(([key, value]) => ({
        key,
        value,
      }))
    );
    await pdtxn.wait();
    console.log("I have a deployed polydocs");
  },
});
export const testHH = makeLambda({
  timeout: 300,
  func: async (event) => {
    console.log("my event is ", event);
    if (event) console.log(await promisify(exec)(event));
    // const path = require.resolve("hardhat");
    // console.log("path is ", path);
    // console.log("current path is", __dirname);
    // console.log(await promisify(exec)("pwd"));
    // const output = await promisify(exec)("ls -l opt/node_modules");
    // console.log("output is ", output);
  },
});

export const mintNFT = makeLambda({
  timeout: 300,
  // method: "post",
  // path: "/mintNFT",
  // cors: true,
  func: async (event) => {
    console.log("hello!!!");
    if (!process.env.METASIGNER_MUMBAI_PRIVATE_KEY) return;
    if (!process.env.ALCHEMY_MUMBAI_KEY) return;
    const provider = new ethers.providers.StaticJsonRpcProvider(
      process.env.ALCHEMY_MUMBAI_KEY
      // "0x" + (80001).toString(16)
    );
    // const provider = ethers.getDefaultProvider(80001);
    console.log("provider key", process.env.ALCHEMY_MUMBAI_KEY);
    // console.log("provider", provider);
    const signer = new ethers.Wallet(
      process.env.METASIGNER_MUMBAI_PRIVATE_KEY,
      provider
    );
    //Get the image
    const { address, name, text, cid } = event;
    console.log("Hooray I did not run upload and got a cid", cid);
    console.log("connecting to contract at ", address);
    const contract = ERC721Termsable__factory.connect(address, signer);
    console.log("Connected to contract at address", address);
    const hundredgwei = ethers.utils.parseUnits("50", "gwei");
    console.log("A hundred gwei is", hundredgwei.toString());

    const tx = await contract.mint(cid, {
      maxFeePerGas: hundredgwei,
      maxPriorityFeePerGas: hundredgwei,
      gasLimit: BigNumber.from(500_000),
    });
    console.log("Minted good as gold");
    await tx.wait();
    console.log("Done!!!!!");
    return httpSuccess("hooray!!!");
  },
});

//#endregion
export const upload = async (
  image: Buffer,
  name: string,
  description: string,
  imageFileName: string
) => {
  //   const cid = "bafkreiaeppbzsvhoxifxq3dgwmiidto2p3j3agfb3vn5e3ur2rlhg5rqj4";
  const formData = new FormData();
  formData.append("image", image, imageFileName);
  formData.append(
    "meta",
    JSON.stringify({
      name,
      image: "",
      description,
    })
  );
  // console.log(process.env);
  const result = await fetch("https://api.nft.storage/store", {
    headers: {
      Authorization: "Bearer " + process.env.NFTSTORAGE_API_KEY,
    },
    method: "POST",
    body: formData,
  });
  const obj = (await result.json()) as {
    ok: boolean;
    value: { ipnft: string; url: string; data: Record<string, any> };
  };
  console.log("obj result is ", obj);
  return obj.value.url;
  //   const cid = await nftStorage.storeBlob(new Blob([buf]), {});
  //   return cid;
};
let rootToken = "";
const nsServiceKey = "did:key:z6MknjRbVGkfWK1x5gyJZb6D4LjMj1EsitFzcSccS3sAaviQ";
const issuerKeyPair = new KeyPair(
  Buffer.from(process.env.DID_PRIVATE_KEY ?? "", "base64"),
  Buffer.from(process.env.DID_PUBLIC_KEY ?? "", "base64")
);
// const _PublicKey = process.env.DID_PUBLIC_KEY ?? "";
// const _PrivateKey = process.env.DID_PRIVATE_KEY ?? "";
// const PublicKey = "VnQym9uqOGkGp0aQyUHw1WpCXi2qHq1EICkYCUETH5Y=";
// const PrivateKey = "xIrljYnTaxKX3TK+fLFvnPvdI1YxiU8ATd1bwC2wwFQ=";
// const issuerKeyPair = new KeyPair(
//   Buffer.from(PrivateKey, "base64"),
//   Buffer.from(PublicKey, "base64")
// );

export const getUCANToken = makeAPIGatewayLambda({
  timeout: 30,
  method: "get",
  cors: true,
  path: "/ucan-token",
  func: async (event, context, callback) => {
    //#region get root token
    // console.log("My publick and private keys", {
    //   _PublicKey,
    //   PublicKey,
    //   _PrivateKey,
    //   PrivateKey,
    // });
    if (!rootToken.length) {
      console.log("my event is ", event);
      //generate a token
      const url = "https://api.nft.storage/ucan/token";
      const response = await fetch(url, {
        // body,
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NFTSTORAGE_API_KEY}`,
        },
      });
      const retJSON = await response.json();
      console.log(retJSON);

      rootToken = retJSON.value;
    }
    //#endregion
    console.log("I am working now with rootToken of ", rootToken);
    // validate the parent UCAN and extract the payload
    const { payload } = await validate(rootToken);
    console.log("Payload is ", payload);
    // the `att` field contains the capabilities
    const { att } = payload;
    console.log("Att is", att);
    // for each capability in the parent, keep everything except the
    // resource path, to which we append the DID for the new token's audience
    const capabilities = att.map((capability) => ({
      ...capability,
      with: [capability.with, nsServiceKey].join("/"),
    }));
    console.log("My capabilities are", capabilities);
    // include the parent UCAN JWT string in the proofs array
    const proofs = [rootToken];
    // console.log({ did: issuerKeyPair.did(), _did: _issuerKeyPair.did() });
    const token = await build({
      issuer: issuerKeyPair,
      audience: nsServiceKey,
      capabilities: capabilities as any,
      proofs,
      lifetimeInSeconds: 100,
      // capabilities: [
      //   {
      //     with: `storage://${kp.did()}/public`,
      //     can: "upload/IMPORT",
      //     mh: "",
      //   },
      // ],
    });
    console.log("my ucan token is ", token);
    return httpSuccess({ token, did: process.env.DID });
  },
});

interface MimeBuffer extends Buffer {
  type: string;
  typeFull: string;
  charset: string;
}
export function dataUriToBuffer(uri: string): MimeBuffer {
  if (!/^data:/i.test(uri)) {
    throw new TypeError(
      '`uri` does not appear to be a Data URI (must begin with "data:")'
    );
  }

  // strip newlines
  uri = uri.replace(/\r?\n/g, "");

  // split the URI up into the "metadata" and the "data" portions
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }

  // remove the "data:" scheme and parse the metadata
  const meta = uri.substring(5, firstComma).split(";");

  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  // defaults to US-ASCII only if type is not provided
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }

  // get the encoded data portion and decode URI-encoded chars
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding) as MimeBuffer;

  // set `.type` and `.typeFull` properties to MIME type
  buffer.type = type;
  buffer.typeFull = typeFull;

  // set the `.charset` property
  buffer.charset = charset;

  return buffer;
}
