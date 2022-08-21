# Polydocs Viewer App Template
Note that you can upload a new copy of this app to IPFS via `yarn upload`. You will need a web3.storage API key in the environment as W3S_APIKEY or passed as an argument on the command line. 

Also note the environment variable set in `yarn upload` - the PUBLIC_URL on an IPFS-hosted dapp should be current directory because there are a number of ways it could be hosted. Also using hashrouter is best practice because when referenced over IPFS, dynamic paths will not survive reloads. 