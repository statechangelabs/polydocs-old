import { useMemo, useState } from "react";
import useAsyncEffect from "./useAsyncEffect";
let gateway = "https://ipfs.io/ipfs/";
export const setGateway = (newGateway: string) => {
  gateway = newGateway;
};
export const useIPFS = (cid: string | undefined) => {
  const [ipfs, setIPFS] = useState<Buffer>();
  useAsyncEffect(async () => {
    if (!cid) return;
    const content64 = localStorage.getItem("ipfs_" + cid);
    if (content64) {
      const content = Buffer.from(content64, "base64");
      setIPFS(content);
    } else {
      const result = await fetch(gateway + cid);
      const content2 = await result.blob();
      const buf = Buffer.from(await content2.arrayBuffer());
      localStorage.setItem("ipfs_" + cid, buf.toString("base64"));
      setIPFS(buf);
    }
  }, [cid]);
  return ipfs;
};

export const useIPFSText = (cid: string) => {
  const buf = useIPFS(cid);
  const text = useMemo(() => (buf ? buf.toString("utf8") : ""), [buf]);
  return text;
};

export const useIPFSDataUri = (cid: string) => {
  const buf = useIPFS(cid);
  const dataUri = useMemo(() => {
    if (!buf) return "";
    const base64 = buf.toString("base64");
    return base64 ? `data:;base64,${base64}` : "";
  }, [buf]);
  return dataUri;
};
