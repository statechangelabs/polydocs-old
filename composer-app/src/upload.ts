const NFTSTORAGE_APIKEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGRkYzA3NkIzRDU3YzFhRDhBMzVjMWFjMGJBNDAyQzkwQTUyN2I5MzciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NzQwMTUwNDI5MywibmFtZSI6ImZpcnN0dGVzdCJ9.4BKFOMYWx-Fy1ldGW9vfYQKxzHuEVlL6WRUeHLuqzr8";
export const upload = async (newText: string) => {
  //   const cid = "bafkreiaeppbzsvhoxifxq3dgwmiidto2p3j3agfb3vn5e3ur2rlhg5rqj4";
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([newText], { type: "text/plain" }),
    "template.md"
  );
  console.log(process.env);
  const result = await fetch("https://api.nft.storage/upload", {
    headers: {
      Authorization: "Bearer " + NFTSTORAGE_APIKEY,
    },
    method: "POST",
    body: formData,
  });
  const obj = await result.json();
  console.log("obj result is ", obj);
  return obj.value.cid + "/template.md";
  //   const cid = await nftStorage.storeBlob(new Blob([buf]), {});
  //   return cid;
};
