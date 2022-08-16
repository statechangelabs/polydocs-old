import {
  ErrorMessage as FormikErrorMessage,
  Field,
  Form,
  Formik,
  useFormikContext,
} from "formik";
import {
  FC,
  Fragment,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { useUpload } from "./useIPFSUpload";
import { useMain } from "./Main";
import { useIPFSDataUri } from "./useIPFS";
import { CloudUploadIcon } from "@heroicons/react/outline";
import { useAddress, useAuthenticatedFetch } from "./Authenticator";
import { ethers } from "ethers";
import { id } from "ethers/lib/utils";
import { deepStrictEqual } from "assert";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
const supportedChains = [
  { chainId: 137, name: "Polygon Mainnet" },
  { chainId: 80001, name: "Polygon Mumbai Testnet" },
];
const ErrorMessage: FC<{ name: string }> = ({ name }) => {
  return (
    <FormikErrorMessage component="div" name={name} className="text-red-500" />
  );
};
export const DropFile: FC<{
  name: string;
  onUploading: (isUploading: boolean) => void;
}> = ({ name, onUploading = () => {} }) => {
  const { setTitle } = useMain();
  useEffect(() => {
    setTitle("Create a Contract");
  }, [setTitle]);
  const { setFieldValue, values } = useFormikContext<Record<string, string>>();
  const [isUploading, setIsUploading] = useState(false);
  const { uploadBlob } = useUpload();
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log("I have accepted these files into my life", acceptedFiles);
      const f = acceptedFiles[0];
      //upload the blob
      setIsUploading(true);
      const cid = await uploadBlob(f);
      setIsUploading(false);
      setFieldValue(name, cid);
    },
    [name, setFieldValue, uploadBlob]
  );
  useEffect(() => {
    onUploading(isUploading);
  }, [isUploading, onUploading]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const image = useIPFSDataUri(values[name]);
  return (
    <div className="mt-1 sm:mt-0 sm:col-span-2">
      <div
        {...getRootProps()}
        className={[
          "max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md",
          isDragActive && "bg-gray-200",
        ].join(" ")}
      >
        <div className="space-y-1 text-center">
          {isUploading && (
            <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400 object-cover animated-pulse" />
          )}

          {!isUploading && !values[name] && (
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {values[name] && !isUploading && (
            <Fragment>
              <img
                src={image}
                className="mx-auto h-12 w-12 text-gray-400 object-cover"
              />

              <a
                href={`https://ipfs.io/ipfs/${values[name]}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.open(`https://ipfs.io/ipfs/${values[name]}`, "_blank");
                  return false;
                }}
                className="flex text-sm text-blue-600 hover:underline align-center"
              >
                {" "}
                Click to Preview
              </a>
            </Fragment>
          )}
          {!isUploading && (
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>{"Upload a file"}</span>
                <Field
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  {...getInputProps()}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
          )}
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
};
export const CreateContract: FC = () => {
  const address = useAddress();
  const [isUploading, setIsUploading] = useState(false);
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{
        name: "",
        symbol: "",
        title: "",
        description: "",
        thumbnail: "",
        cover: "",
        owner: "",
        chainId: "137",
        royaltyRecipient: address,
        royaltyPercentage: "0.00",
      }}
      validate={async ({
        name,
        symbol,
        title,
        description,
        thumbnail,
        cover,
        chainId,
        royaltyRecipient,
        royaltyPercentage,
        owner,
      }) => {
        let isError = false;
        const errors: Record<string, string> = {};
        if (!name) {
          isError = true;
          errors["name"] = "Name is Required";
        }
        if (!symbol || symbol.length > 10) {
          isError = true;
          errors["symbol"] =
            "Symbol is Required and must be less than 10 characters";
        }
        console.log("validating");
        if (!description || !description.includes("[POLYDOCS]")) {
          isError = true;
          errors["description"] =
            "Description is Required and must include [POLYDOCS]";
        } else {
          console.log("description is ok", description);
        }
        if (!supportedChains.find((c) => c.chainId.toString() === chainId)) {
          isError = true;
          errors["chainId"] = "Chain is not supported";
        }

        if (!ethers.utils.isAddress(owner)) {
          isError = true;
          errors["owner"] = "Owner is Invalid Address";
        }
        //Royalties
        if (royaltyRecipient && !ethers.utils.isAddress(royaltyRecipient)) {
          isError = true;
          errors["royaltyRecipient"] = "Royalty Recipient is Invalid Address";
        }
        if (
          parseFloat(royaltyPercentage) > 100 ||
          parseFloat(royaltyPercentage) < 0 ||
          isNaN(parseFloat(royaltyPercentage))
        ) {
          isError = true;
          errors["royaltyPercentage"] =
            "Royalty Percentage must be between 0 and 100, with up to two decimal places (basis points)";
        }

        if (isError) return errors;
      }}
      onSubmit={async (values) => {
        toast("Submitting", { type: "info" });
        const res = await fetch("/make-nft-contract", {
          body: JSON.stringify(values),
        });
        const { id, chainId, address } = await res.json();
        if (res.status === 200) {
          toast("Contract Created", { type: "success" });
          toast("I would have navigated in real mode");
          //   navigate(`/contracts/${id}`);
        } else {
          toast("Error creating contract", { type: "error" });
        }
      }}
    >
      {({ isSubmitting, isValid, dirty, values, errors }) => (
        <Form className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profile
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  General information about the contract
                </p>
              </div>

              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Name
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      {/* <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        workcation.com/
                      </span> */}
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="name"
                        className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                      <ErrorMessage name="name" />
                    </div>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="symbol"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Symbol
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="w-40 flex rounded-md shadow-sm">
                      {/* <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        workcation.com/
                      </span> */}
                      <Field
                        type="text"
                        name="symbol"
                        id="symbol"
                        className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                      <ErrorMessage name="symbol" />
                    </div>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Short Description
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      {/* <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        workcation.com/
                      </span> */}
                      <Field
                        type="text"
                        name="title"
                        id="title"
                        autoComplete="title"
                        className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                      <ErrorMessage name="title" />
                    </div>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Longer Description
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <Field
                      component="textarea"
                      id="description"
                      name="description"
                      rows={3}
                      className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                      defaultValue={""}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      A description that will go into each token. The link to
                      sign the contract terms will be substituted where you add{" "}
                      <b>[POLYDOCS]</b>
                    </p>
                    <ErrorMessage name="description" />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="thumbnail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Thumbnail/logo image for the contract
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <DropFile name="thumbnail" onUploading={setIsUploading} />
                    </div>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Cover Image
                  </label>
                </div>
                <DropFile name="cover" onUploading={setIsUploading} />

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="owner"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Contract Owner Address
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <Field
                      type="text"
                      name="owner"
                      id="owner"
                      onClick={(e: InputEvent) => {
                        //@ts-ignore
                        e.target?.select();
                      }}
                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="owner" />
                  </div>
                </div>
                <div className="pt-6 sm:pt-5">
                  <div role="group" aria-labelledby="label-notifications">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                      <div>
                        <div
                          className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                          id="label-notifications"
                        >
                          Chain For Deployment
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="max-w-lg">
                          <p className="text-sm text-gray-500">
                            When Experimenting, start with a testnet.
                          </p>
                          <div className="mt-4 space-y-4">
                            {supportedChains.map(({ chainId, name }) => (
                              <div
                                className="flex items-center"
                                key={"chainId_" + chainId}
                              >
                                <Field
                                  id={"chainId_" + chainId}
                                  name="chainId"
                                  type="radio"
                                  value={chainId.toString()}
                                  checked={
                                    values.chainId === chainId.toString()
                                  }
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                />

                                <label
                                  htmlFor="push-everything"
                                  className="ml-3 block text-sm font-medium text-gray-700"
                                >
                                  {name}
                                </label>
                              </div>
                            ))}
                          </div>
                          <ErrorMessage name="chainId" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Royalty Information (optional)
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Only works on NFT platforms that conform to ERC 2981
                </p>
              </div>
              <div className="space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Royalty Fees Recipient (blank to go to owner)
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <Field
                      type="text"
                      name="royaltyRecipient"
                      id="royaltyRecipient"
                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="royaltyRecipient" />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Percentage
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <Field
                      id="royaltyPercentage"
                      name="royaltyPercentage"
                      type="text"
                      className="block w-40 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="royaltyPercentage" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                disabled={!isValid || isSubmitting || !dirty || isUploading}
                type="submit"
                className={[
                  "ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                  !isValid || isSubmitting || !dirty || isUploading
                    ? "opacity-50 bg-gray-500"
                    : "",
                ].join(" ")}
              >
                {isSubmitting ? "Sending..." : "Save"}
              </button>
            </div>
            {!isValid && (
              <div>
                {Object.entries(errors).map(([key, value]) => (
                  <ErrorMessage name={key} />
                ))}
              </div>
            )}
            {!dirty && <div>Nothing to save yet...</div>}
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default CreateContract;
