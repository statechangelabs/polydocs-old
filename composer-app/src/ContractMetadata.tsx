import { Formik } from "formik";
import { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ERC721Termsable__factory,
  MetadataURI__factory,
} from "./contracts/index";
import { useProvider } from "./provider";
import { useIPFSDataUri, useIPFSText } from "./useIPFS";
import { useUpload } from "./useIPFSUpload";

const useMetadata = (chainId: string, contractAddress: string) => {
  const [uri, setUri] = useState("");
  const provider = useProvider(chainId);
  const getUri = useCallback(async () => {
    const contract = MetadataURI__factory.connect(contractAddress, provider);
    const metadataURI = await contract.URI();
    setUri(metadataURI);
  }, [contractAddress, provider]);
  useEffect(() => {
    getUri();
  }, [getUri]);
  //Get the metadata from the URI
  const ipfsJson = useIPFSText(uri);
  const metaData = JSON.parse(ipfsJson) as Record<string, any>;
  return { metaData, refresh: getUri };
};

const ContractMetadata: FC = () => {
  const { qualifiedAddress } = useParams();
  const [chainId, contractAddress] = (qualifiedAddress || "").split("::");
  const { metaData, refresh } = useMetadata(chainId, contractAddress);
  const image = useIPFSDataUri(metaData.image);
  const cover = useIPFSDataUri(metaData.cover);
  const description = metaData.description;
  const title = metaData.title;
  const { upload } = useUpload();
  const provider = useProvider(chainId);
  return (
    <Formik
      initialValues={{
        image: metaData.image,
        cover: metaData.cover,
        description: metaData.description,
        title: metaData.title,
      }}
      onSubmit={async (values, { resetForm }) => {
        const newMetadata = metaData;
        newMetadata.image = values.image;
        newMetadata.cover = values.cover;
        newMetadata.description = values.description;
        newMetadata.title = values.title;
        const newMetadataURI = await upload(JSON.stringify(newMetadata));
        const contract = ERC721Termsable__factory.connect(
          contractAddress,
          provider
        );
        if (newMetadataURI) {
          await contract.setURI(newMetadataURI);
          refresh();
          resetForm();
          toast.success("Metadata updated");
        } else {
          toast.error("Error uploading metadata");
        }
      }}
    ></Formik>
  );

  //Get the info from the contract address
};
export default ContractMetadata;
