![Polydocs Logo](/assets/Polydocs%20Devpost%20Thumbnail.png)
# Polydocs
## Inspiration
Smart contracts are increasingly used for managing the allocation of digital assets. These assets are more complex than the cash or deeds we sometimes use for analogies. Intellectual property involves rights and responsibilities. Financial instruments require acceptance on both sides. Communities need agreement on government by norms and rules.

The articulation and acceptance of these terms should be a first-class consideration for those creating digital assets and services. That's why we made Polydocs. 
## What it does
Polydocs is first a standard for expressing agreement to a document made of decentralized information as of a fixed point in time. To reflect that, we make the block height part of the specification of a given document. The format for a polydocs signable document is:

    renderer/#/template::chainId::contractAddress::blockheight[::tokenId]
*Note: `tokenID` is for when the agreement is particular to the token, rather than the whole contract*

To make this easy, we created three services in this hackathon:

1) [sign.polydocs.xyz](https://sign.polydocs.xyz) is a gasless mini-app to enable a customer to accept the terms of an agreement and get recorded on the blockchain using a metatransaction 
2) [admin.polydocs.xyz](https://admin.polydocs.xyz) is a gasless admin system for creating, deploying and managing contracts with polydocs agreements. 
3) [A known templates registry](https://mumbai.polygonscan.com/address/0xC1871e6dc374650c1EcFFEf171DC5465a54c008d) for documents hosted on IPFS.

With these in combination, brands and service providers can create and manage contracts that make it easy for customers to accept terms, record those terms to the immutable blockchain, and enable commerce where everyone accepts the rules of engagement. 


## How we built it - Sponsor Technologies

We built the app on the Polygon blockchain ecosystem for the on-chain recording. We employed Hardhat and Node.js on the back-end, and Create-React-App, Tailwind on the front end connected by a common theme of using Typescript and Typechain to maximize velocity and safety. 

Sponsor technologies were key to making as much progress as we did in this hackathon.

* **Amazon Web Services** For the gasless relay and tracking private user/account information. Our system is built on AWS API Gateway running Lambda functions, authenticated using messages signed by a user's wallet. The system is backed by Quantum Ledger, the private, serverless immutable ledger system to keep everything maximum "blockchain." QLDB has been easy to work with and intuitive. We created a new Lambda Layer to enable hardhat-based deployment and verification of contracts. 

* **Spheron** Our front-ends are hosted on IPFS and stored via FileCoin deals. We leveraged Spheron to deploy not one but **three** apps from a single monorepo, and reduced our concerns through supporting autodeployment based on pushes to main. This took some doing - we made multiple organizations to handle multiple deployments from a single repository. We found a couple of challenges that were generic to hosting on IPFS, but Spheron made them easier to work with. 

* **IPFS/Filecoin** Decentralized storage opens tremendous new possibilities for the integration of trustworthy documents with blockchain record-keeping. The recent introduction of UCAN delegated authority tokesn allowed us to build an even-more-decentralized experience. Now our AWS web2 back-end can ship a time and authority limited token to the front end to facilitate direct uploads for maximum performance and minimum constraints. File transfer went from being our most difficult challege to being one of the best parts of the UX. 

## Challenges, Accomplishments and Lessons

* Using UCAN on a node back-end was challenging at first because the reference library required ESModules, and our typescript code compiles to commonjs. To address this, we ported their library to Typescript and deployed it for commonjs support. This allowed us to integrate this cool new technology simply, and we hope it helps others: https://www.npmjs.com/package/ucan-storage-commonjs

* Using hardhat in a lambda environment was challenging as the dependencies pushed against the space limits for a single package. To address this, we created a lambda layer to make it easy to work with hardhat. It is integrated into our project, and publically available: https://github.com/rhdeck/hardhat-lambda-layer 

* Deploying dynamic apps on IPFS hosting creates challenges since the apps must be truly static assets - there is no web server to help redirect one. We found two tricks particularly helped. 
  * First, we shifted from using the traditional `BrowserRouter` approach of overriding history and paths to using an older-school `HashRouter` that manages navigation through the fragment. This technique felt like a throwback, but magically solved many problems with deep linking. 
  * Second, we set the `PUBLIC_URL` environment variable used by create-react-app to `.` as opposed to the default of `/`. This was important because when viewing an app on IPFS, one is not guaranteed to doing so through a specific path. By referencing "current" and then staying on the one page (because we navigate via the fragment) the app stays stable and available. 

* We focused on issues of onboarding and approaches to make this technology more useful for protecting rights and managing digital assets. While our initial approach was a more traditional dapp in which the customer pays gas fees, introducing a bit of indirection while managing protection and guaranteeing the provenance of signatures significantly reduces the stresses for users. 

## What's next for Polydocs

We started Polydocs as an effort to make it easier and safer to operate complicated intellectual, financial and rights-oriented assets on the chain. We want to continue in this vein.

* **EIPs** We aim to introduce EIPs for the Polydocs signature standard and the contract-level metadata URI that we invented along the way. These will make it easier for others to protect their communities and assets and introduce signable documents as a primitive to the chain. By making the standard open-source and usable by all, we can move the whole community forward. 

* **Trusted Templates** Customers should be able to trust the legal documents put in front of them. As part of Polydocs we created a trusted template registry ([currently hosted on Mumbai](https://mumbai.polygonscan.com/address/0xC1871e6dc374650c1EcFFEf171DC5465a54c008d)) that we imagine we can contribute to based on organizations and projects adopting common agreements. The ability to confirm that the template is in the registry and has some high trust score is a way to help people feel comfortable with these agreements. 

* **Commercialization** There is a potential to provide useful service - especially with the gasless transactions. We are pursuing this opportunity. 

## Gratitude

We are very thankful for the opportunity to learn, grow and develop Polydocs in the context of the Buidl hackathon. Thank you to our hosts at Polygon, the sponsors - especially Protocol Labs, Spheron, and AWS - and the many members of the hackathon community who have made this such a rewarding experience. 

Team Polydocs

* Drew Clements [@drewclem](https://github.com/drewclem)
* Ray Deck [@rhdeck](https://github.com/rhdeck)
* Akshay Rakheja [@akshay-rakheja](https://github.com/akshay-rakheja)

