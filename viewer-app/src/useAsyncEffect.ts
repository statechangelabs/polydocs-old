import { useEffect, useState } from "react";
const useAsyncEffect = (
  promise: () => Promise<void | (() => {})>,
  conditions: any[]
) => {
  const [unmount, setUnmount] = useState<void | (() => void)>(() => {});
  useEffect(() => () => unmount && unmount(), [unmount]);
  return useEffect(() => {
    (async () => {
      try {
        const unmount = await promise();
        setUnmount(unmount);
      } catch (e) {
        setUnmount(() => {});
      }
    })();
    //@eslint-disable-next-line
  }, [...conditions]);
};
export default useAsyncEffect;
