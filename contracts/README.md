# <img src="assets/Polydocs Logo.svg" alt="Polydocs" height="40px"> Polydocs contracts and mixins

## Interfaces
* TermReader.sol - Interface for termsreader contracts
* TokenTermReader.sol - Interface for token termsreader contracts


## Contracts
* TermsableBase.sol - Abstract contract that implements the TermReader interface and provides the basic functionality for termsable contracts
* TermsableNoToken.sol - Abstract contract that inherits TermsableBase.sol and provides functionality for acceptance of Terms that are not token specific
* TokenTermsable.sol - Abstract contract that inherits TermsableBase.sol , implements TokenTermReader interface and provides functionality for acceptance of terms that are token specific

## Future directinos
* TemplateRegistery - list and ability to vote on the credibility of templates to start to build *reputation* management


[![NPM Package](https://img.shields.io/npm/v/@openzeppelin/contracts.svg)](https://www.npmjs.org/package/@openzeppelin/contracts)

## Overview

### Installation

```console
npm install @polydocs/contracts
```

### Usage

Once installed, you can use the contracts in the library by importing them:

```solidity
pragma solidity ^0.8.9;

import "@polydocs/contracts/TermsableNoToken.sol";

contract MyCollectible is ERC721 {
    constructor() ERC721("MyCollectible", "MCO") {
    }
    // Adds terms restrictions while transferring a token
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        require(_acceptedTerms(to), "Terms not accepted");
        super._transfer(from, to, tokenId);
    }

    // Adds terms restrictions while minting a token
    function _safeMint(address _to, uint256 _tokenId) internal override {
        require(_acceptedTerms(_to), "Terms not accepted");
        super._safeMint(_to, _tokenId);
    }
}
```

## License

Polydocs Contracts is released under the [MIT License](LICENSE).
