// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../termsable/TokenTermsable.sol";
import "../interfaces/MetadataURI.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

// import {Base64} from "./libraries/Base64.sol";

contract ERC721TokenTermsable is
    ERC721URIStorage,
    Ownable,
    TokenTermsable,
    ERC2981
{
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds; //  Made public to test for the timebeing
    string private _uri;
    event MintNFT(address sender, uint256 tokenId);

    constructor(
        address _newOwner,
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        _addMetaSigner(_msgSender());
        _transferOwnership(_newOwner);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC2981, ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        require(_acceptedTerms(to, tokenId), "Terms not accepted");
        super._transfer(from, to, tokenId);
    }

    function tokenTerm(
        string memory _term,
        uint256 _tokenId //changed from external to public
    ) public view override returns (string memory) {
        bytes32 keyHash = keccak256(bytes(_term));
        if (keyHash == keccak256("name")) {
            return name();
        }
        if (keyHash == keccak256("symbol")) {
            return symbol();
        }
        return super.tokenTerm(_term, _tokenId);
    }

    struct TermsInfo {
        string key;
        string value;
    }

    function setPolydocs(
        uint256 _tokenId,
        string memory renderer,
        string memory template,
        TermsInfo[] memory terms
    ) public onlyMetaSigner {
        _setTokenRenderer(_tokenId, renderer);

        _setTokenTemplate(_tokenId, template);

        for (uint256 i = 0; i < terms.length; i++) {
            _setTokenTerm(terms[i].key, _tokenId, terms[i].value);
        }
    }

    function mint(string memory _tokenURI)
        public
        onlyMetaSigner
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, _tokenURI);

        _tokenIds.increment();
        emit MintNFT(msg.sender, newItemId);
        return newItemId;
    }
}
