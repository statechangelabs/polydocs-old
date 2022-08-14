const ucanURL =
  process.env.UPLOAD_URL ??
  "https://kdshw9reug.execute-api.us-east-1.amazonaws.com/dev/ucan-token";
const getUCAN = async () => {
  const response = await fetch(ucanURL);
  const json = (await response.json()) as { token: string; did: string };
  return json;
};
export const upload = async (newText: string | Buffer) => {
  const blob = new Blob([newText]);
  return uploadBlob(blob);
};
export const uploadBlob = async (blob: Blob) => {
  const { token, did } = await getUCAN();
  const result = await fetch("https://api.nft.storage/upload", {
    headers: {
      Authorization: "Bearer " + token,
      "x-agent-did": did,
    },
    method: "POST",
    body: blob,
  });
  const obj = await result.json();
  if (obj.ok) {
    return obj.value.cid;
  } else {
    console.error(obj.error);
    throw new Error(obj.error);
  }
};
