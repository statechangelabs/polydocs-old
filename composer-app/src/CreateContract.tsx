import {
  ErrorMessage as FormikErrorMessage,
  Field,
  Form,
  Formik,
} from "formik";
import { FC, useState } from "react";
import { useAddress, useAuthenticatedFetch } from "./Authenticator";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DropFile } from "./DropFile";
import { upload } from "@testing-library/user-event/dist/upload";
import { useUpload } from "./useIPFSUpload";
import { contracts } from "./contracts/factories/@openzeppelin";
const supportedChains = [
  { chainId: 137, name: "Polygon Mainnet" },
  { chainId: 80001, name: "Polygon Mumbai Testnet" },
];
const ErrorMessage: FC<{ name: string }> = ({ name }) => {
  return (
    <FormikErrorMessage component="div" name={name} className="text-red-500" />
  );
};
export const CreateContract: FC = () => {
  const address = useAddress();
  const [isUploading, setIsUploading] = useState(false);
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const { upload } = useUpload();
  return (
    <Formik
      initialValues={{
        name: "",
        symbol: "",
        title: "",
        description: "",
        thumbnail: "",
        cover: "",
        owner: address,
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
        //First, upload the JSON
        const obj = {
          title: values.title,
          description: values.description,
          image: values.thumbnail,
          cover: values.cover,
        };
        const json = JSON.stringify(obj);
        const jsonHash = await upload(json);
        toast("Uploaded metadata to IPFS");
        toast("Submitting", { type: "info" });
        const res = await fetch("/make-nft-contract", {
          method: "POST",
          body: JSON.stringify({
            address: values.owner,
            name: values.name,
            symbol: values.symbol,
            uri: "ipfs://" + jsonHash,
            chainId: values.chainId,
            royaltyRecipient: values.royaltyRecipient,
            royaltyPercentage: values.royaltyPercentage,
          }),
        });
        const { id } = await res.json();
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
