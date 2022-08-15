import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { utils } from "ethers";
import { decodeAB, useIPFSList } from "./useIPFS";
import { useMain } from "./Main";

const Templates: FC = () => {
  const navigate = useNavigate();
  const templates = useMemo(() => {
    return JSON.parse(localStorage.getItem("templates") || "{}") as Record<
      string,
      string
    >;
  }, []);
  const [knownCids, setKnownCids] = useState([] as string[]);
  useEffect(() => {
    setKnownCids([
      "bafybeih2ea4d777iaot4fodu76r5adaqf5hvp4aumfrlxk4teexs2b54ua/template.md",
    ]);
  }, []);
  const knownTemplates = useIPFSList(knownCids);

  const { setTitle } = useMain();
  useEffect(() => {
    setTitle("Dashboard");
  }, []);
  return (
    <div>
      <div>
        <div className="flex justify-center space-x-12 mt-8">
          <h2 className="flex text-3xl font-bold text-black">
            Manage Document Templates
          </h2>
        </div>
        <div className="w-full mx-auto">
          <div className="mb-12">
            <div className="flex justify-center space-x-12 mt-8">
              <h3 className="flex text-xl font-bold text-black">
                Known Templates
              </h3>
            </div>
            <div className="text-xs italic flex justify-center space-x-12 opacity-75 mb-4">
              Click To Review/Revise
            </div>
            <ul className="max-w-4xl mx-auto">
              {Object.entries(knownTemplates).map(([cid, ab]) => (
                <li>
                  <Link
                    to={"/template/" + cid}
                    className="text-gray-60 mt-4 text-purple-default hover:text-purple-light"
                  >
                    <div>
                      {decodeAB(ab).replaceAll("#", "").substring(0, 120)}
                      ...
                    </div>
                    <div className="text-xs text-gray-600">
                      {/* <a
                    href={"https://ipfs.io/ipfs/" + cid}
                    className=" hover:text-purple-light"
                  > */}
                      cid: {cid}
                      {/* </a> */}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Templates;
