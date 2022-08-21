import { FC, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMain } from "./Main";
import { useKnownTemplates } from "./useKnownTemplates";

const Templates: FC = () => {
  const knownTemplates = useKnownTemplates();
  const cids = useMemo(
    () => knownTemplates.map(({ cid }) => cid),
    [knownTemplates]
  );
  const { setTitle } = useMain();
  useEffect(() => {
    setTitle("Known Templates");
  }, [setTitle]);
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
              {knownTemplates
                .filter(({ cid }) => !!cid)
                .map(({ name, cid }) => (
                  <li className="pt-4">
                    <Link
                      to={"/templates/" + cid}
                      className="text-gray-60 mt-4 text-primary-default hover:text-primary-light"
                    >
                      <div>{name}</div>
                      <div className="text-xs text-gray-600">cid: {cid}</div>
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
