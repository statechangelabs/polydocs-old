import "./core";
import "@ethersproject/shims";
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
import { ethers } from "ethers";
import { join } from "path";
import { execSync } from "child_process";
import { Value } from "ion-js/dist/commonjs/es6/dom";
import { Lambda } from "aws-sdk";
import { get as registryGet } from "@raydeck/registry-manager";
import { unlinkSync, writeFileSync } from "fs";
import { TermsableNoToken__factory } from "./contracts/index";
// import fetch from "cross-fetch";
// import fetch from "node-fetch";

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
      await txn.execute(`CREATE TABLE Nodes`);
      await txn.execute(`CREATE INDEX ON Nodes (id)`);
      await txn.execute(`CREATE INDEX ON Nodes (owner)`);
    });
  }
  if (!tableNames.includes("Jobs")) {
    //Build transmissions table
    await qldbDriver.executeLambda(async (txn) => {
      await txn.execute(`CREATE TABLE Jobs`);
      await txn.execute(`CREATE INDEX ON Jobs (id)`);
      await txn.execute(`CREATE INDEX ON Jobs (nodeId)`);
    });
  }
  madeTables = true;
};
const getSignerFromHeader = <T = Record<string, any>>(
  event: APIGatewayProxyEvent,
  apiKey?: string
) => {
  //check for the header
  //check the header for my signature
  const authorization = event.headers.Authorization;
  if (authorization) {
    const [bearer, key] = authorization.split(" ");
    const json = Buffer.from(key, "base64").toString("utf8");
    const { signature, message }: { signature: string; message: string } =
      JSON.parse(json);
    const hash = ethers.utils.hashMessage(message);
    const address = ethers.utils.verifyMessage(message, signature);
    const parsedMessage: T = JSON.parse(message);
    return { address, message: parsedMessage };
  }
  return undefined;
};
const makeAPIFunc = (
  func: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>,
  apiKey?: string
) => <Handler<APIGatewayProxyEvent, APIGatewayProxyResult>>(async (
    event,
    context,
    callback
  ) => {
    // const payload = getSignerFromHeader<Record<string, any>>(event, apiKey);
    // if (!payload) {
    //   return {
    //     statusCode: 401,
    //     body: "Unauthorized",
    //   };
    // }
    // const { address, message } = payload;
    // await makeTables();
    return func(event, context, callback);
  });
const getNodeRecord = async (key: string) => {
  const rxResult = await qldbDriver.executeLambda(async (txn) => {
    const result = await txn.execute(`SELECT * from Nodes WHERE id = '${key}'`);
    return result.getResultList();
  });
  if (!rxResult) throw new Error("no key found");
  const record = rxResult[0];
  return record;
};
const getPrivateKey = async (key: string) => {
  const record = await getNodeRecord(key);
  const privateKey = record.get("privateKey")?.stringValue();
  if (!privateKey) throw new Error("no private key found");
  return privateKey;
};
//#endregion
//#region API Endpoints
export const signDocument = makeAPIGatewayLambda({
  path: "/sign",
  method: "post",
  cors: true,
  timeout: 30,
  func: makeAPIFunc(async (event, context, callback) => {
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
    const polydocs = TermsableNoToken__factory.connect(contractAddress, signer);
    // const result = await fetch("https://polydocs.xyz");
    // const text = await result.text();
    // console.log("text is ", text);
    console.log(
      "now transaction time",
      await signer.getAddress(),
      await signer.getBalance()
    );
    const txn = await polydocs.acceptTermsFor(address, message, signature);
    // await txn.wait();
    // console.log("transaction applied to chain");
    console.log("Transaction complete");
    return httpSuccess("signed");
  }),
});

//#endregion
