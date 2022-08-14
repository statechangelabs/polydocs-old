const ucanURL =
  "https://kdshw9reug.execute-api.us-east-1.amazonaws.com/dev/ucan-token";
const getUCAN = async () => {
  const response = await fetch(ucanURL);
  const json = (await response.json()) as { token: string; did: string };
  return json;
};
export const upload = async (newText: string) => {
  //   const cid = "bafkreiaeppbzsvhoxifxq3dgwmiidto2p3j3agfb3vn5e3ur2rlhg5rqj4";
  //get the new id from the backend
  const { token, did } = await getUCAN();
  // const token =
  //   "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCIsInVjdiI6IjAuOC4wIn0.eyJhdWQiOiJkaWQ6a2V5Ono2TWtualJiVkdrZldLMXg1Z3lKWmI2RDRMak1qMUVzaXRGemNTY2NTM3NBYXZpUSIsImF0dCI6W3sid2l0aCI6InN0b3JhZ2U6Ly9kaWQ6a2V5Ono2TWtrR2pzYzVkYlRMZEdud1ByWnpZVXQ3OXFMR3lxNHpVcG1UTFBkYjFRUzMzMy9kaWQ6a2V5Ono2TWtualJiVkdrZldLMXg1Z3lKWmI2RDRMak1qMUVzaXRGemNTY2NTM3NBYXZpUSIsImNhbiI6InVwbG9hZC8qIn1dLCJleHAiOjE2NjA1MDQwMzgsImlzcyI6ImRpZDprZXk6ejZNa2tHanNjNWRiVExkR253UHJaellVdDc5cUxHeXE0elVwbVRMUGRiMVFTMzMzIiwicHJmIjpbImV5SmhiR2NpT2lKRlpFUlRRU0lzSW5SNWNDSTZJa3BYVkNJc0luVmpkaUk2SWpBdU9DNHdJbjAuZXlKaGRXUWlPaUprYVdRNmEyVjVPbm8yVFd0clIycHpZelZrWWxSTVpFZHVkMUJ5V25wWlZYUTNPWEZNUjNseE5IcFZjRzFVVEZCa1lqRlJVek16TXlJc0ltRjBkQ0k2VzNzaWQybDBhQ0k2SW5OMGIzSmhaMlU2THk5a2FXUTZhMlY1T25vMlRXdHJSMnB6WXpWa1lsUk1aRWR1ZDFCeVducFpWWFEzT1hGTVIzbHhOSHBWY0cxVVRGQmtZakZSVXpNek15SXNJbU5oYmlJNkluVndiRzloWkM4cUluMWRMQ0psZUhBaU9qRTJOakUzTVRNMU16Y3NJbWx6Y3lJNkltUnBaRHByWlhrNmVqWk5hMjVxVW1KV1IydG1WMHN4ZURWbmVVcGFZalpFTkV4cVRXb3hSWE5wZEVaNlkxTmpZMU16YzBGaGRtbFJJaXdpY0hKbUlqcGJYWDAuV1JaZUs1S0tVbWlSeHdpVko4ajEwcWlndE4tMENSTzdza3IwSnAtMmlNUHpkVE1LT1FrbzdlaTRRY29iTWk0di1IWUR0SWJpWVphT2NubUxlbDN3QlEiXX0.L4mHT5Xy1sbKMJNmZzB-nFWjLerIcM7CoYodzmNmTmgLo3gyRmaECC4ogj-D8amUP3MW_2_UqsbLANMWCIyLCw";
  console.log("I have a token and did", { token, did });
  const formData = new FormData();
  formData.append("file", new Blob([newText]));
  console.log("sending template via ucan upload");
  const result = await fetch("https://api.nft.storage/upload", {
    headers: {
      Authorization: "Bearer " + token,
      "x-agent-did": did,
    },
    method: "POST",
    body: new Blob([newText]),
  });
  const obj = await result.json();
  if (obj.ok) {
    console.log("obj result is ", obj);
    return obj.value.cid;
  } else {
    console.error(obj.error);
    throw new Error(obj.error);
  }
  //   const cid = await nftStorage.storeBlob(new Blob([buf]), {});
  //   return cid;
};
