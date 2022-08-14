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
    MetadataURI,
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

    function setURI(string memory _newURI) external onlyMetaSigner {
        _uri = _newURI;
        _lastTermChange = block.number;
        emit UpdatedURI(_uri);
    }

    function URI() public view returns (string memory) {
        return _uri;
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

    // function _safeMint(address _to, uint256 _tokenId) internal override {
    //     require(_acceptedTerms(_to, _tokenId), "Terms not accepted");
    //     super._safeMint(_to, _tokenId);
    // }

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
