import { BigNumber } from "ethers";
import { useState, useEffect } from "react";
import { TemplateRegistry__factory } from "./contracts";
import { useProvider } from "./provider";
import useAsyncEffect from "./useAsyncEffect";

const templateRegistryAddress =
  process.env.REACT_APP_TEMPLATE_REGISTRY_ADDRESS ??
  "0xDd028192816e3366da78C7f0edf234adF5288403";
const templateRegistryChain =
  process.env.REACT_APP_TEMPLATE_REGISTRY_CHAINID ?? "80001";

export const useKnownTemplates = () => {
  const provider = useProvider(templateRegistryChain);
  const templatesRegistry = TemplateRegistry__factory.connect(
    templateRegistryAddress,
    provider
  );
  const [knownCids, setKnownCids] = useState(
    JSON.parse(localStorage.getItem("localTemplateCids") || "[]") as {
      cid: string;
      name: string;
    }[]
  );

  useAsyncEffect(async () => {
    const limit = await templatesRegistry.count();
    for (let x = BigNumber.from(0); x < limit; x.add(1)) {
      const struct = await templatesRegistry.template(x);
      setKnownCids((old) => [
        ...old.filter(({ cid }) => cid !== struct.cid),
        struct,
      ]);
    }
  }, [templatesRegistry]);
  useEffect(() => {
    localStorage.setItem("localTemplateCids", JSON.stringify(knownCids));
    if (knownCids.find(({ cid }) => !cid)) {
      console.log("I have a problem", knownCids);
      setKnownCids(knownCids.filter(({ cid }) => !!cid));
    }
  }, [knownCids]);
  return knownCids;
};
