# PolyDocs

## Short Description
NFTs and DAOs are more than just deeds and clubs. They reflect rights and terms that require protecting. Polydocs makes it easy to create immutable, known agreements to ensure everyone is protected. 

## Long Description
We made a standard for immutable, dynamic documents using IPFS and Polygon smart contracts. A person will know and be able to reference exactly what they signed based on:
1) The webapp used to render the signing page via IPFS CID
2) The template document that contains the boilerplate language, missing only key terms like names, dates and amounts. 
3) The terms fetched from the contract *as of a certain block* so that they cannot be overridden by future changes. 

By specifying the renderer, template, contract and block number, a person will always have the definition of a contract that resolves to the same hash as what they signed, regardless of who goes out of business or changes things in the meantime. This gives us immutable documents we can trust. 

We made both mixins and reference implementations for ERC20, 721 and 1155 contracts to support DeFi, NFT and DAO use cases. 

We generated a markdown-based template renderer to make it easy to sign those documents. We host that on IPFS using an IPFS URL to guarantee immutability - you'll always be able to see the contract you signed exactly as you signed it. 

And we created an editor to make it easy to adapt the contracts to smart contracts. 

## How It's Made
Polydocs is IPFS-first. The insight leverages the immutability of information on IPFS so that even web code can be treated as an immutable document. Any reference to a CID and relative paths from it will be handled properly by a web browser and always reference the same code so it will generate the same result every time. The template document in markdown is also up on IPFS. 

To make sure the document is dynamic while on the immutable IPFS file store, we use a HashRouter so that all dynamic data is handled by the browser and not assumed by the server (since on IPFS, there's no server to help!) As a result, all URLs look like 

ipfs://router-cid/#/template-cid::0xcontractaddress::chainId::blockNumber

That way all agreements are immutable without requiring a copy to go up on IPFS for every possible permutation. Documents are far more controllable and predictable. 

For terms specific to the smartcontract, we have mixins that operate on Polygon smart contracts. We have tested these in both testnet and mainnet, including an OpenSea-shared collection that is part of the reference implementation shown in the video. 

The https://polydocs.xyz user-facing site for editing and administering the contract within the contract is hosted on [Spheron](https://spheron.app) and IPFS over a Filecoin deal. 
## Reference 721 contract: Signing Sloths
[Polygon: 0x66307Afe31cC1f7d93D01d23144b43310415dDa0](https://polygonscan.com/address/0x66307Afe31cC1f7d93D01d23144b43310415dDa0/#code)

## Sponsor Profile
### IPFS and Filecoin

The center of our project is making use of the enormous potential of IPFS as was to create trust in both documents and code through immutability. Putting a static web app on IPFS gives it the dynamism of code and the clear, immutable qualities of a document in a vault. This allows for unique value and trust to be created in an untrustworthy world. We upload files using NFT.storage and web3.storage APIs to make it super-simple for our users. We also started making some innovative ways to connect IPFS to React via hooks. The below link shows how we use IPFS for the immutable signing mini-app Check out the fuller experience at https://polydocs.xyz 

https://ipfs.io/ipfs/bafybeidxa2vnac25dtq4d7jxtafqsahknuxbjwr4ltycxusw6ibn2omrgy/#/bafybeifqmf6t2osakwoop6lefrjdqaws3qtwwfi6zuftdy7anqeufn7e5e/template.md::137::0x66307afe31cc1f7d93d01d23144b43310415dda0::31062293

### Polygon

This project has its reference implementations deployed on Polygon. Our approach to this information is a little more chatty to maintain atomic control for owners and clarity for customers. This is uniquely possible on Polygon, making it the likely future of legaltech in web3. Check out our "Signing Sloths" signature-required reference contract at https://polygonscan.com/address/0x66307Afe31cC1f7d93D01d23144b43310415dDa0#readContract

https://polygonscan.com/address/0x66307Afe31cC1f7d93D01d23144b43310415dDa0#readContract

### Spheron

We are super glad to be able to host this on Spheron Aqua. We are running on a CRA app from a monorepo with customized environment variables and a custom domain. It works great! Particular thanks to prashantmaurya#6839 for expediting the Aqua NFT so we could make this a showcase. 

https://polydocs.xyz
