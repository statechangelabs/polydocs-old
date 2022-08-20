import { useMemo, useState } from "react";
import useAsyncEffect from "./useAsyncEffect";
import { decode, encode } from "base64-arraybuffer";
let gateway = "https://ipfs.io/ipfs/";
export const setGateway = (newGateway: string) => {
  gateway = newGateway;
};

export const getIPFS = async (cid: string | undefined, nocache = false) => {
  if (!cid) return;
  if (!cid) return;
  if (cid.startsWith("ipfs://")) cid = cid.slice(7);
  const content64 = !nocache && localStorage.getItem("ipfs_" + cid);
  if (content64) {
    const content = decode(content64);
    return content;
  } else {
    if (cid.startsWith("https://")) {
      const response = await fetch(cid);
      const content = await response.blob();
      try {
        const ab = await content.arrayBuffer();
        const b64 = encode(ab);
        localStorage.setItem("ipfs_" + cid, b64);
        return ab;
      } catch (e) {
        console.log("I hit an error", e);
      }
      return;
    }
    console.log("Requesting from ", gateway + cid);
    const result = await fetch(gateway + cid);
    console.log("got my result");
    const content2 = await result.blob();
    console.log("got my blob");
    try {
      const ab = await content2.arrayBuffer();
      const b64 = encode(ab);
      localStorage.setItem("ipfs_" + cid, b64);
      return ab;
    } catch (e) {
      console.log("I hit an error", e);
    }
  }
};
export const getIPFSText = async (cid: string | undefined, nocache = false) => {
  const content = await getIPFS(cid, nocache);
  return new TextDecoder().decode(content);
};

export const useIPFS = (cid: string | undefined) => {
  const [ipfs, setIPFS] = useState<ArrayBuffer>();
  useAsyncEffect(async () => {
    const ab = await getIPFS(cid);
    setIPFS(ab);
    console.log("I set the ipfs");
  }, [cid]);
  return ipfs;
};
export const useIPFSList = (cids: string[]) => {
  const [abs, setAbs] = useState<Record<string, ArrayBuffer>>({});
  useAsyncEffect(async () => {
    if (!cids.length) return;
    await Promise.all(
      cids.map(async (cid) => {
        const ab = await getIPFS(cid);
        if (ab) setAbs((prev) => ({ ...prev, [cid]: ab }));
      })
    );
  }, [cids]);
  return abs;
};
export const decodeAB = (buf: ArrayBuffer) =>
  buf ? new TextDecoder().decode(buf) : "";

export const useIPFSText = (cid: string) => {
  const buf = useIPFS(cid);
  const text = useMemo(() => (buf ? new TextDecoder().decode(buf) : ""), [buf]);
  return text;
};

export const useIPFSDataUri = (cid: string) => {
  const buf = useIPFS(cid);
  const dataUri = useMemo(() => {
    if (!buf) return "";
    const base64 = encode(buf);
    return base64 ? `data:;base64,${base64}` : "";
  }, [buf]);
  return dataUri;
};
