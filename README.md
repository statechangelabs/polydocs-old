# doc-assembly


## Test 721 contract
[Mumbai](https://mumbai.polygonscan.com/address/0x042d0Cc53CF23c0941c9EC9078700d5a170433CB#code)

## Notes

First, we can have the immutable code-as-document by putting a static single page application up on IPFS, renderable by any standard web browser. Second, we can use the unstoppable storage in IPFS to host document templates that are standard aside from identifying a few key terms, like the name of the NFT or organization. Third, we use the chain to store those terms using a standard API, and reference thecombination with an identifier that is immediately renderable by a web browser: the CID of the renderer, and then use the fragment of the URL (also known as a "hash") for storing the template document, identifying the smart contract, as well as the last block of a changed term, so that looking at that identifier would always generate the same output. Everyone is agreeing to known terms. 

With that insight in mind, we made smart contracts to require a buyer to accept terms of a community, DEX or NFT before being able to execute or receive a transfer to become an owner. We also made a renderer to make it easy to work with a template agreement. We are working on an editor to make it easy to assemble these documents and protect your intellectual property and community. 


# Sponsor Profile
## IPFS and Filecoin

The center of our project is making use of the enormous potential of IPFS as was to create trust in both documents and code through immutability. Putting a static web app on IPFS gives it the dynamism of code and the clear, immutable qualities of a document in a vault. This allows for unique value and trust to be created in an untrustworthy world. We upload files using NFT.storage and web3.storage APIs to make it super-simple for our users. We also started making some innovative ways to connect IPFS to React via hooks. The below link shows how we use IPFS for the immutable signing mini-app Check out the fuller experience at https://polydocs.xyz 

https://ipfs.io/ipfs/bafybeidxa2vnac25dtq4d7jxtafqsahknuxbjwr4ltycxusw6ibn2omrgy/#/bafybeifqmf6t2osakwoop6lefrjdqaws3qtwwfi6zuftdy7anqeufn7e5e/template.md::137::0x66307afe31cc1f7d93d01d23144b43310415dda0::31062293

## Polygon

This project has its reference implementations deployed on Polygon. Our approach to this information is a little more chatty to maintain atomic control for owners and clarity for customers. This is uniquely possible on Polygon, making it the likely future of legaltech in web3. Check out our "Signing Sloths" signature-required reference contract at https://polygonscan.com/address/0x66307Afe31cC1f7d93D01d23144b43310415dDa0#readContract

https://polygonscan.com/address/0x66307Afe31cC1f7d93D01d23144b43310415dDa0#readContract

## Spheron

We are super glad to be able to host this on Spheron Aqua. We are running on a CRA app from a monorepo with customized environment variables and a custom domain. It works great! Particular thanks to prashantmaurya#6839 for expediting the Aqua NFT so we could make this a showcase. 

https://polydocs.xyz
