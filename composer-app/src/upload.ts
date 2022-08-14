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
  const formData = new FormData();
  formData.append("file", new Blob([newText], { type: "text/plain" }));
  console.log(process.env);
  const result = await fetch("https://api.nft.storage/upload", {
    headers: {
      Authorization: "Bearer " + token,
      "x-agent-did": did,
    },
    method: "POST",
    body: formData,
  });
  const obj = await result.json();
  console.log("obj result is ", obj);
  return obj.value.cid;
  //   const cid = await nftStorage.storeBlob(new Blob([buf]), {});
  //   return cid;
};
