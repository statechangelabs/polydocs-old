import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuthenticatedFetch } from "./Authenticator";
import { ERC721Termsable__factory } from "./contracts";
import { getProvider } from "./provider";
import {
  useIPFSText,
  useIPFSDataUri,
  getIPFS,
  getIPFSText,
  getIPFSDataUri,
} from "./useIPFS";
type PartialContract = {
  chainId: string;
  address: string;
  id: string;
  deployed: number;
  image?: string;
  cover?: string;
  title?: string;
  description?: string;
  imageSrc?: string;
  coverSrc?: string;
};
export type Contract = PartialContract & {
  name: string;
  symbol: string;
};
export const useContracts = () => {
  const fetch = useAuthenticatedFetch();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const contractsRef = useRef(contracts);
  useEffect(() => {
    contractsRef.current = contracts;
  }, [contracts]);
  const updateContract = useCallback(
    async ({ address, chainId, id, deployed }: PartialContract) => {
      if (
        contractsRef.current.find(
          (c) => c.address === address && c.chainId === chainId
        )
      ) {
        return;
      }
      //get the info
      const provider = getProvider(chainId);
      const contract = ERC721Termsable__factory.connect(address, provider);
      try {
        console.log("Checking ", address, chainId);
        const name = await contract.name();
        const symbol = await contract.symbol();
        setContracts((old) => [
          ...old.filter((c) => c.address !== address),
          { address, chainId, name, symbol, id, deployed },
        ]);
        const uri = await contract.URI();
        const json = await getIPFSText(uri);
        const { image, cover, description, title } = JSON.parse(json);
        setContracts((old) => [
          ...old.filter((c) => c.address !== address || c.chainId !== chainId),
          {
            address,
            chainId,
            name,
            symbol,
            id,
            deployed,
            description,
            title,
            image,
            cover,
          },
        ]);
        const imageSrc = await getIPFSDataUri(image);
        const coverSrc = await getIPFSDataUri(cover);
        setContracts((old) => [
          ...old.filter((c) => c.address !== address || c.chainId !== chainId),
          {
            address,
            chainId,
            name,
            symbol,
            id,
            deployed,
            description,
            title,
            image,
            imageSrc,
            cover,
            coverSrc,
          },
        ]);
      } catch (e) {
        console.log("THat wasnt nice", e);
      }
    },
    []
  );
  const getContracts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/contracts");
      const json: PartialContract[] = await response.json();
      json.forEach(updateContract);
    } catch (e) {
      console.error("I had a bad error", e);
    } finally {
      setLoading(false);
    }
  }, [fetch, updateContract]);
  useEffect(() => {
    getContracts();
  }, [getContracts]);
  const removeContract = useCallback(
    async (contractId: string) => {
      setContracts((old) =>
        old.filter((contract) => contract.id !== contractId)
      );
      await fetch(`/contracts?id=${contractId}`, { method: "DELETE" });
      getContracts();
    },
    [fetch]
  );
  return useMemo(
    () => ({ contracts, refresh: getContracts, loading, removeContract }),
    [contracts, getContracts, loading, removeContract]
  );
};
