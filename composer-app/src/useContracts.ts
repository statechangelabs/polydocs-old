import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthenticatedFetch } from "./Authenticator";

export type Contract = {
  id: string;
  address: string;
  chainId: string;
  name: string;
  symbol: string;
};
export const useContracts = () => {
  const fetch = useAuthenticatedFetch();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const getContracts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/contracts");
      const json = await response.json();
      setContracts(json);
    } catch (e) {
      console.error("I had a bad error", e);
    } finally {
      setLoading(false);
    }
  }, [fetch]);
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
